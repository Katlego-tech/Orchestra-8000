/**
 * Orchestra 8000 - Enterprise AI Orchestration Dashboard
 * Interactive JavaScript for premium user experience
 */

// ===== Auth Guard =====
function checkAuth() {
    const token = localStorage.getItem('orchestra_token') || sessionStorage.getItem('orchestra_token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ===== State Management =====
const state = {
    currentFlow: 'planning',
    activeModel: 'ibm-bob',
    logs: [],
    chatOpen: false,
    cpuInterval: null,
    cpuValue: 42,
    memValue: 78,
    netValue: 35,
    diskValue: 24
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    initializeNavigation();
    initializeFlowAnimation();
    initializeModelCards();
    initializeTerminal();
    initializeBubble();
    initializeInteractions();
    startSystemSimulation();
    startCPUMonitoring();
    initPageTransitions();
});

// ===== Navigation =====
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const tabName = item.getAttribute('data-tab');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            switchTab(tabName);
            
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
}

// ===== Tab Switching =====
function switchTab(tabName) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}Tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'orchestration': 'Orchestration',
            'models': 'AI Models',
            'analytics': 'Analytics',
            'settings': 'Settings'
        };
        pageTitle.textContent = titles[tabName] || 'Dashboard';
    }
    
    // Log tab switch
    addLogEntry('info', `Switched to ${tabName} view`);
}

// ===== Flow Animation =====
function initializeFlowAnimation() {
    const flowNodes = document.querySelectorAll('.flow-node');
    const flowLines = document.querySelectorAll('.flow-line');
    
    flowNodes.forEach((node, index) => {
        node.addEventListener('mouseenter', () => {
            node.style.transform = 'translateY(-8px)';
            
            // Highlight connected lines
            if (index < flowLines.length) {
                flowLines[index].style.strokeWidth = '4';
            }
        });
        
        node.addEventListener('mouseleave', () => {
            node.style.transform = '';
            
            if (index < flowLines.length) {
                flowLines[index].style.strokeWidth = '3';
            }
        });
    });
    
    // Animate flow progression
    animateFlowProgress();
}

function animateFlowProgress() {
    const nodes = document.querySelectorAll('.flow-node');
    let currentIndex = 0;
    
    setInterval(() => {
        // Reset all nodes
        nodes.forEach(node => {
            node.classList.remove('active', 'completed');
        });
        
        // Mark previous nodes as completed
        for (let i = 0; i < currentIndex; i++) {
            nodes[i].classList.add('completed');
        }
        
        // Mark current node as active
        if (currentIndex < nodes.length) {
            nodes[currentIndex].classList.add('active');
        }
        
        // Progress to next node
        currentIndex = (currentIndex + 1) % (nodes.length + 1);
        
        // Add log entry
        if (currentIndex < nodes.length) {
            const nodeLabel = nodes[currentIndex].querySelector('.node-label').textContent;
            addLogEntry('info', `Processing: ${nodeLabel}`);
        }
    }, 3000);
}

// ===== Model Cards =====
function initializeModelCards() {
    const modelCards = document.querySelectorAll('.model-card[data-model]');
    
    modelCards.forEach(card => {
        card.addEventListener('click', () => {
            modelCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const modelName = card.querySelector('.model-card-name').textContent;
            state.activeModel = modelName.toLowerCase().replace(' ', '-');
            
            addLogEntry('success', `Switched to model: ${modelName}`);
            
            const insights = {
                'IBM Bob': { icon: 'Target', title: 'Enterprise Choice', text: 'Enterprise-grade reliability with comprehensive audit trails.' },
                'Groq': { icon: 'Speed', title: 'Speed Optimized', text: 'Ultra-fast inference with 3x performance improvement.' },
                'Ollama': { icon: 'Lock', title: 'Privacy First', text: 'Local execution with zero external dependencies.' }
            };
            
            const insight = insights[modelName];
            if (insight) addChatMessage(insight.icon, insight.title, insight.text);
        });
    });
}

// ===== Terminal / Logs =====
function initializeTerminal() {
    // Initial logs
    addLogEntry('info', 'Orchestration session initialized');
    addLogEntry('success', 'Task analysis completed - 3 steps identified');
    addLogEntry('info', 'Routing to IBM Bob (watsonx.ai) - confidence: 0.94');
    addLogEntry('warning', 'Awaiting human approval for strategy execution...');
}

