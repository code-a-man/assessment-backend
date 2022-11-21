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
	const weeklyDistinctSessions = getWeeklyDistinctSessions(rows);
	return { lastUpdate, avgBrandRevenue, weeklyDistinctSessions };
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
		brands[brand].avg = (brands[brand].revenue / brands[brand].purchases).toFixed(2);
		brands[brand].revenue = brands[brand].revenue.toFixed(2);
		if (brand === "") {
			brands["unknown"] = brands[brand];
			delete brands[brand];
		}
	});

	return brands;
}

const getWeeklyDistinctSessions = (rows) => {
	const sessions = {};
	const sessionsWeeks = {};
	rows.forEach(row => {
		const currentDate = new Date(row.event_time);
		const startDate = new Date(currentDate.getFullYear(), 0, 1);
		const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
		const week = Math.ceil(days / 7);
		sessions[week] = sessions[week] || {};
		sessions[week][row.user_session] = true;
	});
	Object.keys(sessions).forEach(week => {
		sessionsWeeks[week] = Object.keys(sessions[week]).length;
	});
	return sessionsWeeks;
}

let data = await updateSheet();

setInterval(async () => {
	data = await updateSheet();
}, 300000);

export { updateSheet, data };