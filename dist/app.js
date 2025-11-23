// API base URL - adjust if needed
const API_BASE_URL = 'https://api2.pgr2stats.com/api2';

// State management
let chart = null;
let sortedDates = []; // Store sorted dates for tooltip calculations
let allData = {}; // Store all data for filtering
let currentDateRange = 'all'; // Current date range filter
let currentTopN = 10; // Current top N selection (10 or 25)
let autoRefreshInterval = null; // Auto-refresh interval
let retryCount = 0; // Track retry attempts
const MAX_RETRIES = 8; // Maximum number of retries (allows up to ~20 seconds for cache generation)
const RETRY_DELAY_MS = 2500; // Delay between retries (2.5 seconds)

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    setupDateRangeListeners();
    setupTopNListener();
    setupRefreshButton();
    setupMobileMenu();
    loadChartData();
    loadLastSyncTime();
    startAutoRefresh();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
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
            // Sync mobile menu
            const mobileMenuItems = document.querySelectorAll('.mobile-menu-item[data-range]');
            mobileMenuItems.forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-range') === range);
            });
            // Filter and update chart
            filterAndUpdateChart();
        });
    });
}

// Setup top N button listener
function setupTopNListener() {
    const topNBtn = document.getElementById('topNBtn');
    if (topNBtn) {
        topNBtn.addEventListener('click', () => {
            // Toggle between 10 and 25
            // Button text shows what will happen when clicked (opposite of current state)
            if (currentTopN === 10) {
                currentTopN = 25;
                topNBtn.textContent = 'Show Top 10';
                topNBtn.setAttribute('data-top-n', '25');
            } else {
                currentTopN = 10;
                topNBtn.textContent = 'Show Top 25';
                topNBtn.setAttribute('data-top-n', '10');
            }
            // Sync mobile menu button
            const mobileTopNBtn = document.getElementById('mobileTopNBtn');
            if (mobileTopNBtn) {
                mobileTopNBtn.textContent = topNBtn.textContent;
                mobileTopNBtn.setAttribute('data-top-n', topNBtn.getAttribute('data-top-n'));
            }
            // Reload data from API with new limit
            retryCount = 0; // Reset retry count when changing top N
            loadChartData();
        });
    }
}

// Setup refresh button listener
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            retryCount = 0; // Reset retry count on manual refresh
            loadChartData();
        });
    }
}

// Start auto-refresh every 30 minutes
function startAutoRefresh() {
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Set up auto-refresh every 30 minutes (1800000 ms)
    autoRefreshInterval = setInterval(() => {
        loadChartData();
        loadLastSyncTime();
    }, 30 * 60 * 1000); // 30 minutes
}

// Load last sync time
async function loadLastSyncTime() {
    try {
        const response = await fetch(`${API_BASE_URL}/sync/latest`);
        if (response.ok) {
            const data = await response.json();
            if (data.lastSync) {
                updateLastSyncTime(data.lastSync);
            }
        }
    } catch (error) {
        console.error('Failed to load last sync time:', error);
    }
}

// Update last sync time display
function updateLastSyncTime(syncDateString) {
    const lastSyncElement = document.getElementById('lastSyncTime');
    if (!lastSyncElement || !syncDateString) return;
    
    try {
        const syncDate = new Date(syncDateString);
        const now = new Date();
        const diffMs = now - syncDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        let timeAgo = '';
        if (diffMins < 1) {
            timeAgo = 'just now';
        } else if (diffMins < 60) {
            timeAgo = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            // Show formatted date for older syncs
            timeAgo = syncDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        }
        
        lastSyncElement.textContent = timeAgo;
    } catch (error) {
        console.error('Error formatting sync time:', error);
        lastSyncElement.textContent = 'Unknown';
    }
}

