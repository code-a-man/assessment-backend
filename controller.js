import {
  calcBrandRevenue,
  calcDailyConversionRate,
  calcNetRevenueOfEachCustomer,
  data,
  getRowsByDateRange,
  getWeeklyDistinctSessions,
} from "./dataHandler.js";

const queryHandler = (query) => {
  // TODO make filters object
  let procData;

  const checkFilter = Object.keys(query).some((key) =>
    key.startsWith("filter")
  );
  if (checkFilter && !query["filter.date.from"] && !query["filter.date.to"]) {
    return { message: "Missing required filtered query parameters" };
  }

  const rows = checkFilter
    ? getRowsByDateRange(
      data.rows,
      query["filter.date.from"],
      query["filter.date.to"],
    )
    : {};

  switch (query.id) {
    case "revenue":
      procData = getRevenue(query, rows, checkFilter);
      break;
    case "sessions":
      procData = getSessions(query, rows, checkFilter);
      break;
    case "conversion":
      procData = getConversion(query, rows, checkFilter);
      break;
    case "net-revenue":
      procData = getNetRevenue(query, rows, checkFilter);
      break;
    default:
      procData = { message: "Invalid id" };
  }

  const returnedData = {
    metric: query.id,
    dimensions: query.dimensions,
    aggregation: query.aggregate,
    data: procData,
  };
  if (checkFilter) {
    returnedData.filters = {
      date: { from: query["filter.date.from"], to: query["filter.date.to"] },
    };
  }
  return returnedData;
};

const getRevenue = (query, rows, checkFilter) => {
  const { aggregate } = query;
  const fixedData = checkFilter
    ? calcBrandRevenue(rows)
    : { ...data.brandRevenue };
  if (aggregate !== "sum" && aggregate !== "avg") {
    return { message: "Invalid aggregate" };
  }
  const value = aggregate === "avg" ? "avg" : "revenue";

  Object.keys(fixedData).forEach((key) =>
    fixedData[key] = [{ value: fixedData[key][value] }]
  );
  return fixedData;
};

const getSessions = (query, rows, checkFilter) => {
  const fixedData = checkFilter
    ? getWeeklyDistinctSessions(rows)
    : { ...data.weeklyDistinctSessions };

  Object.keys(fixedData).forEach((key) =>
    fixedData[key] = [{ value: fixedData[key] }]
  );
  return fixedData;
};

const getConversion = (query, rows, checkFilter) => {
  const fixedData = checkFilter
    ? calcDailyConversionRate(rows)
    : { ...data.dailyConversionRate };

  Object.keys(fixedData).forEach((key) =>
    fixedData[key] = [{ value: fixedData[key] }]
  );
  return fixedData;
};

const getNetRevenue = (query, rows, checkFilter) => {
  const fixedData = checkFilter
    ? calcNetRevenueOfEachCustomer(rows)
    : { ...data.netRevenueOfEachCustomer };

  Object.keys(fixedData).forEach((key) => {
    fixedData[key] = [{ value: fixedData[key] }];
  });
  return fixedData;
};

export { queryHandler };
