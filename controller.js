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
  // TODO: implement
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
