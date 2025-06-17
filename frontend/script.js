const form = document.getElementById('transactionForm');
const table = document.getElementById('transactionsTable');

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


async function loadTransactions() {
  console.log('Loading transactions...');
  const res = await fetch('http://127.0.0.1:5000/api/transactions');
  const data = await res.json();
  console.log('Data received:', data);

  const tableBody = document.querySelector('#transactionsTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  data.forEach(tx => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.type}</td>
      <td>${tx.category}</td>
      <td>${tx.description}</td>
      <td>$${parseFloat(tx.amount).toFixed(2)}</td>
      <td>
      <button onclick="editTransaction(${tx.id})">Edit</button>
      <button onclick="deleteTransaction(${tx.id})">Delete</button>
      </td>
    `;
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


