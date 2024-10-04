const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient,QueryCommand} = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const getAllProducts = async(event) => {
    try{
        console.log('[INFO] EVENT', event)
        const params = {
            TableName : 'ProductTable' ,
            IndexName : 'isDeletedIndex',
            KeyConditionExpression : 'isDeleted = :isDeleted',
            ExpressionAttributeValues : {
                ':isDeleted' : 'false'
            } 
        }
        const sendData = new QueryCommand(params)
        const response = await docClient.send(sendData)
        console.log('[INFO] response data', JSON.stringify(response.Items))
        return response.Items
    }
    catch(error) {
        console.log('[ERROR] error while fetching data')
        throw error
    }
}


module.exports.handler = async(event) => {
    try{
        console.log('[INFO] event ' , event)
        const response = await getAllProducts(event)
        return {
            headers : {
                'Access-Control-Allow-Origin' : "*",
                'Access-Control-Allow-Methods' : "*"
            },
            statusCode : 200,
            body : JSON.stringify({
                message : 'fetched all Products',
                data : response
            })
        }
    }
    catch(error) {
        console.log('[ERROR] error' , error)
        throw error
    }
}