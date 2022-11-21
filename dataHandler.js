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
	const brands = {};
	rows.forEach((row) => {
		if (row.event_type === "purchase") {
		if (row.brand in brands) {
			brands[row.brand].revenue += parseFloat(row.price);
			brands[row.brand].purchases += 1;
		} else {
			brands[row.brand] = {
				revenue: parseFloat(row.price),
				purchases: 1,
			};
		}
	}
	});
	Object.keys(brands).forEach(brand => {
		brands[brand] = (brands[brand].revenue / brands[brand].purchases).toFixed(2);
		if (brand === "") {
			brands["unknown"] = brands[brand];
			delete brands[brand];
		}
	});

	return brands;
}

let data = await updateSheet();

setInterval(async () => {
	data = await updateSheet();
}, 300000);

export { updateSheet, data };