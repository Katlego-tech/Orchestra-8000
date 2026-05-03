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
    harmonicMinimized: false
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    initializeNavigation();
    initializeFlowAnimation();
    initializeModelCards();
    initializeTerminal();
    initializeHarmonic();
    initializeInteractions();
    startSystemSimulation();
    initPageTransitions();
});

// ===== Navigation =====
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const tabName = item.getAttribute('data-tab');
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Switch tabs
            switchTab(tabName);
            
            // Add subtle feedback
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
    
    // Harmonic mobile toggle
    const harmonicToggle = document.getElementById('harmonicToggle');
    const harmonicPanel = document.querySelector('.harmonic-panel');
    
    if (harmonicToggle) {
        harmonicToggle.addEventListener('click', () => {
            harmonicPanel.classList.toggle('mobile-visible');
        });
        
        // Show toggle on mobile
        if (window.innerWidth <= 768) {
            harmonicToggle.style.display = 'flex';
        }
        
        window.addEventListener('resize', () => {
            harmonicToggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
            if (window.innerWidth > 768) {
                harmonicPanel.classList.remove('mobile-visible');
            }
        });
    }
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
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            modelCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Update state
            const modelName = card.querySelector('.model-name').textContent;
            state.activeModel = modelName.toLowerCase().replace(' ', '-');
            
            // Add log entry
            addLogEntry('success', `Switched to model: ${modelName}`);
            
            // Update Harmonic insight
            updateHarmonicInsight(modelName);
        });
        
        // Animate metrics on hover
        card.addEventListener('mouseenter', () => {
            const metrics = card.querySelectorAll('.metric-fill');
            metrics.forEach(metric => {
                const currentWidth = metric.style.width;
                metric.style.width = '0%';
                setTimeout(() => {
                    metric.style.width = currentWidth;
                }, 50);
            });
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

// ===== Harmonic Assistant =====
function initializeHarmonic() {
    const minimizeButton = document.querySelector('.minimize-button');
    const harmonicPanel = document.querySelector('.harmonic-panel');
    const sendButton = document.querySelector('.send-button');
    const textbox = document.querySelector('.harmonic-textbox');
    
    // Minimize/Maximize
    minimizeButton.addEventListener('click', () => {
        state.harmonicMinimized = !state.harmonicMinimized;
        
        if (state.harmonicMinimized) {
            harmonicPanel.classList.add('minimized');
        } else {
            harmonicPanel.classList.remove('minimized');
        }
    });
    
    // Send message
    sendButton.addEventListener('click', () => {
        sendHarmonicMessage();
    });
    
    textbox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendHarmonicMessage();
        }
    });
    
    // Animate status text
    animateHarmonicStatus();
}

function sendHarmonicMessage() {
    const textbox = document.querySelector('.harmonic-textbox');
    const message = textbox.value.trim();
    
    if (message) {
        addLogEntry('info', `User query: ${message}`);
        
        // Simulate response
        setTimeout(() => {
            addLogEntry('success', 'Harmonic: Processing your request...');
            addHarmonicInsight('💬', 'User Query', `Analyzing: "${message}"`);
        }, 500);
        
        textbox.value = '';
    }
}

function animateHarmonicStatus() {
    const statusTexts = [
        'Analyzing system state...',
        'Monitoring orchestration flow...',
        'Optimizing model selection...',
        'Ready to assist...'
    ];
    
    let currentIndex = 0;
    const statusElement = document.querySelector('.harmonic-status');
    
    setInterval(() => {
        statusElement.style.opacity = '0';
        
        setTimeout(() => {
            statusElement.textContent = statusTexts[currentIndex];
            statusElement.style.opacity = '1';
            currentIndex = (currentIndex + 1) % statusTexts.length;
        }, 300);
    }, 5000);
}

function updateHarmonicInsight(modelName) {
    const insights = {
        'IBM Bob': {
            icon: '🎯',
            title: 'Enterprise Choice',
            text: 'IBM Bob provides enterprise-grade reliability with comprehensive audit trails and compliance features.'
        },
        'Groq': {
            icon: '⚡',
            title: 'Speed Optimized',
            text: 'Groq delivers ultra-fast inference with 3x performance improvement for time-critical operations.'
        },
        'Ollama': {
            icon: '🔒',
            title: 'Privacy First',
            text: 'Ollama runs locally with zero external dependencies, ensuring maximum data privacy and control.'
        }
    };
    
    const insight = insights[modelName];
    if (insight) {
        addHarmonicInsight(insight.icon, insight.title, insight.text);
    }
}

function addHarmonicInsight(icon, title, text) {
    const harmonicContent = document.querySelector('.harmonic-content');
    
    const insightCard = document.createElement('div');
    insightCard.className = 'insight-card';
    insightCard.style.opacity = '0';
    insightCard.style.transform = 'translateX(20px)';
    
    insightCard.innerHTML = `
        <div class="insight-icon">${icon}</div>
        <div class="insight-text">
            <h4>${title}</h4>
            <p>${text}</p>
        </div>
    `;
    
    harmonicContent.insertBefore(insightCard, harmonicContent.firstChild);
    
    // Animate in
    setTimeout(() => {
        insightCard.style.transition = 'all 0.3s ease';
        insightCard.style.opacity = '1';
        insightCard.style.transform = '';
    }, 50);
    
    // Keep only last 5 insights
    const insights = harmonicContent.querySelectorAll('.insight-card');
    if (insights.length > 5) {
        insights[insights.length - 1].remove();
    }
}

// ===== Interactive Elements =====
function initializeInteractions() {
    // Approve button
    const approveButton = document.querySelector('.approve-button');
    if (approveButton) {
        approveButton.addEventListener('click', () => {
            approveButton.textContent = 'Approved ✓';
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
    // Simulate periodic system updates
    setInterval(() => {
        const events = [
            { level: 'info', message: 'Health check: All systems operational' },
            { level: 'success', message: 'Cache optimization completed' },
            { level: 'info', message: 'Model performance metrics updated' },
            { level: 'success', message: 'Workflow checkpoint saved' }
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        // Only add if not too many recent logs
        if (state.logs.length < 15) {
            addLogEntry(randomEvent.level, randomEvent.message);
        }
    }, 15000);
    
    // Simulate Harmonic insights
    setInterval(() => {
        const insights = [
            { icon: '📊', title: 'Performance Insight', text: 'Average response time: 1.2s - within optimal range' },
            { icon: '💰', title: 'Cost Analysis', text: 'Current configuration saves 23% compared to baseline' },
            { icon: '🔄', title: 'System Update', text: 'New model version available for testing' }
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        
        if (Math.random() > 0.7) { // 30% chance
            addHarmonicInsight(randomInsight.icon, randomInsight.title, randomInsight.text);
        }
    }, 20000);
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
    addHarmonicInsight,
    updateHarmonicInsight
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
        const severityIcon = window.OrchestraAPI.getSeverityIcon(formatted.severity);
        addHarmonicInsight(
            severityIcon,
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
        <h3 style="color: var(--error);">⚠️ Error</h3>
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
            addHarmonicInsight('✅', 'System Status', 'Backend API is online and ready');
        } else {
            addLogEntry('warning', 'Backend API not responding - using demo mode');
            addHarmonicInsight('⚠️', 'System Status', 'Backend API offline - start server with: cd backend && uv run uvicorn main:app');
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
