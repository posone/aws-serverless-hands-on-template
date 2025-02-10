# AWS Serverless hands on project template
This repository is part of the blog post "AWS Serverless hands on". Please visit this [blog post](https://dev.to). 
In a nutshell with the code located here you should be able to achieve following:
* create OIDC stack allowing connection between GHA and AWS
* create serverless application on AWS with separate Backend and Frontend automated by GitHub Actions
* backend based on Lambda, DynamoDB and API Gateway
* frontend based on S3/CloudFront 
* application itself is a simple CRUD example, it's a quest book, visitor can write down some data by cliking `Add Data` and then fetch it by `Fetch Data From Backend`

## First steps
Before the pipeline can run we need to create connection between AWS and GHA by OIDC stack and it should be started from the machine with AWS access. 
Firstly make sure to adjust `deploy/cdk/lib/components/oidc.ts`
Change the owner accordingly and also adjust PowerUserAccess if you want to provide to the role different permission.
```
cd deploy/cdk
cdk bootstrap aws://<account_id>/eu-west-1 -- --profile <aws_profile>
npm i -D aws-cdk-github-oidc
npm run cdk deploy OidcStack -- --profile <your_aws_profile>
```
## Proper Deploy
To start a deploy after we have OIDC configured, we should adjust our pipeline located: `/.github/workflows/deploy-serverless.yml`. Change the AWS_ACCOUNT to proper value and the role-to-assume if it was changed in the OIDC stack. 
Remove the hash from 4-6 lines, it should look like this:
```  
  push:
    branches:
      - main
```
After the changes will be pushed, the deploy run automatically and in the Deploy Frontend step the CloudFront URL can be found:
Outputs:
FrontendStack.DistributionId = <`your distribution will be here`>.cloudfront.net