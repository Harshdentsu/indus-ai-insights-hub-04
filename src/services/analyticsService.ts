
interface QueryLog {
  query: string;
  userRole: string;
  queryType: string;
  processingTime: number;
  vectorResults: number;
  topSimilarity: number;
  timestamp: Date;
}

class AnalyticsService {
  private queryLogs: QueryLog[] = [];

  logQuery(params: Omit<QueryLog, 'timestamp'>) {
    const logEntry: QueryLog = {
      ...params,
      timestamp: new Date()
    };
    
    this.queryLogs.push(logEntry);
    console.log('Query logged:', logEntry);
  }

  getQueryStats() {
    return {
      totalQueries: this.queryLogs.length,
      avgProcessingTime: this.queryLogs.reduce((sum, log) => sum + log.processingTime, 0) / this.queryLogs.length,
      queryTypes: this.queryLogs.reduce((acc, log) => {
        acc[log.queryType] = (acc[log.queryType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  getRecentQueries(limit: number = 10) {
    return this.queryLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const analyticsService = new AnalyticsService();
