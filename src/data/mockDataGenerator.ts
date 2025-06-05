
import { SKUInventory, Claim, SalesTransaction, Dealer } from '@/types/data';

const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Surat'];
const indianZones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone', 'Northeast Zone'];
const warehouses = ['Mumbai Central', 'Delhi NCR', 'Bangalore Tech Park', 'Chennai Port', 'Kolkata Hub', 'Pune Industrial'];
const productCategories = ['Electronics', 'Machinery', 'Tools', 'Components', 'Spare Parts', 'Equipment'];
const claimReasons = ['Defective Product', 'Shipping Damage', 'Wrong Item', 'Quality Issue', 'Late Delivery', 'Pricing Error'];

const generateSKU = (index: number): string => {
  return `SKU${String(index).padStart(5, '0')}`;
};

const generateClaimNumber = (index: number): string => {
  return `CLM${String(index).padStart(6, '0')}`;
};

const generateTransactionId = (index: number): string => {
  return `TXN${String(index).padStart(8, '0')}`;
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateDealers = (): Dealer[] => {
  const dealers: Dealer[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const city = getRandomElement(indianCities);
    const zone = getRandomElement(indianZones);
    
    dealers.push({
      id: `DEALER${String(i).padStart(3, '0')}`,
      name: `${city} Dealer ${String.fromCharCode(65 + (i % 26))}`,
      region: zone,
      zone: zone,
      city: city,
      contactPerson: `Contact Person ${i}`,
      phone: `+91 ${9000000000 + i}`,
      email: `dealer${i}@example.com`,
      registrationDate: getRandomDate(new Date(2020, 0, 1), new Date(2023, 11, 31))
    });
  }
  
  return dealers;
};

const generateInventory = (): SKUInventory[] => {
  const inventory: SKUInventory[] = [];
  
  for (let i = 1; i <= 300; i++) {
    const category = getRandomElement(productCategories);
    
    inventory.push({
      id: `INV${String(i).padStart(5, '0')}`,
      sku: generateSKU(i),
      productName: `${category} Product ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      warehouse: getRandomElement(warehouses),
      zone: getRandomElement(indianZones),
      quantity: Math.floor(Math.random() * 200) + 5,
      unitPrice: Math.floor(Math.random() * 50000) + 1000,
      lastUpdated: getRandomDate(new Date(2024, 4, 1), new Date()),
      category: category
    });
  }
  
  return inventory;
};

const generateClaims = (dealers: Dealer[]): Claim[] => {
  const claims: Claim[] = [];
  const statuses: Claim['status'][] = ['Pending', 'Approved', 'Rejected', 'Processing'];
  
  for (let i = 1; i <= 100; i++) {
    const dealer = getRandomElement(dealers);
    const submittedDate = getRandomDate(new Date(2024, 0, 1), new Date());
    const status = getRandomElement(statuses);
    const resolvedDate = ['Approved', 'Rejected'].includes(status) ? 
      getRandomDate(submittedDate, new Date()) : undefined;
    
    claims.push({
      id: `CLAIM${String(i).padStart(5, '0')}`,
      claimNumber: generateClaimNumber(i),
      dealerId: dealer.id,
      dealerName: dealer.name,
      amount: Math.floor(Math.random() * 100000) + 5000,
      status: status,
      submittedDate: submittedDate,
      resolvedDate: resolvedDate,
      reason: getRandomElement(claimReasons),
      description: `Detailed description for claim ${generateClaimNumber(i)} regarding ${getRandomElement(claimReasons).toLowerCase()}.`
    });
  }
  
  return claims;
};

const generateSales = (dealers: Dealer[], inventory: SKUInventory[]): SalesTransaction[] => {
  const sales: SalesTransaction[] = [];
  
  for (let i = 1; i <= 1000; i++) {
    const dealer = getRandomElement(dealers);
    const product = getRandomElement(inventory);
    const quantity = Math.floor(Math.random() * 20) + 1;
    const unitPrice = product.unitPrice * (0.8 + Math.random() * 0.4); // ±20% variation
    
    sales.push({
      id: `SALE${String(i).padStart(6, '0')}`,
      transactionId: generateTransactionId(i),
      dealerId: dealer.id,
      dealerName: dealer.name,
      sku: product.sku,
      productName: product.productName,
      quantity: quantity,
      unitPrice: Math.floor(unitPrice),
      totalAmount: Math.floor(quantity * unitPrice),
      saleDate: getRandomDate(new Date(2024, 0, 1), new Date()),
      region: dealer.region,
      zone: dealer.zone
    });
  }
  
  return sales;
};

let cachedData: {
  dealers: Dealer[];
  inventory: SKUInventory[];
  claims: Claim[];
  sales: SalesTransaction[];
} | null = null;

export const generateMockData = () => {
  if (!cachedData) {
    console.log('Generating mock manufacturing data...');
    
    const dealers = generateDealers();
    const inventory = generateInventory();
    const claims = generateClaims(dealers);
    const sales = generateSales(dealers, inventory);
    
    cachedData = {
      dealers,
      inventory,
      claims,
      sales
    };
    
    console.log(`Generated:
    - ${dealers.length} dealers
    - ${inventory.length} inventory items
    - ${claims.length} claims
    - ${sales.length} sales transactions`);
  }
  
  return cachedData;
};

// Export individual generators for testing
export { generateDealers, generateInventory, generateClaims, generateSales };
