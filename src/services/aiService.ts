
import { UserRole } from '@/types/auth';
import { QueryResponse } from '@/types/data';
import { generateMockData } from '@/data/mockDataGenerator';
import { vectorService } from './vectorService';

// Enhanced AI service with vector database integration
export const queryAI = async (query: string, userRole: UserRole): Promise<QueryResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const startTime = Date.now();
  
  // Use vector search to find relevant context
  const vectorResults = await vectorService.searchSimilar(query, 'all', 3);
  console.log('Vector search results:', vectorResults);
  
  // Mock data
  const mockData = generateMockData();
  
  // Enhanced query classification with vector context
  const lowerQuery = query.toLowerCase();
  let response = '';
  let data = null;
  let queryType = 'general';
  
  // Determine query type from vector results and keywords
  const topResult = vectorResults[0];
  if (topResult && topResult.similarity > 0.3) {
    queryType = topResult.document.metadata.type || 'general';
  } else {
    // Fallback to keyword matching
    if (lowerQuery.includes('sku') || lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      queryType = 'inventory';
    } else if (lowerQuery.includes('claim')) {
      queryType = 'claims';
    } else if (lowerQuery.includes('sales') || lowerQuery.includes('revenue')) {
      queryType = 'sales';
    }
  }

  if (queryType === 'inventory' || (lowerQuery.includes('sku') || lowerQuery.includes('inventory') || lowerQuery.includes('stock'))) {
    queryType = 'inventory';
    
    if (lowerQuery.includes('available') || lowerQuery.includes('stock')) {
      const skuMatch = query.match(/sku\s*(\d+)/i);
      if (skuMatch) {
        const skuId = skuMatch[1];
        const inventory = mockData.inventory.find(item => item.sku.includes(skuId));
        
        if (inventory) {
          response = `**SKU ${inventory.sku} - ${inventory.productName}**

🔍 **Vector Search Context:** Found relevant inventory data with ${(topResult?.similarity * 100 || 85).toFixed(1)}% confidence

📍 **Warehouse:** ${inventory.warehouse}
🌍 **Zone:** ${inventory.zone}
📦 **Available Quantity:** ${inventory.quantity} units
💰 **Unit Price:** ₹${inventory.unitPrice.toLocaleString()}
📅 **Last Updated:** ${inventory.lastUpdated.toDateString()}

${inventory.quantity > 50 ? '✅ **Status:** Well stocked' : inventory.quantity > 20 ? '⚠️ **Status:** Low stock' : '🔴 **Status:** Critical stock level'}

**AI Insights:**
• Demand forecast: ${inventory.quantity > 30 ? 'Stable' : 'High demand expected'}
• Reorder recommendation: ${inventory.quantity < 30 ? 'Consider reordering within 7 days' : 'Stock levels adequate'}`;
          data = inventory;
        } else {
          response = `❌ SKU ${skuId} not found in our inventory system. Please verify the SKU number.

**Suggestions:**
• Check for similar SKUs in the same category
• Contact inventory management for discontinued items
• Use wildcard search: "Show products like ${skuId}"`;
        }
      } else {
        const lowStockItems = mockData.inventory.filter(item => item.quantity < 30);
        const totalValue = mockData.inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        
        response = `📊 **Enhanced Inventory Overview** (Vector-Enhanced Analysis)

**Critical Insights:**
• Total inventory value: ₹${totalValue.toLocaleString()}
• Stock efficiency: ${((mockData.inventory.length - lowStockItems.length) / mockData.inventory.length * 100).toFixed(1)}%

**Low Stock Items (< 30 units):**
${lowStockItems.slice(0, 5).map(item => 
  `• ${item.productName} (${item.sku}): ${item.quantity} units in ${item.warehouse} - **Urgency: ${item.quantity < 10 ? 'HIGH' : 'MEDIUM'}**`
).join('\n')}

**Warehouses Performance:**
${Array.from(new Set(mockData.inventory.map(i => i.warehouse))).map(warehouse => {
  const warehouseItems = mockData.inventory.filter(i => i.warehouse === warehouse);
  const avgStock = warehouseItems.reduce((sum, item) => sum + item.quantity, 0) / warehouseItems.length;
  return `• ${warehouse}: ${warehouseItems.length} SKUs, Avg stock: ${avgStock.toFixed(0)} units`;
}).join('\n')}`;
        data = { lowStockItems, totalValue, warehouses: Array.from(new Set(mockData.inventory.map(i => i.warehouse))) };
      }
    }
  } else if (queryType === 'claims' || lowerQuery.includes('claim')) {
    queryType = 'claims';
    
    const claimMatch = query.match(/claim\s*(\d+)/i);
    if (claimMatch) {
      const claimNumber = claimMatch[1];
      const claim = mockData.claims.find(c => c.claimNumber.includes(claimNumber));
      
      if (claim) {
        const avgProcessingTime = mockData.claims
          .filter(c => c.resolvedDate)
          .reduce((sum, c) => sum + (c.resolvedDate!.getTime() - c.submittedDate.getTime()), 0) / 
          mockData.claims.filter(c => c.resolvedDate).length / (1000 * 60 * 60 * 24);

        response = `**Claim ${claim.claimNumber}** (AI-Enhanced Details)

🔍 **Vector Analysis:** ${(topResult?.similarity * 100 || 88).toFixed(1)}% relevance match

👤 **Dealer:** ${claim.dealerName}
💰 **Amount:** ₹${claim.amount.toLocaleString()}
📅 **Submitted:** ${claim.submittedDate.toDateString()}
${claim.resolvedDate ? `✅ **Resolved:** ${claim.resolvedDate.toDateString()}` : ''}

🔄 **Status:** ${claim.status}
📝 **Reason:** ${claim.reason}
📋 **Description:** ${claim.description}

**AI Predictions:**
• Expected resolution: ${claim.status === 'Pending' ? `${Math.ceil(avgProcessingTime)} days (based on historical data)` : 'Resolved'}
• Success probability: ${claim.amount < 50000 ? '85%' : claim.amount < 100000 ? '70%' : '55%'}
• Similar claims: ${mockData.claims.filter(c => c.reason === claim.reason && c.id !== claim.id).length} found

${claim.status === 'Pending' ? '⏳ Your claim is being processed. AI estimates 2-3 business days for completion.' : 
  claim.status === 'Approved' ? '✅ Congratulations! Payment processing initiated.' :
  claim.status === 'Rejected' ? '❌ Rejection reason analysis available. Contact support for appeal process.' :
  '🔄 Advanced processing in progress. Priority queue position: #' + Math.floor(Math.random() * 10 + 1)}`;
        data = { ...claim, avgProcessingTime, similarClaims: mockData.claims.filter(c => c.reason === claim.reason && c.id !== claim.id).length };
      } else {
        response = `❌ Claim ${claimNumber} not found. 

**AI Search Suggestions:**
• Try searching with partial claim number
• Check for typos in claim number
• Use format: "claim status 908XX" for partial matches
• Contact support with dealer ID for manual lookup`;
      }
    } else {
      const userClaims = userRole === 'dealer' ? 
        mockData.claims.filter(c => c.dealerId === 'DEALER001').slice(0, 5) :
        mockData.claims.slice(0, 10);
      
      const statusCounts = mockData.claims.reduce((acc, claim) => {
        acc[claim.status] = (acc[claim.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalClaimValue = mockData.claims.reduce((sum, claim) => sum + claim.amount, 0);
      const avgClaimValue = totalClaimValue / mockData.claims.length;

      response = `📊 **Advanced Claims Analytics** (AI-Powered Insights)

**Financial Overview:**
• Total claim value: ₹${totalClaimValue.toLocaleString()}
• Average claim: ₹${avgClaimValue.toLocaleString()}
• Approval rate: ${((statusCounts.Approved || 0) / mockData.claims.length * 100).toFixed(1)}%

**Status Distribution:**
${Object.entries(statusCounts).map(([status, count]) => 
  `• ${status}: ${count} claims (₹${mockData.claims.filter(c => c.status === status).reduce((sum, c) => sum + c.amount, 0).toLocaleString()})`
).join('\n')}

**Recent Activity:**
${userClaims.map(claim => 
  `• ${claim.claimNumber} - ₹${claim.amount.toLocaleString()} (${claim.status}) - ${claim.reason}`
).join('\n')}

**AI Recommendations:**
• Peak submission time: Avoid Monday mornings for faster processing
• Optimal claim amount: Under ₹50,000 for 85% approval rate
• Required documents: Ensure all supporting docs are attached`;
      data = { userClaims, statusCounts, totalClaimValue, avgClaimValue };
    }
  } else if (queryType === 'sales' || (lowerQuery.includes('sales') || lowerQuery.includes('revenue'))) {
    queryType = 'sales';
    
    const monthlySales = mockData.sales.reduce((acc, sale) => {
      const month = sale.saleDate.toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + sale.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const topProducts = mockData.sales.reduce((acc, sale) => {
      const key = `${sale.productName} (${sale.sku})`;
      if (!acc[key]) acc[key] = { quantity: 0, revenue: 0 };
      acc[key].quantity += sale.quantity;
      acc[key].revenue += sale.totalAmount;
      return acc;
    }, {} as Record<string, { quantity: number; revenue: number }>);

    const sortedProducts = Object.entries(topProducts)
      .sort(([,a], [,b]) => b.revenue - a.revenue)
      .slice(0, 5);

    const totalRevenue = Object.values(monthlySales).reduce((sum, amount) => sum + amount, 0);
    const growthRate = Math.random() * 20 + 5; // Mock growth rate

    response = `📈 **Advanced Sales Analytics** (AI-Enhanced)

🔍 **Vector Intelligence:** ${(topResult?.similarity * 100 || 92).toFixed(1)}% query understanding

**Performance Summary:**
• Total revenue: ₹${totalRevenue.toLocaleString()}
• Growth rate: +${growthRate.toFixed(1)}% (AI projected)
• Market efficiency: ${(Math.random() * 20 + 70).toFixed(1)}%

**Monthly Performance:**
${Object.entries(monthlySales).slice(-3).map(([month, revenue]) => {
  const growth = Math.random() * 30 - 10;
  return `• ${month}: ₹${revenue.toLocaleString()} (${growth > 0 ? '+' : ''}${growth.toFixed(1)}% vs prev)`;
}).join('\n')}

**Top Revenue Generators:**
${sortedProducts.map(([product, data]) => 
  `• ${product}: ${data.quantity} units → ₹${data.revenue.toLocaleString()} (Margin: ${(Math.random() * 30 + 10).toFixed(1)}%)`
).join('\n')}

**AI Market Insights:**
• Best performing region: ${mockData.sales[0]?.region || 'North'} (${(Math.random() * 15 + 25).toFixed(1)}% of total sales)
• Seasonal trend: Q4 shows 23% higher sales
• Inventory turnover: ${(Math.random() * 5 + 8).toFixed(1)}x annually

**Recommendations:**
• Focus on ${sortedProducts[0]?.[0] || 'top product'} - highest ROI
• Expand in ${mockData.sales[Math.floor(Math.random() * mockData.sales.length)]?.region || 'South'} region
• Optimize pricing for products with <15% margin`;
    data = { monthlySales, topProducts: sortedProducts, totalRevenue, growthRate };
  } else {
    // Enhanced general response with vector context
    const contextHint = topResult ? ` I found relevant information about ${topResult.document.metadata.type} in my knowledge base.` : '';
    
    response = `👋 **Hello! I'm your AI Manufacturing Assistant**${contextHint}

🤖 **Enhanced with Vector Database & ChromaDB Integration**

**I can help you with:**

🔍 **Smart Inventory Queries:**
• "Is SKU 12345 available?" → Real-time stock with AI predictions
• "Show critical stock levels" → Automated reorder recommendations
• "Inventory trends in Chennai" → Location-based analytics

📊 **Advanced Sales Intelligence:**
• "Monthly sales performance" → Growth analytics & forecasting
• "Top selling products Q2" → Revenue optimization insights
• "Regional performance comparison" → Market expansion strategies

📝 **Intelligent Claims Management:**
• "Status of claim 90876" → Processing timeline predictions
• "My pending claims summary" → Priority & resolution estimates
• "Claims approval patterns" → Success probability analysis

**🚀 New AI Features:**
• Vector-based semantic search for complex queries
• Predictive analytics for inventory management
• Automated insights and recommendations
• Multi-language query understanding (Hindi/English)

**💡 Try advanced queries like:**
• "Which products need immediate restocking in Mumbai?"
• "Predict sales trend for electronics category"
• "Find claims similar to mine for benchmarking"

**Database Status:** ✅ Connected | **AI Confidence:** ${(Math.random() * 15 + 85).toFixed(1)}%`;
  }

  const processingTime = Date.now() - startTime;

  // Store query for learning (in real implementation)
  console.log(`Query processed: "${query}" -> Type: ${queryType}, Time: ${processingTime}ms`);

  return {
    response,
    data,
    metadata: {
      queryType,
      processingTime,
      confidence: 0.85 + Math.random() * 0.1,
      vectorResults: vectorResults.length,
      topSimilarity: topResult?.similarity || 0
    }
  };
};
