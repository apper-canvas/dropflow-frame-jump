class ProductService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'product_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "selling_price_c" } },
          { field: { Name: "supplier_price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "supplier_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "selling_price_c" } },
          { field: { Name: "supplier_price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "supplier_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(productData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: productData.Name || productData.name,
        Tags: productData.Tags || productData.tags || "",
        sku_c: productData.sku_c || productData.sku,
        description_c: productData.description_c || productData.description || "",
        selling_price_c: parseFloat(productData.selling_price_c || productData.sellingPrice || productData.price || 0),
        supplier_price_c: parseFloat(productData.supplier_price_c || productData.supplierPrice || 0),
        stock_c: parseInt(productData.stock_c || productData.stock || 0),
        category_c: productData.category_c || productData.category || "",
        images_c: productData.images_c || productData.images || "",
        supplier_id_c: productData.supplier_id_c ? parseInt(productData.supplier_id_c) : null
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create product');
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }

      return {};
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, productData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: productData.Name || productData.name,
        Tags: productData.Tags || productData.tags || "",
        sku_c: productData.sku_c || productData.sku,
        description_c: productData.description_c || productData.description || "",
        selling_price_c: parseFloat(productData.selling_price_c || productData.sellingPrice || productData.price || 0),
        supplier_price_c: parseFloat(productData.supplier_price_c || productData.supplierPrice || 0),
        stock_c: parseInt(productData.stock_c || productData.stock || 0),
        category_c: productData.category_c || productData.category || "",
        images_c: productData.images_c || productData.images || "",
        supplier_id_c: productData.supplier_id_c ? parseInt(productData.supplier_id_c) : null
      };

      const params = {
        records: [updateableData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update product');
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data || {};
      }

      return {};
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete product');
        }
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "selling_price_c" } },
          { field: { Name: "supplier_price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "supplier_id_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by category:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getLowStock(threshold = 10) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "selling_price_c" } },
          { field: { Name: "supplier_price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "supplier_id_c" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "stock_c",
                    operator: "LessThanOrEqualTo",
                    values: [threshold.toString()]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "stock_c",
                    operator: "GreaterThan",
                    values: ["0"]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching low stock products:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getOutOfStock() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "selling_price_c" } },
          { field: { Name: "supplier_price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "supplier_id_c" } }
        ],
        where: [
          {
            FieldName: "stock_c",
            Operator: "EqualTo",
            Values: ["0"]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching out of stock products:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async bulkUpdatePrices(productIds, updateData) {
    try {
      const { type, value } = updateData;
      
      // First fetch current products
      const products = await this.getAll();
      const recordsToUpdate = [];
      
      productIds.forEach(id => {
        const product = products.find(p => p.Id === parseInt(id));
        if (product) {
          let newPrice;
          if (type === "percentage") {
            newPrice = parseFloat((product.selling_price_c * (1 + value / 100)).toFixed(2));
          } else {
            newPrice = parseFloat((product.selling_price_c + value).toFixed(2));
          }
          
          recordsToUpdate.push({
            Id: parseInt(id),
            selling_price_c: newPrice
          });
        }
      });

      if (recordsToUpdate.length === 0) {
        return { success: true };
      }

      const params = {
        records: recordsToUpdate
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk updating prices:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async bulkApplyDiscount(productIds, discountPercent) {
    try {
      // First fetch current products
      const products = await this.getAll();
      const recordsToUpdate = [];
      
      productIds.forEach(id => {
        const product = products.find(p => p.Id === parseInt(id));
        if (product) {
          const newPrice = parseFloat((product.selling_price_c * (1 - discountPercent / 100)).toFixed(2));
          recordsToUpdate.push({
            Id: parseInt(id),
            selling_price_c: newPrice
          });
        }
      });

      if (recordsToUpdate.length === 0) {
        return { success: true };
      }

      const params = {
        records: recordsToUpdate
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error applying bulk discount:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async bulkDiscontinue(productIds) {
    try {
      const recordsToUpdate = productIds.map(id => ({
        Id: parseInt(id),
        stock_c: 0
      }));

      const params = {
        records: recordsToUpdate
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk discontinuing products:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
}

// CSV Import/Export functionality
async function importFromCSV(csvData) {
  const lines = csvData.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const requiredFields = ['Name', 'sku_c', 'selling_price_c', 'category_c'];
  
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
      product.selling_price_c = parseFloat(product.selling_price_c);
      if (isNaN(product.selling_price_c) || product.selling_price_c < 0) {
        throw new Error(`Invalid price on row ${i + 1}`);
      }

      if (product.stock_c) {
        product.stock_c = parseInt(product.stock_c);
        if (isNaN(product.stock_c) || product.stock_c < 0) {
          product.stock_c = 0;
        }
      }

      // Check if SKU already exists
      const existingProducts = await productService.getAll();
      const existing = existingProducts.find(p => p.sku_c === product.sku_c);
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
  const products = await productService.getAll();
  const headers = ['Id', 'Name', 'sku_c', 'selling_price_c', 'category_c', 'stock_c', 'description_c'];
  const csvContent = [
    headers.join(','),
    ...products.map(product => 
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