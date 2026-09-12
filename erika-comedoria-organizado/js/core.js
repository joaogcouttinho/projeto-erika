const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        
        // --- DATA MANAGEMENT ---
        let products = JSON.parse(localStorage.getItem('erikacomedoria_products')) || [];
        let allSales = JSON.parse(localStorage.getItem('erikacomedoria_sales')) || [];
        let reports = JSON.parse(localStorage.getItem('erikacomedoria_reports')) || [];

        let currentMonthSales = []; 
        let chartWeeklyInstance = null;
        let chartProductInstance = null;
        
        let today = new Date();
        let activeMonthId = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0'); 
        document.getElementById('current-month-label').innerText = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
