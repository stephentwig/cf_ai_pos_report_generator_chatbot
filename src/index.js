// Main Cloudflare Worker entry point
// POS Report Generator Chatbot
import { sendMessage } from './llm/chat';
import { executeReportWorkflow, getCachedReport } from './workflows/reportGeneration';
// Enable CORS for local development and deployment
function setCORS(response) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}
function createResponse(data, status = 200) {
    const response = new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
    return setCORS(response);
}
// Main fetch handler
export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return setCORS(new Response(null, { status: 204 }));
        }
        const url = new URL(request.url);
        const path = url.pathname;
        try {
            // Chat endpoint
            if (path === '/api/chat' && request.method === 'POST') {
                return handleChat(request, env);
            }
            // Report endpoint
            if (path === '/api/report' && request.method === 'POST') {
                return handleReport(request, env, ctx);
            }
            // Health check
            if (path === '/health' && request.method === 'GET') {
                return createResponse({
                    success: true,
                    data: { status: 'healthy' },
                    timestamp: new Date().toISOString(),
                });
            }
            // Serve frontend (index.html) for root path
            if (path === '/' && request.method === 'GET') {
                const frontendPath = './frontend/index.html';
                try {
                    const html = await fetch(new URL(frontendPath, url.origin)).then((r) => r.text());
                    return setCORS(new Response(html, {
                        headers: { 'Content-Type': 'text/html' },
                    }));
                }
                catch {
                    return createResponse({
                        success: false,
                        error: 'Frontend not available',
                        timestamp: new Date().toISOString(),
                    }, 404);
                }
            }
            // 404 Not Found
            return createResponse({
                success: false,
                error: 'Endpoint not found',
                timestamp: new Date().toISOString(),
            }, 404);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Worker Error:', errorMessage);
            return createResponse({
                success: false,
                error: errorMessage,
                timestamp: new Date().toISOString(),
            }, 500);
        }
    },
    // Scheduled handler for periodic tasks (optional)
    async scheduled(_event, _env, _ctx) {
        console.log('Scheduled task triggered');
        // Add any scheduled maintenance tasks here
    },
};
/**
 * Handle chat requests
 */
async function handleChat(request, env) {
    try {
        const body = (await request.json());
        if (!body.message) {
            return createResponse({
                success: false,
                error: 'Message is required',
                timestamp: new Date().toISOString(),
            }, 400);
        }
        // Generate response
        const response = await sendMessage(env, body.message, [], body.reportType);
        const chatResponse = {
            success: true,
            data: {
                response: response.content,
                sessionId: body.sessionId || `session-${Date.now()}`,
                reportId: `report-${Date.now()}`,
            },
            timestamp: new Date().toISOString(),
        };
        return createResponse(chatResponse);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Chat Error:', errorMessage);
        return createResponse({
            success: false,
            error: errorMessage,
            timestamp: new Date().toISOString(),
        }, 500);
    }
}
/**
 * Handle report generation requests
 */
async function handleReport(request, env, ctx) {
    try {
        const body = (await request.json());
        if (!body.reportType || !body.filters) {
            return createResponse({
                success: false,
                error: 'reportType and filters are required',
                timestamp: new Date().toISOString(),
            }, 400);
        }
        const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Check cache first
        const cachedReport = await getCachedReport(env, reportId);
        if (cachedReport) {
            const reportResponse = {
                success: true,
                data: {
                    reportId,
                    status: 'completed',
                    report: cachedReport,
                },
                timestamp: new Date().toISOString(),
            };
            return createResponse(reportResponse);
        }
        // Start report generation workflow
        ctx.waitUntil(executeReportWorkflow(env, {
            sessionId: body.sessionId || `session-${Date.now()}`,
            reportType: body.reportType,
            filters: body.filters,
            status: 'pending',
        }).catch((error) => console.error('Workflow failed:', error)));
        const response = {
            success: true,
            data: {
                reportId,
                status: 'generating',
                estimatedTime: 5,
            },
            timestamp: new Date().toISOString(),
        };
        return createResponse(response, 202); // 202 Accepted
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Report Error:', errorMessage);
        return createResponse({
            success: false,
            error: errorMessage,
            timestamp: new Date().toISOString(),
        }, 500);
    }
}
//# sourceMappingURL=index.js.map