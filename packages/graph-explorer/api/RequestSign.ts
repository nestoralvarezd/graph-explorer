import aws4 from "aws4";
import getAwsCredentials from "./utils/get-aws-credentials";

export default class RequestSign {
  private static readonly _service = "neptune-db";
  private _credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  };

  private static _instance: RequestSign;

  private constructor() {}
  public static async getInstance() {
    if (!this._instance) {
      this._instance = new RequestSign();
      this._instance._credentials = await getAwsCredentials();
    }

    return this._instance;
  }

  async requestAuthHeaders(options: { url: URL; region: string }) {
    const opts = {
      host: options.url.host.split(":")[0],
      port: options.url.port,
      path: options.url.pathname + options.url.search,
      service: RequestSign._service,
      region: options.region,
    };

    const signedReq: {
      host: string;
      port: string;
      path: string;
      service: string;
      region: string;
      headers: {
        Authorization: string;
        "X-Amz-Date": string;
        "X-Amz-Security-Token": string;
        Host: string;
      };
    } = await aws4.sign(opts, this._credentials);

    const authHeaders = {
      Authorization: signedReq.headers["Authorization"],
      "X-Amz-Date": signedReq.headers["X-Amz-Date"],
      host: signedReq.host,
    }

    if (signedReq.headers["X-Amz-Security-Token"]) {
      authHeaders["X-Amz-Security-Token"] = signedReq.headers["X-Amz-Security-Token"];
    }

    return authHeaders;
  }
}
