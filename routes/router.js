const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const homeController = require('../controllers/homeController');
const transactionController = require('../controllers/transactionController');
const userController = require("../controllers/userController");


router.get('/rewards',homeController.getBalance)
router.get('/recents',homeController.getRecentTransactions);
router.post('/donation',homeController.addNewExpense);

router.get('/pieChart/getTransactionAmountByCategory', transactionController.getTransactionAmountByCategory);
router.get('/donations', transactionController.getDonations);
router.put('/status',transactionController.updateStatus)

router.delete('/deleteDonation', expenseController.deleteExpense);
router.get('/allDonations',expenseController.getAllDonations);

router.get('/donar', userController.getUserDetails);
router.get('/donar/check', userController.checkUserDetails);
router.put('/donar/update', userController.updateUserDetails);
router.delete('/donar/delete',userController.deleteUser)
router.post('/newdonar', userController.createUser);

module.exports = router;
