// Mock database for demonstration
const mockDatabase = {
    images: {
        cctv1: 'https://via.placeholder.com/800x450/333333/ffffff?text=CCTV+1+Feed',
        cctv2: 'https://via.placeholder.com/800x450/444444/ffffff?text=CCTV+2+Feed',
        cctv3: 'https://via.placeholder.com/800x450/555555/ffffff?text=CCTV+3+Feed',
        cctv4: 'https://via.placeholder.com/800x450/666666/ffffff?text=CCTV+4+Feed',
        cctv5: 'https://via.placeholder.com/800x450/777777/ffffff?text=CCTV+5+Feed',
        cctv6: 'https://via.placeholder.com/800x450/888888/ffffff?text=CCTV+6+Feed'
    },
    data: {
        march: {
            'Biodegradable': [151, 231, 52, 12, 201, 647],
            'Recyclable': [782, 92, 123, 361, 223, 1581],
            'Residual': [16, 33, 78, 23, 54, 204],
            'Special': [1, 22, 5, 13, 1, 42]
        },
        february: {
            'Biodegradable': [138, 215, 48, 19, 189, 609],
            'Recyclable': [721, 88, 145, 339, 267, 1560],
            'Residual': [22, 41, 82, 31, 48, 224],
            'Special': [3, 18, 7, 9, 2, 39]
        },
        january: {
            'Biodegradable': [162, 198, 61, 15, 176, 612],
            'Recyclable': [695, 105, 132, 378, 245, 1555],
            'Residual': [19, 28, 69, 27, 61, 204],
            'Special': [2, 15, 3, 11, 3, 34]
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCCTVDropdown();
    populateAllTables();
    createAllCharts();
});

// CCTV Image Functions
function initializeCCTVDropdown() {
    const cctvSelect = document.getElementById('cctvSelect');
    const cctvImage = document.getElementById('cctvImage');
    
    cctvSelect.addEventListener('change', function() {
        const selectedCamera = this.value;
        cctvImage.src = mockDatabase.images[selectedCamera];
        cctvImage.alt = selectedCamera.toUpperCase() + ' Feed';
    });
}

function toggleFullscreen() {
    const cctvDisplay = document.getElementById('cctvDisplay');
    
    if (!document.fullscreenElement) {
        cctvDisplay.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Folder Toggle Functions
function toggleFolder(monthName) {
    const folder = document.querySelector(`[data-month="${monthName}"]`);
    const content = folder.querySelector('.folder-content');
    const icon = folder.querySelector('.folder-icon');
    
    if (content.classList.contains('open')) {
        content.classList.remove('open');
        icon.classList.remove('rotated');
    } else {
        // Close all other folders first
        document.querySelectorAll('.folder-content.open').forEach(openContent => {
            openContent.classList.remove('open');
            openContent.parentElement.querySelector('.folder-icon').classList.remove('rotated');
        });
        
        // Open the clicked folder
        content.classList.add('open');
        icon.classList.add('rotated');
    }
}

// Table Population Functions
function populateAllTables() {
    populateTable('march', mockDatabase.data.march);
    populateTable('february', mockDatabase.data.february);
    populateTable('january', mockDatabase.data.january);
}

function populateTable(month, data) {
    const tableId = month + 'Table';
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add data rows for each waste type
    Object.keys(data).forEach(wasteType => {
        const values = data[wasteType];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${wasteType}</td>
            <td>${values[0]}</td>
            <td>${values[1]}</td>
            <td>${values[2]}</td>
            <td>${values[3]}</td>
            <td>${values[4]}</td>
            <td>${values[5]}</td>
        `;
        tbody.appendChild(tr);
    });
    
    // Add totals row
    const totalsRow = document.createElement('tr');
    const totals = [0, 0, 0, 0, 0, 0]; // Area 1-5 and Grand Total
    
    Object.values(data).forEach(values => {
        for (let i = 0; i < 6; i++) {
            totals[i] += values[i];
        }
    });
    
    totalsRow.innerHTML = `
        <td><strong>Totals</strong></td>
        <td><strong>${totals[0]}</strong></td>
        <td><strong>${totals[1]}</strong></td>
        <td><strong>${totals[2]}</strong></td>
        <td><strong>${totals[3]}</strong></td>
        <td><strong>${totals[4]}</strong></td>
        <td><strong>${totals[5]}</strong></td>
    `;
    tbody.appendChild(totalsRow);
}

// Chart Creation Functions
function createAllCharts() {
    createChart('march', mockDatabase.data.march);
    createChart('february', mockDatabase.data.february);
    createChart('january', mockDatabase.data.january);
}

function createChart(month, data) {
    const canvasId = month + 'Chart';
    const ctx = document.getElementById(canvasId);
    
    // Process data for pie chart - use totals for each waste type
    const labels = Object.keys(data);
    const values = Object.values(data).map(values => values[5]); // Use the total column (index 5)
    
    // Create pie chart
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#4CAF50', // Green for Biodegradable
                    '#2196F3', // Blue for Recyclable
                    '#FF9800', // Orange for Residual
                    '#F44336'  // Red for Special
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: `${month.charAt(0).toUpperCase() + month.slice(1)} 2025 - Waste Distribution`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Smooth scrolling for navigation (if needed)
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Error handling for image loading
document.addEventListener('DOMContentLoaded', function() {
    const cctvImage = document.getElementById('cctvImage');
    
    cctvImage.addEventListener('error', function() {
        console.log('Image loading error - using fallback placeholder');
        this.src = 'https://via.placeholder.com/800x450/cccccc/333333?text=CCTV+Feed+Unavailable';
    });
});

// Responsive handling
window.addEventListener('resize', function() {
    // Handle any responsive adjustments if needed
    const cctvDisplay = document.querySelector('.cctv-display');
    if (cctvDisplay && document.fullscreenElement) {
        // Handle fullscreen resize if needed
    }
});