const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/spare-parts
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, unitPrice } = req.body;

    if (!name || quantity == null || unitPrice == null) {
      return res.status(400).json({ error: 'Name, quantity, and unitPrice are required' });
    }

    const totalPrice = quantity * unitPrice;

    const [result] = await db.query(
      'INSERT INTO Spare_Part (name, category, quantity, unitPrice, totalPrice) VALUES (?, ?, ?, ?, ?)',
      [name, category || null, quantity, unitPrice, totalPrice]
    );

    res.status(201).json({
      message: 'Spare part added successfully',
      sparePartId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/spare-parts
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Spare_Part');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
