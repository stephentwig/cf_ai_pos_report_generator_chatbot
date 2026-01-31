import { ChatSession as ChatSessionType, ChatMessage } from '../types/index';
export declare class ChatSession {
    state: any;
    env: any;
    sessionId: string;
    session: ChatSessionType | null;
    constructor(state: any, env: any);
    /**
     * Initialize or retrieve session
     */
    initSession(userId: string): Promise<ChatSessionType>;
    /**
     * Add message to conversation
     */
    addMessage(role: 'user' | 'assistant', content: string): Promise<ChatMessage>;
    /**
     * Get all messages in session
     */
    getMessages(): Promise<ChatMessage[]>;
    /**
     * Get messages since a certain timestamp
     */
    getMessagesSince(timestamp: string): Promise<ChatMessage[]>;
    /**
     * Clear conversation history
     */
    clearHistory(): Promise<void>;
    /**
     * Update session metadata
     */
    updateMetadata(metadata: Record<string, any>): Promise<void>;
    /**
     * Get session info
     */
    getSessionInfo(): Promise<ChatSessionType>;
    /**
     * Handle fetch requests to Durable Object
     */
    fetch(request: Request): Promise<Response>;
}
//# sourceMappingURL=ChatSession.d.ts.map