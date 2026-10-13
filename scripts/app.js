export const validators = {
    isValidDescription(desc) {
        const regex = /^[a-zA-Z0-9\s.,'-]+$/;
        return regex.test(desc.trim());
    },
    isValidAmount(amount) {
        const num = parseFloat(amount);
        return !isNaN(num) && num > 0;
    },
    isValidDate(dateStr) {
        return dateStr !== '' && !isNaN(new Date(dateStr).getTime());
    },
    isValidCategory(category) {
    const validCategories = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
    return validCategories.includes(category);
  },
};

export function clearInputError(inputElement) {
  inputElement.style.borderColor = '#E5E7EB';
  const parent = inputElement.parentElement;
  const errorMsg = parent.querySelector('.error-feedback');
  if (errorMsg) errorMsg.remove();
}

export function showInputError(inputElement, message) {
  inputElement.style.borderColor = '#DC2626';
  const parent = inputElement.parentElement;
  let errorMsg = parent.querySelector('.error-feedback');
  if (!errorMsg) {
    errorMsg = document.createElement('div');
    errorMsg.className = 'error-feedback';
    errorMsg.style.color = '#DC2626';
    errorMsg.style.fontSize = '0.8rem';
    errorMsg.style.marginTop = '0.25rem';
    parent.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
}

let transactions = JSON.parse(localStorage.getItem('transactions')) || [
  { id: 'txn_1', date: '2026-10-01', description: 'Cafeteria Lunch', amount: 12.50, category: 'Food' },
  { id: 'txn_2', date: '2026-10-05', description: 'Chemistry Textbook', amount: 89.99, category: 'Books' }
];
let monthlyBudgetCap = parseFloat(localStorage.getItem('budgetCap')) || 1000.00;
let sortDirection = { column: 'date', asc: false };

const recordsTbody = document.getElementById('records-tbody');
const searchInput = document.getElementById('search-input');
const totalRecordsEl = document.getElementById('total-records');
const totalsumEl = document.getElementById('total-sum');
const topCategoryEl = document.getElementById('top-category');
const budgetDisplayEl = document.getElementById('budget-display');
const budgetFillEl = document.getElementById('budget-fill');

function initApp() {
    renderDashboard();
    renderTable(transactions);
    setupEventListeners();
}

function compileSafeRegex(query) {
    try {
        return new RegExp(query, 'i');
    } catch (e) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(escapedQuery, 'i');
    }   
}

function highlightMatch(text, regex) {
  const str = String(text);
  if (!regex || !regex.source) return escapeHtml(str);
  return escapeHtml(str).replace(regex, (match) => `<mark style="background-color:#FDE047; padding:0 2px;">${match}</mark>`);
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

function renderDashboard() {
  if (!totalRecordsEl) return;
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  totalRecordsEl.textContent = transactions.length;
  totalSumEl.textContent = `$${total.toFixed(2)}`;

    const categories = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  let topCat = 'N/A';
  let maxAmt = 0;
  for (const [cat, amt] of Object.entries(categories)) {
 
    if (amt > maxAmt) { maxAmt = amt; topCat = cat; }
  }
  topCategoryEl.textContent = topCat;
 
  if (budgetDisplayEl && budgetFillEl) {
    budgetDisplayEl.textContent = `$${total.toFixed(2)} / $${monthlyBudgetCap.toFixed(2)}`;
    const pct = Math.min((total / monthlyBudgetCap) * 100, 100);
    budgetFillEl.style.width = `${pct}%`;
    budgetFillEl.style.backgroundColor = total > monthlyBudgetCap ? '#DC2626' : '#059669';
  }
 
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function renderTable(data, regex = null) {
  if (!recordsTbody) return;
  recordsTbody.innerHTML = '';

  if (data.length === 0) {
    recordsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:#6B7280;">No transaction records match your criteria.</td></tr>`;
    return;
  }

data.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>{t.id}</td>
    <td>${highlightMatch(t.date, regex)}</td>
    <td>${highlightMatch(t.description, regex)}</td>
    <td>$${t.amount.toFixed(2)}</td>
      <td>${highlightMatch(t.category, regex)}</td>
      <td>
        <button class="btn-secondary" onclick="window.editRecord('${t.id}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Edit</button>
        <button class="btn-secondary" onclick="window.deleteRecord('${t.id}')" style="padding:0.25rem 0.5rem; font-size:0.75rem; background-color:#DC2626; color:#FFF;">Del</button>
      </td>
      `;
    recordsTbody.appendChild(tr);
  });
}
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
      const regex = compileSafeRegex(query);
      const filtered = transactions.filter(t =>
        regex.test(t.description) || regex.test(t.category) || regex.test(t.date) || regex.test(t.amount.toString())
      );
      renderTable(filtered, query ? regex : null);
    });
  }
}

window.deleteRecord = function(id) {
  if (confirm('Are you sure you want to delete this record?')) {
    transactions = transactions.filter(t => t.id !== id);
    renderDashboard();
    renderTable(transactions);
  }
};

window.editRecord = function(id) {
  const t = transactions.find(item => item.id === id);
  if (!t) return;
  document.getElementById('record-id').value = t.id;
  document.getElementById('description').value = t.description;
  document.getElementById('amount').value = t.amount;
  document.getElementById('category').value = t.category;
  document.getElementById('date').value = t.date;
  window.scrollTo({ top: document.getElementById('form-section').offsetTop, behavior: 'smooth' });
};

initApp();
