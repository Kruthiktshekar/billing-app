/* eslint-disable no-undef */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');
/* eslint-enable no-undef */

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const getAllBills = async (event) => {
  try {
    console.log('[INFO] EVENT', event);
    const params = {
      TableName: 'BillingTable',
      IndexName: 'isDeletedIndex',
      KeyConditionExpression: 'isDeleted = :isDeleted',
      ExpressionAttributeValues: {
        ':isDeleted': 'false',
      },
    };
    const sendData = new QueryCommand(params);
    const response = await docClient.send(sendData);
    console.log('[INFO] response data', JSON.stringify(response.Items));
    return response.Items;
  } catch (error) {
    console.log('[ERROR] error while fetching data');
    throw error;
  }
};

    // eslint-disable-next-line no-undef
module.exports.handler = async (event) => {
  try {
    console.log('[INFO] event ', event);
    const response = await getAllBills(event);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
      statusCode: 200,
      body: JSON.stringify({
        message: 'fetched all Bills',
        data: response,
      }),
    };
  } catch (error) {
    console.log('[ERROR] error', error);
    throw error;
  }
};
