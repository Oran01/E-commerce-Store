import Link from "next/link";
import { AnalyticsCharts } from "@/app/admin/_components/AnalyticsCharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { ShoppingCart, Users, Package } from "lucide-react";
import { JSX } from "react";

/**
 * Retrieves aggregated sales data, including total revenue and number of sales.
 *
 */
async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

/**
 * Fetches user statistics, including total user count and average order value per user.
 *
 */
async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePreUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

/**
 * Retrieves product data, including the number of active and inactive products.
 *
 */
async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

/**
 * The Admin Dashboard component that displays sales, user, and product statistics.
 *
 */
export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="space-y-6">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Sales"
          subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
          body={formatCurrency(salesData.amount)}
          href="/admin/orders" // 🔗 Route for Sales
        />
        <DashboardCard
          title="Customers"
          subtitle={`${formatCurrency(userData.averageValuePreUser)} Average Value`}
          body={formatNumber(userData.userCount)}
          href="/admin/users" // 🔗 Route for Customers
        />
        <DashboardCard
          title="Active Products"
          subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
          body={formatNumber(productData.activeCount)}
          href="/admin/products" // 🔗 Route for Products
        />
      </div>
      <div className="ml-24">
        <AnalyticsCharts />
      </div>
    </div>
  );
}

/**
 * Type definition for the DashboardCard component props.
 */
type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
  href: string;
};

/**
 * A reusable component that represents a dashboard card with statistics and navigation.
 *
 * @param {DashboardCardProps} props - The properties for the dashboard card.
 */
function DashboardCard({ title, subtitle, body, href }: DashboardCardProps) {
  // Map icons based on the title
  const icons: { [key: string]: JSX.Element } = {
    Sales: <ShoppingCart className="text-gray-300" size={20} />,
    Customers: <Users className="text-gray-300" size={20} />,
    "Active Products": <Package className="text-gray-300" size={20} />,
  };

  return (
    <Link href={href}>
      <div className="ml-24 cursor-pointer">
        <Card className="bg-transparent border border-gray-300 hover:scale-105 transition-all duration-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              {icons[title] && icons[title]}{" "}
              {/* Render the icon if it exists */}
              <CardTitle className="text-white text-lg font-semibold">
                {title}
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              {subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-white text-xl font-bold">
            {body}
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
