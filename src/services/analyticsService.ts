interface QueryLog {
  id: string;
  query: string;
  userRole: string;
  queryType: string;
  timestamp: Date;
  processingTime: number;
  confidence: number;
  vectorResults: number;
}

class AnalyticsService {
  private queryLogs: QueryLog[] = [];
  private readonly MAX_LOGS = 1000;

  public logQuery(
    query: string,
    userRole: string,
    queryType: string,
    processingTime: number,
    confidence: number,
    vectorResults: number
  ): void {
    const log: QueryLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query,
      userRole,
      queryType,
      timestamp: new Date(),
      processingTime,
      confidence,
      vectorResults
    };

    this.queryLogs.unshift(log);
    
    // Keep only recent logs
    if (this.queryLogs.length > this.MAX_LOGS) {
      this.queryLogs = this.queryLogs.slice(0, this.MAX_LOGS);
    }

    console.log('Query logged:', log);
  }

  public getQueryStats(): {
    totalQueries: number;
    avgProcessingTime: number;
    avgConfidence: number;
    queryTypeDistribution: Record<string, number>;
    recentQueries: QueryLog[];
  } {
    if (this.queryLogs.length === 0) {
      return {
        totalQueries: 0,
        avgProcessingTime: 0,
        avgConfidence: 0,
        queryTypeDistribution: {},
        recentQueries: []
      };
    }

    const totalQueries = this.queryLogs.length;
    const avgProcessingTime = this.queryLogs.reduce((sum, log) => sum + log.processingTime, 0) / totalQueries;
    const avgConfidence = this.queryLogs.reduce((sum, log) => sum + log.confidence, 0) / totalQueries;
    
    const queryTypeDistribution = this.queryLogs.reduce((acc, log) => {
      acc[log.queryType] = (acc[log.queryType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalQueries,
      avgProcessingTime,
      avgConfidence,
      queryTypeDistribution,
      recentQueries: this.queryLogs.slice(0, 10)
    };
  }

  public getUserStats(userRole: string): {
    userQueries: number;
    favoriteQueryType: string;
    avgConfidence: number;
  } {
    const userLogs = this.queryLogs.filter(log => log.userRole === userRole);
    
    if (userLogs.length === 0) {
      return {
        userQueries: 0,
        favoriteQueryType: 'none',
        avgConfidence: 0
      };
    }

    const typeCount = userLogs.reduce((acc, log) => {
      acc[log.queryType] = (acc[log.queryType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteQueryType = Object.entries(typeCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

    const avgConfidence = userLogs.reduce((sum, log) => sum + log.confidence, 0) / userLogs.length;

    return {
      userQueries: userLogs.length,
      favoriteQueryType,
      avgConfidence
    };
  }
}

export const analyticsService = new AnalyticsService();
