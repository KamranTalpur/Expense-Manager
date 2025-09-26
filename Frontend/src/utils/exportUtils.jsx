// frontend/src/utils/exportUtils.js
export const exportToCSV = (expenses, filename = 'expenses.csv') => {
  const headers = 'Date,Name,Category,Amount\n';
  const csvContent = expenses.map(expense => 
    `"${new Date(expense.date).toLocaleDateString()}","${expense.name}","${expense.reason}",${expense.amount}`
  ).join('\n');
  
  const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (expenses, filename = 'expenses.json') => {
  const dataStr = JSON.stringify(expenses, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};