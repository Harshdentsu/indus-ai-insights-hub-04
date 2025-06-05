
export interface SKUInventory {
  id: string;
  sku: string;
  productName: string;
  warehouse: string;
  zone: string;
  quantity: number;
  unitPrice: number;
  lastUpdated: Date;
  category: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  dealerId: string;
  dealerName: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing';
  submittedDate: Date;
  resolvedDate?: Date;
  reason: string;
  description: string;
}

export interface SalesTransaction {
  id: string;
  transactionId: string;
  dealerId: string;
  dealerName: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: Date;
  region: string;
  zone: string;
}

export interface Dealer {
  id: string;
  name: string;
  region: string;
  zone: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  registrationDate: Date;
}

export interface QueryResponse {
  response: string;
  data?: any;
  metadata?: {
    queryType: string;
    processingTime: number;
    confidence: number;
  };
}
