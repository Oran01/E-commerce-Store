"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getSalesTrends,
  getTopSellingProducts,
  getRevenueByProduct,
} from "../_actions/analytics";
import { formatCurrency } from "@/lib/formatters";

// Define expected data types
type SalesTrend = { date: string; total: number };
type TopProduct = { name: string; sales: number };
type RevenueProduct = { name: string; revenue: number };

/**
 * A component that renders various charts for sales analytics.
 *
 */
export function AnalyticsCharts() {
  //  Explicitly define the types of state variables
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [revenueByProduct, setRevenueByProduct] = useState<RevenueProduct[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      setSalesTrends(await getSalesTrends());
      setTopProducts(await getTopSellingProducts());
      setRevenueByProduct(await getRevenueByProduct());
    }
    fetchData();
  }, []);

  const colors = ["#B6A6E9", "#876FD4", "#5E40BE", "#3D2785", "#21134D"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {/* Sales Over Time Chart */}
      <div className="p-4 bg-transparent border border-gray-300  shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-white">
          Sales Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesTrends}>
            <XAxis dataKey="date" tick={{ fill: "white", dy: 10 }} />
            <YAxis tick={{ fill: "white" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#B6A6E9"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products Chart */}
      <div className="p-4 bg-transparent border border-gray-300 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-white">
          Top Selling Products
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <XAxis dataKey="name" tick={false} axisLine={true} />

            <YAxis
              tick={{ fill: "white" }}
              allowDecimals={false}
              domain={[1, "auto"]}
            />
            <Tooltip />
            <Bar dataKey="sales">
              {/* Assign a unique color to each product */}
              {topProducts.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by Product Pie Chart */}
      <div className="p-4  bg-transparent border border-gray-300 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-center text-white">
          Revenue by Product
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={revenueByProduct}
              dataKey="revenue"
              nameKey="name"
              innerRadius={80}
              outerRadius={120}
              strokeWidth={5}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {revenueByProduct.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>

            {/* Centered Text for Total Revenue */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-xl font-bold"
            >
              {formatCurrency(
                revenueByProduct.reduce((acc, cur) => acc + cur.revenue, 0)
              )}
            </text>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
