/* eslint-disable no-undef */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
/* eslint-enable no-undef */

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const getBill = async (event) => {
  try {
    console.log('[INFO]', event);
    const { id } = event.queryStringParameters;
    const params = {
      TableName: 'BillingTable',
      Key: {
        billingId: id,
      },
    };

    const sendData = new GetCommand(params);
    const response = await docClient.send(sendData);
    console.log('[INFO] response', JSON.stringify(response));
    return response;
  } catch (error) {
    console.log('[ERROR]', error);
    throw error;
  }
};

    // eslint-disable-next-line no-undef
module.exports.handler = async (event) => {
  try {
    console.log('[INFO]', event);
    const response = await getBill(event);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
      statusCode: 200,
      body: JSON.stringify({
        message: 'Bill Fetched',
        data: response.Item,
      }),
    };
  } catch (error) {
    console.log('[ERROR]', error);
    throw error;
  }
};
