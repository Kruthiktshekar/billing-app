/* eslint-disable no-undef */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
/* eslint-enable no-undef */


const client = new DynamoDBClient();
const doclient = DynamoDBDocumentClient.from(client);

const createBillLambda = async (event) => {
  try {
    console.log('[INFO] event from createBill', event);
    const data = JSON.parse(event.body);
    const params = {
      TableName: 'BillingTable',
      Item: {
        billingId: uuidv4(),
        ...data,
      },
    };

    const sendData = new PutCommand(params);
    const response = await doclient.send(sendData);
    console.log('[INFO] response from createBill', JSON.stringify(response));
    return response;
  } catch (error) {
    console.error('[ERROR] error ', error);
    throw error;
  }
};

    // eslint-disable-next-line no-undef
module.exports.handler = async (event) => {
  try {
    console.log('[INFO] in handler', event);
    const response = await createBillLambda(event);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
      statusCode: 200,
      body: JSON.stringify({
        message: 'bill created successfully',
        data: response,
      }),
    };
  } catch (error) {
    console.log('[ERROR] error in handler', error);
    throw error;
  }
};
