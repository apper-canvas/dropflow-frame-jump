import React, { useEffect, useState } from "react";
import ImportExportModal from "@/components/molecules/ImportExportModal";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/organisms/ProductCard";
import BulkDiscountModal from "@/components/molecules/BulkDiscountModal";
import BulkDiscontinueModal from "@/components/molecules/BulkDiscontinueModal";
import BulkPriceUpdateModal from "@/components/molecules/BulkPriceUpdateModal";
import BulkActionToolbar from "@/components/molecules/BulkActionToolbar";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
const Products = () => {
const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showDiscontinueModal, setShowDiscontinueModal] = useState(false);
const [showImportExportModal, setShowImportExportModal] = useState(false);

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

  const handleSelectProduct = (productId, isSelected) => {
    const newSelected = new Set(selectedProducts);
    if (isSelected) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.Id)));
    }
  };

  const handleBulkPriceUpdate = async (updateData) => {
    try {
      const selectedIds = Array.from(selectedProducts);
      await productService.bulkUpdatePrices(selectedIds, updateData);
      toast.success(`Prices updated for ${selectedIds.length} products`);
      setSelectedProducts(new Set());
      await loadProducts();
    } catch (error) {
      toast.error("Failed to update prices");
    }
  };

  const handleBulkDiscount = async (discountPercent) => {
    try {
      const selectedIds = Array.from(selectedProducts);
      await productService.bulkApplyDiscount(selectedIds, discountPercent);
      toast.success(`${discountPercent}% discount applied to ${selectedIds.length} products`);
      setSelectedProducts(new Set());
      await loadProducts();
    } catch (error) {
      toast.error("Failed to apply discount");
    }
  };

  const handleBulkDiscontinue = async () => {
    try {
      const selectedIds = Array.from(selectedProducts);
      await productService.bulkDiscontinue(selectedIds);
      toast.success(`${selectedIds.length} products discontinued`);
      setSelectedProducts(new Set());
      setShowDiscontinueModal(false);
      await loadProducts();
    } catch (error) {
      toast.error("Failed to discontinue products");
    }
  };
const handleImportProducts = async (csvData) => {
    try {
      const result = await productService.importFromCSV(csvData);
      toast.success(`Successfully imported ${result.imported} products. ${result.skipped} skipped due to errors.`);
      loadProducts();
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
    }
  };

  const handleExportProducts = async () => {
    try {
      await productService.exportToCSV();
      toast.success('Products exported successfully');
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    }
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
          <Button 
            variant="secondary" 
            icon="Upload"
            onClick={() => setShowImportExportModal(true)}
          >
            Import/Export
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

        {/* Results count and Select All */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {filteredProducts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              icon={selectedProducts.size === filteredProducts.length ? "CheckSquare" : "Square"}
            >
              {selectedProducts.size === filteredProducts.length ? "Deselect All" : "Select All"}
            </Button>
          )}
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
              isSelected={selectedProducts.has(product.Id)}
              onSelect={(isSelected) => handleSelectProduct(product.Id, isSelected)}
            />
          ))}
        </div>
      )}

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedProducts.size}
        onBulkPriceUpdate={() => setShowPriceModal(true)}
        onBulkDiscount={() => setShowDiscountModal(true)}
        onBulkDiscontinue={() => setShowDiscontinueModal(true)}
        onClearSelection={() => setSelectedProducts(new Set())}
      />

      {/* Modals */}
      <BulkPriceUpdateModal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        onConfirm={handleBulkPriceUpdate}
        selectedCount={selectedProducts.size}
      />

      <BulkDiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onConfirm={handleBulkDiscount}
        selectedCount={selectedProducts.size}
      />

      <BulkDiscontinueModal
        isOpen={showDiscontinueModal}
        onClose={() => setShowDiscontinueModal(false)}
        onConfirm={handleBulkDiscontinue}
selectedCount={selectedProducts.size}
      />

      <ImportExportModal
        isOpen={showImportExportModal}
        onClose={() => setShowImportExportModal(false)}
        onImport={handleImportProducts}
        onExport={handleExportProducts}
        dataType="Products"
        allowImport={true}
        allowExport={true}
      />
    </div>
  );
};

export default Products;