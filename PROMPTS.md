# AI Prompts Documentation

This document contains all AI prompts used in the POS Report Generator Chatbot application. These prompts are designed to guide Llama 3.3 in generating accurate, well-structured POS reports and analysis.

## System Prompts

### Main System Prompt

Used as the base system prompt for all chat interactions.

```
You are an AI assistant specialized in Point-of-Sale (POS) business analytics and reporting. 
Your role is to help business owners and managers understand their sales data through intelligent 
analysis and report generation.

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

If you don't have the data needed to answer a question, clearly state what additional 
information would be helpful.
```

## Report Generation Prompts

### Daily Sales Report

```
Generate a comprehensive daily sales report based on today's POS data. Include:

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

Format the output clearly with headers and bullet points. Provide specific figures with units.
```

### Weekly Sales Report

```
Generate a detailed weekly sales analysis. Include:

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

Provide detailed analysis with specific numbers and percentages.
```

### Monthly Sales Report

```
Generate a comprehensive monthly sales report. Include:

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

Provide executive summary at the top, then detailed analysis.
```

## Analysis Prompts

### Trend Analysis

```
Analyze the sales trends in the provided data. Focus on:

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

Provide insights with specific data points and recommendations.
```

### Comparative Analysis

```
Compare the current period with the previous period. Analyze:

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

Highlight the most significant changes and explain their implications.
```

### Anomaly Detection

```
Examine the data for unusual patterns or anomalies:

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

Flag potential issues and suggest actions.
```

## Structured Question Prompts

### "What are my best performing products?"

```
Based on the POS data provided, identify and analyze the best performing products.

Provide:
1. Top 10 products by total revenue
2. Top 10 products by quantity sold
3. Top 10 products by profit margin
4. Performance metrics for each:
   - Total sales
   - Number of transactions
   - Average price per transaction
   - Trend (increasing/decreasing/stable)

Also identify:
- Products with highest customer satisfaction indicators (if available)
- Products that drive traffic (frequently bought with other items)
- Seasonal performance if applicable

End with: Recommendations for inventory, marketing, and pricing.
```

### "How much did I make today?"

```
Provide a quick summary of today's sales including:

1. **Quick Numbers**
   - Total revenue
   - Gross profit (if margin data available)
   - Number of transactions

2. **Top Sales**
   - Highest individual transaction
   - Top 3 selling items
   - Best department/category

3. **Notable Metrics**
   - Average transaction value
   - Peak sales hour
   - Payment method used most

4. **Comparison**
   - vs yesterday
   - vs same day last week
   - vs daily average (this month)

Keep it concise and scannable.
```

### "What should I focus on?"

```
Based on the POS data analysis, provide strategic recommendations:

1. **Immediate Opportunities**
   - Quick wins in the next week
   - Products/categories to promote
   - Pricing adjustments to consider

2. **Short-term Focus (1-3 months)**
   - Inventory optimization
   - Staff allocation recommendations
   - Marketing focus areas

3. **Long-term Strategy (3-12 months)**
   - Category expansion opportunities
   - Customer segment focus
   - Operational improvements

4. **Risk Areas**
   - Declining products/categories
   - Customer churn signals
   - Margin erosion indicators

5. **Growth Opportunities**
   - High-margin items to push
   - Customer upsell/cross-sell opportunities
   - New market segments
   - Product combinations to highlight

Prioritize by impact and feasibility.
```

## Prompt Templates for Custom Questions

### Dynamic Report Generation Template

```
Generate a {REPORT_TYPE} report for {TIME_PERIOD} with the following parameters:

Filters:
- Department: {DEPARTMENT}
- Category: {CATEGORY}
- Date range: {START_DATE} to {END_DATE}

Focus areas:
{CUSTOM_FOCUS_AREAS}

Include:
1. Executive summary
2. Key metrics
3. Detailed analysis
4. Comparisons with previous {TIME_PERIOD}
5. Recommendations

Format: Clear, professional, with specific numbers
```

### Dynamic Analysis Template

```
Analyze {METRIC} for {DIMENSION} over {TIME_PERIOD}.

Specific focus:
{ANALYSIS_FOCUS}

Provide:
1. Trend analysis
2. Performance vs benchmarks
3. Root cause analysis for anomalies
4. Comparative insights
5. Actionable recommendations

Use specific data points and percentages.
```

## Guardrails & Safety Prompts

### Data Validation Prompt

```
Before generating any report, verify:

1. Data completeness: Are all required fields present?
2. Data consistency: Are there obvious data entry errors?
3. Data quality: Are values reasonable?
4. Date range: Is the date range appropriate for the analysis?
5. Sample size: Is there sufficient data for reliable analysis?

If issues are found:
- Flag them clearly
- Note impact on report reliability
- Suggest data correction if applicable
- Provide analysis with caveats if proceeding
```

### Accuracy & Disclaimer Prompt

```
When presenting analysis or projections, include:

1. Data source and date
2. Analysis methodology
3. Assumptions made
4. Confidence level (high/medium/low)
5. Limitations of the analysis

Always include: "This analysis is based on the POS data provided and should be 
combined with business judgment for decision-making."
```

## Example Prompt Combinations

### Customer Segmentation Analysis

```
Based on the POS data, segment customers and provide insights:

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

Provide specific numbers and percentages for each segment.
```

### Inventory Analysis

```
Analyze inventory performance based on sales data:

1. **Fast Movers**
   - Top 20 products by volume
   - Replenishment recommendations
   - Safety stock levels

2. **Slow Movers**
   - Products with lowest volume
   - Consider discontinuation
   - Potential clearance strategies

3. **Dead Stock**
   - Items not sold in {TIME_PERIOD}
   - Potential loss on inventory
   - Clearance recommendations

4. **Seasonal Items**
   - Products with seasonal demand
   - Recommended stocking levels
   - Timing recommendations

Provide clear recommendations for inventory management.
```

---

**Note**: These prompts are continuously refined based on user feedback and results. They are designed to work with Llama 3.3 but can be adapted for other LLMs as needed.

**Last Updated**: January 30, 2026
