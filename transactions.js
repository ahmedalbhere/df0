document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('transaction-form');
  const list = document.getElementById('transaction-list');
  const balanceEl = document.getElementById('balance');
  const incomeTab = document.getElementById('income-tab');
  const expenseTab = document.getElementById('expense-tab');
  
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  let currentType = 'income';

  // تعيين تاريخ اليوم كقيمة افتراضية
  document.getElementById('date').valueAsDate = new Date();

  // تبديل بين التبويبات
  incomeTab.addEventListener('click', () => {
    incomeTab.classList.add('active');
    expenseTab.classList.remove('active');
    currentType = 'income';
  });

  expenseTab.addEventListener('click', () => {
    expenseTab.classList.add('active');
    incomeTab.classList.remove('active');
    currentType = 'expense';
  });

  // حفظ العمليات في localStorage
  function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  // تحديث الرصيد
  function updateBalance() {
    const balance = transactions.reduce((total, trx) => {
      return trx.type === 'income' ? total + trx.amount : total - trx.amount;
    }, 0);
    
    balanceEl.textContent = balance.toFixed(2) + ' جنيه';
    balanceEl.style.color = balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)';
  }

  // عرض العمليات
  function renderTransactions() {
    list.innerHTML = '';
    
    // تصفية العمليات حسب النوع إذا كان محددًا
    const filteredTransactions = currentType === 'income' 
      ? transactions.filter(trx => trx.type === 'income')
      : currentType === 'expense'
      ? transactions.filter(trx => trx.type === 'expense')
      : transactions;
    
    // عرض العمليات
    filteredTransactions.forEach((trx, index) => {
      const item = document.createElement('div');
      item.className = `transaction-item ${trx.type}`;
      
      item.innerHTML = `
        <div class="transaction-details">
          <div class="transaction-title">
            ${trx.type === 'income' ? 'مدخول' : 'مصروف'}
          </div>
          <div class="transaction-note">${trx.note || 'لا يوجد وصف'}</div>
          <div class="transaction-date">${trx.date}</div>
        </div>
        <div class="transaction-amount">
          ${trx.amount} جنيه
        </div>
        <button class="delete-btn" data-id="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      
      list.appendChild(item);
    });
    
    updateBalance();
  }

  // حذف عملية
  list.addEventListener('click', function(e) {
    if (e.target.closest('.delete-btn')) {
      const index = e.target.closest('.delete-btn').getAttribute('data-id');
      if (confirm('هل تريد حذف هذه العملية؟')) {
        transactions.splice(index, 1);
        saveTransactions();
        renderTransactions();
      }
    }
  });

  // إضافة عملية جديدة
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const note = document.getElementById('note').value;
    const date = document.getElementById('date').value;
    
    if (!amount || isNaN(amount)) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }
    
    const type = currentType;
    
    transactions.unshift({
      type,
      amount,
      note,
      date: formatDate(date)
    });
    
    saveTransactions();
    renderTransactions();
    form.reset();
    document.getElementById('date').valueAsDate = new Date();
  });

  // تنسيق التاريخ
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  }

  // التحميل الأولي
  renderTransactions();
});
