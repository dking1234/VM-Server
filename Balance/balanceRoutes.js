const express = require('express');
const balanceController = require('./balanceController');

const router = express.Router();

router.post('/create', balanceController.createBalance);
router.get('/:userId', balanceController.getBalanceByUserId);
router.put('/:userId', balanceController.updateBalanceByUserId);
router.post('/deposit/:userId', balanceController.depositAmount);

module.exports = router;
