const {
  dynamoDbDocClient,
  transactionTable,
  userTable
} = require("../config/dynamoDB.config");

// Helper function to create a DynamoDB service object
const createDynamoDbService = () => {
  const getDynamoDbDocClient = () => dynamoDbDocClient;
  const getTransactionsTable = () => transactionTable;
  const getUserTable = () => userTable;

  const getTransactionAmountByCategory = async (donarId, startTime, endTime) => {
    try {
      const params = {
        TableName: getTransactionsTable(),
        KeyConditionExpression:
          "donarId = :donarId AND #timeStamp BETWEEN :startTime AND :endTime",
        ExpressionAttributeNames: {
          "#timeStamp": "timeStamp",
        },
        ExpressionAttributeValues: {
          ":donarId": Number(donarId),
          ":startTime": startTime,
          ":endTime": endTime,
        },
      };
      const data = await dynamoDbDocClient.query(params).promise();
      return data;
    } catch (error) {
      console.error("Unable to query:", error);
      throw error;
    }
  };

  const getDonations = async (donarId) => {
    try {
      const params = {
        TableName: getTransactionsTable(),
      };

      const data = await dynamoDbDocClient.scan(params).promise();

      // Filter out donations from the specified donor
      const filteredData = data.Items.filter(
        (item) => item.donarId !== Number(donarId)
      );

      return filteredData;
    } catch (error) {
      console.error("Unable to get donations:", error);
      throw error;
    }
  };

  const updateStatus = async (donation) => {
    const transactionParams = {
      TableName: getTransactionsTable(),
      Key: {
        donarId: Number(donation.donar),
        timeStamp: donation.timeStamp,
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status", 
      },
      ExpressionAttributeValues: {
        ":status": true, 
      },
      ReturnValues: "ALL_NEW",
    };

    const userParams = {
      TableName: getUserTable(),
      Key: {
        donarId: Number(donation.donar),
      },
      UpdateExpression: "SET #rewards = #rewards + :rewardIncrement",
      ExpressionAttributeNames: {
        "#rewards": "rewards",
      },
      ExpressionAttributeValues: {
        ":rewardIncrement": 100,
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      await dynamoDbDocClient.update(transactionParams).promise();
      
      await dynamoDbDocClient.update(userParams).promise();

      return { message: "Status updated and rewards added." };
    } catch (error) {
      console.error("Unable to update status and rewards:", error);
      throw error;
    }
  };

  return {
    getDynamoDbDocClient,
    getTransactionAmountByCategory,
    getDonations,
    updateStatus
  };
};

module.exports = createDynamoDbService;