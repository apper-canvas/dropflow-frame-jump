import React, { useState, useEffect } from "react";
import OrderTable from "@/components/organisms/OrderTable";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import ShippingCalculator from "@/components/organisms/ShippingCalculator";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";
const Orders = () => {
const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState(null);
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await orderService.getAll();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Orders loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

const handleViewOrder = (order) => {
    toast.info(`Viewing order #${order.orderNumber}`);
  };

  const handleUpdateOrderStatus = async (order) => {
    try {
      const nextStatus = getNextStatus(order.status);
      await orderService.update(order.Id, { ...order, status: nextStatus });
      toast.success(`Order #${order.orderNumber} status updated to ${nextStatus}`);
      loadOrders();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const handleCalculateShipping = (order) => {
    setSelectedOrderForShipping(order);
    setShippingModalOpen(true);
  };

  const handleCloseShippingModal = () => {
    setShippingModalOpen(false);
    setSelectedOrderForShipping(null);
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      "pending": "processing",
      "processing": "shipped",
      "shipped": "delivered",
      "delivered": "delivered",
      "cancelled": "cancelled"
    };
    return statusFlow[currentStatus] || currentStatus;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOrders} />;

  // Calculate metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const processingOrders = orders.filter(order => order.status === "processing").length;
  const shippedOrders = orders.filter(order => order.status === "shipped").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Orders</h1>
          <p className="text-gray-600">Manage and track your customer orders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon="Download">
            Export Orders
          </Button>
          <Button variant="primary" icon="RefreshCw" onClick={loadOrders}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon="ShoppingCart"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Pending"
          value={pendingOrders}
          icon="Clock"
          gradient="from-warning to-yellow-600"
        />
        <StatCard
          title="Processing"
          value={processingOrders}
          icon="Package"
          gradient="from-info to-blue-600"
        />
        <StatCard
          title="Shipped"
          value={shippedOrders}
          icon="Truck"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          gradient="from-primary to-purple-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search orders by number, customer name, or email..."
              className="w-full"
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <Empty
          title="No Orders Found"
          description={searchTerm || statusFilter !== "all"
            ? "Try adjusting your filters to find more orders."
            : "Your orders will appear here when customers start purchasing."
          }
          icon="ShoppingCart"
        />
      ) : (
<OrderTable
          orders={filteredOrders}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateOrderStatus}
          onCalculateShipping={handleCalculateShipping}
        />
)}
      
      <ShippingCalculator
        order={selectedOrderForShipping}
        isOpen={shippingModalOpen}
        onClose={handleCloseShippingModal}
      />
    </div>
  );
};

export default Orders;