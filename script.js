// DOM Elements
const carbonForm = document.getElementById('carbonForm');
const totalEmissionEl = document.getElementById('totalEmission');
const ecoScoreEl = document.getElementById('ecoScore');
const ledIndicator = document.getElementById('ledIndicator');
const ledLabel = document.getElementById('ledLabel');
const ratingStars = document.getElementById('ratingStars');
const ratingText = document.getElementById('ratingText');
const suggestionsEl = document.getElementById('suggestions');
const aiMessages = document.getElementById('aiMessages');
const typingIndicator = document.getElementById('typingIndicator');
const historyListEl = document.getElementById('historyList');
const downloadReportBtn = document.getElementById('downloadReport');
const loadingEl = document.getElementById('loading');
const calculateBtn = document.getElementById('calculateBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const realTimeClock = document.getElementById('realTimeClock');
const emissionSaved = document.getElementById('emissionSaved');
const savedAmount = document.getElementById('savedAmount');

// Emission factors
const emissionFactors = {
    car: 0.21,
    bike: 0.1,
    bus: 0.05,
    cycle: 0,
    electricity: 0.5,
    waste: 0.3,
    water: 0.001
};

// Charts
let pieChart;
let barChart;
let lineChart;

// Global variables
let isDarkMode = false;
let currentEmission = 0;
let currentScore = 100;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initCharts();
    loadHistory();
    setupNavigation();
    setupDarkMode();
    setupRealTimeClock();
    setupScrollAnimations();
    animateHeroStats();
    updateEmissionSaved();
});

// Particles Background
function initParticles() {
    const particlesBg = document.getElementById('particles-bg');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesBg.appendChild(particle);
    }
}

// Navigation
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Dark Mode
function setupDarkMode() {
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Load saved preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️';
    }
}

// Real-time Clock
function setupRealTimeClock() {
    function updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();
        document.getElementById('currentTime').textContent = time;
        document.getElementById('currentDate').textContent = date;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Animated Counters
function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Hero Stats Animation
function animateHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateCounter(stat, target, 3000);
    });
}

// Eco Stats Animation
function animateEcoStats() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateCounter(stat, target, 2000);
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                if (entry.target.classList.contains('about-visual')) {
                    animateEcoStats();
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.feature-card, .about-visual, .contact-content').forEach(el => {
        observer.observe(el);
    });
}

// Initialize Charts
function initCharts() {
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const barCtx = document.getElementById('barChart').getContext('2d');
    const lineCtx = document.getElementById('lineChart').getContext('2d');

    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Transportation', 'Electricity', 'Waste', 'Water'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: [
                    '#4ade80',
                    '#22c55e',
                    '#16a34a',
                    '#15803d'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'CO₂ Emissions (kg)',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: '#4ade80',
                borderRadius: 5,
                hoverBackgroundColor: '#22c55e'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e0e0e0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e0e0e0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });

    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Eco Performance',
                data: [65, 70, 75, 80, 85, 90],
                borderColor: '#4ade80',
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4ade80',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e0e0e0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e0e0e0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            animation: {
                duration: 3000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Calculate Carbon Footprint
carbonForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Show loading
    loadingEl.style.display = 'flex';
    calculateBtn.disabled = true;

    // Simulate calculation delay
    setTimeout(() => {
        calculateFootprint();
        loadingEl.style.display = 'none';
        calculateBtn.disabled = false;
    }, 3000);
});

function calculateFootprint() {
    const transportSelect = document.getElementById('transportSelect');
    const transport = transportSelect.value;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const waste = parseFloat(document.getElementById('waste').value) || 0;
    const water = parseFloat(document.getElementById('water').value) || 0;

    // Calculate emissions
    const transportEmission = emissionFactors[transport] * distance;
    const electricityEmission = emissionFactors.electricity * electricity;
    const wasteEmission = emissionFactors.waste * waste;
    const waterEmission = emissionFactors.water * water;

    const totalEmission = transportEmission + electricityEmission + wasteEmission + waterEmission;
    currentEmission = totalEmission;

    // Calculate eco score (100 - emission percentage, min 0)
    const maxEmission = 50; // Arbitrary max for scoring
    const ecoScore = Math.max(0, Math.min(100, 100 - (totalEmission / maxEmission) * 100));
    currentScore = ecoScore;

    // Update UI
    animateCounter(totalEmissionEl, totalEmission.toFixed(2));
    animateEcoScore(ecoScore);
    updateLEDIndicator(totalEmission);
    updateRating(ecoScore);

    // Update charts
    updateCharts(transportEmission, electricityEmission, wasteEmission, waterEmission);

    // Show AI suggestions
    showAISuggestions(transport, totalEmission, ecoScore);

    // Save to history
    saveToHistory(totalEmission, ecoScore);

    // Update emission saved
    updateEmissionSaved();

    // Scroll to dashboard
    scrollToSection('dashboard');
}

function animateEcoScore(score) {
    const progressRing = document.querySelector('.progress-ring-circle');
    const circumference = 2 * Math.PI * 50; // radius = 50
    const offset = circumference - (score / 100) * circumference;

    progressRing.style.strokeDasharray = circumference;
    progressRing.style.strokeDashoffset = circumference;

    setTimeout(() => {
        progressRing.style.strokeDashoffset = offset;
        animateCounter(ecoScoreEl, Math.round(score));
    }, 500);
}

function updateLEDIndicator(emission) {
    const led = ledIndicator.querySelector('.led');
    led.className = 'led';

    if (emission < 5) {
        led.classList.add('green');
        ledLabel.textContent = 'Low';
    } else if (emission < 15) {
        led.classList.add('yellow');
        ledLabel.textContent = 'Moderate';
    } else {
        led.classList.add('red');
        ledLabel.textContent = 'High';
    }
}

