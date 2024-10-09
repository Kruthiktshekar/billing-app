const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient,PutCommand} = require('@aws-sdk/lib-dynamodb')
const { v4: uuidv4 } = require('uuid')

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)





const createProduct = async(event) => {
    console.log('[INFO] EVENT' , event)

    try{
        const data = JSON.parse(event.body)
        const params = {
            TableName : 'ProductTable',
            Item : {
                productId : uuidv4(),
                ...data
            }
        }

        const sendData = new PutCommand(params)
        const response = await docClient.send(sendData)
        console.log('[INFO] response data', JSON.stringify(response))
        return response
    }
    catch(error){
        console.log('[ERROR] error', error)
        throw error
    }
}


module.exports.handler = async(event) => {
    try{
    console.log('[INFO] event' ,  event)
    const response = await createProduct(event)
    return {
        headers : {
            'Access-Control-Allow-Origin' : "*",
            'Access-Control-Allow-Methods' : "*"
        },
        statusCode : 200,
        body : JSON.stringify({
            message : 'Item created Successfully',
            data : response
        })
    }
  }
  catch(error){
    console.log('[ERROR] error',error)
    throw error
  }
}
