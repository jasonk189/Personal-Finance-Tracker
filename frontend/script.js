const form = document.getElementById('transactionForm');
const table = document.getElementById('transactionsTable');

let sortKey = null;       // 'date' or 'amount'
let sortOrder = 'asc';    // 'asc' or 'desc'


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.amount = parseFloat(data.amount); // ensure numeric

  const url = editingId
  ? `http://127.0.0.1:5000/api/transactions/${editingId}`
  : 'http://127.0.0.1:5000/api/transactions';
  const method = editingId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    loadTransactions();
    form.reset();
    editingId = null;
  }
});


let allTransactions = []; // store all transactions globally

async function loadTransactions(filters = {}) {
  const res = await fetch('http://127.0.0.1:5000/api/transactions');
  allTransactions = await res.json();

  let filtered = allTransactions;

  if (filters.startDate && filters.endDate) {
    filtered = filtered.filter(tx => tx.date >= filters.startDate && tx.date <= filters.endDate);
  } else if (filters.startDate) {
    filtered = filtered.filter(tx => tx.date >= filters.startDate);
  } else if (filters.endDate) {
    filtered = filtered.filter(tx => tx.date <= filters.endDate);
  }
  if (filters.type) {
    filtered = filtered.filter(tx => tx.type === filters.type);
  }
  if (filters.category) {
    filtered = filtered.filter(tx => tx.category.toLowerCase().includes(filters.category.toLowerCase()));
  }

  if (sortKey) {
  filtered.sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    // Convert to comparable values
    if (sortKey === 'date') {
      valA = new Date(valA);
      valB = new Date(valB);
    } else if (sortKey === 'amount') {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// Clear and render rows as before...
const tableBody = document.querySelector('#transactionsTable tbody');
tableBody.innerHTML = '';
filtered.forEach(tx => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${tx.date}</td>
    <td>${tx.type}</td>
    <td>${tx.category}</td>
    <td>${tx.description}</td>
    <td>$${parseFloat(tx.amount).toFixed(2)}</td>
    <td>
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    </td>
  `;

  row.querySelector('.editBtn').addEventListener('click', () => editTransaction(tx.id));
  row.querySelector('.deleteBtn').addEventListener('click', () => deleteTransaction(tx.id));

  tableBody.appendChild(row);
});
}






async function deleteTransaction(id) {
  await fetch(`http://127.0.0.1:5000/api/transactions/${id}`, { method: 'DELETE' });
  loadTransactions();
}

async function addTransaction(transaction) {
  const res = await fetch('http://127.0.0.1:5000/api/transactions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(transaction)
  });
  if (!res.ok) {
    alert('Failed to add transaction');
    return;
  }
  // After successful add, reload or refresh transactions list
  loadTransactions();
}


loadTransactions();

let editingId = null;

function editTransaction(id) {
  console.log('Editing transaction with ID:', id);
  fetch('http://127.0.0.1:5000/api/transactions')
    .then(res => res.json())
    .then(data => {
      const tx = data.find(t => t.id === id);
      if (tx) {
        document.querySelector('[name="date"]').value = tx.date;
        document.querySelector('[name="type"]').value = tx.type;
        document.querySelector('[name="category"]').value = tx.category;
        document.querySelector('[name="description"]').value = tx.description;
        document.querySelector('[name="amount"]').value = tx.amount;
        editingId = id;
        const cancelBtn = document.getElementById('cancelEdit');
        cancelBtn.style.display = 'inline-block'; // Show the Cancel button
      }
    });
}



const cancelBtn = document.getElementById('cancelEdit');
cancelBtn.addEventListener('click', () => {
  form.reset();
  editingId = null;
  cancelBtn.style.display = 'none';
});

document.getElementById('applyFilters').addEventListener('click', () => {
  const filters = {
    startDate: document.getElementById('filterStartDate').value,
    endDate: document.getElementById('filterEndDate').value,
    type: document.getElementById('filterType').value,       // add this line
    category: document.getElementById('filterCategory').value // add this line
  };
  loadTransactions(filters);
});


document.getElementById('clearFilters').addEventListener('click', () => {
  document.getElementById('filterStartDate').value = '';
  document.getElementById('filterEndDate').value = '';
  loadTransactions();
});

function updateSortIndicators() {
  const dateHeader = document.getElementById('sortDate');
  const amountHeader = document.getElementById('sortAmount');

  // Reset classes
  dateHeader.classList.remove('sorted-asc', 'sorted-desc');
  amountHeader.classList.remove('sorted-asc', 'sorted-desc');

  if (sortKey === 'date') {
    dateHeader.classList.add(sortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');
  } else if (sortKey === 'amount') {
    amountHeader.classList.add(sortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');
  }
}


document.getElementById('sortDate').addEventListener('click', () => {
  if (sortKey === 'date') {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey = 'date';
    sortOrder = 'asc';
  }
  updateSortIndicators();
  loadTransactions();
});

document.getElementById('sortAmount').addEventListener('click', () => {
  if (sortKey === 'amount') {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey = 'amount';
    sortOrder = 'asc';
  }
  updateSortIndicators();
  loadTransactions();
});

// Call once on page load to initialize
updateSortIndicators();




// Theme toggle functionality

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function updateIcon(theme) {
  const icon = document.getElementById('themeIcon');
  icon.classList.add('fade-out');

  setTimeout(() => {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    icon.classList.remove('fade-out');
  }, 150); // Halfway through the transition
}


function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  setCookie('theme', theme, 365);
  updateIcon(theme);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = getCookie('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(theme);
});

document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  const newTheme = isDark ? 'dark' : 'light';
  setCookie('theme', newTheme, 365);
  updateIcon(newTheme);
});


