document.addEventListener('DOMContentLoaded', () => {
  const dailyCtx = document.getElementById('dailyChart');
  const responseCtx = document.getElementById('responseChart');

  new Chart(dailyCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Accidents',
        data: [18, 26, 21, 30, 28, 35, 19],
        backgroundColor: ['#0B5ED7', '#198754', '#FFC107', '#DC3545', '#0B5ED7', '#198754', '#DC3545']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  new Chart(responseCtx, {
    type: 'line',
    data: {
      labels: ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h'],
      datasets: [{
        data: [18, 16, 14, 12, 10, 11, 13, 9],
        borderColor: '#0B5ED7',
        tension: 0.3,
        fill: false,
        label: 'Minutes'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });
});
