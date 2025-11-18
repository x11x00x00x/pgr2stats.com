// API base URL
const API_BASE_URL = 'https://lc.pgr2stats.com/api';

// State management
let progressTimer = null;
let lastProgress = 0;
let slowProgress = 0;
let isLoading = false;
let currentPage = 1;
let currentPagination = null;
let allChanges = [];
let currentSearchTerm = null;
let isLoadingMore = false;
let displayedCount = 0; // Track how many items are currently displayed

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadLatestChanges();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('refreshBtn').addEventListener('click', () => {
        resetAndLoad();
    });
    document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
    document.getElementById('playerName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// Reset and load fresh data
function resetAndLoad() {
    currentPage = 1;
    allChanges = [];
    displayedCount = 0;
    currentSearchTerm = null;
    currentPagination = null;
    document.getElementById('playerName').value = '';
    loadLatestChanges();
}

// Handle search
function handleSearch() {
    const playerName = document.getElementById('playerName').value.trim();
    currentPage = 1;
    allChanges = [];
    displayedCount = 0;
    currentSearchTerm = playerName || null;
    if (playerName) {
        searchPlayer(playerName);
    } else {
        loadLatestChanges();
    }
}

// Update progress bar with slow movement when stuck
function updateProgress(percent) {
    const progressBar = document.getElementById('loadingProgress');
    if (!progressBar) return;
    
    const actualPercent = Math.min(100, Math.max(0, percent));
    lastProgress = actualPercent;
    
    if (actualPercent > slowProgress) {
        slowProgress = actualPercent;
    }
    
    progressBar.style.width = slowProgress + '%';
    
    if (progressTimer) {
        clearInterval(progressTimer);
    }
    
    if (!progressTimer && isLoading && slowProgress < 99) {
        progressTimer = setInterval(() => {
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            if (currentWidth < 99) {
                slowProgress = Math.min(99, currentWidth + 0.15);
                progressBar.style.width = slowProgress + '%';
            }
        }, 50);
    }
}

// Show/hide loading
function showLoading() {
    isLoading = true;
    lastProgress = 0;
    slowProgress = 0;
    document.getElementById('loadingContainer').style.display = 'flex';
    updateProgress(0);
}

function hideLoading() {
    isLoading = false;
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
    lastProgress = 0;
    slowProgress = 0;
    document.getElementById('loadingContainer').style.display = 'none';
}

// Show/hide results
function showResults() {
    document.getElementById('resultsSection').style.display = 'block';
}

function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

// Load latest changes
async function loadLatestChanges(page = 1, append = false) {
    if (!append) {
        showLoading();
        hideResults();
        allChanges = [];
    } else {
        isLoadingMore = true;
        document.getElementById('loadMoreBtn').disabled = true;
        document.getElementById('loadMoreBtn').textContent = 'Loading...';
    }
    
    updateProgress(10);
    
    try {
        const url = `${API_BASE_URL}/latestchanges?page=${page}&limit=50`;
        const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = 10 + (e.loaded / e.total) * 80;
                    updateProgress(percentComplete);
                }
            });
            
            xhr.addEventListener('load', () => {
                updateProgress(90);
                if (xhr.status === 200) {
                    try {
                        const responseText = xhr.responseText;
                        console.log('Raw response text (first 200 chars):', responseText.substring(0, 200));
                        const response = JSON.parse(responseText);
                        console.log('Parsed response type:', typeof response, 'Is Array:', Array.isArray(response));
                        updateProgress(100);
                        setTimeout(() => resolve(response), 100);
                    } catch (e) {
                        console.error('Parse error:', e);
                        console.error('Response text:', xhr.responseText);
                        reject(new Error('Failed to parse response: ' + e.message));
                    }
                } else {
                    console.error('HTTP error:', xhr.status, xhr.statusText);
                    reject(new Error(`HTTP error! status: ${xhr.status}`));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Network error'));
            });
            
            xhr.open('GET', url);
            xhr.send();
        });
        
        // Handle both paginated response {data: [...], pagination: {...}} and flat array [...]
        let data, pagination;
        console.log('API Response:', response);
        console.log('Is Array?', Array.isArray(response));
        
        if (Array.isArray(response)) {
            // Response is a flat array (old format)
            data = response;
            pagination = {
                page: 1,
                limit: data.length,
                total: data.length,
                totalPages: 1,
                hasMore: false,
                nextPage: null
            };
        } else {
            // Response is paginated object (new format)
            data = response.data || [];
            pagination = response.pagination || {
                page: 1,
                limit: data.length,
                total: data.length,
                totalPages: 1,
                hasMore: false,
                nextPage: null
            };
        }
        
        console.log('Extracted data:', data);
        console.log('Data length:', data.length);
        
        if (append) {
            // Append to existing data
            allChanges = [...allChanges, ...data];
            currentPagination = pagination;
            currentPage = pagination.page || page;
            // Display with append flag - will append new items
            displayLatestChanges(data, currentSearchTerm, pagination, true);
        } else {
            // Replace data
            allChanges = data;
            displayedCount = 0;
            currentPagination = pagination;
            currentPage = pagination.page || page;
            console.log('Calling displayLatestChanges with data length:', allChanges.length);
            displayLatestChanges(allChanges, currentSearchTerm, pagination, false);
        }
        hideLoading();
        
        if (append) {
            isLoadingMore = false;
            document.getElementById('loadMoreBtn').disabled = false;
            document.getElementById('loadMoreBtn').textContent = 'Load More';
        }
    } catch (error) {
        console.error('Failed to load latest changes:', error);
        hideLoading();
        if (append) {
            isLoadingMore = false;
            document.getElementById('loadMoreBtn').disabled = false;
            document.getElementById('loadMoreBtn').textContent = 'Load More';
        }
        showError('Failed to load latest changes. Please try again.');
    }
}