function updateRating(score) {
    const stars = ratingStars.querySelectorAll('.star');
    const rating = Math.round(score / 20); // 0-5 stars

    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });

    const ratingTexts = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    ratingText.textContent = ratingTexts[rating - 1] || 'Poor';
}

function updateCharts(transport, electricity, waste, water) {
    pieChart.data.datasets[0].data = [transport, electricity, waste, water];
    pieChart.update();

    // Update bar chart with random weekly data
    const weeklyData = Array.from({length: 7}, () => Math.random() * 20);
    barChart.data.datasets[0].data = weeklyData;
    barChart.update();

    // Update line chart
    lineChart.update();
}

// AI Suggestions with Typing Effect
function showAISuggestions(transport, emission, score) {
    const suggestions = [];

    if (transport === 'car') {
        suggestions.push('🚗 Consider using PMPML buses in Alandi for reduced emissions.');
        suggestions.push('🤝 Try carpooling with neighbors to share the carbon load.');
    } else if (transport === 'bike') {
        suggestions.push('🚴 Great choice! Biking is excellent for the environment.');
    } else if (transport === 'bus') {
        suggestions.push('🚌 Excellent! Public transport is the way to go in Alandi.');
    } else if (transport === 'cycle') {
        suggestions.push('🚶 Perfect! Walking or cycling produces zero emissions.');
    }

    if (emission > 10) {
        suggestions.push('💡 Consider reducing electricity usage by using LED bulbs and unplugging devices.');
        suggestions.push('♻️ Try minimizing waste by recycling and composting.');
    }

    if (score > 80) {
        suggestions.push('🌟 Outstanding! You\'re making great strides for the environment.');
        suggestions.push('📢 Share your eco-friendly habits with friends and family in Alandi.');
    } else if (score > 60) {
        suggestions.push('👍 Good job! Small changes can make a big difference.');
    } else {
        suggestions.push('🌱 Every journey starts with a single step. Keep working towards sustainability!');
    }

    suggestions.push('🎭 During Alandi festivals, consider walking to reduce pilgrimage emissions.');

    // Clear previous messages
    aiMessages.innerHTML = '';

    // Show typing indicator
    typingIndicator.style.display = 'flex';

    // Simulate AI thinking
    setTimeout(() => {
        typingIndicator.style.display = 'none';

        // Add messages with typing effect
        suggestions.forEach((suggestion, index) => {
            setTimeout(() => {
                addAIMessage(suggestion);
            }, index * 1500);
        });

        suggestionsEl.style.display = 'block';
    }, 2000);
}

function addAIMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.textContent = text;
    aiMessages.appendChild(messageDiv);
}

// Emission Saved Today
function updateEmissionSaved() {
    const saved = Math.max(0, 25 - currentEmission); // Assume 25kg is the daily goal
    animateCounter(savedAmount, saved.toFixed(1));
}

// Local Storage
function saveToHistory(emission, score) {
    const history = JSON.parse(localStorage.getItem('carbonHistory') || '[]');
    const entry = {
        date: new Date().toLocaleDateString(),
        emission: emission.toFixed(2),
        score: Math.round(score)
    };

    history.unshift(entry);
    if (history.length > 10) history.pop(); // Keep only last 10 entries

    localStorage.setItem('carbonHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('carbonHistory') || '[]');
    historyListEl.innerHTML = '';

    if (history.length === 0) {
        historyListEl.innerHTML = '<p>No calculations yet. Start by calculating your carbon footprint!</p>';
        return;
    }

    history.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <strong>${entry.date}</strong><br>
            Emission: ${entry.emission} kg | Eco Score: ${entry.score}
        `;
        historyListEl.appendChild(div);
    });
}

// PDF Download
downloadReportBtn.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Smart Alandi Carbon Intelligence System', 20, 30);
    doc.text('Carbon Footprint Report', 20, 50);

    const history = JSON.parse(localStorage.getItem('carbonHistory') || '[]');
    let y = 80;

    if (history.length > 0) {
        doc.setFontSize(14);
        doc.text('Recent Calculations:', 20, y);
        y += 20;

        history.forEach((entry, index) => {
            if (y > 250) {
                doc.addPage();
                y = 30;
            }
            doc.setFontSize(12);
            doc.text(`${entry.date}: ${entry.emission} kg CO₂, Eco Score: ${entry.score}`, 20, y);
            y += 15;
        });
    } else {
        doc.text('No calculations found.', 20, y);
    }

    doc.save('carbon-report.pdf');
});

// Transport dropdown functionality
document.getElementById('transport').addEventListener('click', function() {
    const select = document.getElementById('transportSelect');
    select.style.display = 'block';
    this.style.display = 'none';
    select.focus();
});

document.getElementById('transportSelect').addEventListener('change', function() {
    const input = document.getElementById('transport');
    input.value = this.options[this.selectedIndex].text;
    input.style.display = 'block';
    this.style.display = 'none';
});

document.getElementById('transportSelect').addEventListener('blur', function() {
    const input = document.getElementById('transport');
    input.style.display = 'block';
    this.style.display = 'none';
});

// Add some demo data on load
window.addEventListener('load', function() {
    // Simulate some initial data
    setTimeout(() => {
        if (!localStorage.getItem('carbonHistory')) {
            const demoData = [
                { date: '2024-01-01', emission: '12.50', score: 75 },
                { date: '2024-01-02', emission: '8.30', score: 83 },
                { date: '2024-01-03', emission: '15.20', score: 70 }
            ];
            localStorage.setItem('carbonHistory', JSON.stringify(demoData));
            loadHistory();
        }
    }, 1000);
});