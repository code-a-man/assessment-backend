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
  let data;

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
      data = getRevenue(query, rows, checkFilter);
      break;
    case "sessions":
      data = getSessions(query, rows, checkFilter);
      break;
    case "conversion":
      data = getConversion(query, rows, checkFilter);
      break;
    case "net-revenue":
      data = getNetRevenue(query, rows, checkFilter);
      break;
    default:
      data = { message: "Invalid id" };
  }

  const returnedData = {
    metric: query.id,
    dimensions: query.dimensions,
    aggregation: query.aggregate,
    data,
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