// Search for a player
async function searchPlayer(playerName, page = 1, append = false) {
    if (!append) {
        showLoading();
        hideResults();
        allChanges = [];
    } else {
        isLoadingMore = true;
        document.getElementById('loadMoreBtn').disabled = true;
        document.getElementById('loadMoreBtn').textContent = 'Loading...';
    }
    
    updateProgress(10);
    
    try {
        const url = `${API_BASE_URL}/latestchanges?page=${page}&limit=50&name=${encodeURIComponent(playerName)}`;
        const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = 10 + (e.loaded / e.total) * 80;
                    updateProgress(percentComplete);
                }
            });
            
            xhr.addEventListener('load', () => {
                updateProgress(90);
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        updateProgress(100);
                        setTimeout(() => resolve(response), 100);
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
            
            xhr.open('GET', url);
            xhr.send();
        });
        
        // Handle both paginated response {data: [...], pagination: {...}} and flat array [...]
        let data, pagination;
        console.log('Search API Response:', response);
        console.log('Search Is Array?', Array.isArray(response));
        
        if (Array.isArray(response)) {
            // Response is a flat array (old format)
            data = response;
            pagination = {
                page: 1,
                limit: data.length,
                total: data.length,
                totalPages: 1,
                hasMore: false,
                nextPage: null
            };
        } else {
            // Response is paginated object (new format)
            data = response.data || [];
            pagination = response.pagination || {
                page: 1,
                limit: data.length,
                total: data.length,
                totalPages: 1,
                hasMore: false,
                nextPage: null
            };
        }
        
        console.log('Search Extracted data:', data);
        console.log('Search Data length:', data.length);
        
        if (append) {
            // Append to existing data
            allChanges = [...allChanges, ...data];
            currentPagination = pagination;
            currentPage = pagination.page || page;
            // Display with append flag - will append new items
            displayLatestChanges(data, playerName, pagination, true);
        } else {
            // Replace data
            allChanges = data;
            displayedCount = 0;
            currentPagination = pagination;
            currentPage = pagination.page || page;
            console.log('Search Calling displayLatestChanges with data length:', allChanges.length);
            displayLatestChanges(allChanges, playerName, pagination, false);
        }
        hideLoading();
        
        if (append) {
            isLoadingMore = false;
            document.getElementById('loadMoreBtn').disabled = false;
            document.getElementById('loadMoreBtn').textContent = 'Load More';
        }
    } catch (error) {
        console.error('Failed to search player:', error);
        hideLoading();
        if (append) {
            isLoadingMore = false;
            document.getElementById('loadMoreBtn').disabled = false;
            document.getElementById('loadMoreBtn').textContent = 'Load More';
        }
        showError(`Failed to search for "${playerName}". Please try again.`);
    }
}

