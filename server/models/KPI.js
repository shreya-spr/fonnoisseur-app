import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);

const daySchema = new Schema(
  {
    date: String,
    revenue: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
    expenses: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
  },
  { toJSON: { getters: true } }  // to be able to use the 'get:'
);

const monthSchema = new Schema(
  {
    month: String,
    revenue: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
    expenses: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
    operationalExpenses: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
    nonOperationalExpenses: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
  },
  { toJSON: { getters: true } }  // to be able to use the 'get:'
);

const KPISchema = new Schema(
  {
    totalProfit: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,  // currency is always mul by 100, 
      // divide by 100 to get the actual value
    },
    totalRevenue: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,  
    },
    totalExpenses: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
    expensesByCategory: {
        // its an object
      type: Map,
      of: {
        type: mongoose.Types.Currency,
        currency: "USD",
        get: (v) => v / 100,
      },
    },
    monthlyData: [monthSchema],
    dailyData: [daySchema],
  },
  { timestamps: true, toJSON: { getters: true } }
);

const KPI = mongoose.model("KPI", KPISchema);

export default KPI;