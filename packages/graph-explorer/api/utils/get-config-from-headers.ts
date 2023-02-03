import { IncomingHttpHeaders } from "http";

const getConfigFromHeaders = (headers: IncomingHttpHeaders) => {
	return {
		dbEngine: headers["graph-db-connection-engine"] as string,
		dbConnectionUrl: headers["graph-db-connection-url"] as string,
		awsNeptuneRegion: headers["aws-neptune-region"] as string,
	}
}

export default getConfigFromHeaders;
