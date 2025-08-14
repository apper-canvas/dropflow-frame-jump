import ordersData from "@/services/mockData/orders.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  constructor() {
    this.orders = [...ordersData];
  }

  async getAll() {
    await delay(300);
    return [...this.orders];
  }

  async getById(id) {
    await delay(200);
    const order = this.orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  }

  async create(orderData) {
    await delay(500);
    const newId = Math.max(...this.orders.map(o => o.Id)) + 1;
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(newId).padStart(3, "0")}`;
    const newOrder = {
      Id: newId,
      orderNumber,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    this.orders.push(newOrder);
    return { ...newOrder };
  }

  async update(id, orderData) {
    await delay(350);
    const index = this.orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    this.orders[index] = { ...this.orders[index], ...orderData };
    return { ...this.orders[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    this.orders.splice(index, 1);
    return { success: true };
  }

  async getByStatus(status) {
    await delay(300);
    return this.orders.filter(o => o.status === status);
  }

  async getByDateRange(startDate, endDate) {
    await delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= start && orderDate <= end;
    });
  }

async getRecentOrders(limit = 10) {
    await delay(250);
    return [...this.orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  async getOrderShippingDetails(id) {
    await delay(200);
    const order = this.orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Return enhanced order data with shipping-specific fields
    return {
      ...order,
      customerAddress: order.customerAddress || `${order.customer} Address, City, State 12345`,
      totalWeight: this.calculateOrderWeight(order),
      estimatedDimensions: this.getEstimatedPackageDimensions(order)
    };
  }

  calculateOrderWeight(order) {
    // Simulate weight calculation based on items
    const baseWeight = order.items * 1.2; // 1.2 lbs per item average
    return Math.round(baseWeight * 10) / 10; // Round to 1 decimal
  }

  getEstimatedPackageDimensions(order) {
    // Simulate package dimensions based on order size
    const items = order.items;
    if (items <= 2) {
      return { length: 8, width: 6, height: 4 };
    } else if (items <= 5) {
      return { length: 12, width: 8, height: 6 };
    } else {
      return { length: 16, width: 12, height: 8 };
    }
  }
}

export const orderService = new OrderService();