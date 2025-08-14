import productsData from "@/services/mockData/products.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  async getAll() {
    await delay(300);
    return [...this.products];
  }

  async getById(id) {
    await delay(200);
    const product = this.products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  }

  async create(productData) {
    await delay(400);
    const newId = Math.max(...this.products.map(p => p.Id)) + 1;
    const newProduct = {
      Id: newId,
      ...productData,
      createdAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async update(id, productData) {
    await delay(350);
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    this.products[index] = { ...this.products[index], ...productData };
    return { ...this.products[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    this.products.splice(index, 1);
    return { success: true };
  }

  async getByCategory(category) {
    await delay(300);
    return this.products.filter(p => p.category === category);
  }

  async getLowStock(threshold = 10) {
    await delay(250);
    return this.products.filter(p => p.stock <= threshold && p.stock > 0);
  }

  async getOutOfStock() {
    await delay(250);
    return this.products.filter(p => p.stock === 0);
  }
}

export const productService = new ProductService();