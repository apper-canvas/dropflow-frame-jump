// Initialize ApperClient for supplier database operations
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'supplier_c';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock supplier data
const suppliersData = [
  {
    Id: 1,
    name: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    contact: "+1-555-0101",
    location: "New York, NY",
    rating: 4.5,
    status: "active",
    products: ["Software", "Hardware"],
    apiEndpoint: "https://api.techsolutions.com"
  },
  {
    Id: 2,
    name: "Global Supplies Co",
    email: "info@globalsupplies.com",
    contact: "+1-555-0102",
    location: "Los Angeles, CA",
    rating: 4.2,
    status: "active",
    products: ["Office Supplies", "Equipment"],
    apiEndpoint: null
  },
  {
    Id: 3,
    name: "Premium Parts Ltd",
    email: "sales@premiumparts.com",
    contact: "+1-555-0103",
    location: "Chicago, IL",
    rating: 4.8,
    status: "active",
    products: ["Automotive Parts", "Industrial"],
    apiEndpoint: "https://api.premiumparts.com"
  }
];

class SupplierService {
  constructor() {
    this.suppliers = [...suppliersData];
  }

  async getAll() {
    await delay(300);
    return [...this.suppliers];
  }

  async getById(id) {
    await delay(200);
    const supplier = this.suppliers.find(s => s.Id === parseInt(id));
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    return { ...supplier };
  }

  async create(supplierData) {
    await delay(400);
    const newId = Math.max(...this.suppliers.map(s => s.Id)) + 1;
    const newSupplier = {
      Id: newId,
      ...supplierData,
      createdAt: new Date().toISOString()
    };
    this.suppliers.push(newSupplier);
    return { ...newSupplier };
  }

  async update(id, supplierData) {
    await delay(350);
    const index = this.suppliers.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Supplier not found");
    }
    this.suppliers[index] = { ...this.suppliers[index], ...supplierData };
    return { ...this.suppliers[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.suppliers.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Supplier not found");
    }
    this.suppliers.splice(index, 1);
    return { success: true };
  }

  async getConnectedSuppliers() {
    await delay(250);
    return this.suppliers.filter(s => s.apiEndpoint);
  }

  async getTopRated(minRating = 4.0) {
    await delay(250);
    return this.suppliers.filter(s => s.rating >= minRating);
}

  async getPerformanceMetrics() {
    await delay(300);
    return this.suppliers.map(supplier => {
      // Generate realistic performance metrics based on supplier rating
      const basePerformance = (supplier.rating / 5) * 100;
      const variation = 5 + Math.random() * 10; // 5-15% variation
      
      const onTimeDelivery = Math.min(100, Math.max(70, 
        basePerformance + (Math.random() - 0.5) * variation
      ));
      
      const accuracy = Math.min(100, Math.max(85, 
        basePerformance + (Math.random() - 0.3) * (variation * 0.8)
      ));
      
      const avgProcessingTime = Math.max(1, Math.min(72, 
        48 - (basePerformance - 80) * 0.5 + (Math.random() - 0.5) * 20
      ));
      
      const processingTrend = (Math.random() - 0.5) * 8; // -4 to +4 hours trend
      
      const totalOrders = Math.floor(20 + Math.random() * 180); // 20-200 orders
      
      return {
        supplierId: supplier.Id,
        onTimeDelivery: Math.round(onTimeDelivery * 10) / 10,
        accuracy: Math.round(accuracy * 10) / 10,
        avgProcessingTime: Math.round(avgProcessingTime * 10) / 10,
        processingTrend: Math.round(processingTrend * 10) / 10,
        totalOrders
      };
    });
  }
}

// CSV Import/Export functionality
async function importFromCSV(csvData) {
  await delay(800);
  
  const lines = csvData.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const requiredFields = ['name', 'email', 'contact'];
  
  // Validate headers
  for (const field of requiredFields) {
    if (!headers.includes(field)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  let imported = 0;
  let skipped = 0;
  const serviceInstance = new SupplierService();
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const supplier = {};
      
      headers.forEach((header, index) => {
        supplier[header] = values[index] || '';
      });

      // Validate required fields
      for (const field of requiredFields) {
        if (!supplier[field]) {
          throw new Error(`Missing ${field} on row ${i + 1}`);
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(supplier.email)) {
        throw new Error(`Invalid email format on row ${i + 1}`);
      }

      // Convert numeric fields
      if (supplier.rating) {
        supplier.rating = parseFloat(supplier.rating);
        if (isNaN(supplier.rating) || supplier.rating < 0 || supplier.rating > 5) {
          supplier.rating = 0;
        }
      }

      // Check if email already exists
      const existing = serviceInstance.suppliers.find(s => s.email === supplier.email);
      if (existing) {
        skipped++;
        continue;
      }

      // Set default values
      supplier.status = supplier.status || 'active';
      supplier.location = supplier.location || '';
      supplier.rating = supplier.rating || 0;

      // Add supplier
      await serviceInstance.create(supplier);
      imported++;
    } catch (error) {
      console.warn(`Skipping row ${i + 1}: ${error.message}`);
      skipped++;
    }
  }

  return { imported, skipped };
}

async function exportToCSV() {
  await delay(300);
  
  const serviceInstance = new SupplierService();
  const suppliers = await serviceInstance.getAll();
  
  const headers = ['Id', 'name', 'email', 'contact', 'location', 'rating', 'status', 'products'];
  const csvContent = [
    headers.join(','),
    ...suppliers.map(supplier => 
      headers.map(header => {
        let value = supplier[header] || '';
        // Handle products array
        if (header === 'products' && Array.isArray(value)) {
          value = value.join('; ');
        }
        // Escape commas and quotes in values
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `suppliers_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { importFromCSV, exportToCSV };
export const supplierService = new SupplierService();