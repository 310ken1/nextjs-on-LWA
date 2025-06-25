import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.DockerImageFunction(this, "NextjsLambda", {
      code: lambda.DockerImageCode.fromImageAsset("../next-app"),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(15),
    });

    const functionUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    // CloudFront with Origin Access Control using SigV4
    const oac = new cloudfront.FunctionUrlOriginAccessControl(
      this,
      "FunctionUrlOAC",
      {
        originAccessControlName: "NextFunctionUrlOAC",
        signing: cloudfront.Signing.SIGV4_ALWAYS,
      }
    );

    const distribution = new cloudfront.Distribution(
      this,
      "NextjsDistribution",
      {
        defaultBehavior: {
          origin: origins.FunctionUrlOrigin.withOriginAccessControl(
            functionUrl,
            {
              originAccessControl: oac,
            }
          ),
        },
      }
    );

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.domainName}`,
    });

    new cdk.CfnOutput(this, "FunctionURL", {
      value: functionUrl.url,
    });
  }
}
