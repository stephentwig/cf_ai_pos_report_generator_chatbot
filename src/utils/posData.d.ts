import { POSTransaction, POSItem } from '../types/index';
export declare const SAMPLE_PRODUCTS: Record<string, POSItem & {
    unitPrice: number;
}>;
/**
 * Generate sample POS transactions for testing
 * @param startDate ISO date string
 * @param endDate ISO date string
 * @param transactionCount Number of transactions to generate
 * @returns Array of sample transactions
 */
export declare function generateSampleTransactions(startDate: string, endDate: string, transactionCount?: number): POSTransaction[];
/**
 * Format transaction data for LLM analysis
 * @param transactions Array of transactions
 * @returns Formatted string for LLM
 */
export declare function formatTransactionsForAnalysis(transactions: POSTransaction[]): string;
/**
 * Generate category statistics
 */
export declare function generateCategoryStats(transactions: POSTransaction[]): Record<string, any>;
/**
 * Compare two time periods
 */
export declare function comparePeriods(period1: POSTransaction[], period2: POSTransaction[]): Record<string, any>;
//# sourceMappingURL=posData.d.ts.map