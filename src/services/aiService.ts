
import { UserRole, QueryResponse } from '@/types/data';
import { generateMockData } from '@/data/mockDataGenerator';

// Mock AI service - In production, this would connect to OpenAI API and ChromaDB
export const queryAI = async (query: string, userRole: UserRole): Promise<QueryResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const startTime = Date.now();
  
  // Mock data
  const mockData = generateMockData();
  
  // Simple query classification based on keywords
  const lowerQuery = query.toLowerCase();
  let response = '';
  let data = null;
  let queryType = 'general';

  if (lowerQuery.includes('sku') || lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
    queryType = 'inventory';
    
    if (lowerQuery.includes('available') || lowerQuery.includes('stock')) {
      const skuMatch = query.match(/sku\s*(\d+)/i);
      if (skuMatch) {
        const skuId = skuMatch[1];
        const inventory = mockData.inventory.find(item => item.sku.includes(skuId));
        
        if (inventory) {
          response = `**SKU ${inventory.sku} - ${inventory.productName}**

📍 **Warehouse:** ${inventory.warehouse}
🌍 **Zone:** ${inventory.zone}
📦 **Available Quantity:** ${inventory.quantity} units
💰 **Unit Price:** ₹${inventory.unitPrice.toLocaleString()}
📅 **Last Updated:** ${inventory.lastUpdated.toDateString()}

${inventory.quantity > 50 ? '✅ **Status:** Well stocked' : inventory.quantity > 20 ? '⚠️ **Status:** Low stock' : '🔴 **Status:** Critical stock level'}`;
          data = inventory;
        } else {
          response = `❌ SKU ${skuId} not found in our inventory system. Please verify the SKU number.`;
        }
      } else {
        const lowStockItems = mockData.inventory.filter(item => item.quantity < 30);
        response = `📊 **Inventory Overview**

**Low Stock Items (< 30 units):**
${lowStockItems.slice(0, 5).map(item => 
  `• ${item.productName} (${item.sku}): ${item.quantity} units in ${item.warehouse}`
).join('\n')}

**Total SKUs:** ${mockData.inventory.length}
**Warehouses:** ${Array.from(new Set(mockData.inventory.map(i => i.warehouse))).length}`;
        data = lowStockItems;
      }
    }
  } else if (lowerQuery.includes('claim') || lowerQuery.includes('claims')) {
    queryType = 'claims';
    
    const claimMatch = query.match(/claim\s*(\d+)/i);
    if (claimMatch) {
      const claimNumber = claimMatch[1];
      const claim = mockData.claims.find(c => c.claimNumber.includes(claimNumber));
      
      if (claim) {
        response = `**Claim ${claim.claimNumber}**

👤 **Dealer:** ${claim.dealerName}
💰 **Amount:** ₹${claim.amount.toLocaleString()}
📅 **Submitted:** ${claim.submittedDate.toDateString()}
${claim.resolvedDate ? `✅ **Resolved:** ${claim.resolvedDate.toDateString()}` : ''}

🔄 **Status:** ${claim.status}
📝 **Reason:** ${claim.reason}
📋 **Description:** ${claim.description}

${claim.status === 'Pending' ? '⏳ Your claim is being processed and will be updated within 2-3 business days.' : 
  claim.status === 'Approved' ? '✅ Congratulations! Your claim has been approved.' :
  claim.status === 'Rejected' ? '❌ Unfortunately, this claim was rejected. Contact support for details.' :
  '🔄 This claim is currently being processed.'}`;
        data = claim;
      } else {
        response = `❌ Claim ${claimNumber} not found. Please verify the claim number.`;
      }
    } else {
      const userClaims = userRole === 'dealer' ? 
        mockData.claims.filter(c => c.dealerId === 'DEALER001').slice(0, 5) :
        mockData.claims.slice(0, 10);
      
      const statusCounts = mockData.claims.reduce((acc, claim) => {
        acc[claim.status] = (acc[claim.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      response = `📊 **Claims Overview**

**Status Summary:**
${Object.entries(statusCounts).map(([status, count]) => 
  `• ${status}: ${count} claims`
).join('\n')}

**Recent Claims:**
${userClaims.map(claim => 
  `• ${claim.claimNumber} - ₹${claim.amount.toLocaleString()} (${claim.status})`
).join('\n')}`;
      data = userClaims;
    }
  } else if (lowerQuery.includes('sales') || lowerQuery.includes('revenue')) {
    queryType = 'sales';
    
    const monthlySales = mockData.sales.reduce((acc, sale) => {
      const month = sale.saleDate.toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + sale.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const topProducts = mockData.sales.reduce((acc, sale) => {
      acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
      return acc;
    }, {} as Record<string, number>);

    const sortedProducts = Object.entries(topProducts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    response = `📈 **Sales Analytics**

**Monthly Revenue:**
${Object.entries(monthlySales).slice(-3).map(([month, revenue]) => 
  `• ${month}: ₹${revenue.toLocaleString()}`
).join('\n')}

**Top Selling Products:**
${sortedProducts.map(([product, quantity]) => 
  `• ${product}: ${quantity} units sold`
).join('\n')}

**Total Transactions:** ${mockData.sales.length}
**Active Dealers:** ${Array.from(new Set(mockData.sales.map(s => s.dealerId))).length}`;
    data = { monthlySales, topProducts: sortedProducts };
  } else {
    response = `👋 Hello! I can help you with:

🔍 **Inventory Queries:**
• "Is SKU 12345 available?"
• "Show stock levels in Chennai"
• "Low stock alerts"

📊 **Sales Information:**
• "Monthly sales report"
• "Top selling products"
• "Regional performance"

📝 **Claims Management:**
• "Status of claim 90876"
• "My pending claims"
• "Claims summary"

💡 **Try asking specific questions about your inventory, sales data, or claim status!**`;
  }

  const processingTime = Date.now() - startTime;

  return {
    response,
    data,
    metadata: {
      queryType,
      processingTime,
      confidence: 0.85 + Math.random() * 0.1
    }
  };
};
