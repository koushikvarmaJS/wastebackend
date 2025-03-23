const { dynamoDbDocClient, transactionTable, userTable } = require('../config/dynamoDB.config');
const { timeStamp } = require('../util/timeStamp');

const createDynamoDbService = () => {
    const getDynamoDbClient = () => dynamoDbDocClient;
    const getTransactionTable = () => transactionTable;
    const getUserTable = () => userTable;

    // Fetch userName from userTable
    const getUserName = async (donarId) => {
        try {
            const params = {
                TableName: getUserTable(),
                KeyConditionExpression: "donarId = :donarId",
                ExpressionAttributeValues: {
                    ":donarId": Number(donarId)
                }
            };
            const data = await dynamoDbDocClient.query(params).promise();
            return data.Items.length ? data.Items[0].userName : null;
        } catch (err) {
            console.log('Error fetching userName:', err);
            throw err;
        }
    };

    const getBalance = async (donarId) => {
        try {
            const params = {
                TableName: getUserTable(),
                KeyConditionExpression: "donarId = :donarId",
                ExpressionAttributeValues: {
                    ":donarId": Number(donarId)
                }
            };
            const data = await dynamoDbDocClient.query(params).promise();
            return data.Items;
        } catch (err) {
            console.log('Error:', err);
            throw err;
        }
    };

    const getRecentTransactions = async (donarId) => {
        try {
            const params = {
                TableName: getTransactionTable(),
                KeyConditionExpression: "donarId = :donarId",
                ExpressionAttributeValues: {
                    ":donarId": Number(donarId)
                },
                ScanIndexForward: false,
                Limit: 10
            };
            const data = await dynamoDbDocClient.query(params).promise();
            return data.Items;
        } catch (err) {
            console.log("Error:", err);
            throw err;
        }
    };

    const addNewExpense = async (item) => {
        try {
            // Fetch userName from userTable
            const userName = await getUserName(item.donar);

            if (!userName) {
                throw new Error(`UserName not found for donarId: ${item.donar}`);
            }

            const newItem = {
                'donarId': Number(item.donar),
                'userName': userName, // Adding userName to transaction
                'location': item.location,
                'category': item.category,
                'description': item.description,
                'status': false,
                'timeStamp': timeStamp()
            };

            const params = {
                TableName: getTransactionTable(),
                Item: newItem
            };

            const updateParams = {
                Key: {
                    donarId: Number(item.donar)
                },
                TableName: getUserTable(),
                UpdateExpression: "SET #balance = #balance + :amount",
                ExpressionAttributeNames: {
                    '#balance': 'rewards'
                },
                ExpressionAttributeValues: {
                    ':amount': 10
                },
                ReturnValues: "UPDATED_NEW"
            };

            await dynamoDbDocClient.put(params).promise();
            const updatedBalance = await dynamoDbDocClient.update(updateParams).promise();

            return { updatedBalance, newItem };
        } catch (err) {
            console.log("Error adding expense:", err);
            throw err;
        }
    };

    return {
        getDynamoDbClient,
        getBalance,
        getRecentTransactions,
        addNewExpense
    };
};

module.exports = createDynamoDbService;