// Setup mobile menu
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const dropdown = document.getElementById('mobileMenuDropdown');
    const mobileTopNBtn = document.getElementById('mobileTopNBtn');
    const mobileRefreshBtn = document.getElementById('mobileRefreshBtn');
    
    if (menuBtn && dropdown) {
        // Toggle dropdown
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Handle date range selection in mobile menu
        dropdown.querySelectorAll('.mobile-menu-item[data-range]').forEach(item => {
            item.addEventListener('click', () => {
                const range = item.getAttribute('data-range');
                currentDateRange = range;
                
                // Update active state
                dropdown.querySelectorAll('.mobile-menu-item[data-range]').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Update desktop buttons
                document.querySelectorAll('.date-range-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-range') === range);
                });
                
                filterAndUpdateChart();
                dropdown.classList.remove('active');
            });
        });
        
        // Handle top N button in mobile menu
        if (mobileTopNBtn) {
            mobileTopNBtn.addEventListener('click', () => {
                if (currentTopN === 10) {
                    currentTopN = 25;
                    mobileTopNBtn.textContent = 'Show Top 10';
                    mobileTopNBtn.setAttribute('data-top-n', '25');
                } else {
                    currentTopN = 10;
                    mobileTopNBtn.textContent = 'Show Top 25';
                    mobileTopNBtn.setAttribute('data-top-n', '10');
                }
                // Update desktop button
                const desktopBtn = document.getElementById('topNBtn');
                if (desktopBtn) {
                    desktopBtn.textContent = mobileTopNBtn.textContent;
                    desktopBtn.setAttribute('data-top-n', mobileTopNBtn.getAttribute('data-top-n'));
                }
                retryCount = 0; // Reset retry count on manual refresh
                loadChartData();
                dropdown.classList.remove('active');
            });
        }
        
        // Handle refresh button in mobile menu
        if (mobileRefreshBtn) {
            mobileRefreshBtn.addEventListener('click', () => {
                loadChartData();
                loadLastSyncTime();
                dropdown.classList.remove('active');
            });
        }
    }
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
                            
                            // For 7-day and 30-day ranges, show gain, total, and daily change
                            if (currentDateRange === '7' || currentDateRange === '30') {
                                const originalKudos = dataset.originalKudosMap && dataset.originalKudosMap.get(date);
                                const dailyChange = dataset.dailyChangeMap && dataset.dailyChangeMap.get(date);
                                
                                if (originalKudos !== undefined) {
                                    // Show: "UserName: +CumulativeGain (Total: X, Daily: +Y)"
                                    // currentValue is the cumulative gain shown on chart
                                    const gainStr = currentValue >= 0 
                                        ? `+${currentValue.toLocaleString()}` 
                                        : currentValue.toLocaleString();
                                    
                                    let label = `${dataset.userName}: ${gainStr} (Total: ${originalKudos.toLocaleString()}`;
                                    
                                    // Add daily change if available
                                    if (dailyChange !== null && dailyChange !== undefined) {
                                        const dailyChangeStr = dailyChange >= 0 
                                            ? `+${dailyChange.toLocaleString()}` 
                                            : dailyChange.toLocaleString();
                                        label += `, Daily: ${dailyChangeStr}`;
                                    }
                                    
                                    label += ')';
                                    return label;
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
                        const response = JSON.parse(xhr.responseText);
                        updateProgress(100);
                        // Handle both old format (just data) and new format (with lastSync)
                        const data = response.data || response;
                        const lastSync = response.lastSync;
                        if (lastSync) {
                            updateLastSyncTime(lastSync);
                        }
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
            
            xhr.open('GET', `${API_BASE_URL}/xbltotal/chart?limit=${currentTopN}`);
            xhr.send();
        });
        
        // Reset retry count on success
        retryCount = 0;
        
        if (!data || Object.keys(data).length === 0) {
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                const delaySeconds = (RETRY_DELAY_MS / 1000).toFixed(1);
                console.warn(`No chart data received, retrying in ${delaySeconds} seconds... (attempt ${retryCount}/${MAX_RETRIES})`);
                // Retry after a delay if no data (cache might be generating)
                // First retry waits a bit longer to give cache time to generate
                const delay = retryCount === 1 ? RETRY_DELAY_MS * 2 : RETRY_DELAY_MS;
                setTimeout(() => {
                    loadChartData();
                }, delay);
                return;
            } else {
                console.error('Max retries reached. Chart data not available.');
                hideLoading();
                // Show empty chart
                allData = {};
                filterAndUpdateChart();
                return;
            }
        }
        
        // Store all data for filtering
        allData = data;
        filterAndUpdateChart();
        hideLoading();
    } catch (error) {
        console.error('Failed to load chart data:', error);
        
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            // Retry on error (might be cache generation in progress)
            const delaySeconds = (RETRY_DELAY_MS / 1000).toFixed(1);
            console.log(`Retrying in ${delaySeconds} seconds... (attempt ${retryCount}/${MAX_RETRIES})`);
            // First retry waits a bit longer to give cache time to generate
            const delay = retryCount === 1 ? RETRY_DELAY_MS * 2 : RETRY_DELAY_MS;
            setTimeout(() => {
                loadChartData();
            }, delay);
        } else {
            console.error('Max retries reached. Unable to load chart data.');
            retryCount = 0; // Reset for next manual refresh
            hideLoading();
            // Show empty chart
            allData = {};
            filterAndUpdateChart();
        }
    }
}

// Helper function to parse date string as local date (not UTC)
function parseLocalDate(dateString) {
    if (!dateString) return null;
    
    // If it's already a Date object, return it
    if (dateString instanceof Date) {
        const localDate = new Date(dateString);
        localDate.setHours(0, 0, 0, 0);
        return localDate;
    }
    
    // Parse date string - handle both ISO format and simple date strings
    // For strings like "2025-01-15", parse as local date components
    const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
        const year = parseInt(dateMatch[1], 10);
        const month = parseInt(dateMatch[2], 10) - 1; // Month is 0-indexed
        const day = parseInt(dateMatch[3], 10);
        const localDate = new Date(year, month, day);
        localDate.setHours(0, 0, 0, 0);
        return localDate;
    }
    
    // Fallback to standard Date parsing
    const parsed = new Date(dateString);
    // If parsed as UTC, convert to local by using local date components
    if (!isNaN(parsed.getTime())) {
        const localDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
        localDate.setHours(0, 0, 0, 0);
        return localDate;
    }
    
    return null;
}

