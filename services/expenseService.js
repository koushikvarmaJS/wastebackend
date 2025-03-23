const {
  dynamoDbDocClient,
  transactionTable,
  userTable,
} = require("../config/dynamoDB.config");

const createDynamoDbService = () => {
  const getDynamoDbDocClient = () => dynamoDbDocClient;

  const getTableName = () => transactionTable;
  const getUserTable = () => userTable;

  const deleteExpense = async (donation) => {
    const params = {
      TableName: getTableName(),
      Key: {
        donarId: Number(donation.donar),
        timeStamp: donation.timeStamp,
      },
    };
    const updateParams = {
      Key: {
        donarId: Number(donation.donar),
      },
      TableName: getUserTable(),
      UpdateExpression: "SET #balance = #balance - :amount",
      ExpressionAttributeNames: {
        "#balance": "rewards",
      },
      ExpressionAttributeValues: {
        ":amount": 10,
      },
      ReturnValues: "UPDATED_NEW",
    };
    try {
      await dynamoDbDocClient.delete(params).promise();
      const updatedBalance = await dynamoDbDocClient
        .update(updateParams)
        .promise();
      return updatedBalance;
    } catch (err) {
      console.log("Error:", err);
      throw err;
    }
  };

  return {
    getDynamoDbDocClient,
    deleteExpense,
  };
};

module.exports = createDynamoDbService;
