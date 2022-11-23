import { 
	data,
	getRowsByDateRange,
	calcBrandRevenue,
	getWeeklyDistinctSessions,
	calcDailyConversionRate,
	calcNetRevenueOfEachCustomer,
} from "./dataHandler.js";

const queryHandler = (query) => {
  // TODO make filters object
  const checkFilter = Object.keys(query).some((key) => key.startsWith("filter"));
  if (checkFilter && !query["filter.date.from"] && !query["filter.date.to"]) {
    return { message: "Missing required filtered query parameters" };
  }
  const rows = checkFilter ? getRowsByDateRange(data.rows, query["filter.date.from"], query["filter.date.to"]) : {};
  switch (query.id) {
    case "revenue":
      return getRevenue(query, rows, checkFilter);
    case "sessions":
      return getSessions(query, rows, checkFilter);
    case "conversion":
      return getConversion(query, rows, checkFilter);
    case "net-revenue":
      return getNetRevenue(query, rows, checkFilter);
    default:
      return { message: "Invalid id" };
  }
};

const getRevenue = (query, rows, checkFilter) => {
  const { id, dimensions, aggregate } = query;
  const fixedData = checkFilter ? calcBrandRevenue(rows) : { ...data.brandRevenue };
  if (aggregate !== "sum" && aggregate !== "avg") {
    return { message: "Invalid aggregate" };
  }
  const value = aggregate === "avg" ? "avg" : "revenue";

  Object.keys(fixedData).forEach((key) =>
    fixedData[key] = [{ value: fixedData[key][value] }]
  );
  return {
    metric: id,
    dimensions: dimensions,
    aggregation: aggregate,
    data: fixedData,
  };
};

const getSessions = (query, rows, checkFilter) => {
  const { id, dimensions, aggregate } = query;
  const fixedData = checkFilter ? getWeeklyDistinctSessions(rows) : { ...data.weeklyDistinctSessions };

  Object.keys(fixedData).forEach((key) =>
    fixedData[key] = [{ value: fixedData[key] }]
  );
  return {
    metric: id,
    dimensions: dimensions,
    aggregation: aggregate,
    data: fixedData,
  };
};

const getConversion = (query, rows, checkFilter) => {
  const { id, dimensions, aggregate } = query;
  const fixedData = checkFilter ? calcDailyConversionRate(rows) : { ...data.dailyConversionRate };

  Object.keys(fixedData).forEach((key) =>
    fixedData[key] = [{ value: fixedData[key] }]
  );
  return {
    metric: id,
    dimensions: dimensions,
    aggregation: aggregate,
    data: fixedData,
  };
};

const getNetRevenue = (query, rows, checkFilter) => {
  const { id, dimensions, aggregate } = query;
  const fixedData = checkFilter ? calcNetRevenueOfEachCustomer(rows) : { ...data.netRevenueOfEachCustomer };

  Object.keys(fixedData).forEach((key) => {
      fixedData[key] = [{ value: fixedData[key] }];
  });
  return {
    metric: id,
    dimensions: dimensions,
    aggregation: aggregate,
    data: fixedData,
  };
};

export { queryHandler };
