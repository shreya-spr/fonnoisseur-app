import DashboardBox from "@/components/DashboardBox";
import React, { useMemo, useState } from "react";
import { useGetKpisQuery } from "@/state/api";
import FlexBetween from "@/components/FlexBetween";
import { Box, Button, Typography, useTheme } from "@mui/material";

import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression, { DataPoint } from "regression";


const Predictions = () => {
    const { palette } = useTheme();
    const [isPredictions, setIsPredictions] = useState(false);
    const { data: kpiData } = useGetKpisQuery();

    const formattedData = useMemo(() => {
        if (!kpiData) {
            return [];
        }
        const monthData = kpiData[0].monthlyData;
    
        const formatted: Array<DataPoint> = monthData.map(
          ({ revenue }, i: number) => {
            return [i, revenue];
          }
        );
        const regressionLine = regression.linear(formatted);
    
        return monthData.map(({ month, revenue }, i: number) => {
          return {
            name: month,
            "Actual Revenue": revenue,
            "Regression Line": regressionLine.points[i][1],
            // like get the january of the next year
            "Predicted Revenue": regressionLine.predict(i + 12)[1],
          };
        });
      }, [kpiData]);

    return (
        <DashboardBox width="100%" height="100%" p="1rem" overflow="hidden">

        {/* title */}
        <FlexBetween m="1rem 2.5rem" gap="1rem">
        <Box>
          <Typography variant="h3">Revenue and Predictions</Typography>
          <Typography variant="h6">
            charted revenue and predicted revenue based on a simple linear
            regression model
          </Typography>
        </Box>
        <Button
          onClick={() => setIsPredictions(!isPredictions)}
          sx={{
            color: palette.grey[800],
            backgroundColor: palette.grey[600],
            boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
          }}
        >
          Show Predicted Revenue for Next Year
        </Button>
        </FlexBetween>

        {/* the actual plot */}
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 20,
            right: 75,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
          <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }}>
            {/* title for axes */}
            <Label value="Month" offset={-5} position="insideBottom" />
          </XAxis>
          {/* set range and add currency signs and other styles */}
          <YAxis
            domain={[12000, 26000]} 
            axisLine={{ strokeWidth: "0" }}
            style={{ fontSize: "10px" }}
            tickFormatter={(v) => `₹${v}`}
          >
            <Label
              value="Revenue in INR"
              angle={-90}
              offset={-5}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="Actual Revenue"
            stroke={palette.primary.main}
            strokeWidth={0}
            dot={{ strokeWidth: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Regression Line"
            stroke="#8884d8"
            dot={false}
          />
          {/* dotted prediction line */}
          {isPredictions && (
            <Line
              strokeDasharray="5 5"
              dataKey="Predicted Revenue"
              stroke={palette.secondary[500]}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
        </DashboardBox>
    );
};

export default Predictions;