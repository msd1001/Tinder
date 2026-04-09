const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "eu-north-1";
// Credentials are automatically resolved using the AWS SDK credential provider chain.
// For more information, see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: "AKIASPIHDJN6KYQVRTN7",
    secretAccessKey: "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",
  },
});
module.exports = { sesClient };
