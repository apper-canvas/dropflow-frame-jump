// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ShippingService {
  async calculateRates({ destination, weight, dimensions, orderValue }) {
    await delay(800); // Simulate API call

    // Validate inputs
    if (!destination || weight <= 0) {
      throw new Error("Invalid shipping parameters");
    }

    const { length, width, height } = dimensions;
    if (length <= 0 || width <= 0 || height <= 0) {
      throw new Error("Invalid package dimensions");
    }

    // Calculate dimensional weight (DIM weight = L x W x H / 166 for domestic)
    const dimensionalWeight = (length * width * height) / 166;
    const billableWeight = Math.max(weight, dimensionalWeight);

    // Base rates and calculations
    const baseRates = {
      USPS: {
        ground: { base: 8.50, perLb: 0.85, multiplier: 1.0 },
        priority: { base: 12.80, perLb: 1.25, multiplier: 1.2 },
        express: { base: 22.95, perLb: 2.15, multiplier: 1.5 }
      },
      FedEx: {
        ground: { base: 10.20, perLb: 1.05, multiplier: 1.1 },
        express: { base: 25.50, perLb: 2.35, multiplier: 1.3 },
        overnight: { base: 45.80, perLb: 3.85, multiplier: 1.8 }
      },
      UPS: {
        ground: { base: 9.85, perLb: 0.95, multiplier: 1.05 },
        express: { base: 24.75, perLb: 2.25, multiplier: 1.25 },
        overnight: { base: 48.20, perLb: 4.15, multiplier: 1.9 }
      }
    };

    // Distance and zone factor (simplified)
    const zoneFactor = this.calculateZoneFactor(destination);
    
    // Generate rates for each carrier and service
    const rates = [];

    // USPS rates
    rates.push({
      carrier: 'USPS',
      service: 'Ground Advantage',
      cost: this.calculateCost(baseRates.USPS.ground, billableWeight, zoneFactor),
      deliveryTime: '3-5 business days',
      recommended: false
    });

    rates.push({
      carrier: 'USPS',
      service: 'Priority Mail',
      cost: this.calculateCost(baseRates.USPS.priority, billableWeight, zoneFactor),
      deliveryTime: '1-3 business days',
      recommended: true // Mark as recommended for balanced cost/speed
    });

    rates.push({
      carrier: 'USPS',
      service: 'Priority Mail Express',
      cost: this.calculateCost(baseRates.USPS.express, billableWeight, zoneFactor),
      deliveryTime: '1-2 business days',
      recommended: false
    });

    // FedEx rates
    rates.push({
      carrier: 'FedEx',
      service: 'Ground',
      cost: this.calculateCost(baseRates.FedEx.ground, billableWeight, zoneFactor),
      deliveryTime: '3-5 business days',
      recommended: false
    });

    rates.push({
      carrier: 'FedEx',
      service: '2Day',
      cost: this.calculateCost(baseRates.FedEx.express, billableWeight, zoneFactor),
      deliveryTime: '2 business days',
      recommended: false
    });

    rates.push({
      carrier: 'FedEx',
      service: 'Overnight',
      cost: this.calculateCost(baseRates.FedEx.overnight, billableWeight, zoneFactor),
      deliveryTime: 'Next business day',
      recommended: false
    });

    // UPS rates
    rates.push({
      carrier: 'UPS',
      service: 'Ground',
      cost: this.calculateCost(baseRates.UPS.ground, billableWeight, zoneFactor),
      deliveryTime: '3-5 business days',
      recommended: false
    });

    rates.push({
      carrier: 'UPS',
      service: '2nd Day Air',
      cost: this.calculateCost(baseRates.UPS.express, billableWeight, zoneFactor),
      deliveryTime: '2 business days',
      recommended: false
    });

    rates.push({
      carrier: 'UPS',
      service: 'Next Day Air',
      cost: this.calculateCost(baseRates.UPS.overnight, billableWeight, zoneFactor),
      deliveryTime: 'Next business day',
      recommended: false
    });

    // Sort by cost (ascending)
    rates.sort((a, b) => a.cost - b.cost);

    // Add some randomness to simulate real-world variations
    rates.forEach(rate => {
      const variance = (Math.random() - 0.5) * 2; // ±$2 variance
      rate.cost = Math.max(rate.cost + variance, rate.cost * 0.9);
    });

    return rates;
  }

  calculateCost(rateConfig, weight, zoneFactor) {
    const { base, perLb, multiplier } = rateConfig;
    return (base + (weight * perLb)) * multiplier * zoneFactor;
  }

  calculateZoneFactor(destination) {
    // Simplified zone calculation based on destination
    const lowerDest = destination.toLowerCase();
    
    // Local/Regional (Zone 1-3)
    if (lowerDest.includes('local') || lowerDest.includes('nearby')) {
      return 0.9;
    }
    
    // Cross-country (Zone 6-8)
    if (lowerDest.includes('california') || lowerDest.includes('florida') || 
        lowerDest.includes('new york') || lowerDest.includes('texas')) {
      return 1.3;
    }
    
    // International
    if (lowerDest.includes('canada') || lowerDest.includes('mexico') || 
        lowerDest.includes('international')) {
      return 2.1;
    }
    
    // Default mid-range zone
    return 1.1;
  }

  async getCarriers() {
    await delay(200);
    return [
      { code: 'USPS', name: 'United States Postal Service', logo: '🇺🇸' },
      { code: 'FEDEX', name: 'FedEx', logo: '📦' },
      { code: 'UPS', name: 'United Parcel Service', logo: '🚚' }
    ];
  }

  async getServiceTypes(carrier) {
    await delay(200);
    
    const serviceMap = {
      'USPS': [
        { code: 'GROUND', name: 'Ground Advantage', deliveryDays: '3-5' },
        { code: 'PRIORITY', name: 'Priority Mail', deliveryDays: '1-3' },
        { code: 'EXPRESS', name: 'Priority Mail Express', deliveryDays: '1-2' }
      ],
      'FEDEX': [
        { code: 'GROUND', name: 'Ground', deliveryDays: '3-5' },
        { code: '2DAY', name: '2Day', deliveryDays: '2' },
        { code: 'OVERNIGHT', name: 'Overnight', deliveryDays: '1' }
      ],
      'UPS': [
        { code: 'GROUND', name: 'Ground', deliveryDays: '3-5' },
        { code: '2DAY', name: '2nd Day Air', deliveryDays: '2' },
        { code: 'NEXTDAY', name: 'Next Day Air', deliveryDays: '1' }
      ]
    };

    return serviceMap[carrier] || [];
  }
}

export const shippingService = new ShippingService();