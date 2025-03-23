//This file contains the logic for handling incoming HTTP requests and responding with the appropriate data. It interacts with the model and service layers to fetch or manipulate data in DynamoDB.
const createDynamoDbService = require("../services/transactionsDBService");

const dynamoDbService = createDynamoDbService();

const getTransactionAmountByCategory = async (req, res) => {
  try {
    const categories = await dynamoDbService.getTransactionAmountByCategory(
      req.query.donar,
      req.query.startTime,
      req.query.endTime,
    );
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

const getDonations = async (req,res) => {
  try{
      const donar = req.query.donar
      const donations =  await dynamoDbService.getDonations(donar)
      res.status(200).json(donations)
  }catch (error) {
      res.status(500).json({ message: "Error fetching details", error })
  }
}

const updateStatus = async (req, res) => {
  try {
    const donation = req.body;
    const updatedStatus = await dynamoDbService.updateStatus(donation)
    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).send('Failed to delete expense');
  }
};

module.exports = {
  getTransactionAmountByCategory,
  getDonations,
  updateStatus
};
