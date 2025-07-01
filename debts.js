document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('debt-form');
  const list = document.getElementById('debt-list');
  const owedAmountEl = document.getElementById('owed-amount');
  const debtAmountEl = document.getElementById('debt-amount');
  
  let debts = JSON.parse(localStorage.getItem('debts')) || [];

  // حفظ الديون في localStorage
  function saveDebts() {
    localStorage.setItem('debts', JSON.stringify(debts));
  }

  // تحديث إجمالي الديون
  function updateTotals() {
    const owedTotal = debts
      .filter(debt => debt.type === 'owed')
      .reduce((total, debt) => total + parseFloat(debt.amount), 0);
    
    const debtTotal = debts
      .filter(debt => debt.type === 'debt')
      .reduce((total, debt) => total + parseFloat(debt.amount), 0);
    
    owedAmountEl.textContent = owedTotal.toFixed(2) + ' جنيه';
    debtAmountEl.textContent = debtTotal.toFixed(2) + ' جنيه';
  }

  // عرض الديون
  function renderDebts() {
    list.innerHTML = '';
    
    debts.forEach((debt, index) => {
      const item = document.createElement('div');
      item.className = `debt-item ${debt.type}`;
      
      item.innerHTML = `
        <div class="debt-details">
          <div class="debt-name">${debt.name}</div>
          <div class="debt-amount">${debt.amount} جنيه</div>
          <div class="debt-date">${debt.date || ''}</div>
        </div>
        <button class="delete-btn" data-id="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      
      list.appendChild(item);
    });
    
    updateTotals();
  }

  // حذف دين
  list.addEventListener('click', function(e) {
    if (e.target.closest('.delete-btn')) {
      const index = e.target.closest('.delete-btn').getAttribute('data-id');
      if (confirm('هل تريد حذف هذا الدين؟')) {
        debts.splice(index, 1);
        saveDebts();
        renderDebts();
      }
    }
  });

  // إضافة دين جديد
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    
    if (!name || !amount || isNaN(amount) || !type) {
      alert('الرجاء إدخال جميع البيانات بشكل صحيح');
      return;
    }
    
    debts.unshift({
      name,
      amount,
      type,
      date: new Date().toLocaleDateString('ar-EG')
    });
    
    saveDebts();
    renderDebts();
    form.reset();
  });

  // التحميل الأولي
  renderDebts();
});
