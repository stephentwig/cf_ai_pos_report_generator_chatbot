// Sample POS data and utilities for testing and demonstration
// Sample products database
export const SAMPLE_PRODUCTS = {
    'SKU-001': {
        sku: 'SKU-001',
        name: 'Cappuccino',
        category: 'Beverages',
        quantity: 0,
        unitPrice: 4.50,
        totalPrice: 0,
    },
    'SKU-002': {
        sku: 'SKU-002',
        name: 'Espresso Shot',
        category: 'Beverages',
        quantity: 0,
        unitPrice: 2.75,
        totalPrice: 0,
    },
    'SKU-003': {
        sku: 'SKU-003',
        name: 'Croissant',
        category: 'Pastries',
        quantity: 0,
        unitPrice: 3.50,
        totalPrice: 0,
    },
    'SKU-004': {
        sku: 'SKU-004',
        name: 'Blueberry Muffin',
        category: 'Pastries',
        quantity: 0,
        unitPrice: 4.00,
        totalPrice: 0,
    },
    'SKU-005': {
        sku: 'SKU-005',
        name: 'Caesar Salad',
        category: 'Food',
        quantity: 0,
        unitPrice: 9.99,
        totalPrice: 0,
    },
    'SKU-006': {
        sku: 'SKU-006',
        name: 'Turkey Sandwich',
        category: 'Food',
        quantity: 0,
        unitPrice: 10.50,
        totalPrice: 0,
    },
    'SKU-007': {
        sku: 'SKU-007',
        name: 'Iced Tea',
        category: 'Beverages',
        quantity: 0,
        unitPrice: 3.00,
        totalPrice: 0,
    },
    'SKU-008': {
        sku: 'SKU-008',
        name: 'Chocolate Chip Cookie',
        category: 'Pastries',
        quantity: 0,
        unitPrice: 2.50,
        totalPrice: 0,
    },
    'SKU-009': {
        sku: 'SKU-009',
        name: 'Chicken Wrap',
        category: 'Food',
        quantity: 0,
        unitPrice: 8.99,
        totalPrice: 0,
    },
    'SKU-010': {
        sku: 'SKU-010',
        name: 'Matcha Latte',
        category: 'Beverages',
        quantity: 0,
        unitPrice: 5.50,
        totalPrice: 0,
    },
};
/**
 * Generate sample POS transactions for testing
 * @param startDate ISO date string
 * @param endDate ISO date string
 * @param transactionCount Number of transactions to generate
 * @returns Array of sample transactions
 */
export function generateSampleTransactions(startDate, endDate, transactionCount = 50) {
    const transactions = [];
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const skus = Object.keys(SAMPLE_PRODUCTS);
    const paymentMethods = [
        'cash',
        'card',
        'mobile',
        'check',
    ];
    for (let i = 0; i < transactionCount; i++) {
        const randomTime = start + Math.random() * (end - start);
        const timestamp = new Date(randomTime).toISOString();
        // Generate 1-4 items per transaction
        const itemCount = Math.floor(Math.random() * 4) + 1;
        const items = [];
        let subtotal = 0;
        for (let j = 0; j < itemCount; j++) {
            const randomSku = skus[Math.floor(Math.random() * skus.length)];
            const productData = SAMPLE_PRODUCTS[randomSku];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const itemTotal = productData.unitPrice * quantity;
            items.push({
                sku: randomSku,
                name: productData.name,
                category: productData.category,
                quantity,
                unitPrice: productData.unitPrice,
                totalPrice: itemTotal,
            });
            subtotal += itemTotal;
        }
        // Calculate tax and discount
        const taxRate = 0.08; // 8% tax
        const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
        // Random discount (20% chance of discount between 5-15%)
        const hasDiscount = Math.random() < 0.2;
        const discountAmount = hasDiscount
            ? Math.round(subtotal * (Math.random() * 0.1 + 0.05) * 100) / 100
            : 0;
        const totalAmount = subtotal + taxAmount - discountAmount;
        transactions.push({
            id: `TXN-${Date.now()}-${i}`,
            timestamp,
            amount: Math.round(totalAmount * 100) / 100,
            taxAmount,
            discountAmount,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            items,
            customerId: Math.random() < 0.7 ? `CUST-${Math.floor(Math.random() * 1000)}` : undefined,
            notes: Math.random() < 0.1 ? 'Regular customer' : undefined,
        });
    }
    return transactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}
/**
 * Format transaction data for LLM analysis
 * @param transactions Array of transactions
 * @returns Formatted string for LLM
 */
