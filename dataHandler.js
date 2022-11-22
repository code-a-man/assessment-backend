import { GoogleSpreadsheet } from "npm:google-spreadsheet";
import { config as loadEnv } from "https://deno.land/std@0.165.0/dotenv/mod.ts";

const updateSheet = async () => {
  await loadEnv({ export: true, allowEmptyValues: true });

  console.log("Updating sheet");
  const doc = new GoogleSpreadsheet(Deno.env.get("SHEET_ID"));
  doc.useApiKey(Deno.env.get("API_KEY"));

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const rows = await sheet.getRows();
  const lastUpdate = new Date();
  console.log("Updated sheet");
  const brandRevenue = calcBrandRevenue(rows);
  const weeklyDistinctSessions = getWeeklyDistinctSessions(rows);
  const dailyConversionRate = calcDailyConversionRate(rows);
  const netRevenueOfEachCustomer = calcNetRevenueOfEachCustomer(rows);
  return {
    lastUpdate,
    brandRevenue,
    weeklyDistinctSessions,
    dailyConversionRate,
    netRevenueOfEachCustomer,
  };
};

const calcBrandRevenue = (rows) => {
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

  Object.keys(brands).forEach((brand) => {
    brands[brand].avg = (brands[brand].revenue / brands[brand].purchases)
      .toFixed(2);
    brands[brand].revenue = brands[brand].revenue.toFixed(2);
    if (brand === "") {
      brands["unknown"] = brands[brand];
      delete brands[brand];
    }
  });

  return brands;
};

const getWeeklyDistinctSessions = (rows) => {
  const sessions = {};
  const sessionsWeeks = {};
  rows.forEach((row) => {
    const currentDate = new Date(row.event_time);
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    const week = Math.ceil(days / 7);
    sessions[week] = sessions[week] || {};
    sessions[week][row.user_session] = true;
  });
  Object.keys(sessions).forEach((week) => {
    sessionsWeeks[week] = Object.keys(sessions[week]).length;
  });
  return sessionsWeeks;
};

const calcDailyConversionRate = (rows) => {
  const dates = {};
  rows.forEach((row) => {
    const date = row.event_time.split(" ")[0];
    dates[date] = dates[date] || { purchases: 0, ratio: 0, sessions: {} };
    dates[date].sessions[row.user_session] = true;
    if (row.event_type === "purchase") {
      dates[date].purchases++;
    }
  });
  Object.keys(dates).forEach((date) => {
    dates[date].ratio =
      (dates[date].purchases / (Object.keys(dates[date].sessions).length) * 100)
        .toFixed(2);

    dates[date] = {
      sessions: Object.keys(dates[date].sessions).length,
      purchases: dates[date].purchases,
      value: dates[date].ratio,
    };
  });
  return dates;
};

const calcNetRevenueOfEachCustomer = (rows) => {
  const customers = {};
  rows.forEach((row) => {
    customers[row.user_id] = customers[row.user_id] ||
      { purchases: 0, refunds: 0 };
    if (row.event_type === "purchase") {
      customers[row.user_id].purchases += parseFloat(row.price);
    } else if (row.event_type === "refund") {
      customers[row.user_id].refunds += parseFloat(row.price);
    }
  });
  Object.keys(customers).forEach((customer) => {
    customers[customer] = parseFloat(
      (customers[customer].purchases - customers[customer].refunds).toFixed(2),
    );
  });
  return customers;
};

let data = await updateSheet();

setInterval(async () => {
	data = await updateSheet();
}, 300000);

export { data, updateSheet };
