import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class BackendStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'BackendLambda', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset('./lambda'), 
    });

    const api = new apigateway.RestApi(this, 'APIGateway', {
        restApiName: 'ServerlessAppAPI',
        description: 'API for the serverless handson.',
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction);
    const resource = api.root.addResource('data');
    
    resource.addMethod('GET', lambdaIntegration, {
        methodResponses: [
            {
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Origin': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Headers': true,
                },
            },
        ],
    });
    
    resource.addMethod('POST', lambdaIntegration, {
        methodResponses: [
            {
                statusCode: '201',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Origin': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Headers': true,
                },
            },
        ],
    });
    
    // Add CORS options
    resource.addCorsPreflight({
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
    });
    
    new CfnOutput(this, 'API_URL', { value: api.url })

    const table = new dynamodb.Table(this, 'Visitors', {
        partitionKey: { name: 'city', type: dynamodb.AttributeType.STRING }, // Partition key
        sortKey: { name: 'firstname', type: dynamodb.AttributeType.STRING }, // Sort key
        tableName: 'Visitors',
        removalPolicy: RemovalPolicy.DESTROY,
    });

    table.grantReadWriteData(lambdaFunction);
    lambdaFunction.addEnvironment('TABLE_NAME', table.tableName);  
    }
}
