const AWS = require('aws-sdk')
require('dotenv').config()

console.log("Ids",process.env.AWS_ACCESS_KEY_ID );


AWS.config.update({
    region: process.env.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

const dynamoDbClient = new AWS.DynamoDB()

const dynamoDbDocClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-north-1'});

const transactionTable = 'donations';
const userTable = 'donars'


module.exports = {
    dynamoDbClient,
    dynamoDbDocClient,
    transactionTable,
    userTable
};
