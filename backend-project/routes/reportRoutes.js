const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/reports/daily-stockout
router.get('/daily-stockout', async (req, res) => {
  try {
    const { date } = req.query;
    let query = `
      SELECT so.*, sp.name as sparePartName, u.username 
      FROM Stock_Out so 
      JOIN Spare_Part sp ON so.sparePartId = sp.sparePartId
      LEFT JOIN Users u ON so.userId = u.userId
    `;
    const params = [];

    if (date) {
      query += ' WHERE so.stockOutDate = ?';
      params.push(date);
    }

    query += ' ORDER BY so.stockOutDate DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports/stock-status
router.get('/stock-status', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        sp.sparePartId,
        sp.name,
        sp.category,
        sp.quantity as storedQuantity,
        sp.unitPrice,
        COALESCE(SUM(so.stockOutQuantity), 0) as totalStockOut,
        sp.quantity as remainingQuantity
      FROM Spare_Part sp
      LEFT JOIN Stock_Out so ON sp.sparePartId = so.sparePartId
      GROUP BY sp.sparePartId, sp.name, sp.category, sp.quantity, sp.unitPrice
      ORDER BY sp.name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
