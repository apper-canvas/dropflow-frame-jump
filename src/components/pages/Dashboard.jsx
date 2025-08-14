import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import OrderTable from "@/components/organisms/OrderTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";
import { productService } from "@/services/api/productService";
import { supplierService } from "@/services/api/supplierService";
import SupplierPerformanceCard from "@/components/molecules/SupplierPerformanceCard";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";

const Dashboard = () => {
const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierMetrics, setSupplierMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [ordersData, productsData, suppliersData, metricsData] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        supplierService.getAll(),
        supplierService.getPerformanceMetrics()
      ]);
      
setOrders(ordersData);
      setProducts(productsData);
      setSuppliers(suppliersData);
      setSupplierMetrics(metricsData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleViewOrder = (order) => {
    toast.info(`Viewing order #${order.orderNumber}`);
  };

  const handleUpdateOrderStatus = (order) => {
    toast.info(`Updating status for order #${order.orderNumber}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

// Calculate enhanced metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalSales = orders.filter(order => order.status === "completed").length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const lowStockProducts = products.filter(product => product.stock < 10 && product.stock > 0).length;
  
  // Chart data preparation
  const salesTrendData = {
    options: {
      chart: {
        type: 'line',
        toolbar: { show: false },
        sparkline: { enabled: false }
      },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#5E3AEE'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        labels: { style: { colors: '#64748B' } }
      },
      yaxis: { labels: { style: { colors: '#64748B' } } },
      grid: { borderColor: '#E2E8F0' },
      tooltip: { theme: 'light' }
    },
    series: [{
      name: 'Sales',
      data: [12000, 19000, 15000, 25000, 22000, 30000]
    }]
  };

  const categoryDistributionData = {
    options: {
      chart: { type: 'donut' },
      colors: ['#5E3AEE', '#10B981', '#F59E0B', '#EF4444'],
      labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
      legend: { position: 'bottom' },
      plotOptions: {
        pie: { donut: { size: '70%' } }
      }
    },
    series: [35, 25, 20, 20]
  };

  const topProductsData = {
    options: {
      chart: {
        type: 'bar',
        toolbar: { show: false }
      },
      colors: ['#5E3AEE'],
      xaxis: {
        categories: products.slice(0, 5).map(p => p.name.substring(0, 15) + '...'),
        labels: { style: { colors: '#64748B' } }
      },
      yaxis: { labels: { style: { colors: '#64748B' } } },
      grid: { borderColor: '#E2E8F0' },
      plotOptions: {
        bar: { borderRadius: 4, horizontal: false }
      }
    },
    series: [{
      name: 'Sales',
      data: products.slice(0, 5).map(() => Math.floor(Math.random() * 100) + 20)
    }]
  };
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Dashboard</h1>
          <p className="text-gray-600">Monitor your dropshipping operations</p>
        </div>
        <Button variant="primary" icon="RefreshCw" onClick={loadDashboardData}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
{/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
<StatCard
          title="Total Sales"
          value={totalSales?.toString() || '0'}
          icon="TrendingUp"
          gradient="from-blue-500 to-blue-600"
          changeValue={12}
          changeType="positive"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue?.toLocaleString() || '0'}`}
          icon="DollarSign"
          gradient="from-success to-green-600"
          changeValue={8}
          changeType="positive"
        />
        <StatCard
          title="Average Order Value"
          value={`$${averageOrderValue?.toFixed(2) || '0.00'}`}
          icon="Calculator"
          gradient="from-purple-500 to-purple-600"
          changeValue={5}
          changeType="positive"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders?.toString() || '0'}
          icon="Clock"
          gradient="from-warning to-yellow-600"
          changeValue={3}
          changeType="negative"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockProducts?.toString() || '0'}
          icon="AlertTriangle"
          gradient="from-error to-red-600"
          changeValue={0}
          changeType="neutral"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary">Sales Trend</h3>
            <ApperIcon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <Chart
            options={salesTrendData.options}
            series={salesTrendData.series}
            type="line"
            height={300}
          />
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary">Category Distribution</h3>
            <ApperIcon name="PieChart" size={20} className="text-primary" />
          </div>
          <Chart
            options={categoryDistributionData.options}
            series={categoryDistributionData.series}
            type="donut"
            height={300}
          />
        </div>
      </div>

      {/* Top Products Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary">Top Selling Products</h3>
          <ApperIcon name="BarChart3" size={20} className="text-primary" />
        </div>
        <Chart
          options={topProductsData.options}
          series={topProductsData.series}
          type="bar"
          height={350}
        />
      </div>
{/* Revenue Analytics & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Insights */}
        <div className="bg-gradient-to-br from-primary/5 to-purple-100 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <ApperIcon name="Target" size={20} className="text-primary mr-3" />
            <h3 className="text-lg font-semibold text-secondary">Performance Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Monthly Growth</span>
              <span className="font-semibold text-success">+12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Customer Retention</span>
              <span className="font-semibold text-primary">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Conversion Rate</span>
              <span className="font-semibold text-accent">4.2%</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts > 0 && (
          <div className="bg-gradient-to-r from-warning/5 to-yellow-100 border border-warning/20 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <ApperIcon name="AlertTriangle" size={20} className="text-warning mr-3" />
              <h3 className="text-lg font-semibold text-secondary">Inventory Alert</h3>
            </div>
            <p className="text-gray-700 mb-4">
              {lowStockProducts} product{lowStockProducts !== 1 ? "s" : ""} need restocking attention.
            </p>
            <Button variant="warning" size="sm" icon="Package">
              Manage Inventory
            </Button>
          </div>
        )}
      </div>

{/* Supplier Performance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Supplier Performance</h2>
          <Button variant="outline" size="sm">
            <ApperIcon name="BarChart3" size={16} className="mr-2" />
            View Details
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map(supplier => {
            const performance = supplierMetrics.find(m => m.supplierId === supplier.Id);
            if (!performance) return null;
            
            return (
              <SupplierPerformanceCard
                key={supplier.Id}
                supplier={supplier}
                performance={performance}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary">Recent Orders</h2>
          <Button variant="ghost" size="sm" icon="ArrowRight">
            View All Orders
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <Empty
            title="No Recent Orders"
            description="Your recent orders will appear here once you start receiving them."
            icon="ShoppingCart"
          />
        ) : (
          <OrderTable
            orders={recentOrders}
            onViewOrder={handleViewOrder}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;