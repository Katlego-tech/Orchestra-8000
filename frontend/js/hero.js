/**
 * Orchestra 8000 - Hero/Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    initPageTransition();
    initTriageDemo();
});

function initTriageDemo() {
    const runBtn = document.getElementById('runTriageBtn');
    const taskInput = document.getElementById('demoTask');
    const resultDiv = document.getElementById('triageResult');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultContent = document.getElementById('resultContent');
    
    if (!runBtn || !taskInput) return;
    
    runBtn.addEventListener('click', async () => {
        const task = taskInput.value.trim();
        if (!task) {
            alert('Please enter a task to analyze');
            return;
        }
        
        const priority = document.querySelector('input[name="priority"]:checked').value;
        
        // Show result div with loading
        resultDiv.style.display = 'block';
        loadingSpinner.style.display = 'flex';
        resultContent.style.display = 'none';
        
        // Simulate triage analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Determine model based on priority and task
        const triageResult = performTriage(task, priority);
        
        // Hide loading, show result
        loadingSpinner.style.display = 'none';
        resultContent.style.display = 'block';
        
        // Update UI with result
        displayTriageResult(triageResult);
    });
}

function performTriage(task, priority) {
    const taskLower = task.toLowerCase();
    const isComplex = taskLower.includes('analyze') || taskLower.includes('complex') ||
                      taskLower.includes('detailed') || taskLower.includes('research');
    const isCode = taskLower.includes('code') || taskLower.includes('function') ||
                   taskLower.includes('program') || taskLower.includes('script');
    const isSimple = taskLower.includes('summarize') || taskLower.includes('simple') ||
                     taskLower.includes('quick') || taskLower.includes('brief');
    
    let selectedModel = {
        name: 'IBM watsonx',
        icon: '🤖',
        reason: '',
        cost: '$0.005',
        time: '2.5s',
        confidence: '95%'
    };
    
    if (priority === 'cost') {
        if (isSimple) {
            selectedModel = {
                name: 'Ollama',
                icon: '🦙',
                reason: 'Selected for cost efficiency on simple tasks',
                cost: '$0.001',
                time: '1.8s',
                confidence: '92%'
            };
        } else {
            selectedModel = {
                name: 'IBM watsonx',
                icon: '🤖',
                reason: 'Best balance of cost and accuracy for this task',
                cost: '$0.005',
                time: '2.5s',
                confidence: '95%'
            };
        }
    } else if (priority === 'speed') {
        selectedModel = {
            name: 'Groq',
            icon: '⚡',
            reason: 'Ultra-fast inference with LPU technology',
            cost: '$0.008',
            time: '0.8s',
            confidence: '93%'
        };
    } else if (priority === 'accuracy') {
        if (isComplex || isCode) {
            selectedModel = {
                name: 'IBM watsonx',
                icon: '🤖',
                reason: 'Enterprise-grade accuracy for complex tasks',
                cost: '$0.005',
                time: '2.5s',
                confidence: '98%'
            };
        } else {
            selectedModel = {
                name: 'IBM watsonx',
                icon: '🤖',
                reason: 'Highest accuracy and reliability',
                cost: '$0.005',
                time: '2.5s',
                confidence: '97%'
            };
        }
    }
    
    return selectedModel;
}

function displayTriageResult(result) {
    document.getElementById('selectedModelIcon').textContent = result.icon;
    document.getElementById('selectedModelName').textContent = result.name;
    document.getElementById('selectedModelReason').textContent = result.reason;
    document.getElementById('metricCost').textContent = result.cost;
    document.getElementById('metricTime').textContent = result.time;
    document.getElementById('metricConfidence').textContent = result.confidence;
}

function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.feature-card, .benefit-item, .metric-row').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initPageTransition() {
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

console.log('%c Orchestra 8000 Hero', 'color: #0F62FE; font-size: 14px; font-weight: bold;');