export function formatTransactionsForAnalysis(transactions) {
    let formatted = 'POS Transaction Data for Analysis:\n\n';
    formatted += `Total Transactions: ${transactions.length}\n`;
    formatted += `Date Range: ${transactions[0]?.timestamp} to ${transactions[transactions.length - 1]?.timestamp}\n\n`;
    // Summary statistics
    let totalRevenue = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    const productStats = {};
    const categoryStats = {};
    const paymentStats = {};
    const hourlyStats = {};
    for (const txn of transactions) {
        totalRevenue += txn.amount;
        totalTax += txn.taxAmount;
        totalDiscount += txn.discountAmount;
        for (const item of txn.items) {
            if (!productStats[item.sku]) {
                productStats[item.sku] = { count: 0, revenue: 0, qty: 0 };
            }
            productStats[item.sku].count++;
            productStats[item.sku].revenue += item.totalPrice;
            productStats[item.sku].qty += item.quantity;
            if (!categoryStats[item.category]) {
                categoryStats[item.category] = { count: 0, revenue: 0 };
            }
            categoryStats[item.category].count++;
            categoryStats[item.category].revenue += item.totalPrice;
        }
        paymentStats[txn.paymentMethod] = (paymentStats[txn.paymentMethod] || 0) + txn.amount;
        const hour = new Date(txn.timestamp).getHours();
        hourlyStats[hour] = (hourlyStats[hour] || 0) + txn.amount;
    }
    formatted += `Total Revenue: $${totalRevenue.toFixed(2)}\n`;
    formatted += `Total Tax: $${totalTax.toFixed(2)}\n`;
    formatted += `Total Discounts: $${totalDiscount.toFixed(2)}\n`;
    formatted += `Average Transaction: $${(totalRevenue / transactions.length).toFixed(2)}\n\n`;
    // Top products
    formatted += 'Top 5 Products by Revenue:\n';
    const sortedProducts = Object.entries(productStats)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5);
    for (const [sku, stats] of sortedProducts) {
        const product = SAMPLE_PRODUCTS[sku];
        formatted += `- ${product?.name || sku}: $${stats.revenue.toFixed(2)} (${stats.qty} units, ${stats.count} transactions)\n`;
    }
    formatted += '\nCategory Breakdown:\n';
    for (const [category, stats] of Object.entries(categoryStats)) {
        formatted += `- ${category}: $${stats.revenue.toFixed(2)} (${stats.count} items)\n`;
    }
    formatted += '\nPayment Methods:\n';
    for (const [method, amount] of Object.entries(paymentStats)) {
        formatted += `- ${method}: $${amount.toFixed(2)}\n`;
    }
    formatted += '\nHourly Performance:\n';
    for (const [hour, amount] of Object.entries(hourlyStats).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))) {
        formatted += `- ${hour}:00: $${amount.toFixed(2)}\n`;
    }
    return formatted;
}
/**
 * Generate category statistics
 */
export function generateCategoryStats(transactions) {
    const stats = {};
    for (const txn of transactions) {
        for (const item of txn.items) {
            if (!stats[item.category]) {
                stats[item.category] = {
                    revenue: 0,
                    quantity: 0,
                    transactions: 0,
                    items: {},
                };
            }
            stats[item.category].revenue += item.totalPrice;
            stats[item.category].quantity += item.quantity;
            stats[item.category].transactions++;
            if (!stats[item.category].items[item.sku]) {
                stats[item.category].items[item.sku] = {
                    name: item.name,
                    quantity: 0,
                    revenue: 0,
                };
            }
            stats[item.category].items[item.sku].quantity += item.quantity;
            stats[item.category].items[item.sku].revenue += item.totalPrice;
        }
    }
    return stats;
}
/**
 * Compare two time periods
 */
export function comparePeriods(period1, period2) {
    const stats1 = {
        revenue: period1.reduce((sum, t) => sum + t.amount, 0),
        transactions: period1.length,
        avgTransaction: 0,
        items: period1.flatMap((t) => t.items).length,
    };
    const stats2 = {
        revenue: period2.reduce((sum, t) => sum + t.amount, 0),
        transactions: period2.length,
        avgTransaction: 0,
        items: period2.flatMap((t) => t.items).length,
    };
    stats1.avgTransaction = stats1.revenue / stats1.transactions;
    stats2.avgTransaction = stats2.revenue / stats2.transactions;
    return {
        period1: stats1,
        period2: stats2,
        comparison: {
            revenueChange: ((stats2.revenue - stats1.revenue) / stats1.revenue * 100).toFixed(2),
            transactionChange: ((stats2.transactions - stats1.transactions) / stats1.transactions * 100).toFixed(2),
            avgTransactionChange: ((stats2.avgTransaction - stats1.avgTransaction) / stats1.avgTransaction * 100).toFixed(2),
        },
    };
}
//# sourceMappingURL=posData.js.map