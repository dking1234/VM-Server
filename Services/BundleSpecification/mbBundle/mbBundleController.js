// controllers/mbBundleController.js
const express = require('express');
const mbBundle = require('../mbBundle/mbBundleModel');

const router = express.Router();

// Create a new mbBundle
router.post('/mbBundles', async (req, res) => {
  const { name, unitPricePerMB } = req.body;

  try {
    const newMbBundle = new mbBundle({ name, unitPricePerMB });
    await newMbBundle.save();

    res.status(201).json(newMbBundle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Calculate the amount of MB based on the unit price
router.post('/mbBundles/calculate', async (req, res) => {
  const { amount, unitPricePerMB } = req.body;

  try {
    const mbAmount = amount / unitPricePerMB;
    res.status(200).json({ mbAmount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
