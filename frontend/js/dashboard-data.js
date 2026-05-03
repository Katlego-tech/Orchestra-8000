/**
 * Orchestra 8000 - Dashboard Data Generator
 * Generates realistic, dynamic data for all dashboard sections
 */

// ===== Data Generation Functions =====

function generateRealisticData() {
    return {
        // Dashboard Stats
        stats: {
            activeTasks: Math.floor(Math.random() * 20) + 15, // 15-35
            successRate: (95 + Math.random() * 4).toFixed(1), // 95-99%
            modelsActive: 3,
            avgResponse: (1.0 + Math.random() * 0.5).toFixed(1) // 1.0-1.5s
        },
        
        // Recent Activity
        activities: generateActivities(),
        
        // Provider Status
        providers: {
            watsonx: {
                name: 'IBM Bob (watsonx.ai)',
                model: 'Granite 4.0',
                avgLatency: Math.floor(Math.random() * 50) + 120, // 120-170ms
                requests: Math.floor(Math.random() * 500) + 1000, // 1000-1500
                status: 'healthy',
                uptime: 99.9
            },
            groq: {
                name: 'Groq',
                model: 'Llama 3.3 70B',
                avgLatency: Math.floor(Math.random() * 20) + 30, // 30-50ms
                requests: Math.floor(Math.random() * 400) + 700, // 700-1100
                status: 'healthy',
                uptime: 99.7
            },
            ollama: {
                name: 'Ollama',
                model: 'Local',
                avgLatency: Math.floor(Math.random() * 100) + 280, // 280-380ms
                requests: Math.floor(Math.random() * 300) + 300, // 300-600
                status: 'healthy',
                uptime: 100
            }
        },
        
        // System Monitoring
        system: {
            cpu: Math.floor(Math.random() * 30) + 35, // 35-65%
            memory: Math.floor(Math.random() * 20) + 70, // 70-90%
            network: (Math.random() * 2 + 0.5).toFixed(1), // 0.5-2.5 MB/s
            disk: Math.floor(Math.random() * 100) + 80 // 80-180 MB/s
        },
        
        // Model Metrics
        modelMetrics: {
            watsonx: {
                requests: Math.floor(Math.random() * 500) + 1000,
                p99Latency: Math.floor(Math.random() * 100) + 250,
                cost: 0.005,
                speed: 145,
                trust: 95,
                uptime: 99.9
            },
            groq: {
                requests: Math.floor(Math.random() * 400) + 700,
                p99Latency: Math.floor(Math.random() * 50) + 70,
                cost: 0.003,
                speed: 42,
                trust: 75,
                uptime: 99.7
            },
            ollama: {
                requests: Math.floor(Math.random() * 300) + 300,
                p99Latency: Math.floor(Math.random() * 150) + 450,
                cost: 0,
                speed: 320,
                trust: 100,
                uptime: 100
            }
        },
        
        // Analytics Data
        analytics: {
            weeklyCompletion: generateWeeklyData(),
            modelDistribution: {
                watsonx: 52,
                groq: 30,
                ollama: 18
            },
            costTrend: generateCostTrend(),
            roi: {
                value: 3.4,
                accuracy: 94,
                costSavings: 78,
                latency: 88
            }
        }
    };
}

function generateActivities() {
    const activities = [
        {
            type: 'success',
            title: 'Triage completed for WS-{id}',
            time: '{time} ago',
            icon: 'check'
        },
        {
            type: 'info',
            title: 'Model switched to {model}',
            time: '{time} ago',
            icon: 'info'
        },
        {
            type: 'warning',
            title: 'Human approval checkpoint triggered',
            time: '{time} ago',
            icon: 'alert'
        },
        {
            type: 'success',
            title: 'Workflow automation executed',
            time: '{time} ago',
            icon: 'check'
        },
        {
            type: 'info',
            title: 'Performance optimization applied',
            time: '{time} ago',
            icon: 'info'
        }
    ];
    
    const models = ['IBM Bob (watsonx.ai)', 'Groq', 'Ollama'];
    const times = ['1 minute', '3 minutes', '7 minutes', '12 minutes', '18 minutes'];
    
    return activities.slice(0, 5).map((activity, index) => ({
        ...activity,
        title: activity.title
            .replace('{id}', String(Math.floor(Math.random() * 100) + 1).padStart(3, '0'))
            .replace('{model}', models[Math.floor(Math.random() * models.length)]),
        time: times[index] + ' ago'
    }));
}

function generateWeeklyData() {
    return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [
            85 + Math.random() * 10,
            88 + Math.random() * 10,
            75 + Math.random() * 10,
            92 + Math.random() * 8,
            85 + Math.random() * 10,
            60 + Math.random() * 15,
            40 + Math.random() * 15
        ]
    };
}

function generateCostTrend() {
    const baseValue = 0.003;
    return Array.from({ length: 7 }, (_, i) => {
        return (baseValue * (1 - (i * 0.05) + Math.random() * 0.02)).toFixed(4);
    });
}

// ===== MCP Knowledge Base Data =====
function getMCPData() {
    return {
        knowledgeBase: {
            docs: Math.floor(Math.random() * 500) + 2500,
            lastUpdated: 'Today'
        },
        runbooks: {
            workflows: Math.floor(Math.random() * 50) + 140,
            lastUpdated: '2 hours ago'
        },
        incidents: {
            resolved: Math.floor(Math.random() * 500) + 4000,
            lastUpdated: '15 minutes ago'
        }
    };
}

// ===== Export =====
window.DashboardData = {
    generate: generateRealisticData,
    getMCP: getMCPData
};

// Made with Bob
