// Report generation workflow orchestration

import { WorkflowContext, GeneratedReport, ReportFilters } from '../types/index';
import { generateReport } from '../llm/chat';
import {
  generateSampleTransactions,
  formatTransactionsForAnalysis,
  generateCategoryStats,
} from '../utils/posData';

/**
 * Execute report generation workflow
 */
export async function executeReportWorkflow(
  env: any,
  context: WorkflowContext,
): Promise<GeneratedReport> {
  try {
    console.log(`Starting report workflow: ${context.reportType}`);

    // Step 1: Fetch or generate POS data
    console.log('Step 1: Fetching POS data...');
    const posData = await fetchPOSData(env, context.filters);
    context.data = posData;

    // Step 2: Format data for analysis
    console.log('Step 2: Formatting data for analysis...');
    const formattedData = formatTransactionsForAnalysis(posData.transactions);

    // Step 3: Generate report using LLM
    console.log('Step 3: Generating report with LLM...');
    const llmResponse = await generateReport(
      env,
      context.reportType,
      formattedData,
      context.filters,
    );

    if (!llmResponse.content) {
      throw new Error('Empty response from LLM');
    }

    // Step 4: Process and structure report
    console.log('Step 4: Processing report...');
    const report = await processReportResponse(
      context,
      llmResponse.content,
      posData.stats,
    );

    // Step 5: Cache report
    console.log('Step 5: Caching report...');
    await cacheReport(env, report);

    context.status = 'completed';
    return report;
  } catch (error) {
    context.status = 'failed';
    context.error = error instanceof Error ? error.message : 'Unknown error';
    console.error('Report workflow failed:', error);
    throw error;
  }
}

/**
 * Fetch POS data from database or generate sample data
 */
async function fetchPOSData(
  _env: any,
  filters: ReportFilters,
): Promise<{
  transactions: any[];
  stats: Record<string, any>;
}> {
  // For demo purposes, generate sample data
  // In production, fetch from actual database
  const startDate = new Date(filters.startDate);
  const endDate = new Date(filters.endDate);
  const dayDifference = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Generate more transactions for longer periods
  const transactionCount = Math.max(10, dayDifference * 15);

  const transactions = generateSampleTransactions(
    filters.startDate,
    filters.endDate,
    transactionCount,
  );

  // Apply filters
  let filtered = transactions;

  if (filters.department || filters.category) {
    filtered = filtered.filter((txn) =>
      txn.items.some((item) => {
        if (filters.category && item.category !== filters.category) return false;
        return true;
      }),
    );
  }

  if (filters.minAmount || filters.maxAmount) {
    filtered = filtered.filter((txn) => {
      if (filters.minAmount && txn.amount < filters.minAmount) return false;
      if (filters.maxAmount && txn.amount > filters.maxAmount) return false;
      return true;
    });
  }

  const stats = generateCategoryStats(filtered);

  return {
    transactions: filtered,
    stats,
  };
}

/**
 * Process LLM response and structure as report
 */
async function processReportResponse(
  context: WorkflowContext,
  response: string,
  _stats: Record<string, any>,
): Promise<GeneratedReport> {
  // Parse response into sections
  const sections = parseReportSections(response);

  const report: GeneratedReport = {
    id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: context.reportType,
    generatedAt: new Date().toISOString(),
    data: {
      summary: sections.summary || response.substring(0, 500),
      metrics: extractMetrics(response),
      analysis: sections.analysis || response,
      recommendations: extractRecommendations(response),
    },
    filters: context.filters,
  };

  return report;
}

/**
 * Extract metrics from report text
 */
function extractMetrics(text: string): Record<string, any> {
  const metrics: Record<string, any> = {};

  // Extract revenue
  const revenueMatch = text.match(/\$[\d,]+\.?\d*/g);
  if (revenueMatch) {
    metrics.revenue = revenueMatch[0];
  }

  // Extract transaction count
  const txnMatch = text.match(/(\d+)\s*(?:transactions|transaction)/i);
  if (txnMatch) {
    metrics.transactions = txnMatch[1];
  }

  // Extract average transaction
  const avgMatch = text.match(/average.*?\$[\d,]+\.?\d*/i);
  if (avgMatch) {
    metrics.averageTransaction = avgMatch[0];
  }

  return metrics;
}

/**
 * Extract recommendations from report
 */
function extractRecommendations(text: string): string[] {
  const recommendations: string[] = [];

  // Look for recommendation-like sentences
  const sentences = text.split(/[.!?]+/);
  const recommendationKeywords = [
    'recommend',
    'suggest',
    'should',
    'consider',
    'focus on',
    'improve',
    'opportunity',
  ];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase().trim();
    if (
      lower.length > 10 &&
      recommendationKeywords.some((keyword) => lower.includes(keyword))
    ) {
      recommendations.push(sentence.trim());
      if (recommendations.length >= 5) break; // Limit to 5 recommendations
    }
  }

  return recommendations;
}

/**
 * Parse report sections from text
 */
function parseReportSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = text.split('\n');

  let currentSection = 'summary';
  let currentContent = '';

  for (const line of lines) {
    // Check if line is a header
    if (/^#+\s+|^\*\*.*\*\*/.test(line)) {
      if (currentContent.trim()) {
        sections[currentSection] = currentContent.trim();
      }
      currentSection = line.replace(/#+|\*\*/g, '').trim().toLowerCase().replace(/\s+/g, '_');
      currentContent = '';
    } else {
      currentContent += line + '\n';
    }
  }

  if (currentContent.trim()) {
    sections[currentSection] = currentContent.trim();
  }

  return sections;
}

/**
 * Cache report for future retrieval
 */
async function cacheReport(env: any, report: GeneratedReport): Promise<void> {
  try {
    const kv = env.REPORTS_CACHE;
    if (kv) {
      const cacheKey = `report:${report.id}`;
      await kv.put(cacheKey, JSON.stringify(report), {
        expirationTtl: 86400 * 7, // 7 days
      });
      console.log(`Report cached: ${cacheKey}`);
    }
  } catch (error) {
    console.warn('Failed to cache report:', error);
  }
}

/**
 * Retrieve cached report
 */
export async function getCachedReport(
  env: any,
  reportId: string,
): Promise<GeneratedReport | null> {
  try {
    const kv = env.REPORTS_CACHE;
    if (!kv) return null;

    const cached = await kv.get(`report:${reportId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to retrieve cached report:', error);
  }
  return null;
}
