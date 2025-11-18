// API base URL - adjust if needed
const API_BASE_URL = 'https://api2.pgr2stats.com/api2';

// State management
let chart = null;
let sortedDates = []; // Store sorted dates for tooltip calculations
let allData = {}; // Store all data for filtering
let currentDateRange = 'all'; // Current date range filter

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    setupDateRangeListeners();
    loadChartData();
});

// Setup date range button listeners
function setupDateRangeListeners() {
    const buttons = document.querySelectorAll('.date-range-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Get the range value
            const range = btn.getAttribute('data-range');
            currentDateRange = range;
            // Filter and update chart
            filterAndUpdateChart();
        });
    });
}

// Show/hide loading indicator
function showLoading() {
    isLoading = true;
    lastProgress = 0;
    slowProgress = 0;
    document.getElementById('loadingContainer').style.display = 'flex';
    document.getElementById('chartContainer').style.display = 'none';
    // Start continuous movement immediately
    updateProgress(0);
}

function hideLoading() {
    isLoading = false;
    // Clear progress timer
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
    lastProgress = 0;
    slowProgress = 0;
    document.getElementById('loadingContainer').style.display = 'none';
    document.getElementById('chartContainer').style.display = 'block';
}

// Initialize Chart.js
function initializeChart() {
    const ctx = document.getElementById('kudosChart').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#e0e0e0',
                        font: {
                            size: 12
                        },
                        usePointStyle: true,
                        padding: 15
                    }
                },
                title: {
                    display: true,
                    text: 'Top 10 Kudos Over Time',
                    color: '#e0e0e0',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const dataset = context.dataset;
                            const dataIndex = context.dataIndex;
                            const currentValue = context.parsed.y;
                            const date = sortedDates[dataIndex];
                            
                            if (currentValue === null || !date) {
                                return dataset.userName + ': No data';
                            }
                            
                            // For 7-day and 30-day ranges, show gain and total
                            if (currentDateRange === '7' || currentDateRange === '30') {
                                const originalKudos = dataset.originalKudosMap && dataset.originalKudosMap.get(date);
                                if (originalKudos !== undefined) {
                                    // Show: "UserName: +Gain (Total: X)"
                                    // currentValue is the gain shown on chart
                                    const gainStr = currentValue >= 0 
                                        ? `+${currentValue.toLocaleString()}` 
                                        : currentValue.toLocaleString();
                                    return `${dataset.userName}: ${gainStr} (Total: ${originalKudos.toLocaleString()})`;
                                }
                                // Fallback if originalKudos not found
                                const gainStr = currentValue >= 0 
                                    ? `+${currentValue.toLocaleString()}` 
                                    : currentValue.toLocaleString();
                                return `${dataset.userName}: ${gainStr}`;
                            }
                            
                            // For "all time", show current value and change from previous
                            // Find the previous non-null value
                            let previousValue = null;
                            for (let i = dataIndex - 1; i >= 0; i--) {
                                const prevValue = dataset.data[i];
                                if (prevValue !== null && prevValue !== undefined) {
                                    previousValue = prevValue;
                                    break;
                                }
                            }
                            
                            // Format the label
                            let label = dataset.userName + ': ' + currentValue.toLocaleString();
                            
                            if (previousValue !== null) {
                                const change = currentValue - previousValue;
                                const changeStr = change >= 0 
                                    ? '+' + change.toLocaleString() 
                                    : change.toLocaleString();
                                label += ' (' + changeStr + ')';
                            }
                            
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Date',
                        color: '#b0b0b0'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: '#333'
                    },
                    title: {
                        display: true,
                        text: 'Kudos',
                        color: '#b0b0b0'
                    }
                }
            }
        }
    });
}

// Update progress bar with slow movement when stuck
let lastProgress = 0;
let slowProgress = 0;
let progressTimer = null;
let isLoading = false;

function updateProgress(percent) {
    const progressBar = document.getElementById('loadingProgress');
    if (!progressBar) return;
    
    // Set the actual progress
    const actualPercent = Math.min(100, Math.max(0, percent));
    lastProgress = actualPercent;
    
    // If we got new progress, update slowProgress to match (but don't go backwards)
    if (actualPercent > slowProgress) {
        slowProgress = actualPercent;
    }
    
    // Always update the bar to the slow progress
    progressBar.style.width = slowProgress + '%';
    
    // Start continuous movement if not already running
    if (!progressTimer && isLoading && slowProgress < 99) {
        progressTimer = setInterval(() => {
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            // Keep moving forward continuously up to 99%
            if (currentWidth < 99) {
                slowProgress = Math.min(99, currentWidth + 0.15);
                progressBar.style.width = slowProgress + '%';
            }
        }, 50); // Update every 50ms for smoother movement
    }
}

// Load chart data from API with progress tracking
async function loadChartData() {
    showLoading();
    updateProgress(0);
    
    try {
        // Simulate initial progress
        updateProgress(10);
        
        // Use XMLHttpRequest for progress tracking
        const data = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = 10 + (e.loaded / e.total) * 80; // 10-90%
                    updateProgress(percentComplete);
                }
            });
            
            xhr.addEventListener('load', () => {
                updateProgress(90);
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        updateProgress(100);
                        setTimeout(() => resolve(data), 100);
                    } catch (e) {
                        reject(new Error('Failed to parse response'));
                    }
                } else {
                    reject(new Error(`HTTP error! status: ${xhr.status}`));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Network error'));
            });
            
            xhr.open('GET', `${API_BASE_URL}/xbltotal/chart`);
            xhr.send();
        });
        
        if (!data || Object.keys(data).length === 0) {
            console.warn('No chart data received');
            hideLoading();
            return;
        }
        
        // Store all data for filtering
        allData = data;
        filterAndUpdateChart();
        hideLoading();
    } catch (error) {
        console.error('Failed to load chart data:', error);
        hideLoading();
    }
}

