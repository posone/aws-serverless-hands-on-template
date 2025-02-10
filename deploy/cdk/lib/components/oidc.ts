import { Construct } from 'constructs';
import { GithubActionsRole, GithubActionsIdentityProvider } from 'aws-cdk-github-oidc';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';

export class oidc{
  constructor(scope: Construct, rolename: string, repo: string, provider: GithubActionsIdentityProvider) {
    const accessSSMRole = new GithubActionsRole(scope, rolename, {
        provider: provider,   
        owner: '<your_github_owner>',
        repo: repo,
        roleName: rolename
    });
    accessSSMRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess'));
  }
}