// Filter data based on date range and update chart
function filterAndUpdateChart() {
    if (!allData || Object.keys(allData).length === 0) return;
    
    let filteredData = {};
    // Get today in user's local timezone at midnight
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today.setHours(0, 0, 0, 0);
    
    // Calculate cutoff date based on range (in user's local timezone)
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
            // Filter by date range using local timezone
            filteredData[userName] = userData.filter(point => {
                if (!point.date) return false;
                const pointDate = parseLocalDate(point.date);
                if (!pointDate) return false;
                // Compare dates normalized to local midnight
                return pointDate >= cutoffDate;
            });
        }
    });
    
    updateChart(filteredData);
}

// Update chart with new data
function updateChart(data) {
    if (!chart) return;
    
    // Handle empty data gracefully
    if (!data || Object.keys(data).length === 0) {
        console.warn('No data to display in chart');
        // Show empty chart with message
        chart.data.labels = [];
        chart.data.datasets = [];
        chart.update();
        return;
    }
    
    // Get all unique dates across all users
    const allDates = new Set();
    Object.values(data).forEach(userData => {
        userData.forEach(point => {
            if (point.date) {
                allDates.add(point.date);
            }
        });
    });
    
    // Sort dates using local timezone parsing and store globally for tooltip access
    sortedDates = Array.from(allDates).sort((a, b) => {
        const dateA = parseLocalDate(a);
        const dateB = parseLocalDate(b);
        if (!dateA || !dateB) return 0;
        return dateA - dateB;
    });
    
    // Calculate max kudos/gains for each user and sort users
    const usersWithMaxKudos = Object.keys(data).map(userName => {
        const userData = data[userName];
        
        // For 7-day and 30-day ranges, sort by total gains, not absolute kudos
        if (currentDateRange === '7' || currentDateRange === '30') {
            const sortedUserData = userData
                .filter(point => point.date && point.kudos !== undefined)
                .sort((a, b) => {
                    const dateA = parseLocalDate(a.date);
                    const dateB = parseLocalDate(b.date);
                    if (!dateA || !dateB) return 0;
                    return dateA - dateB;
                });
            
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
    
    // Limit to top N users
    const topUsers = usersWithMaxKudos.slice(0, currentTopN);
    
    // Generate colors for each user (extended for top 25)
    const colors = [
        '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
        '#00BCD4', '#FFEB3B', '#E91E63', '#3F51B5', '#FF5722',
        '#795548', '#607D8B', '#009688', '#CDDC39', '#FFC107',
        '#FF5722', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'
    ];
    
    // Create datasets for each user in sorted order
    const datasets = topUsers.map((user, index) => {
        const { userName, userData } = user;
        
        // Get sorted user data points by date (using local timezone)
        const sortedUserData = userData
            .filter(point => point.date && point.kudos !== undefined)
            .sort((a, b) => {
                const dateA = parseLocalDate(a.date);
                const dateB = parseLocalDate(b.date);
                if (!dateA || !dateB) return 0;
                return dateA - dateB;
            });
        
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
        const dailyChangeMap = new Map(); // Daily change (difference from previous day)
        
        sortedUserData.forEach((point, index) => {
            if (point.date && point.kudos !== undefined) {
                const originalKudos = point.kudos;
                originalKudosMap.set(point.date, originalKudos);
                
                // Calculate daily change (difference from previous day)
                let dailyChange = null;
                if (index > 0) {
                    const previousPoint = sortedUserData[index - 1];
                    if (previousPoint && previousPoint.kudos !== undefined) {
                        dailyChange = originalKudos - previousPoint.kudos;
                    }
                }
                dailyChangeMap.set(point.date, dailyChange);
                
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
            // Store original kudos, daily changes, and startKudos for tooltip
            originalKudosMap: originalKudosMap,
            dailyChangeMap: dailyChangeMap,
            startKudos: startKudos,
            userName: userName
        };
    });
    
    // Update chart title based on date range and top N
    let titleText = `Top ${currentTopN} Kudos Over Time`;
    if (currentDateRange === '7') {
        titleText = `Top ${currentTopN} Kudos - Last 7 Days`;
    } else if (currentDateRange === '30') {
        titleText = `Top ${currentTopN} Kudos - Last 30 Days`;
    }
    chart.options.plugins.title.text = titleText;
    
    // Update chart
    chart.data.labels = sortedDates;
    chart.data.datasets = datasets;
    chart.update();
}
