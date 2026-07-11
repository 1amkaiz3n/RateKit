// API Configuration
const API_BASE = '/api';

// State Management
let state = {
    settings: null,
    expenses: [],
    estimates: []
};

// DOM Elements
const elements = {
    // Dashboard
    targetSalary: document.getElementById('target-salary'),
    totalExpenses: document.getElementById('total-expenses'),
    totalMonthly: document.getElementById('total-monthly'),
    hourlyRate: document.getElementById('hourly-rate'),
    baseHourlyRate: document.getElementById('base-hourly-rate'),
    finalRate: document.getElementById('final-rate'),
    workingDays: document.getElementById('working-days'),
    productiveHours: document.getElementById('productive-hours'),
    monthlyProductiveHours: document.getElementById('monthly-productive-hours'),
    profitMarginDisplay: document.getElementById('profit-margin-display'),
    expensesList: document.getElementById('expenses-list'),
    
    // Settings
    targetSalaryInput: document.getElementById('target-salary-input'),
    workingDaysInput: document.getElementById('working-days-input'),
    productiveHoursInput: document.getElementById('productive-hours-input'),
    profitMarginInput: document.getElementById('profit-margin-input'),
    
    // Estimation
    calculateProjectBtn: document.getElementById('calculate-project-btn'),
    saveEstimateBtn: document.getElementById('save-estimate-btn'),
    calcBaseRate: document.getElementById('calc-base-rate'),
    calcEstimatedHours: document.getElementById('calc-estimated-hours'),
    calcBaseCost: document.getElementById('calc-base-cost'),
    calcAdditionalCost: document.getElementById('calc-additional-cost'),
    calcMargin: document.getElementById('calc-margin'),
    calcTotalPrice: document.getElementById('calc-total-price'),
    calcRecommendedPrice: document.getElementById('calc-recommended-price'),
    
    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    contents: document.querySelectorAll('[id$="-content"]'),
    themeToggle: document.getElementById('theme-toggle'),
    themeText: document.getElementById('theme-text')
};

// Format Currency
function formatCurrency(amount) {
    return `Rp${Math.round(amount).toLocaleString('id-ID')}`;
}

// Update Dashboard Display
function updateDashboard() {
    if (!state.settings) return;
    
    elements.targetSalary.textContent = formatCurrency(state.settings.target_salary);
    elements.workingDays.textContent = `${state.settings.working_days} Hari`;
    elements.productiveHours.textContent = `${state.settings.productive_hours} Jam`;
    elements.profitMarginDisplay.textContent = state.settings.profit_margin;
    
    const totalExpenses = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    elements.totalExpenses.textContent = formatCurrency(totalExpenses);
    
    const totalMonthly = state.settings.target_salary + totalExpenses;
    elements.totalMonthly.textContent = formatCurrency(totalMonthly);
    
    const monthlyProductiveHours = state.settings.working_days * state.settings.productive_hours;
    elements.monthlyProductiveHours.textContent = `${monthlyProductiveHours} Jam`;
    
    const hourlyRate = totalMonthly / monthlyProductiveHours;
    const finalRate = hourlyRate * (1 + state.settings.profit_margin / 100);
    
    elements.baseHourlyRate.textContent = formatCurrency(hourlyRate);
    elements.hourlyRate.textContent = formatCurrency(hourlyRate);
    elements.finalRate.textContent = formatCurrency(finalRate);
    
    renderExpenses();
    
    // Save to local storage
    localStorage.setItem('ratekit_settings', JSON.stringify(state.settings));
    localStorage.setItem('ratekit_expenses', JSON.stringify(state.expenses));
}

// Render Expenses List
function renderExpenses() {
    elements.expensesList.innerHTML = '';
    
    state.expenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg';
        item.innerHTML = `
            <span class="font-medium">${expense.name}</span>
            <span class="font-semibold text-gray-600 dark:text-gray-400">${formatCurrency(expense.amount)}</span>
        `;
        elements.expensesList.appendChild(item);
    });
    
    if (state.expenses.length === 0) {
        elements.expensesList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">Belum ada biaya operasional ditambahkan</p>';
    }
}

// Load Data
async function loadData() {
    try {
        // Load settings
        const settingsResponse = await fetch(`${API_BASE}/settings`);
        if (settingsResponse.ok) {
            state.settings = await settingsResponse.json();
        } else {
            const defaultSettings = {
                id: 1,
                target_salary: 5000000,
                working_days: 22,
                productive_hours: 6,
                profit_margin: 30
            };
            state.settings = defaultSettings;
        }
        
        // Load expenses
        const expensesResponse = await fetch(`${API_BASE}/expenses`);
        if (expensesResponse.ok) {
            state.expenses = await expensesResponse.json();
        }
        
        updateDashboard();
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Update Settings
async function updateSettings() {
    const settingsData = {
        target_salary: parseFloat(elements.targetSalaryInput.value) || 0,
        working_days: parseInt(elements.workingDaysInput.value) || 22,
        productive_hours: parseFloat(elements.productiveHoursInput.value) || 6,
        profit_margin: parseFloat(elements.profitMarginInput.value) || 30
    };
    
    try {
        const response = await fetch(`${API_BASE}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settingsData)
        });
        
        if (response.ok) {
            state.settings = await response.json();
            updateDashboard();
            showNotification('Pengaturan berhasil diperbarui', 'success');
        }
    } catch (error) {
        showNotification('Gagal memperbarui pengaturan', 'error');
    }
}

// Add Expense
async function addExpense(name, amount) {
    try {
        const response = await fetch(`${API_BASE}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, amount })
        });
        
        if (response.ok) {
            const newExpense = await response.json();
            state.expenses.push(newExpense);
            updateDashboard();
            showNotification('Biaya operasional berhasil ditambahkan', 'success');
        }
    } catch (error) {
        showNotification('Gagal menambah biaya operasional', 'error');
    }
}

