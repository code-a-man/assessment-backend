import { data } from "./dataHandler.js";

const queryHandler = (query) => {
  switch (query.id) {
    case "revenue":
      return getRevenue(query);
    case "sessions":
      return getSessions(query);
    case "conversion":
      return getConversion(query);
    case "net-revenue":
      return getNetRevenue(query);
    default:
      return { message: "Invalid id" };
  }
};

const getRevenue = (query) => {
  const { id, dimensions, aggregate } = query;
  const fixedData = { ...data.brandRevenue }; // ? create a copy of the data to avoid changing the original data
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

const getSessions = (query) => {
  // TODO: implement
};

const getConversion = (query) => {
  // TODO: implement
};

const getNetRevenue = (query) => {
  // TODO: implement
};
export { queryHandler };