function addLogEntry(level, message) {
    const terminal = document.querySelector('.terminal');
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    const logLine = document.createElement('div');
    logLine.className = 'terminal-line';
    
    logLine.innerHTML = `
        <span class="timestamp">[${timestamp}]</span>
        <span class="log-level ${level}">${level.toUpperCase()}</span>
        <span class="log-message">${message}</span>
    `;
    
    // Remove active class from previous line
    const activeLines = terminal.querySelectorAll('.terminal-line.active');
    activeLines.forEach(line => line.classList.remove('active'));
    
    // Add new line
    terminal.appendChild(logLine);
    
    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
    
    // Keep only last 20 logs
    const lines = terminal.querySelectorAll('.terminal-line');
    if (lines.length > 20) {
        lines[0].remove();
    }
    
    // Store in state
    state.logs.push({ timestamp, level, message });
}

// ===== Floating Bubble =====
function initializeBubble() {
    const bubble = document.getElementById('harmonicBubble');
    const chat = document.getElementById('harmonicChat');
    const closeBtn = document.getElementById('chatClose');
    const sendBtn = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');
    
    if (!bubble || !chat) return;
    
    bubble.addEventListener('click', () => {
        state.chatOpen = !state.chatOpen;
        if (state.chatOpen) {
            chat.classList.add('visible');
            bubble.classList.add('hidden');
        } else {
            chat.classList.remove('visible');
            bubble.classList.remove('hidden');
        }
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            state.chatOpen = false;
            chat.classList.remove('visible');
            bubble.classList.remove('hidden');
        });
    }
    
    if (sendBtn && input) {
        sendBtn.addEventListener('click', () => sendChatMessage(input, chat));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage(input, chat);
        });
    }
    
    animateChatStatus();
}

function sendChatMessage(input, chat) {
    const message = input.value.trim();
    if (!message) return;
    
    const messages = document.getElementById('chatMessages');
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `<p>${escapeHtml(message)}</p>`;
    messages.appendChild(userMsg);
    
    input.value = '';
    addLogEntry('info', `User query: ${message}`);
    
    setTimeout(() => {
        const responses = [
            `I've analyzed your request about "${message.slice(0, 30)}...". All providers are operational.`,
            `Processing your query. Current system ROI: 3.4x with 98% success rate.`,
            `Based on current orchestration data, I recommend proceeding with IBM Bob for this task.`,
            `Your request is being routed through the optimal provider. ETA: <200ms.`
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        const harmonicMsg = document.createElement('div');
        harmonicMsg.className = 'chat-message harmonic';
        harmonicMsg.innerHTML = `<p>${response}</p>`;
        messages.appendChild(harmonicMsg);
        messages.scrollTop = messages.scrollHeight;
        
        addLogEntry('success', 'Harmonic: Response delivered');
    }, 800);
    
    messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function animateChatStatus() {
    const statusTexts = [
        'Analyzing system state...',
        'Monitoring orchestration flow...',
        'Optimizing model selection...',
        'Ready to assist...'
    ];
    
    let currentIndex = 0;
    const statusElement = document.getElementById('chatStatus');
    
    if (!statusElement) return;
    
    setInterval(() => {
        statusElement.style.opacity = '0';
        setTimeout(() => {
            statusElement.textContent = statusTexts[currentIndex];
            statusElement.style.opacity = '1';
            currentIndex = (currentIndex + 1) % statusTexts.length;
        }, 300);
    }, 5000);
}

function addChatMessage(icon, title, text) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    
    const msg = document.createElement('div');
    msg.className = 'chat-message harmonic';
    msg.innerHTML = `<p><strong>${title}:</strong> ${text}</p>`;
    messages.insertBefore(msg, messages.firstChild);
    
    const items = messages.querySelectorAll('.chat-message');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
}

// ===== Interactive Elements =====
function initializeInteractions() {
    // Approve button
    const approveButton = document.querySelector('.approve-button');
    if (approveButton) {
        approveButton.addEventListener('click', () => {
        approveButton.textContent = 'Approved';
        approveButton.style.background = 'var(--success)';
            approveButton.disabled = true;
            
            addLogEntry('success', 'Human approval granted - proceeding with execution');
            
            // Progress the flow
            setTimeout(() => {
                addLogEntry('info', 'Executing strategy with IBM Bob...');
            }, 1000);
        });
    }
    
    // Expand buttons
    const expandButtons = document.querySelectorAll('.expand-button');
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const panel = button.closest('.panel');
            panel.classList.toggle('expanded');
            
            // Rotate icon
            const svg = button.querySelector('svg');
            const currentRotation = svg.style.transform || 'rotate(0deg)';
            svg.style.transform = currentRotation === 'rotate(0deg)' 
                ? 'rotate(180deg)' 
                : 'rotate(0deg)';
        });
    });
    
    // Control buttons
    const controlButtons = document.querySelectorAll('.control-button');
    controlButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            addLogEntry('info', 'Flow control action triggered');
        });
    });
    
    // Trace buttons
    const traceButtons = document.querySelectorAll('.trace-button');
    traceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.toLowerCase();
            
            if (action === 'clear') {
                const terminal = document.querySelector('.terminal');
                terminal.innerHTML = '';
                addLogEntry('info', 'Terminal cleared');
            } else if (action === 'export') {
                addLogEntry('success', 'Logs exported successfully');
            }
        });
    });
    
    // Tree nodes
    const treeNodes = document.querySelectorAll('.tree-node');
    treeNodes.forEach(node => {
        const header = node.querySelector('.node-header');
        header.addEventListener('click', () => {
            node.classList.toggle('expanded');
        });
    });
}

