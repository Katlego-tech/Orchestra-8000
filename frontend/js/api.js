/**
 * Orchestra 8000 - API Integration Module
 * Handles all backend API communications
 */

// ===== Configuration =====
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
};

// ===== API Client =====
class OrchestraAPI {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * Make HTTP request with timeout and error handling
     */
    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }
            
            throw error;
        }
    }

    /**
     * Retry failed requests with exponential backoff
     */
    async requestWithRetry(endpoint, options = {}, attempts = API_CONFIG.RETRY_ATTEMPTS) {
        try {
            return await this.request(endpoint, options);
        } catch (error) {
            if (attempts <= 1) {
                throw error;
            }

            console.warn(`Request failed, retrying... (${API_CONFIG.RETRY_ATTEMPTS - attempts + 1}/${API_CONFIG.RETRY_ATTEMPTS})`);
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
            
            return this.requestWithRetry(endpoint, options, attempts - 1);
        }
    }

    /**
     * Perform IT issue triage
     * @param {Object} triageData - { workstation_id, issue_description, provider }
     * @returns {Promise<Object>} Triage response
     */
    async performTriage(triageData) {
        const { workstation_id, issue_description, provider = 'watsonx' } = triageData;

        if (!workstation_id || !issue_description) {
            throw new Error('Workstation ID and issue description are required');
        }

        return await this.requestWithRetry('/triage', {
            method: 'POST',
            body: JSON.stringify({
                workstation_id,
                issue_description,
                provider
            })
        });
    }

    /**
     * Health check endpoint
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/docs`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// ===== Create singleton instance =====
const orchestraAPI = new OrchestraAPI();

// ===== Helper Functions =====

/**
 * Format triage response for display
 */
function formatTriageResponse(response) {
    return {
        workstationId: response.workstation_id,
        summary: response.issue_summary,
        severity: response.severity,
        provider: response.provider_used,
        plan: response.reasoning_plan || 'No plan provided',
        timestamp: new Date().toISOString()
    };
}

/**
 * Get severity color based on level
 */
function getSeverityColor(severity) {
    const colors = {
        low: '#24A148',
        medium: '#FFD600',
        high: '#FF832B',
        critical: '#DA1E28'
    };
    return colors[severity] || '#E0E0E0';
}

/**
 * Get severity icon based on level
 */
function getSeverityIcon(severity) {
    const icons = {
        low: '✓',
        medium: '⚠',
        high: '⚡',
        critical: '🔥'
    };
    return icons[severity] || '○';
}

/**
 * Validate provider name
 */
function validateProvider(provider) {
    const validProviders = ['watsonx', 'groq', 'ollama'];
    return validProviders.includes(provider.toLowerCase());
}

// ===== Export API =====
window.OrchestraAPI = {
    client: orchestraAPI,
    performTriage: (data) => orchestraAPI.performTriage(data),
    healthCheck: () => orchestraAPI.healthCheck(),
    formatTriageResponse,
    getSeverityColor,
    getSeverityIcon,
    validateProvider
};

console.log('%c🔌 Orchestra API Module Loaded', 'color: #0F62FE; font-size: 14px; font-weight: bold;');
console.log(`%cAPI Base URL: ${API_CONFIG.BASE_URL}`, 'color: #FFD600; font-size: 12px;');

// Made with Bob
