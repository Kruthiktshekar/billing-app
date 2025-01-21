/* eslint-disable no-undef */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
/* eslint-enable no-undef */

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const updateProduct = async (event) => {
  try {
    console.log('[INFO]', event);
    const { id } = event.queryStringParameters;
    const { name, description, quantity, price, isDeleted } = JSON.parse(
      event.body
    );
    const params = {
      TableName: 'ProductTable',
      Key: {
        productId: id,
      },
      UpdateExpression:
        'SET #name = :name, #description = :description, #quantity = :quantity , #price = :price , #isDeleted = :isDeleted',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#description': 'description',
        '#quantity': 'quantity',
        '#price': 'price',
        '#isDeleted': 'isDeleted',
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':description': description,
        ':quantity': quantity,
        ':price': price,
        ':isDeleted': isDeleted,
      },
      ReturnValues: 'ALL_NEW',
    };

    const sendData = new UpdateCommand(params);
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
    const response = await updateProduct(event);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
      statusCode: 200,
      body: JSON.stringify({
        message: 'Product Updated',
        data: response.Attributes,
      }),
    };
  } catch (error) {
    console.log('[ERROR]', error);
    throw error;
  }
};
