import React, { useState, useEffect } from "react";
import SupplierList from "@/components/organisms/SupplierList";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import { supplierService } from "@/services/api/supplierService";
import { toast } from "react-toastify";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await supplierService.getAll();
      setSuppliers(data);
      setFilteredSuppliers(data);
    } catch (err) {
      setError("Failed to load suppliers");
      console.error("Suppliers loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    let filtered = suppliers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(supplier => supplier.rating >= minRating);
    }

    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm, ratingFilter]);

  const handleViewSupplier = (supplier) => {
    toast.info(`Viewing ${supplier.name} details`);
  };

  const handleEditSupplier = (supplier) => {
    toast.info(`Editing ${supplier.name}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSuppliers} />;

  // Calculate metrics
  const totalSuppliers = suppliers.length;
  const connectedSuppliers = suppliers.filter(s => s.apiEndpoint).length;
  const averageRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
  const topRatedSuppliers = suppliers.filter(s => s.rating >= 4.5).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier relationships and performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon="Upload">
            Import Suppliers
          </Button>
          <Button variant="primary" icon="Plus">
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Supplier Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Suppliers"
          value={totalSuppliers}
          icon="Users"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="API Connected"
          value={connectedSuppliers}
          icon="Link"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          icon="Star"
          gradient="from-warning to-yellow-600"
        />
        <StatCard
          title="Top Rated (4.5+)"
          value={topRatedSuppliers}
          icon="Award"
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
              placeholder="Search suppliers by name or email..."
              className="w-full"
            />
          </div>
          
          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </p>
        </div>
      </div>

      {/* Suppliers List */}
      {filteredSuppliers.length === 0 ? (
        <Empty
          title="No Suppliers Found"
          description={searchTerm || ratingFilter !== "all"
            ? "Try adjusting your filters to find more suppliers."
            : "Start building your supplier network by adding your first supplier."
          }
          actionLabel="Add Supplier"
          icon="Users"
        />
      ) : (
        <SupplierList
          suppliers={filteredSuppliers}
          onViewSupplier={handleViewSupplier}
          onEditSupplier={handleEditSupplier}
        />
      )}
    </div>
  );
};

export default Suppliers;