// Load more results
function loadMore() {
    if (isLoadingMore || !currentPagination || !currentPagination.hasMore) {
        return;
    }
    
    const nextPage = currentPagination.nextPage;
    if (!nextPage) {
        return;
    }
    
    if (currentSearchTerm) {
        searchPlayer(currentSearchTerm, nextPage, true);
    } else {
        loadLatestChanges(nextPage, true);
    }
}

// Display latest changes
function displayLatestChanges(data, searchTerm = null, pagination = null, append = false) {
    const container = document.getElementById('resultsContainer');
    
    console.log('displayLatestChanges called with:', {
        dataLength: data ? data.length : 0,
        isArray: Array.isArray(data),
        append,
        isLoadingMore
    });
    
    // If appending, add to existing list
    if (append && isLoadingMore) {
        const changesList = container.querySelector('.changes-list');
        if (changesList && data && data.length > 0) {
            // Sort new items by data_date (most recent first)
            const sortedNewData = [...data].sort((a, b) => {
                const dateA = new Date(a.data_date || 0);
                const dateB = new Date(b.data_date || 0);
                return dateB - dateA;
            });
            
            // Add only new items
            sortedNewData.forEach(change => {
                changesList.insertAdjacentHTML('beforeend', createChangeCard(change));
            });
            
            displayedCount += sortedNewData.length;
        }
    } else {
        // First load - clear and rebuild
        container.innerHTML = '';
        displayedCount = 0;
        
        console.log('Checking data:', {
            data: data,
            isArray: Array.isArray(data),
            length: data ? data.length : 'undefined',
            isEmpty: !data || data.length === 0
        });
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            const message = searchTerm 
                ? `No changes found for "${searchTerm}"`
                : 'No latest changes found';
            console.log('Showing error message:', message);
            showError(message);
            return;
        }
        
        let html = '';
        
        if (searchTerm) {
            html += `<div class="search-info"><h3>Results for: ${searchTerm}</h3></div>`;
        }
        
        html += '<div class="changes-list">';
        
        // Sort by data_date (most recent first)
        const sortedData = [...data].sort((a, b) => {
            const dateA = new Date(a.data_date || 0);
            const dateB = new Date(b.data_date || 0);
            return dateB - dateA;
        });
        
        sortedData.forEach(change => {
            html += createChangeCard(change);
        });
        
        html += '</div>';
        
        container.innerHTML = html;
        displayedCount = sortedData.length;
    }
    
    // Update pagination controls
    if (pagination) {
        updatePaginationUI(pagination, allChanges.length);
    }
    
    showResults();
}

// Update pagination UI
function updatePaginationUI(pagination, currentCount) {
    const paginationControls = document.getElementById('paginationControls');
    const resultsCount = document.getElementById('resultsCount');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Update results count
    if (pagination.total !== undefined) {
        resultsCount.textContent = `Showing ${currentCount} of ${pagination.total.toLocaleString()} results`;
    } else {
        resultsCount.textContent = `Showing ${currentCount} results`;
    }
    
    // Show/hide load more button
    if (pagination.hasMore) {
        paginationControls.style.display = 'flex';
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More';
    } else {
        paginationControls.style.display = 'none';
    }
}

