const form = document.getElementById('transactionForm');
const table = document.getElementById('transactionsTable');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch('http://127.0.0.1:5000/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    loadTransactions();
    form.reset();
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
      <td>$${tx.amount.toFixed(2)}</td>
      <td><button onclick="deleteTransaction(${tx.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}





async function deleteTransaction(id) {
  await fetch(`http://127.0.0.1:5000/api/transactions/${id}`, { method: 'DELETE' });
  loadTransactions();
}

async function addTransaction(transaction) {
  const res = await fetch('/api/transactions', {
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
