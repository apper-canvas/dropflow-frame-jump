import suppliersData from "@/services/mockData/suppliers.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

export const supplierService = new SupplierService();