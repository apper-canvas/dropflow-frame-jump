import React, { useState, useEffect } from "react";
import InventoryList from "@/components/organisms/InventoryList";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError("Failed to load inventory");
      console.error("Inventory loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Stock filter
    if (stockFilter !== "all") {
      if (stockFilter === "in-stock") {
        filtered = filtered.filter(product => product.stock > 10);
      } else if (stockFilter === "low-stock") {
        filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
      } else if (stockFilter === "out-of-stock") {
        filtered = filtered.filter(product => product.stock === 0);
      }
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, stockFilter]);

  const handleUpdateStock = (product) => {
    toast.info(`Updating stock for ${product.name}`);
  };

  const handleViewProduct = (product) => {
    toast.info(`Viewing ${product.name} details`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadInventory} />;

  // Calculate metrics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stock > 10).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.sellingPrice * p.stock), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Inventory</h1>
          <p className="text-gray-600">Monitor stock levels and product availability</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon="Download">
            Export Inventory
          </Button>
          <Button variant="primary" icon="RefreshCw" onClick={loadInventory}>
            Sync Stock
          </Button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon="Package"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="In Stock"
          value={inStockProducts}
          icon="CheckCircle"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Low Stock"
          value={lowStockProducts}
          icon="AlertTriangle"
          gradient="from-warning to-yellow-600"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockProducts}
          icon="XCircle"
          gradient="from-error to-red-600"
        />
        <StatCard
          title="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          icon="DollarSign"
          gradient="from-primary to-purple-600"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts > 0 && (
        <div className="bg-gradient-to-r from-warning/5 to-yellow-100 border border-warning/20 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-warning mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-1">Low Stock Alert</h3>
                <p className="text-gray-700">
                  {lowStockProducts} product{lowStockProducts !== 1 ? "s" : ""} running low on stock
                </p>
              </div>
            </div>
            <Button variant="warning" size="sm" icon="Package">
              Restock Now
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products by name, SKU, or category..."
              className="w-full"
            />
          </div>
          
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock (10+ units)</option>
              <option value="low-stock">Low Stock (1-10 units)</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>

      {/* Inventory List */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="No Products Found"
          description={searchTerm || stockFilter !== "all"
            ? "Try adjusting your filters to find more products."
            : "Your inventory will appear here once you add products."
          }
          actionLabel="Add Products"
          icon="Package"
        />
      ) : (
        <InventoryList
          products={filteredProducts}
          onUpdateStock={handleUpdateStock}
          onViewProduct={handleViewProduct}
        />
      )}
    </div>
  );
};

export default Inventory;