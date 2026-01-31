// Frontend JavaScript for POS Report Generator Chatbot

class POSChatBot {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.messages = [];
    this.isLoading = false;

    this.initializeElements();
    this.attachEventListeners();
    this.initializeDates();
  }

  initializeElements() {
    this.messagesContainer = document.getElementById('messages');
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.chatForm = document.getElementById('chatForm');
    this.loadingIndicator = document.getElementById('loadingIndicator');
    this.reportPanel = document.getElementById('reportPanel');
    this.reportModal = document.getElementById('reportModal');
    this.quickReportBtns = document.querySelectorAll('.quick-report');
  }

  attachEventListeners() {
    // Chat form
    this.chatForm.addEventListener('submit', (e) => this.handleSendMessage(e));

    // Quick report buttons
    this.quickReportBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleQuickReport(e));
    });

    // Clear history
    document.getElementById('clearHistory')?.addEventListener('click', () => this.clearHistory());

    // Export report
    document.getElementById('exportReport')?.addEventListener('click', () => this.exportReport());

    // Modal controls
    document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
    document.getElementById('cancelReport')?.addEventListener('click', () => this.closeModal());
    document.getElementById('reportForm')?.addEventListener('submit', (e) => this.handleCustomReport(e));

    // Voice input
    document.getElementById('useVoice')?.addEventListener('change', (e) => this.handleVoiceToggle(e));

    // Panel close
    document.getElementById('closePanel')?.addEventListener('click', () => this.closePanel());
  }

  initializeDates() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7);

    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');

    if (startInput) startInput.valueAsDate = startDate;
    if (endInput) endInput.valueAsDate = today;
  }

  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async handleSendMessage(e) {
    e.preventDefault();

    const message = this.messageInput.value.trim();
    if (!message) return;

    // Add user message to UI
    this.addMessage('user', message);
    this.messageInput.value = '';
    this.messageInput.style.height = 'auto';

    // Show loading
    this.setLoading(true);

    try {
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId: this.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        this.addMessage('assistant', data.data.response);
        this.updateReportPanel(data.data);
      } else {
        this.addMessage('assistant', `Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      this.addMessage('assistant', `Error: ${error.message}. Please try again.`);
    } finally {
      this.setLoading(false);
    }
  }

  async handleQuickReport(e) {
    const reportType = e.target.dataset.type;
    this.addMessage('user', `Generate ${reportType} report`);
    this.setLoading(true);

    try {
      const today = new Date();
      let startDate = new Date(today);

      switch (reportType) {
        case 'daily':
          startDate.setDate(today.getDate());
          break;
        case 'weekly':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(today.getMonth() - 1);
          break;
        default:
          startDate.setDate(today.getDate() - 30);
      }

      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          filters: {
            startDate: startDate.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
          },
          sessionId: this.sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.addMessage(
          'assistant',
          `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated! (ID: ${data.data.reportId})`,
        );
        this.updateReportPanel(data.data);
      } else {
        this.addMessage('assistant', `Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      this.addMessage('assistant', `Error: ${error.message}`);
    } finally {
      this.setLoading(false);
    }
  }

  handleCustomReport(e) {
    e.preventDefault();
    this.closeModal();
    const formData = new FormData(e.target);
    // Handle custom report generation
  }

  handleVoiceToggle(e) {
    if (e.target.checked) {
      this.startVoiceInput();
    }
  }

  startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      console.log('Voice input started...');
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      this.messageInput.value = transcript;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
  }

  addMessage(role, content) {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${role}`;

    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';

    // Simple markdown parsing
    content = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    contentEl.innerHTML = content;
    messageEl.appendChild(contentEl);

    this.messagesContainer.appendChild(messageEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    this.messages.push({ role, content });
  }

  updateReportPanel(data) {
    if (!data.report) {
      this.reportPanel.innerHTML = `
        <div class="report-info">
          <p><strong>Report ID:</strong> ${data.reportId}</p>
          <p><strong>Status:</strong> ${data.status}</p>
          ${data.estimatedTime ? `<p><strong>Estimated Time:</strong> ${data.estimatedTime}s</p>` : ''}
        </div>
      `;
      return;
    }

    const report = data.report;
    this.reportPanel.innerHTML = `
      <div class="report-details">
        <h3>${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report</h3>
        <p><strong>Generated:</strong> ${new Date(report.generatedAt).toLocaleString()}</p>
        
        <h4>Summary</h4>
        <p>${report.data.summary}</p>
        
        <h4>Key Metrics</h4>
        <ul>
          ${Object.entries(report.data.metrics)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('')}
        </ul>
        
        ${
          report.data.recommendations.length > 0
            ? `
          <h4>Recommendations</h4>
          <ul>
            ${report.data.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
          </ul>
        `
            : ''
        }
      </div>
    `;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    if (isLoading) {
      this.loadingIndicator.classList.remove('hidden');
      this.sendBtn.disabled = true;
    } else {
      this.loadingIndicator.classList.add('hidden');
      this.sendBtn.disabled = false;
    }
  }

  clearHistory() {
    if (confirm('Clear all chat history?')) {
      this.messages = [];
      this.messagesContainer.innerHTML = `
        <div class="message message-assistant welcome">
          <div class="message-content">
            <h3>Chat history cleared</h3>
            <p>Ready for a new conversation!</p>
          </div>
        </div>
      `;
      this.sessionId = this.generateSessionId();
    }
  }

  exportReport() {
    const reportText = this.messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText),
    );
    element.setAttribute('download', `pos-report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  closeModal() {
    this.reportModal.classList.add('hidden');
  }

  closePanel() {
    this.reportPanel.innerHTML = '<p class="placeholder">Reports will appear here</p>';
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const chatBot = new POSChatBot();

  // Auto-resize textarea
  const textarea = document.getElementById('messageInput');
  if (textarea) {
    textarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
  }

  // Set up API base URL if needed
  const apiBase = window.location.origin;
  console.log('API Base URL:', apiBase);
});
