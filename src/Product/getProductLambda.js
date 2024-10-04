const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient, GetCommand} = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

const getProduct = async(event) => {
    try{
        console.log('[INFO]', event)
        const {id} = event.queryStringParameters
        const params = {
            TableName : 'ProductTable',
            Key : {
                productId : id
            }
        }

        const sendData = new GetCommand(params)
        const response = await docClient.send(sendData)
        console.log('[INFO] response' , JSON.stringify(response))
        return response
    }
    catch(error){
        console.log('[ERROR]', error)
        throw error
    }
}


module.exports.handler = async(event) => {
    try{
        console.log('[INFO]' , event)
        const response = await getProduct(event)
        return{
            headers : {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : '*'
            },
            statusCode : 200,
            body : JSON.stringify({
                message : 'Product fetched',
                data : response.Item
            })
        }
    }
    catch(error){
        console.log('[ERROR]', error)
        throw error
    }
}