import type { FC } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { TopProductData } from "@/types";

export const TopProductsChart: FC<{ data: TopProductData[] }> = ({ data }) => {
  // --- This logic correctly fetches the computed CSS variables ---
  const primaryColor = useThemeColor("--primary");
  const mutedColor = useThemeColor("--muted-foreground");
  const borderColor = useThemeColor("--border");
  const cardColor = useThemeColor("--card");
  const cardForegroundColor = useThemeColor("--card-foreground");
  const accentColor = useThemeColor("--accent");

  // --- This logic correctly formats the data for the chart ---
  const formattedData = data.map((item) => ({
    name:
      item.product.name.length > 20
        ? `${item.product.name.substring(0, 20)}...`
        : item.product.name,
    "Units Sold": parseInt(item.totalQuantitySold, 10),
  }));

  // --- The `return` statement was added here to render the JSX ---
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Top 5 products by units sold.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {/* All the color props are correctly passed the computed values */}
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
            <XAxis type="number" stroke={mutedColor} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              stroke={mutedColor}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: cardColor,
                borderColor: borderColor,
                color: cardForegroundColor,
              }}
              cursor={{ fill: accentColor, fillOpacity: 0.1 }}
            />
            <Legend />
            <Bar dataKey="Units Sold" fill={primaryColor} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