// Create a card for a single change
function createChangeCard(change) {
    const dataDate = change.data_date || 'Unknown date';
    const playerName = change.name || 'Unknown';
    const leaderboardName = change.leaderboard_name || 'Unknown Leaderboard';
    const oldScore = change.oldScore !== undefined ? change.oldScore : null;
    const newScore = change.newScore !== undefined ? change.newScore : null;
    const oldRank = change.oldRank !== undefined ? change.oldRank : null;
    const newRank = change.newRank !== undefined ? change.newRank : null;
    
    // Format score change
    const scoreChange = formatScoreChange(oldScore, newScore);
    const rankChange = formatRankChange(oldRank, newRank);
    
    let html = `<div class="change-card">
        <div class="change-header">
            <div class="change-title-section">
                <h3 class="leaderboard-name">${escapeHtml(leaderboardName)}</h3>
                <p class="player-name">${escapeHtml(playerName)}</p>
            </div>
            <span class="change-date">${formatDate(dataDate)}</span>
        </div>
        <div class="change-details">
            ${scoreChange}
            ${rankChange}
        </div>
    </div>`;
    
    return html;
}

// Format score change
function formatScoreChange(oldScore, newScore) {
    if (oldScore === null && newScore === null) {
        return '';
    }
    
    const oldScoreFormatted = formatScore(oldScore);
    const newScoreFormatted = formatScore(newScore);
    
    // Calculate change if both are numbers
    let changeIndicator = '';
    if (typeof oldScore === 'number' && typeof newScore === 'number' && oldScore !== 0) {
        const change = newScore - oldScore;
        if (change > 0) {
            changeIndicator = `<span class="score-change positive">+${formatScore(change)}</span>`;
        } else if (change < 0) {
            changeIndicator = `<span class="score-change negative">${formatScore(change)}</span>`;
        }
    }
    
    return `
        <div class="score-change-section">
            <div class="score-comparison">
                <span class="score-label">Score:</span>
                <span class="old-score">${oldScoreFormatted}</span>
                <span class="arrow">→</span>
                <span class="new-score">${newScoreFormatted}</span>
                ${changeIndicator}
            </div>
        </div>
    `;
}

// Format rank change
function formatRankChange(oldRank, newRank) {
    if (oldRank === null && newRank === null) {
        return '';
    }
    
    const oldRankFormatted = oldRank !== null && oldRank !== undefined ? oldRank : 'N/A';
    const newRankFormatted = newRank !== null && newRank !== undefined ? newRank : 'N/A';
    
    // Calculate rank change
    let rankChangeIndicator = '';
    if (typeof oldRank === 'number' && typeof newRank === 'number' && oldRank !== 0) {
        const change = oldRank - newRank; // Positive means rank improved (lower number)
        if (change > 0) {
            rankChangeIndicator = `<span class="rank-change improved">↑ ${change}</span>`;
        } else if (change < 0) {
            rankChangeIndicator = `<span class="rank-change declined">↓ ${Math.abs(change)}</span>`;
        } else {
            rankChangeIndicator = `<span class="rank-change same">—</span>`;
        }
    }
    
    return `
        <div class="rank-change-section">
            <div class="rank-comparison">
                <span class="rank-label">Rank:</span>
                <span class="old-rank">${oldRankFormatted}</span>
                <span class="arrow">→</span>
                <span class="new-rank">${newRankFormatted}</span>
                ${rankChangeIndicator}
            </div>
        </div>
    `;
}

// Format score value (handles both numbers and time strings)
function formatScore(score) {
    if (score === null || score === undefined) return 'N/A';
    if (typeof score === 'number') {
        return score.toLocaleString();
    }
    // If it's a time string (like "00:49.300"), return as-is
    return String(score);
}

// Format column name for display
function formatColumnName(name) {
    return name.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Format value for display
function formatValue(value) {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    return escapeHtml(String(value));
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    try {
        const date = new Date(dateString);
        // Format as: "Nov 12, 2025, 3:12 AM"
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    } catch (e) {
        return dateString;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = `<div class="error-message">${escapeHtml(message)}</div>`;
    showResults();
}

