const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const headers = {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async (event) => {
    const tableName = 'Visitors';
    try {
        if (event.httpMethod === 'GET') {
            const city = event.queryStringParameters?.city;
            if (!city) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: "Missing required parameter: city" }),
                };
            }

            const params = {
                TableName: tableName,
                KeyConditionExpression: 'city = :city',
                ExpressionAttributeValues: {
                    ':city': city,
                },
            };
            const data = await docClient.send(new QueryCommand(params));
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: "Query successful",
                    items: data.Items,
                }),
            };
        } else if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            if (!body.city || !body.firstname || !body.yearofbirth) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: "Missing required fields: city, firstname, yearofbirth" }),
                };
            }

            const params = {
                TableName: tableName,
                Item: {
                    city: body.city,
                    firstname: body.firstname,
                    yearofbirth: body.yearofbirth,
                },
            };
            await docClient.send(new PutCommand(params));
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ message: "Item added successfully" }),
            };
        } else {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: "Method not allowed" }),
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
