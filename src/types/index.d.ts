export interface POSTransaction {
    id: string;
    timestamp: string;
    amount: number;
    taxAmount: number;
    discountAmount: number;
    paymentMethod: 'cash' | 'card' | 'mobile' | 'check';
    items: POSItem[];
    customerId?: string;
    notes?: string;
}
export interface POSItem {
    sku: string;
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discount?: number;
}
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    sessionId: string;
}
export interface ChatSession {
    id: string;
    userId: string;
    messages: ChatMessage[];
    createdAt: string;
    lastActivity: string;
    metadata?: Record<string, any>;
}
export interface ReportRequest {
    reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
    filters: ReportFilters;
    sessionId: string;
    userId?: string;
}
export interface ReportFilters {
    startDate: string;
    endDate: string;
    department?: string;
    category?: string;
    paymentMethod?: string;
    minAmount?: number;
    maxAmount?: number;
}
export interface GeneratedReport {
    id: string;
    type: string;
    generatedAt: string;
    data: {
        summary: string;
        metrics: Record<string, any>;
        analysis: string;
        recommendations: string[];
    };
    filters: ReportFilters;
}
export interface LLMResponse {
    content: string;
    model: string;
    usage?: {
        inputTokens: number;
        outputTokens: number;
    };
    finishReason: string;
}
export interface WorkflowContext {
    sessionId: string;
    userId?: string;
    reportType: string;
    filters: ReportFilters;
    data?: any;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error?: string;
}
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
}
export interface ChatResponse extends APIResponse {
    data: {
        response: string;
        reportId?: string;
        sessionId: string;
    };
}
export interface ReportResponse extends APIResponse {
    data: {
        reportId: string;
        status: 'generating' | 'completed' | 'failed';
        estimatedTime?: number;
        report?: GeneratedReport;
    };
}
//# sourceMappingURL=index.d.ts.map