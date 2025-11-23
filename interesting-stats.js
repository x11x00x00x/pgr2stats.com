// API base URL
const API_BASE_URL = 'https://api2.pgr2stats.com/api2';

// State management
let chart = null;
let currentChartType = '24hour';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupChartButtons();
    loadChart(currentChartType);
});

// Setup chart button listeners
function setupChartButtons() {
    const buttons = document.querySelectorAll('.chart-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Get the chart type
            const chartType = btn.getAttribute('data-chart');
            currentChartType = chartType;
            
            // Load the chart
            loadChart(chartType);
        });
    });
}


// Show/hide loading
function showLoading(chartType) {
    document.getElementById('loadingContainer').style.display = 'flex';
    document.getElementById('chartContainer').style.display = 'none';
    updateProgress(0);
    
    // Show loading note for charts that take time
    const loadingNote = document.getElementById('loadingNote');
    if (loadingNote) {
        if (chartType === '24hour' || chartType === '7day') {
            loadingNote.textContent = 'Note: It takes around 1 minute to load this chart...';
            loadingNote.style.display = 'block';
        } else if (chartType === 'avgkudos') {
            loadingNote.textContent = 'Loading average kudos per race data...';
            loadingNote.style.display = 'block';
        } else if (chartType === 'streak') {
            loadingNote.textContent = 'Note: It takes around 1 minute to load this chart...';
            loadingNote.style.display = 'block';
        } else {
            loadingNote.style.display = 'none';
        }
    }
}

function hideLoading() {
    document.getElementById('loadingContainer').style.display = 'none';
    document.getElementById('chartContainer').style.display = 'block';
}

// Update progress bar
let lastProgress = 0;
let slowProgress = 0;
let progressTimer = null;

function updateProgress(percent) {
    const progressBar = document.getElementById('loadingProgress');
    if (!progressBar) return;
    
    const actualPercent = Math.min(100, Math.max(0, percent));
    lastProgress = actualPercent;
    
    if (actualPercent > slowProgress) {
        slowProgress = actualPercent;
    }
    
    progressBar.style.width = slowProgress + '%';
    
    if (!progressTimer && slowProgress < 99) {
        progressTimer = setInterval(() => {
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            if (currentWidth < 99) {
                slowProgress = Math.min(99, currentWidth + 0.15);
                progressBar.style.width = slowProgress + '%';
            }
        }, 50);
    }
}

// Load chart based on type
async function loadChart(chartType) {
    showLoading(chartType);
    
    try {
        updateProgress(10);
        
        if (chartType === '24hour') {
            await load24HourKudosChart();
        } else if (chartType === '7day') {
            await load7DayKudosChart();
        } else if (chartType === 'avgkudos') {
            await loadAvgKudosPerRaceChart();
        } else if (chartType === 'streak') {
            await loadLongestStreakChart();
        }
        // Add more chart types here as needed
        
        hideLoading();
    } catch (error) {
        console.error('Failed to load chart:', error);
        hideLoading();
    }
}

// Load 24-hour kudos record chart
async function load24HourKudosChart() {
    try {
        updateProgress(20);
        
        // Fetch pre-calculated 24-hour gains from server (much faster!)
        const response = await fetch(`${API_BASE_URL}/xbltotal/24hour-gains?limit=20`);
        if (!response.ok) {
            throw new Error('Failed to fetch 24-hour gains data');
        }
        
        updateProgress(80);
        
        const topGains = await response.json();
        
        updateProgress(100);
        
        // Create chart
        create24HourKudosChart(topGains);
        
    } catch (error) {
        console.error('Error loading 24-hour kudos chart:', error);
        throw error;
    }
}

// Get chart title
function get24HourChartTitle() {
    return 'Top 20 - Most Kudos Gained in a 24-Hour Period';
}

// Load 7-day kudos record chart
async function load7DayKudosChart() {
    try {
        updateProgress(20);
        
        // Fetch pre-calculated 7-day gains from server (much faster!)
        const response = await fetch(`${API_BASE_URL}/xbltotal/7day-gains?limit=20`);
        if (!response.ok) {
            throw new Error('Failed to fetch 7-day gains data');
        }
        
        updateProgress(80);
        
        const topGains = await response.json();
        
        updateProgress(100);
        
        // Create chart
        create7DayKudosChart(topGains);
        
    } catch (error) {
        console.error('Error loading 7-day kudos chart:', error);
        throw error;
    }
}

// Get chart title for 7-day
function get7DayChartTitle() {
    return 'Top 20 - Most Kudos Gained in a 7-Day Period';
}