// Update Expense
async function updateExpense(id, name, amount) {
    try {
        const response = await fetch(`${API_BASE}/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, amount })
        });
        
        if (response.ok) {
            const updatedExpense = await response.json();
            const index = state.expenses.findIndex(e => e.id === id);
            if (index !== -1) {
                state.expenses[index] = updatedExpense;
            }
            updateDashboard();
            showNotification('Biaya operasional berhasil diperbarui', 'success');
        }
    } catch (error) {
        showNotification('Gagal memperbarui biaya operasional', 'error');
    }
}

// Delete Expense
async function deleteExpense(id) {
    try {
        await fetch(`${API_BASE}/expenses/${id}`, {
            method: 'DELETE'
        });
        
        state.expenses = state.expenses.filter(e => e.id !== id);
        updateDashboard();
        showNotification('Biaya operasional berhasil dihapus', 'success');
    } catch (error) {
        showNotification('Gagal menghapus biaya operasional', 'error');
    }
}

// Calculate Project
async function calculateProject() {
    const estimatedHours = parseFloat(document.getElementById('estimated-hours').value) || 0;
    const additionalCost = parseFloat(document.getElementById('additional-cost').value) || 0;
    const additionalMargin = parseFloat(document.getElementById('additional-margin').value) || null;
    
    try {
        const response = await fetch(`${API_BASE}/calculate-project?estimated_hours=${estimatedHours}&additional_cost=${additionalCost}&additional_margin=${additionalMargin}`);
        
        if (response.ok) {
            const result = await response.json();
            
            elements.calcBaseRate.textContent = formatCurrency(result.base_hourly_rate);
            elements.calcEstimatedHours.textContent = `${result.estimated_hours} Jam`;
            elements.calcBaseCost.textContent = formatCurrency(result.base_cost);
            elements.calcAdditionalCost.textContent = formatCurrency(result.additional_cost);
            elements.calcMargin.textContent = formatCurrency(result.margin_amount);
            elements.calcTotalPrice.textContent = formatCurrency(result.total_price);
            elements.calcRecommendedPrice.textContent = formatCurrency(result.recommended_price);
            
            return result;
        }
    } catch (error) {
        showNotification('Gagal menghitung estimasi', 'error');
        return null;
    }
}

// Save Estimate
async function saveEstimate() {
    const projectName = document.getElementById('project-name').value;
    const estimatedHours = parseFloat(document.getElementById('estimated-hours').value);
    const additionalCost = parseFloat(document.getElementById('additional-cost').value);
    const additionalMargin = parseFloat(document.getElementById('additional-margin').value);
    
    if (!projectName) {
        showNotification('Nama project wajib diisi', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/estimates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project_name: projectName,
                estimated_hours: estimatedHours,
                additional_cost: additionalCost,
                additional_margin: additionalMargin || null
            })
        });
        
        if (response.ok) {
            const newEstimate = await response.json();
            showNotification('Estimasi berhasil disimpan', 'success');
            
            // Reset form
            document.getElementById('project-name').value = '';
            document.getElementById('estimated-hours').value = '3';
            document.getElementById('additional-cost').value = '0';
            document.getElementById('additional-margin').value = '0';
        }
    } catch (error) {
        showNotification('Gagal menyimpan estimasi', 'error');
    }
}

// Navigation
function switchPage(pageId) {
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    elements.contents.forEach(content => {
        content.classList.add('hidden');
        if (content.id === `${pageId}-content`) {
            content.classList.remove('hidden');
        }
    });
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'settings': 'Pengaturan',
        'estimation': 'Estimasi Proyek',
        'history': 'Riwayat'
    };
    document.getElementById('page-title').textContent = titles[pageId];
}

// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('ratekit_theme', 'light');
        elements.themeText.textContent = 'Dark Mode';
    } else {
        html.classList.add('dark');
        localStorage.setItem('ratekit_theme', 'dark');
        elements.themeText.textContent = 'Light Mode';
    }
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event Listeners
elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        switchPage(page);
    });
});

elements.targetSalaryInput.addEventListener('change', updateSettings);
elements.workingDaysInput.addEventListener('change', updateSettings);
elements.productiveHoursInput.addEventListener('change', updateSettings);
elements.profitMarginInput.addEventListener('change', updateSettings);

elements.themeToggle.addEventListener('click', toggleTheme);

elements.calculateProjectBtn.addEventListener('click', calculateProject);
elements.saveEstimateBtn.addEventListener('click', saveEstimate);

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Load theme from local storage
    const savedTheme = localStorage.getItem('ratekit_theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        elements.themeText.textContent = 'Light Mode';
    }
    
    loadData();
});
