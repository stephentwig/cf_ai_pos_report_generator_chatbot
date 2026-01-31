// System prompts and prompt templates for the POS Report Generator
export const SYSTEM_PROMPT = `You are an AI assistant specialized in Point-of-Sale (POS) business analytics and reporting. 
Your role is to help business owners and managers understand their sales data through intelligent analysis and report generation.

Key Responsibilities:
1. Analyze POS transaction data to identify trends, patterns, and insights
2. Generate clear, actionable business reports
3. Answer questions about sales performance, inventory, and customer behavior
4. Provide data-driven recommendations for business improvement
5. Explain financial metrics and business metrics in accessible language

Guidelines:
- Always base your analysis on the provided POS data
- Use professional business language but remain accessible
- Provide specific numbers and percentages when available
- Organize information clearly with summaries and key takeaways
- Flag any data inconsistencies or anomalies
- Suggest follow-up questions for deeper analysis

If you don't have the data needed to answer a question, clearly state what additional information would be helpful.`;
export const DAILY_REPORT_PROMPT = `Generate a comprehensive daily sales report based on today's POS data. Include:

1. **Sales Summary**
   - Total revenue
   - Number of transactions
   - Average transaction value
   - Peak sales times

2. **Top Performers**
   - Top 5 products by revenue
   - Top 5 products by quantity sold
   - Top payment methods

3. **Department Performance**
   - Revenue by department
   - Transaction count by department
   - Department comparison

4. **Customer Insights**
   - Transaction count
   - Customer segments (new vs returning)
   - Average spend by segment

5. **Key Metrics**
   - Gross margin (if applicable)
   - Discount percentage
   - Tax collected

6. **Alerts & Observations**
   - Any unusual patterns
   - Notable changes from average
   - Recommendations for follow-up

Format the output clearly with headers and bullet points. Provide specific figures with units.`;
export const WEEKLY_REPORT_PROMPT = `Generate a detailed weekly sales analysis. Include:

1. **Week Overview**
   - Total revenue
   - Week-over-week change (%)
   - Total transactions
   - Daily average

2. **Daily Breakdown**
   - Sales by day of week
   - Best and worst performing days
   - Trends throughout the week

3. **Product Analysis**
   - Top 10 products by revenue
   - Top 10 products by volume
   - Slowest moving items

4. **Category Performance**
   - Revenue by category
   - Category trends
   - High-margin vs high-volume categories

5. **Customer Behavior**
   - Total unique customers
   - Repeat customer rate
   - Customer spending patterns
   - Time-of-day preferences

6. **Payment & Transactions**
   - Payment method breakdown
   - Average transaction value trend
   - Transaction frequency by time

7. **Strategic Insights**
   - Week's performance assessment
   - Key opportunities
   - Recommendations for next week

Provide detailed analysis with specific numbers and percentages.`;
export const MONTHLY_REPORT_PROMPT = `Generate a comprehensive monthly sales report. Include:

1. **Monthly Performance**
   - Total revenue (with variance from previous month %)
   - Total transactions
   - Average transaction value
   - Daily average revenue

2. **Revenue Breakdown**
   - By week
   - By department
   - By category

3. **Top Products**
   - Top 20 products by revenue
   - Top 20 products by quantity
   - Products with highest margin
   - New products performance

4. **Category Analysis**
   - Category rankings
   - Growth categories
   - Declining categories
   - Category margins

5. **Customer Analysis**
   - Total customers
   - New customers vs returning
   - Customer segments
   - High-value customers
   - Customer lifetime value trends

6. **Operational Metrics**
   - Discounts given (% of revenue)
   - Tax collected
   - Payment method mix
   - Return/refund rate

7. **Trends & Patterns**
   - Seasonal observations
   - Day-of-week patterns
   - Time-of-day patterns
   - Product trend analysis

8. **Year-over-Year Comparison**
   - Same month comparison
   - Growth rate
   - Category changes
   - Customer changes

9. **Recommendations**
   - Strategic opportunities
   - Areas for improvement
   - Inventory adjustments needed
   - Staffing considerations
   - Marketing suggestions

Provide executive summary at the top, then detailed analysis.`;
export const TREND_ANALYSIS_PROMPT = `Analyze the sales trends in the provided data. Focus on:

1. **Time-Based Trends**
   - Daily patterns
   - Weekly patterns
   - Monthly patterns
   - Seasonal indicators

2. **Product Trends**
   - Growing products
   - Declining products
   - Emerging trends
   - Obsolete products

3. **Customer Trends**
   - Customer acquisition trends
   - Retention trends
   - Spending trends
   - Segment shifts

4. **Financial Trends**
   - Revenue per transaction
   - Margin trends
   - Discount trends
   - Payment method shifts

Provide insights with specific data points and recommendations.`;
export const ANOMALY_DETECTION_PROMPT = `Examine the data for unusual patterns or anomalies:

1. **Price Anomalies**
   - Unusually high/low transactions
   - Outlier products
   - Suspicious transaction patterns

2. **Volume Anomalies**
   - Unusual spikes or drops
   - Day/time anomalies
   - Product volume anomalies

3. **Customer Anomalies**
   - Unusual customer behavior
   - Large transactions
   - Refund anomalies

4. **Pattern Breaks**
   - Deviations from historical patterns
   - Unexpected category changes
   - Payment method anomalies

Flag potential issues and suggest actions.`;
export const COMPARATIVE_ANALYSIS_PROMPT = `Compare the current period with the previous period. Analyze:

1. **Revenue Comparison**
   - Total revenue change (%)
   - Average transaction value change
   - Transaction count change
   - Revenue breakdown changes

2. **Product Comparison**
   - Top products changes
   - Product performance shifts
   - New vs discontinued products
   - Volume vs revenue changes

3. **Customer Comparison**
   - Customer count changes
   - Spending pattern changes
   - Segment shifts
   - Customer acquisition changes

4. **Operational Changes**
   - Payment method shifts
   - Discount percentage changes
   - Category mix changes
   - Time-of-day pattern changes

Highlight the most significant changes and explain their implications.`;
export const CUSTOMER_SEGMENTATION_PROMPT = `Based on the POS data, segment customers and provide insights:

1. **Segment Identification**
   - By spending level (high/medium/low value)
   - By purchase frequency (frequent/occasional/rare)
   - By product preference

2. **Segment Characteristics**
   - Average spend per segment
   - Purchase frequency
   - Preferred products
   - Preferred payment methods
   - Time-of-day preferences

3. **Segment Performance**
   - Revenue contribution
   - Margin contribution
   - Growth rate

4. **Segment Recommendations**
   - Marketing strategy per segment
   - Pricing strategy per segment
   - Inventory strategy per segment
   - Customer retention focus

Provide specific numbers and percentages for each segment.`;
export const INVENTORY_ANALYSIS_PROMPT = `Analyze inventory performance based on sales data:

1. **Fast Movers**
   - Top 20 products by volume
   - Replenishment recommendations
   - Safety stock levels

2. **Slow Movers**
   - Products with lowest volume
   - Consider discontinuation
   - Potential clearance strategies

3. **Dead Stock**
   - Items not sold in the period
   - Potential loss on inventory
   - Clearance recommendations

4. **Seasonal Items**
   - Products with seasonal demand
   - Recommended stocking levels
   - Timing recommendations

Provide clear recommendations for inventory management.`;
export const QUICK_SUMMARY_PROMPT = `Provide a quick summary of the sales period including:

1. **Quick Numbers**
   - Total revenue
   - Gross profit (if margin data available)
   - Number of transactions
   - Average transaction value

2. **Top Sales**
   - Highest individual transaction
   - Top 3 selling items
   - Best department/category

3. **Notable Metrics**
   - Peak sales time
   - Payment method used most
   - Customer count

4. **Key Insight**
   - Most important finding
   - One key recommendation

Keep it concise and scannable.`;
export const DATA_VALIDATION_PROMPT = `Before generating any report, verify:

1. Data completeness: Are all required fields present?
2. Data consistency: Are there obvious data entry errors?
3. Data quality: Are values reasonable?
4. Date range: Is the date range appropriate for the analysis?
5. Sample size: Is there sufficient data for reliable analysis?

If issues are found:
- Flag them clearly
- Note impact on report reliability
- Suggest data correction if applicable
- Provide analysis with caveats if proceeding`;
// Helper function to get appropriate prompt based on report type
export function getReportPrompt(reportType) {
    switch (reportType) {
        case 'daily':
            return DAILY_REPORT_PROMPT;
        case 'weekly':
            return WEEKLY_REPORT_PROMPT;
        case 'monthly':
            return MONTHLY_REPORT_PROMPT;
        case 'trend-analysis':
            return TREND_ANALYSIS_PROMPT;
        case 'anomaly-detection':
            return ANOMALY_DETECTION_PROMPT;
        case 'comparative':
            return COMPARATIVE_ANALYSIS_PROMPT;
        case 'customer-segmentation':
            return CUSTOMER_SEGMENTATION_PROMPT;
        case 'inventory':
            return INVENTORY_ANALYSIS_PROMPT;
        case 'quick-summary':
            return QUICK_SUMMARY_PROMPT;
        default:
            return SYSTEM_PROMPT;
    }
}
//# sourceMappingURL=prompts.js.map