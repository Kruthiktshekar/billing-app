const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient,DeleteCommand} = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

const deleteBill = async(event) => {
    try{
        console.log('[INFO] event', event)
        const {id} = event.queryStringParameters
        const params = {
            TableName : 'BillingTable',
            Key : {
                billingId : id
            }
        }
        const sendData = new DeleteCommand(params)
        const response = await docClient.send(sendData)
        console.log('[INFO] response data ' , JSON.stringify(response))
        return response
    }
    catch(error){
        console.log('[ERROR] error in deleting product' , error)
        throw error
    }
}

module.exports.handler = async(event) => {
    try{
        console.log('[INFO] EVENT' ,event)
        const response = await deleteBill(event)
    
        return {
            headers : {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : '*'
            },
            statusCode : 200,
            body : JSON.stringify({
                message : 'Bill Deleted',
                data : response
            })
        }
    }
    catch(error){
        console.log('[ERROR] ',error)
        throw error
    }
}