// Filter data based on date range and update chart
function filterAndUpdateChart() {
    if (!allData || Object.keys(allData).length === 0) return;
    
    let filteredData = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate cutoff date based on range
    let cutoffDate = null;
    if (currentDateRange === '7') {
        cutoffDate = new Date(today);
        cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else if (currentDateRange === '30') {
        cutoffDate = new Date(today);
        cutoffDate.setDate(cutoffDate.getDate() - 30);
    }
    
    // Filter data for each user
    Object.keys(allData).forEach(userName => {
        const userData = allData[userName];
        if (currentDateRange === 'all') {
            // No filtering needed
            filteredData[userName] = userData;
        } else {
            // Filter by date range
            filteredData[userName] = userData.filter(point => {
                if (!point.date) return false;
                const pointDate = new Date(point.date);
                pointDate.setHours(0, 0, 0, 0);
                return pointDate >= cutoffDate;
            });
        }
    });
    
    updateChart(filteredData);
}

// Update chart with new data
function updateChart(data) {
    if (!chart || !data) return;
    
    // Get all unique dates across all users
    const allDates = new Set();
    Object.values(data).forEach(userData => {
        userData.forEach(point => {
            if (point.date) {
                allDates.add(point.date);
            }
        });
    });
    
    // Sort dates and store globally for tooltip access
    sortedDates = Array.from(allDates).sort();
    
    // Calculate max kudos/gains for each user and sort users
    const usersWithMaxKudos = Object.keys(data).map(userName => {
        const userData = data[userName];
        
        // For 7-day and 30-day ranges, sort by total gains, not absolute kudos
        if (currentDateRange === '7' || currentDateRange === '30') {
            const sortedUserData = userData
                .filter(point => point.date && point.kudos !== undefined)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            if (sortedUserData.length >= 2) {
                const startKudos = sortedUserData[0].kudos;
                const endKudos = sortedUserData[sortedUserData.length - 1].kudos;
                const totalGain = endKudos - startKudos;
                return { userName, maxKudos: totalGain, userData };
            } else if (sortedUserData.length === 1) {
                return { userName, maxKudos: 0, userData };
            }
        }
        
        // For "all time", sort by max kudos
        const maxKudos = Math.max(...userData.map(point => point.kudos || 0));
        return { userName, maxKudos, userData };
    });
    
    // Sort by max kudos/gains descending (highest first)
    usersWithMaxKudos.sort((a, b) => b.maxKudos - a.maxKudos);
    
    // Generate colors for each user
    const colors = [
        '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
        '#00BCD4', '#FFEB3B', '#E91E63', '#3F51B5', '#FF5722'
    ];
    
    // Create datasets for each user in sorted order
    const datasets = usersWithMaxKudos.map((user, index) => {
        const { userName, userData } = user;
        
        // Get sorted user data points by date
        const sortedUserData = userData
            .filter(point => point.date && point.kudos !== undefined)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // For 7-day and 30-day ranges, calculate starting kudos to show gains
        let startKudos = 0;
        let label = userName;
        
        if ((currentDateRange === '7' || currentDateRange === '30') && sortedUserData.length > 0) {
            // Use the first data point as the baseline (starting kudos)
            startKudos = sortedUserData[0].kudos;
            
            // Calculate total gain for the label
            if (sortedUserData.length >= 2) {
                const endKudos = sortedUserData[sortedUserData.length - 1].kudos;
                const change = endKudos - startKudos;
                const changeStr = change > 0 
                    ? `+${change.toLocaleString()}` 
                    : change.toLocaleString();
                label = `${userName} (${changeStr})`;
            } else if (sortedUserData.length === 1) {
                // Only one data point means no change
                label = `${userName} (0)`;
            }
        }
        
        // Create maps for both chart values and original kudos (for tooltip)
        const dataMap = new Map(); // Chart values (gains or absolute)
        const originalKudosMap = new Map(); // Original kudos values for tooltip
        
        sortedUserData.forEach(point => {
            if (point.date && point.kudos !== undefined) {
                const originalKudos = point.kudos;
                originalKudosMap.set(point.date, originalKudos);
                
                // For 7-day and 30-day ranges, show gains from start (subtract starting kudos)
                // For "all", show absolute values
                const kudosValue = (currentDateRange === '7' || currentDateRange === '30')
                    ? originalKudos - startKudos
                    : originalKudos;
                dataMap.set(point.date, kudosValue);
            }
        });
        
        // Create data points for all dates (null if no data for that date)
        const chartData = sortedDates.map(date => {
            return dataMap.has(date) ? dataMap.get(date) : null;
        });
        
        return {
            label: label,
            data: chartData,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '40',
            fill: false,
            tension: 0.1,
            pointRadius: 3,
            pointHoverRadius: 5,
            // Store original kudos and startKudos for tooltip
            originalKudosMap: originalKudosMap,
            startKudos: startKudos,
            userName: userName
        };
    });
    
    // Update chart title based on date range
    let titleText = 'Top 10 Kudos Over Time';
    if (currentDateRange === '7') {
        titleText = 'Top 10 Kudos - Last 7 Days';
    } else if (currentDateRange === '30') {
        titleText = 'Top 10 Kudos - Last 30 Days';
    }
    chart.options.plugins.title.text = titleText;
    
    // Update chart
    chart.data.labels = sortedDates;
    chart.data.datasets = datasets;
    chart.update();
}
