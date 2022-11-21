import { GoogleSpreadsheet } from 'npm:google-spreadsheet';

const updateSheet = async () => {
	const doc = new GoogleSpreadsheet(Deno.env.get("SHEET_ID"));
	doc.useApiKey(Deno.env.get("API_KEY"));

	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[0];

	const rows = await sheet.getRows();
	
	return rows;
};

export { updateSheet };