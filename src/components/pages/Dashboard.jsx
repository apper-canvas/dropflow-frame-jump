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

  // Calculate metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = products.filter(product => product.stock < 10 && product.stock > 0).length;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon="ShoppingCart"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon="Clock"
          gradient="from-warning to-yellow-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockProducts}
          icon="AlertTriangle"
          gradient="from-error to-red-600"
        />
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts > 0 && (
        <div className="bg-gradient-to-r from-warning/5 to-yellow-100 border border-warning/20 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <ApperIcon name="AlertTriangle" size={20} className="text-warning mr-3" />
            <h2 className="text-lg font-semibold text-secondary">Low Stock Alert</h2>
          </div>
          <p className="text-gray-700 mb-4">
            You have {lowStockProducts} product{lowStockProducts !== 1 ? "s" : ""} with low stock levels that need attention.
          </p>
          <Button variant="warning" size="sm" icon="Package">
            View Inventory
          </Button>
        </div>
      )}

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