// Create 7-day kudos chart
function create7DayKudosChart(data) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    const labels = data.map(item => item.userName || 'Unknown');
    const gains = data.map(item => item.gain || 0);
    const dates = data.map(item => {
        if (!item.date) return 'Unknown';
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    });
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Kudos Gained in 7 Days',
                data: gains,
                backgroundColor: 'rgba(236, 72, 153, 0.6)',
                borderColor: 'rgba(236, 72, 153, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#e0e0e0'
                    }
                },
                title: {
                    display: true,
                    text: get7DayChartTitle(),
                    color: '#e0e0e0',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            return `Date: ${dates[index]}`;
                        },
                        label: function(context) {
                            return `Kudos: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Player',
                        color: '#b0b0b0'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0',
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Kudos Gained',
                        color: '#b0b0b0'
                    }
                }
            }
        }
    });
}

// Create 24-hour kudos chart
function create24HourKudosChart(data) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    const labels = data.map(item => item.userName || 'Unknown');
    const gains = data.map(item => item.gain || 0);
    const dates = data.map(item => {
        if (!item.date) return 'Unknown';
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    });
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Kudos Gained in 24 Hours',
                data: gains,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#e0e0e0'
                    }
                },
                title: {
                    display: true,
                    text: get24HourChartTitle(),
                    color: '#e0e0e0',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            return `Date: ${dates[index]}`;
                        },
                        label: function(context) {
                            return `Kudos: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Player',
                        color: '#b0b0b0'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0',
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Kudos Gained',
                        color: '#b0b0b0'
                    }
                }
            }
        }
    });
}

// Load average kudos per race chart
async function loadAvgKudosPerRaceChart() {
    try {
        updateProgress(20);
        
        // Fetch pre-calculated average kudos per race from server
        const response = await fetch(`${API_BASE_URL}/xbltotal/avg-kudos-per-race?limit=20`);
        if (!response.ok) {
            throw new Error('Failed to fetch average kudos per race data');
        }
        
        updateProgress(80);
        
        const data = await response.json();
        
        updateProgress(100);
        
        // Create chart
        createAvgKudosPerRaceChart(data);
        
    } catch (error) {
        console.error('Error loading average kudos per race chart:', error);
        throw error;
    }
}

// Create average kudos per race chart
function createAvgKudosPerRaceChart(data) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    const labels = data.map(item => item.userName || 'Unknown');
    const avgKudos = data.map(item => item.avgKudos || 0);
    const totalKudos = data.map(item => item.totalKudos || 0);
    const totalRaces = data.map(item => item.totalRaces || 0);
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Kudos Per Race',
                data: avgKudos,
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#e0e0e0'
                    }
                },
                title: {
                    display: true,
                    text: 'Top 20 - Average Kudos Per Race',
                    color: '#e0e0e0',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const avg = avgKudos[index].toFixed(2);
                            const kudos = totalKudos[index].toLocaleString();
                            const races = totalRaces[index].toLocaleString();
                            return [
                                `Avg: ${avg} kudos/race`,
                                `Total: ${kudos} kudos`,
                                `Races: ${races}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Player',
                        color: '#b0b0b0'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0',
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Average Kudos Per Race',
                        color: '#b0b0b0'
                    }
                }
            }
        }
    });
}

// Load longest streak chart
async function loadLongestStreakChart() {
    try {
        updateProgress(20);
        
        // Fetch pre-calculated longest streak from server
        const response = await fetch(`${API_BASE_URL}/xbltotal/longest-streak?limit=20`);
        if (!response.ok) {
            throw new Error('Failed to fetch longest streak data');
        }
        
        updateProgress(80);
        
        const data = await response.json();
        
        updateProgress(100);
        
        // Create chart
        createLongestStreakChart(data);
        
    } catch (error) {
        console.error('Error loading longest streak chart:', error);
        throw error;
    }
}

// Create longest streak chart
function createLongestStreakChart(data) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    const labels = data.map(item => item.userName || 'Unknown');
    const streaks = data.map(item => item.streak || 0);
    const startDates = data.map(item => {
        if (!item.startDate) return 'Unknown';
        const date = new Date(item.startDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    });
    const endDates = data.map(item => {
        if (!item.endDate) return 'Unknown';
        const date = new Date(item.endDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    });
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Consecutive Days with Kudos Gain',
                data: streaks,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#e0e0e0'
                    }
                },
                title: {
                    display: true,
                    text: 'Top 20 - Longest Streak of Consecutive Days with Kudos Gains',
                    color: '#e0e0e0',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const days = streaks[index];
                            return [
                                `Streak: ${days} day${days !== 1 ? 's' : ''}`,
                                `From: ${startDates[index]}`,
                                `To: ${endDates[index]}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Player',
                        color: '#b0b0b0'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0',
                        stepSize: 1
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Consecutive Days',
                        color: '#b0b0b0'
                    }
                }
            }
        }
    });
}

