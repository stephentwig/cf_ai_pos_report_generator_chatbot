// Llama 3.3 LLM Service for chat interactions

import { LLMResponse, ChatMessage } from '../types/index';
import { SYSTEM_PROMPT, getReportPrompt } from '../utils/prompts';

interface Ai {
  run(modelName: string, input: Record<string, any>): Promise<Record<string, any>>;
}

/**
 * Send a message to Llama 3.3 via Cloudflare Workers AI
 */
export async function sendMessage(
  env: any,
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  reportType?: string,
): Promise<LLMResponse> {
  try {
    // Prepare system prompt based on report type
    const systemPrompt = reportType ? getReportPrompt(reportType) : SYSTEM_PROMPT;

    // Build messages array for conversation
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    // Add conversation history
    for (const msg of conversationHistory) {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    // Call Cloudflare Workers AI
    const ai: Ai = env.AI;
    if (!ai) {
      throw new Error('AI service not available. Ensure Workers AI is bound in wrangler.toml');
    }

    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8', {
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    });

    // Extract response
    const content =
      response.result?.response ||
      (Array.isArray(response.result) ? response.result[0]?.text : '') ||
      '';

    return {
      content,
      model: 'llama-3.3-70b',
      finishReason: String(response.result?.finish_reason || 'stop'),
      usage: {
        inputTokens: response.result?.usage?.prompt_tokens || 0,
        outputTokens: response.result?.usage?.completion_tokens || 0,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('LLM Error:', errorMessage);

    return {
      content: `Error: Unable to generate response. ${errorMessage}`,
      model: 'llama-3.3-70b',
      finishReason: 'error',
    };
  }
}

/**
 * Stream a message response
 */
export async function streamMessage(
  env: any,
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  reportType?: string,
): Promise<ReadableStream<string>> {
  const systemPrompt = reportType ? getReportPrompt(reportType) : SYSTEM_PROMPT;

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    {
      role: 'system',
      content: systemPrompt,
    },
  ];

  for (const msg of conversationHistory) {
    messages.push({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    });
  }

  messages.push({
    role: 'user',
    content: userMessage,
  });

  // For streaming, we'll return a mock stream
  // In production, use proper streaming from Workers AI
  return new ReadableStream({
    async start(controller) {
      try {
        const response = await sendMessage(env, userMessage, conversationHistory, reportType);

        // Simulate streaming by sending chunks
        const chunks = response.content.split(' ');
        for (const chunk of chunks) {
          controller.enqueue(`${chunk} `);
          // Small delay to simulate streaming
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Generate a report based on POS data
 */
export async function generateReport(
  env: any,
  reportType: string,
  posData: string,
  filters?: Record<string, any>,
): Promise<LLMResponse> {
  const reportPrompt = getReportPrompt(reportType);

  const fullPrompt = `${reportPrompt}

Here is the POS data to analyze:

${posData}

${
  filters
    ? `
Apply these filters to your analysis:
${Object.entries(filters)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}
`
    : ''
}

Please provide a comprehensive analysis with specific numbers and actionable recommendations.`;

  return sendMessage(env, fullPrompt, [], reportType);
}

/**
 * Validate if response contains valid content
 */
export function isValidResponse(response: LLMResponse): boolean {
  return !!(
    response.content &&
    response.content.length > 0 &&
    response.finishReason !== 'error'
  );
}

/**
 * Parse report sections from LLM response
 */
export function parseReportSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = content.split('\n');

  let currentSection = 'summary';
  let currentContent = '';

  for (const line of lines) {
    // Check if line is a header (starts with ** or ##)
    if (line.startsWith('**') || line.startsWith('##')) {
      if (currentContent.trim()) {
        sections[currentSection] = currentContent.trim();
      }
      currentSection = line.replace(/\*\*|##/g, '').trim().toLowerCase().replace(/\s+/g, '_');
      currentContent = '';
    } else {
      currentContent += line + '\n';
    }
  }

  // Save last section
  if (currentContent.trim()) {
    sections[currentSection] = currentContent.trim();
  }

  return sections;
}
