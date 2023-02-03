// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import express from 'express';
import cors from "cors";
import fetch from "node-fetch";
import RequestSign from "./RequestSign";
import getConfigFromHeaders from "./utils/get-config-from-headers";

const app: express.Application = express();
app.use(cors());

app.get("/api", async (req: express.Request, res: express.Response) => {
	try {
		const queryParams = req.query;
		const config = getConfigFromHeaders(req.headers);

		let externalUri = config.dbConnectionUrl;
		if (config.dbEngine === "sparql") {
			externalUri = `${externalUri}/sparql?format=json&`
		}
		externalUri = `${externalUri}query=${queryParams.query}`

		const requestSign = await RequestSign.getInstance();
		const authHeaders = await requestSign.requestAuthHeaders({
			url: new URL(externalUri), region: config.awsNeptuneRegion,
		});

		const response = await fetch(externalUri, {
			headers: {
				...req.headers, ...authHeaders
			}
		});
		const data = await response.json();
		res.status(200).send(data);
	} catch (error) {
		console.error(error);
		res.status(400).send();
	}
});

export const handler = app;
