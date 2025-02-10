import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as components from './components';
import { GithubActionsIdentityProvider } from 'aws-cdk-github-oidc';

export class OidcStack extends cdk.Stack {
    constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const provider = new GithubActionsIdentityProvider(this, 'GithubProvider');
      new components.oidc(this, "github-actions-role", "aws-serverless-hands-on-template", provider);
    }
  }