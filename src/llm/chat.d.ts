import { LLMResponse, ChatMessage } from '../types/index';
/**
 * Send a message to Llama 3.3 via Cloudflare Workers AI
 */
export declare function sendMessage(env: any, userMessage: string, conversationHistory?: ChatMessage[], reportType?: string): Promise<LLMResponse>;
/**
 * Stream a message response
 */
export declare function streamMessage(env: any, userMessage: string, conversationHistory?: ChatMessage[], reportType?: string): Promise<ReadableStream<string>>;
/**
 * Generate a report based on POS data
 */
export declare function generateReport(env: any, reportType: string, posData: string, filters?: Record<string, any>): Promise<LLMResponse>;
/**
 * Validate if response contains valid content
 */
export declare function isValidResponse(response: LLMResponse): boolean;
/**
 * Parse report sections from LLM response
 */
export declare function parseReportSections(content: string): Record<string, string>;
//# sourceMappingURL=chat.d.ts.map