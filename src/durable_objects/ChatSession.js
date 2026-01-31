// Chat Session Durable Object for managing conversation state
export class ChatSession {
    state;
    env;
    sessionId;
    session = null;
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessionId = state.id.toString();
    }
    /**
     * Initialize or retrieve session
     */
    async initSession(userId) {
        const stored = (await this.state.storage.get('session'));
        if (stored) {
            this.session = stored;
            this.session.lastActivity = new Date().toISOString();
        }
        else {
            this.session = {
                id: this.sessionId,
                userId,
                messages: [],
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                metadata: {
                    reportCount: 0,
                    lastReportType: null,
                    preferences: {},
                },
            };
        }
        await this.state.storage.put('session', this.session);
        return this.session;
    }
    /**
     * Add message to conversation
     */
    async addMessage(role, content) {
        if (!this.session) {
            throw new Error('Session not initialized');
        }
        const message = {
            id: `msg-${Date.now()}`,
            role,
            content,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
        };
        this.session.messages.push(message);
        this.session.lastActivity = new Date().toISOString();
        // Keep only last 50 messages to save storage
        if (this.session.messages.length > 50) {
            this.session.messages = this.session.messages.slice(-50);
        }
        await this.state.storage.put('session', this.session);
        return message;
    }
    /**
     * Get all messages in session
     */
    async getMessages() {
        if (!this.session) {
            throw new Error('Session not initialized');
        }
        return this.session?.messages || [];
    }
    /**
     * Get messages since a certain timestamp
     */
    async getMessagesSince(timestamp) {
        if (!this.session) {
            throw new Error('Session not initialized');
        }
        return this.session.messages.filter((msg) => msg.timestamp > timestamp);
    }
    /**
     * Clear conversation history
     */
    async clearHistory() {
        if (!this.session) {
            throw new Error('Session not initialized');
        }
        this.session.messages = [];
        this.session.lastActivity = new Date().toISOString();
        await this.state.storage.put('session', this.session);
    }
    /**
     * Update session metadata
     */
    async updateMetadata(metadata) {
        if (!this.session) {
            throw new Error('Session not initialized');
        }
        this.session.metadata = {
            ...this.session.metadata,
            ...metadata,
        };
        this.session.lastActivity = new Date().toISOString();
        await this.state.storage.put('session', this.session);
    }
    /**
     * Get session info
     */
    async getSessionInfo() {
        if (!this.session) {
            throw new Error('Session not initialized');
        }
        return {
            ...this.session,
            messages: this.session.messages.slice(-10), // Return last 10 messages
        };
    }
    /**
     * Handle fetch requests to Durable Object
     */
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        try {
            if (path === '/init' && request.method === 'POST') {
                const body = await request.json();
                const session = await this.initSession(body.userId);
                return new Response(JSON.stringify(session), {
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (path === '/message' && request.method === 'POST') {
                const body = await request.json();
                const message = await this.addMessage(body.role, body.content);
                return new Response(JSON.stringify(message), {
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (path === '/messages' && request.method === 'GET') {
                const messages = await this.getMessages();
                return new Response(JSON.stringify(messages), {
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (path === '/info' && request.method === 'GET') {
                const info = await this.getSessionInfo();
                return new Response(JSON.stringify(info), {
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (path === '/clear' && request.method === 'POST') {
                await this.clearHistory();
                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (path === '/metadata' && request.method === 'PUT') {
                const body = await request.json();
                await this.updateMetadata(body);
                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response('Not Found', { status: 404 });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Durable Object Error:', errorMessage);
            return new Response(JSON.stringify({
                error: errorMessage,
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
}
//# sourceMappingURL=ChatSession.js.map