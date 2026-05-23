const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/stock-in
router.post('/', async (req, res) => {
  try {
    const { stockInQuantity, stockInDate, sparePartId } = req.body;

    if (!stockInQuantity || !stockInDate || !sparePartId) {
      return res.status(400).json({ error: 'stockInQuantity, stockInDate, and sparePartId are required' });
    }

    const [sparePart] = await db.query('SELECT * FROM Spare_Part WHERE sparePartId = ?', [sparePartId]);
    if (sparePart.length === 0) {
      return res.status(404).json({ error: 'Spare part not found' });
    }

    const [result] = await db.query(
      'INSERT INTO Stock_In (stockInQuantity, stockInDate, sparePartId) VALUES (?, ?, ?)',
      [stockInQuantity, stockInDate, sparePartId]
    );

    const newQuantity = sparePart[0].quantity + stockInQuantity;
    const newTotalPrice = newQuantity * sparePart[0].unitPrice;
    await db.query(
      'UPDATE Spare_Part SET quantity = ?, totalPrice = ? WHERE sparePartId = ?',
      [newQuantity, newTotalPrice, sparePartId]
    );

    res.status(201).json({
      message: 'Stock in recorded successfully',
      stockInId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stock-in
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT si.*, sp.name as sparePartName 
      FROM Stock_In si 
      JOIN Spare_Part sp ON si.sparePartId = sp.sparePartId
      ORDER BY si.stockInDate DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
