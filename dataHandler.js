import { GoogleSpreadsheet } from 'npm:google-spreadsheet';
import { config as loadEnv } from "https://deno.land/std@0.165.0/dotenv/mod.ts";

const updateSheet = async () => {

	await loadEnv({ export: true, allowEmptyValues: true });

	console.log('Updating sheet');
	const doc = new GoogleSpreadsheet(Deno.env.get("SHEET_ID"));
	doc.useApiKey(Deno.env.get("API_KEY"));

	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[0];

	const rows = await sheet.getRows();
	const lastUpdate = new Date();
	console.log("Updated sheet");
	return {rows, lastUpdate};
};

let data = await updateSheet();

setInterval(async () => {
	data = await updateSheet();
}, 300000);

export { updateSheet, data };