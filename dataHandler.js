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
	const avgBrandRevenue = calcAvgBrandRevenue(rows);

	return { lastUpdate, avgBrandRevenue };
};

const calcAvgBrandRevenue = (rows) => {
	// ? for now just return total revenue without filtering purchases
	// TODO Calculate average brand revenue with filtering purchases
	// TODO Mark blank brands as "Unknown"
	const brands = {};
	rows.forEach(row => {
		brands[row.brand] = brands[row.brand] || 0.00;
		brands[row.brand] += parseFloat(row.price)
	});
	Object.keys(brands).forEach(brand => {
		brands[brand] = parseFloat(brands[brand].toFixed(2));
	});

	return brands;
}

let data = await updateSheet();

setInterval(async () => {
	data = await updateSheet();
}, 300000);

export { updateSheet, data };