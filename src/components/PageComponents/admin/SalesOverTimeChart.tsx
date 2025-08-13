import { useThemeColor } from "@/hooks/useThemeColor";
import type { FC } from "react";
import {
  LineChart,
  Line,
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
import type { SalesData } from "@/types";

export const SalesOverTimeChart: FC<{ data: SalesData[] }> = ({ data }) => {
  const primaryColor = useThemeColor("--primary");
  const mutedColor = useThemeColor("--muted-foreground");
  const borderColor = useThemeColor("--border");
  const cardColor = useThemeColor("--card");
  const cardForegroundColor = useThemeColor("--card-foreground");
  const accentColor = useThemeColor("--accent");

  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    Sales: parseFloat(item.totalSales),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Over Time</CardTitle>
        <CardDescription>Daily revenue from the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />

            <XAxis dataKey="date" stroke={mutedColor} />
            <YAxis stroke={mutedColor} tickFormatter={(value) => `$${value}`} />

            <Tooltip
              contentStyle={{
                backgroundColor: cardColor,
                borderColor: borderColor,
                color: cardForegroundColor,
              }}
              cursor={{ fill: accentColor, fillOpacity: 0.1 }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="Sales"
              stroke={primaryColor}
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
