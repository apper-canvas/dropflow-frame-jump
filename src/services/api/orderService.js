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
}

export const orderService = new OrderService();