// ===== System Simulation =====
function startSystemSimulation() {
    setInterval(() => {
        const events = [
            { level: 'info', message: 'Health check: All systems operational' },
            { level: 'success', message: 'Cache optimization completed' },
            { level: 'info', message: 'Model performance metrics updated' },
            { level: 'success', message: 'Workflow checkpoint saved' }
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        if (state.logs.length < 15) {
            addLogEntry(randomEvent.level, randomEvent.message);
        }
    }, 15000);
    
    setInterval(() => {
        const insights = [
            { icon: 'Chart', title: 'Performance Insight', text: 'Average response time: 1.2s - within optimal range' },
            { icon: 'Cost', title: 'Cost Analysis', text: 'Current configuration saves 23% compared to baseline' },
            { icon: 'Update', title: 'System Update', text: 'New model version available for testing' }
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        
        if (Math.random() > 0.7) {
            addChatMessage(randomInsight.icon, randomInsight.title, randomInsight.text);
        }
    }, 20000);
}

// ===== CPU Monitoring =====
function startCPUMonitoring() {
    const cpuBar = document.getElementById('cpuBar');
    const cpuValue = document.getElementById('cpuValue');
    const memBar = document.getElementById('memBar');
    const memValue = document.getElementById('memValue');
    const netBar = document.getElementById('netBar');
    const netValue = document.getElementById('netValue');
    const diskBar = document.getElementById('diskBar');
    const diskValue = document.getElementById('diskValue');
    
    state.cpuInterval = setInterval(() => {
        state.cpuValue = clamp(state.cpuValue + randomInt(-8, 8), 15, 95);
        state.memValue = clamp(state.memValue + randomInt(-5, 5), 50, 92);
        state.netValue = clamp(state.netValue + randomInt(-10, 10), 10, 80);
        state.diskValue = clamp(state.diskValue + randomInt(-3, 3), 15, 60);
        
        if (cpuBar) cpuBar.style.width = `${state.cpuValue}%`;
        if (cpuValue) cpuValue.textContent = `${state.cpuValue}%`;
        updateBarState(cpuBar, state.cpuValue);
        
        if (memBar) memBar.style.width = `${state.memValue}%`;
        if (memValue) memValue.textContent = `${(state.memValue / 100 * 8).toFixed(1)} GB`;
        updateBarState(memBar, state.memValue);
        
        if (netBar) netBar.style.width = `${state.netValue}%`;
        if (netValue) netValue.textContent = `${(state.netValue / 100 * 4).toFixed(1)} MB/s`;
        updateBarState(netBar, state.netValue);
        
        if (diskBar) diskBar.style.width = `${state.diskValue}%`;
        if (diskValue) diskValue.textContent = `${Math.floor(state.diskValue / 100 * 500)} MB/s`;
        updateBarState(diskBar, state.diskValue);
    }, 2000);
}

function updateBarState(bar, value) {
    if (!bar) return;
    bar.classList.remove('warning', 'critical');
    if (value > 80) bar.classList.add('critical');
    else if (value > 60) bar.classList.add('warning');
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===== Utility Functions =====
function formatTimestamp(date) {
    return date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Smooth Animations =====
function addSmoothTransitions() {
    const elements = document.querySelectorAll('.panel, .model-card, .insight-card');
    
    elements.forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
}

// ===== Performance Monitoring =====
function monitorPerformance() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Orchestra 8000 Performance:', {
            loadTime: perfData.loadEventEnd - perfData.fetchStart,
            domReady: perfData.domContentLoadedEventEnd - perfData.fetchStart
        });
    }
}

// Initialize performance monitoring
window.addEventListener('load', () => {
    monitorPerformance();
    addSmoothTransitions();
});

// ===== Export for debugging =====
window.Orchestra = {
    state,
    addLogEntry,
    addChatMessage
};

console.log('%c🎼 Orchestra 8000 Initialized', 'color: #0F62FE; font-size: 16px; font-weight: bold;');
console.log('%cEnterprise AI Orchestration Dashboard', 'color: #FFD600; font-size: 12px;');

