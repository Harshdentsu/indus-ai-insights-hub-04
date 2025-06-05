
interface VectorDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding: number[];
}

interface VectorSearchResult {
  document: VectorDocument;
  similarity: number;
}

class MockChromaDBService {
  private documents: VectorDocument[] = [];
  private collections: Map<string, VectorDocument[]> = new Map();

  constructor() {
    this.initializeCollections();
  }

  private initializeCollections() {
    // Initialize with sample documents for better query matching
    const inventoryDocs = [
      {
        id: 'inv_1',
        content: 'SKU inventory stock availability warehouse Chennai zone quantity units',
        metadata: { type: 'inventory', warehouse: 'Chennai', zone: 'Zone 1' },
        embedding: this.generateMockEmbedding('inventory')
      },
      {
        id: 'inv_2', 
        content: 'SKU stock levels low inventory critical shortage products',
        metadata: { type: 'inventory', status: 'low_stock' },
        embedding: this.generateMockEmbedding('low_stock')
      }
    ];

    const claimsDocs = [
      {
        id: 'claim_1',
        content: 'claim status pending approved rejected dealer claim number processing',
        metadata: { type: 'claims', status: 'processing' },
        embedding: this.generateMockEmbedding('claims')
      }
    ];

    const salesDocs = [
      {
        id: 'sales_1',
        content: 'sales revenue performance monthly quarterly analytics trends',
        metadata: { type: 'sales', period: 'monthly' },
        embedding: this.generateMockEmbedding('sales')
      }
    ];

    this.collections.set('inventory', inventoryDocs);
    this.collections.set('claims', claimsDocs);
    this.collections.set('sales', salesDocs);
  }

  private generateMockEmbedding(category: string): number[] {
    // Generate a simple mock embedding based on category
    const embedding = new Array(384).fill(0).map(() => Math.random() - 0.5);
    
    // Add category-specific patterns
    if (category === 'inventory') {
      embedding[0] = 0.8;
      embedding[1] = 0.6;
    } else if (category === 'claims') {
      embedding[0] = 0.2;
      embedding[1] = 0.9;
    } else if (category === 'sales') {
      embedding[0] = 0.9;
      embedding[1] = 0.3;
    }
    
    return embedding;
  }

  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    // Simple cosine similarity calculation
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < Math.min(embedding1.length, embedding2.length); i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  public async searchSimilar(query: string, collection: string = 'all', limit: number = 3): Promise<VectorSearchResult[]> {
    const queryEmbedding = this.generateQueryEmbedding(query);
    const results: VectorSearchResult[] = [];

    const collectionsToSearch = collection === 'all' 
      ? Array.from(this.collections.values()).flat() 
      : this.collections.get(collection) || [];

    for (const doc of collectionsToSearch) {
      const similarity = this.calculateSimilarity(queryEmbedding, doc.embedding);
      results.push({ document: doc, similarity });
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  private generateQueryEmbedding(query: string): number[] {
    const lowerQuery = query.toLowerCase();
    let category = 'general';

    if (lowerQuery.includes('sku') || lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      category = 'inventory';
    } else if (lowerQuery.includes('claim')) {
      category = 'claims';
    } else if (lowerQuery.includes('sales') || lowerQuery.includes('revenue')) {
      category = 'sales';
    }

    return this.generateMockEmbedding(category);
  }

  public async addDocument(content: string, metadata: Record<string, any>, collection: string = 'general'): Promise<string> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const embedding = this.generateQueryEmbedding(content);
    
    const document: VectorDocument = { id, content, metadata, embedding };
    
    if (!this.collections.has(collection)) {
      this.collections.set(collection, []);
    }
    
    this.collections.get(collection)!.push(document);
    return id;
  }

  public getCollectionStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const [name, docs] of this.collections.entries()) {
      stats[name] = docs.length;
    }
    return stats;
  }
}

export const vectorService = new MockChromaDBService();
