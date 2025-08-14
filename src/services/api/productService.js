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

  async bulkUpdatePrices(productIds, updateData) {
    await delay(500);
    const { type, value } = updateData;
    
    productIds.forEach(id => {
      const index = this.products.findIndex(p => p.Id === parseInt(id));
      if (index !== -1) {
        const product = this.products[index];
        if (type === "percentage") {
          product.sellingPrice = parseFloat((product.sellingPrice * (1 + value / 100)).toFixed(2));
        } else {
          product.sellingPrice = parseFloat((product.sellingPrice + value).toFixed(2));
        }
      }
    });
    
    return { success: true };
  }

  async bulkApplyDiscount(productIds, discountPercent) {
    await delay(500);
    
    productIds.forEach(id => {
      const index = this.products.findIndex(p => p.Id === parseInt(id));
      if (index !== -1) {
        const product = this.products[index];
        product.sellingPrice = parseFloat((product.sellingPrice * (1 - discountPercent / 100)).toFixed(2));
      }
    });
    
    return { success: true };
  }

  async bulkDiscontinue(productIds) {
    await delay(400);
    
    productIds.forEach(id => {
      const index = this.products.findIndex(p => p.Id === parseInt(id));
      if (index !== -1) {
        this.products[index].stock = 0;
      }
    });
    
    return { success: true };
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
  const requiredFields = ['name', 'sku', 'price', 'category'];
  
  // Validate headers
  for (const field of requiredFields) {
    if (!headers.includes(field)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  let imported = 0;
  let skipped = 0;
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const product = {};
      
      headers.forEach((header, index) => {
        product[header] = values[index] || '';
      });

      // Validate required fields
      for (const field of requiredFields) {
        if (!product[field]) {
          throw new Error(`Missing ${field} on row ${i + 1}`);
        }
      }

      // Convert numeric fields
      product.price = parseFloat(product.price);
      if (isNaN(product.price) || product.price < 0) {
        throw new Error(`Invalid price on row ${i + 1}`);
      }

      if (product.stock) {
        product.stock = parseInt(product.stock);
        if (isNaN(product.stock) || product.stock < 0) {
          product.stock = 0;
        }
      }

      // Check if SKU already exists
      const existing = productService.products.find(p => p.sku === product.sku);
      if (existing) {
        skipped++;
        continue;
      }

      // Add product
      await productService.create(product);
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
  
  const headers = ['Id', 'name', 'sku', 'price', 'category', 'stock', 'status', 'supplier', 'description'];
  const csvContent = [
    headers.join(','),
    ...productService.products.map(product => 
      headers.map(header => {
        const value = product[header] || '';
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
  link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { importFromCSV, exportToCSV };
export const productService = new ProductService();