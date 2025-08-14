import React, { useState, useEffect } from "react";
import ProductCard from "@/components/organisms/ProductCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError("Failed to load products");
      console.error("Products loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter);
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
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const handleViewProduct = (product) => {
    toast.info(`Viewing ${product.name}`);
  };

  const handleEditProduct = (product) => {
    toast.info(`Editing ${product.name}`);
  };

  const handleAddToStore = (product) => {
    toast.success(`${product.name} added to your store!`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProducts} />;

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Products</h1>
          <p className="text-gray-600">Browse and manage your product catalog</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon="Upload">
            Import Products
          </Button>
          <Button variant="primary" icon="Plus">
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products by name, description, or SKU..."
              className="w-full"
            />
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
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

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="No Products Found"
          description={searchTerm || categoryFilter !== "all" || stockFilter !== "all" 
            ? "Try adjusting your filters to find more products."
            : "Start building your catalog by adding products from suppliers."
          }
          actionLabel="Add First Product"
          icon="Package"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.Id}
              product={product}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onAddToStore={handleAddToStore}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;