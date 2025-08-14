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
}

export const supplierService = new SupplierService();