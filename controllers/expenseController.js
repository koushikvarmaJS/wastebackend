// controllers/expenseController.js
const createDynamoDbService = require('../services/expenseService');

dynamoDbService = createDynamoDbService()


const deleteExpense = async (req, res) => {
    try {
      const donation = req.body;
      const updatedBalance = await dynamoDbService.deleteExpense(donation)
      res.status(200).json(updatedBalance);
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).send('Failed to delete expense');
    }
  };

module.exports = {
  deleteExpense
};
