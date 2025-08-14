// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class OrderService {
  constructor() {
    this.tableName = 'order_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "order_number_c" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "items_c" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching orders:", error?.response?.data?.message);
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
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "order_number_c" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "items_c" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching order with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(orderData) {
    try {
      // Only include Updateable fields in create operation
      const createData = {
        Name: orderData.Name || `Order ${Date.now()}`,
        Tags: orderData.Tags || "",
        order_number_c: orderData.order_number_c || `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        customer_name_c: orderData.customer_name_c || "",
        customer_email_c: orderData.customer_email_c || "",
        shipping_address_c: orderData.shipping_address_c || "",
        status_c: orderData.status_c || "pending",
        total_c: parseFloat(orderData.total_c) || 0.0,
        items_c: orderData.items_c || ""
      };

      const params = { records: [createData] };
      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create order ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create order');
        }

        return successfulRecords[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating order:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

async update(id, orderData) {
    try {
      // Only include Updateable fields in update operation
      const updateData = {
        Id: parseInt(id)
      };

      if (orderData.Name !== undefined) updateData.Name = orderData.Name;
      if (orderData.Tags !== undefined) updateData.Tags = orderData.Tags;
      if (orderData.order_number_c !== undefined) updateData.order_number_c = orderData.order_number_c;
      if (orderData.customer_name_c !== undefined) updateData.customer_name_c = orderData.customer_name_c;
      if (orderData.customer_email_c !== undefined) updateData.customer_email_c = orderData.customer_email_c;
      if (orderData.shipping_address_c !== undefined) updateData.shipping_address_c = orderData.shipping_address_c;
      if (orderData.status_c !== undefined) updateData.status_c = orderData.status_c;
      if (orderData.total_c !== undefined) updateData.total_c = parseFloat(orderData.total_c);
      if (orderData.items_c !== undefined) updateData.items_c = orderData.items_c;

      const params = { records: [updateData] };
      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update order ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update order');
        }

        return successfulUpdates[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating order:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete order ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete order');
        }

        return { success: true };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting order:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "order_number_c" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "items_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching orders by status:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "order_number_c" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "items_c" } }
        ],
        where: [
          {
            FieldName: "CreatedOn",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "CreatedOn",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching orders by date range:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getRecentOrders(limit = 10) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "order_number_c" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "customer_email_c" } },
          { field: { Name: "shipping_address_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "total_c" } },
          { field: { Name: "items_c" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent orders:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
async getOrderShippingDetails(id) {
    try {
      const order = await this.getById(id);
      if (!order) {
        throw new Error("Order not found");
      }
      
      // Return enhanced order data with shipping-specific fields
      return {
        ...order,
        customerAddress: order.shipping_address_c || `${order.customer_name_c} Address, City, State 12345`,
        totalWeight: this.calculateOrderWeight(order),
        estimatedDimensions: this.getEstimatedPackageDimensions(order)
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching order shipping details:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

calculateOrderWeight(order) {
    // Simulate weight calculation based on items
    const itemsCount = order.items_c ? order.items_c.split(',').length : 1;
    const baseWeight = itemsCount * 1.2; // 1.2 lbs per item average
    return Math.round(baseWeight * 10) / 10; // Round to 1 decimal
  }

  getEstimatedPackageDimensions(order) {
    // Simulate package dimensions based on order size
    const itemsCount = order.items_c ? order.items_c.split(',').length : 1;
    if (itemsCount <= 2) {
      return { length: 8, width: 6, height: 4 };
    } else if (itemsCount <= 5) {
      return { length: 12, width: 8, height: 6 };
    } else {
      return { length: 16, width: 12, height: 8 };
    }
  }
}

// CSV Export functionality
async function exportToCSV() {
  try {
    const orderService = new OrderService();
    const orders = await orderService.getAll();
    
    const headers = ['Id', 'Name', 'order_number_c', 'customer_name_c', 'customer_email_c', 'status_c', 'total_c', 'CreatedOn', 'items_c', 'shipping_address_c'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => 
        headers.map(header => {
          let value = order[header] || '';
          // Handle items formatting
          if (header === 'items_c' && value) {
            value = value.toString();
          }
          // Handle date formatting
          if (header === 'CreatedOn' && value) {
            value = new Date(value).toLocaleDateString();
          }
          // Handle total formatting
          if (header === 'total_c' && typeof value === 'number') {
            value = `$${value.toFixed(2)}`;
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
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting orders to CSV:", error);
    throw error;
  }
}

export { exportToCSV };
export const orderService = new OrderService();