// Made with Bob


// ===== Triage Modal Functions =====
function openTriageModal() {
    const modal = document.getElementById('triageModal');
    modal.classList.add('show');
    document.getElementById('triageForm').reset();
    document.getElementById('triageResult').style.display = 'none';
}

function closeTriageModal() {
    const modal = document.getElementById('triageModal');
    modal.classList.remove('show');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('triageModal');
    if (e.target === modal) {
        closeTriageModal();
    }
});

// ===== Triage Form Handler =====
document.addEventListener('DOMContentLoaded', () => {
    const triageForm = document.getElementById('triageForm');
    
    if (triageForm) {
        triageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleTriageSubmit();
        });
    }
    
    // Check backend health on load
    checkBackendHealth();
});

async function handleTriageSubmit() {
    const submitBtn = document.getElementById('triageSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const resultDiv = document.getElementById('triageResult');
    
    // Get form values
    const workstationId = document.getElementById('workstationId').value.trim();
    const issueDescription = document.getElementById('issueDescription').value.trim();
    const provider = document.getElementById('providerSelect').value;
    
    // Validate
    if (!workstationId || !issueDescription) {
        showTriageError('Please fill in all required fields');
        return;
    }
    
    try {
        // Set loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        resultDiv.style.display = 'none';
        
        addLogEntry('info', `Submitting triage request for ${workstationId}...`);
        
        // Call API
        const response = await window.OrchestraAPI.performTriage({
            workstation_id: workstationId,
            issue_description: issueDescription,
            provider: provider
        });
        
        // Format and display result
        const formatted = window.OrchestraAPI.formatTriageResponse(response);
        displayTriageResult(formatted);
        
        // Add log entries
        addLogEntry('success', `Triage completed for ${workstationId}`);
        addLogEntry('info', `Provider: ${formatted.provider}`);
        addLogEntry('info', `Severity: ${formatted.severity}`);
        
        // Update Harmonic with insight
        addChatMessage(
            'Triage',
            'Triage Complete',
            `${workstationId}: ${formatted.severity} severity issue identified`
        );
        
    } catch (error) {
        console.error('Triage error:', error);
        showTriageError(error.message || 'Failed to process triage request');
        addLogEntry('error', `Triage failed: ${error.message}`);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
}

function displayTriageResult(result) {
    const resultDiv = document.getElementById('triageResult');
    const severityColor = window.OrchestraAPI.getSeverityColor(result.severity);
    const severityIcon = window.OrchestraAPI.getSeverityIcon(result.severity);
    
    resultDiv.innerHTML = `
        <h3>${severityIcon} Triage Analysis Complete</h3>
        <div class="result-item">
            <div class="result-label">Workstation ID</div>
            <div class="result-value">${result.workstationId}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Issue Summary</div>
            <div class="result-value">${result.summary}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Severity Level</div>
            <div class="result-value">
                <span class="severity-badge severity-${result.severity}" style="background: ${severityColor}">
                    ${result.severity}
                </span>
            </div>
        </div>
        <div class="result-item">
            <div class="result-label">AI Provider</div>
            <div class="result-value">${result.provider}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Recommended Action Plan</div>
            <div class="result-value">${result.plan}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Timestamp</div>
            <div class="result-value">${new Date(result.timestamp).toLocaleString()}</div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
}

function showTriageError(message) {
    const resultDiv = document.getElementById('triageResult');
    resultDiv.innerHTML = `
        <h3 style="color: var(--error);">Error</h3>
        <div class="result-value" style="color: var(--error);">${message}</div>
    `;
    resultDiv.style.display = 'block';
}

// ===== Backend Health Check =====
async function checkBackendHealth() {
    try {
        const isHealthy = await window.OrchestraAPI.healthCheck();
        if (isHealthy) {
            addLogEntry('success', 'Backend API connection established');
            addChatMessage('Online', 'System Status', 'Backend API is online and ready');
        } else {
            addLogEntry('warning', 'Backend API not responding - using demo mode');
            addChatMessage('Offline', 'System Status', 'Backend API offline - start server with: cd backend && uv run uvicorn main:app');
        }
    } catch (error) {
        addLogEntry('warning', 'Backend API check failed - using demo mode');
    }
}

// Make functions globally available
window.openTriageModal = openTriageModal;
window.closeTriageModal = closeTriageModal;

// ===== Page Transitions =====
function initPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') || href === 'javascript:void(0)') return;
            
            e.preventDefault();
            
            let overlay = document.querySelector('.page-transition');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'page-transition';
                document.body.appendChild(overlay);
            }
            
            overlay.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
}
