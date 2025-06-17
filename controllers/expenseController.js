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

  const getAllDonations = async (req,res) => {
    try{
        const donar = req.query.donar
        const allDonations =  await dynamoDbService.getAllDonations(donar)
        res.status(200).json(allDonations)
    }catch (error) {
        res.status(500).json({ message: "Error fetching details", error })
    }
}
module.exports = {
  deleteExpense,
  getAllDonations
};
