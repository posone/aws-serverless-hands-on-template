import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BackendStack } from '../lib/backend-stack';

test('Lambda Function Created', () => {
    const app = new cdk.App();
    const stack = new BackendStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
    });
});

test('API Gateway Created', () => {
    const app = new cdk.App();
    const stack = new BackendStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
        Name: 'ServerlessAppAPI',
        Description: 'API for the serverless handson.',
    });
});

test('DynamoDB Table Created', () => {
    const app = new cdk.App();
    const stack = new BackendStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::DynamoDB::Table', {
        TableName: 'Visitors',
        KeySchema: [
            { AttributeName: 'city', KeyType: 'HASH' },
            { AttributeName: 'firstname', KeyType: 'RANGE' },
        ],
    });
});