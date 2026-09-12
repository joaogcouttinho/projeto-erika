// --- SISTEMA DE FECHAMENTO DE MÊS AUTOMÁTICO ---
        function checkMonthRollover() {
            let savedMonthId = localStorage.getItem('erikacomedoria_last_month');

            if (!savedMonthId) {
                localStorage.setItem('erikacomedoria_last_month', activeMonthId);
            } else if (savedMonthId !== activeMonthId) {
                const oldSales = allSales.filter(s => s.monthId === savedMonthId);
                if (oldSales.length > 0) {
                    const totalRevenue = oldSales.reduce((sum, s) => sum + s.total, 0);
                    const totalProfit = oldSales.reduce((sum, s) => sum + s.profit, 0);
                    
                    const prodMap = {};
                    oldSales.forEach(s => {
                        if(!prodMap[s.productName]) prodMap[s.productName] = { name: s.productName, qty: 0, total: 0 };
                        prodMap[s.productName].qty += s.qty;
                        prodMap[s.productName].total += s.total;
                    });
                    const topProducts = Object.values(prodMap).sort((a,b) => b.total - a.total).slice(0, 10);
                    
                    const [year, mth] = savedMonthId.split('-');
                    const reportName = `${monthNames[parseInt(mth)-1]} ${year}`;
                    
                    reports.unshift({
                        id: savedMonthId,
                        name: reportName,
                        totalRevenue,
                        totalProfit,
                        topProducts,
                        closureDate: new Date().toLocaleDateString('pt-BR')
                    });
                    localStorage.setItem('erikacomedoria_reports', JSON.stringify(reports));
                }
                localStorage.setItem('erikacomedoria_last_month', activeMonthId);
            }

            currentMonthSales = allSales.filter(s => s.monthId === activeMonthId);
            renderReportsTable();
        }
