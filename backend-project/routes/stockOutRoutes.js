const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/stock-out
router.post('/', async (req, res) => {
  try {
    const { stockOutQuantity, stockOutUnitPrice, stockOutDate, sparePartId, userId } = req.body;

    if (!stockOutQuantity || !stockOutUnitPrice || !stockOutDate || !sparePartId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [sparePart] = await db.query('SELECT * FROM Spare_Part WHERE sparePartId = ?', [sparePartId]);
    if (sparePart.length === 0) {
      return res.status(404).json({ error: 'Spare part not found' });
    }

    if (sparePart[0].quantity < stockOutQuantity) {
      return res.status(400).json({ error: 'Insufficient stock quantity' });
    }

    const stockOutTotalPrice = stockOutQuantity * stockOutUnitPrice;

    const [result] = await db.query(
      'INSERT INTO Stock_Out (stockOutQuantity, stockOutUnitPrice, stockOutTotalPrice, stockOutDate, sparePartId, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [stockOutQuantity, stockOutUnitPrice, stockOutTotalPrice, stockOutDate, sparePartId, userId || null]
    );

    const newQuantity = sparePart[0].quantity - stockOutQuantity;
    const newTotalPrice = newQuantity * sparePart[0].unitPrice;
    await db.query(
      'UPDATE Spare_Part SET quantity = ?, totalPrice = ? WHERE sparePartId = ?',
      [newQuantity, newTotalPrice, sparePartId]
    );

    res.status(201).json({
      message: 'Stock out recorded successfully',
      stockOutId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stock-out
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT so.*, sp.name as sparePartName, u.username 
      FROM Stock_Out so 
      JOIN Spare_Part sp ON so.sparePartId = sp.sparePartId
      LEFT JOIN Users u ON so.userId = u.userId
      ORDER BY so.stockOutDate DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/stock-out/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stockOutQuantity, stockOutUnitPrice, stockOutDate, sparePartId, userId } = req.body;

    const [existing] = await db.query('SELECT * FROM Stock_Out WHERE stockOutId = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Stock out record not found' });
    }

    const oldRecord = existing[0];

    // Restore old quantity to spare part
    await db.query(
      'UPDATE Spare_Part SET quantity = quantity + ? WHERE sparePartId = ?',
      [oldRecord.stockOutQuantity, oldRecord.sparePartId]
    );

    const targetSparePartId = sparePartId || oldRecord.sparePartId;
    const [sparePart] = await db.query('SELECT * FROM Spare_Part WHERE sparePartId = ?', [targetSparePartId]);

    const newStockOutQty = stockOutQuantity || oldRecord.stockOutQuantity;
    if (sparePart[0].quantity < newStockOutQty) {
      // Revert the restore
      await db.query(
        'UPDATE Spare_Part SET quantity = quantity - ? WHERE sparePartId = ?',
        [oldRecord.stockOutQuantity, oldRecord.sparePartId]
      );
      return res.status(400).json({ error: 'Insufficient stock quantity' });
    }

    const newUnitPrice = stockOutUnitPrice || oldRecord.stockOutUnitPrice;
    const stockOutTotalPrice = newStockOutQty * newUnitPrice;

    await db.query(
      'UPDATE Stock_Out SET stockOutQuantity = ?, stockOutUnitPrice = ?, stockOutTotalPrice = ?, stockOutDate = ?, sparePartId = ?, userId = ? WHERE stockOutId = ?',
      [newStockOutQty, newUnitPrice, stockOutTotalPrice, stockOutDate || oldRecord.stockOutDate, targetSparePartId, userId || oldRecord.userId, id]
    );

    // Deduct new quantity from spare part
    await db.query(
      'UPDATE Spare_Part SET quantity = quantity - ? WHERE sparePartId = ?',
      [newStockOutQty, targetSparePartId]
    );

    // Update totalPrice
    const [updatedPart] = await db.query('SELECT * FROM Spare_Part WHERE sparePartId = ?', [targetSparePartId]);
    await db.query(
      'UPDATE Spare_Part SET totalPrice = quantity * unitPrice WHERE sparePartId = ?',
      [targetSparePartId]
    );

    res.json({ message: 'Stock out record updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/stock-out/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM Stock_Out WHERE stockOutId = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Stock out record not found' });
    }

    const record = existing[0];

    // Restore quantity to spare part
    await db.query(
      'UPDATE Spare_Part SET quantity = quantity + ?, totalPrice = (quantity + ?) * unitPrice WHERE sparePartId = ?',
      [record.stockOutQuantity, record.stockOutQuantity, record.sparePartId]
    );

    await db.query('DELETE FROM Stock_Out WHERE stockOutId = ?', [id]);

    res.json({ message: 'Stock out record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
