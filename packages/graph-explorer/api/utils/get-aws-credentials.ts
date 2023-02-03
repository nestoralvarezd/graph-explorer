import * as AWS from "aws-sdk";

const getAwsCredentials = async () => {
  const credProvider = new AWS.CredentialProviderChain();
  try {
    const credentials: AWS.Credentials = await new Promise(
      (resolve, reject) => {
        credProvider.resolve(function (err, credentials) {
          if (err) {
            reject(err);
            return;
          }
          // eslint-disable-next-line no-console
          console.info(
            `${new Date().toLocaleTimeString()} [API] INFO - Master credentials available`
          );
          resolve(credentials);
        });
      }
    );

    return {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    };
  } catch (error) {
    console.error(
      `${new Date().toLocaleTimeString()} [API] ERROR - No master credentials available`,
      error
    );
  }

  return { accessKeyId: "", secretAccessKey: "", sessionToken: "" };
};

export default getAwsCredentials;
