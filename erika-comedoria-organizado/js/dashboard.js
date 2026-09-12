// --- DASHBOARD E GRÁFICOS DINÂMICOS ---
        function updateDashboard() {
            let totalQty = 0, marginSum = 0;
            const alertsBox = document.getElementById('stock-alerts');
            alertsBox.innerHTML = '';

            products.forEach(p => {
                totalQty += p.qty;
                const { margin } = calculateMetrics(p.cost, p.price);
                marginSum += margin;

                if (p.qty <= p.minStock) {
                    const isZero = p.qty === 0;
                    const bgClass = isZero ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-700';
                    const iconClass = isZero ? 'fa-circle-xmark text-red-400' : 'fa-circle-exclamation text-slate-400';
                    alertsBox.innerHTML += `
                        <div class="flex items-center justify-between p-3 rounded-xl border ${bgClass} m-0">
                            <div class="flex items-center"><i class="fa-solid ${iconClass} mr-3"></i> <span class="font-semibold text-sm">${escapeHTML(p.name)}</span></div>
                            <span class="text-xs font-bold px-2 py-1 bg-white rounded shadow-sm border border-slate-100">${p.qty} un</span>
                        </div>`;
                }
            });

            if (products.length === 0 || alertsBox.innerHTML === '') alertsBox.innerHTML = '<div class="col-span-full text-slate-400 text-sm">Estoque regularizado.</div>';
            
            document.getElementById('kpi-stock').innerText = totalQty;
            const avgMargin = products.length > 0 ? (marginSum / products.length).toFixed(1) : 0;
            document.getElementById('kpi-margin').innerText = `${avgMargin}%`;

            const currentRevenue = currentMonthSales.reduce((sum, s) => sum + s.total, 0);
            const currentProfit = currentMonthSales.reduce((sum, s) => sum + s.profit, 0);
            document.getElementById('kpi-revenue').innerText = formatMoney(currentRevenue);
            document.getElementById('kpi-profit').innerText = formatMoney(currentProfit);

            renderCharts();
        }

        function renderCharts() {
            // GRÁFICO 1: VENDAS POR SEMANA (Baseado no dia da venda)
            let w1=0, w2=0, w3=0, w4=0;
            currentMonthSales.forEach(s => {
                const day = parseInt(s.date.split('/')[0]); 
                if (day <= 7) w1 += s.total;
                else if (day <= 14) w2 += s.total;
                else if (day <= 21) w3 += s.total;
                else w4 += s.total;
            });

            const ctxWeekly = document.getElementById('chartGeneralWeekly').getContext('2d');
            if(chartWeeklyInstance) chartWeeklyInstance.destroy();
            chartWeeklyInstance = new Chart(ctxWeekly, {
                type: 'bar',
                data: {
                    labels: ['Sem 1 (Dias 1-7)', 'Sem 2 (8-14)', 'Sem 3 (15-21)', 'Sem 4 (22+)'],
                    datasets: [{
                        label: 'Faturamento (R$)',
                        data: [w1, w2, w3, w4],
                        backgroundColor: '#b45309',
                        borderRadius: 6,
                        barPercentage: 0.6
                    }]
                },
                options: { 
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, border: { display: false } },
                        y: { 
                            beginAtZero: true, 
                            suggestedMax: 200, // Teto inicial fixo, o gráfico vai preenchendo de baixo pra cima
                            grid: { color: '#f0ede8' }, 
                            border: { display: false },
                            ticks: { callback: function(value) { return 'R$ ' + value; } }
                        }
                    }
                }
            });

            // GRÁFICO 2: PRODUTOS MAIS VENDIDOS
            const productSalesMap = {};
            currentMonthSales.forEach(s => {
                if(!productSalesMap[s.productName]) productSalesMap[s.productName] = 0;
                productSalesMap[s.productName] += s.total;
            });

            const sortedProducts = Object.entries(productSalesMap).sort((a, b) => b[1] - a[1]).slice(0, 7);
            const prodLabels = sortedProducts.length > 0 ? sortedProducts.map(item => item[0]) : [''];
            const prodData = sortedProducts.length > 0 ? sortedProducts.map(item => item[1]) : [0];

            const ctxProduct = document.getElementById('chartProductPerformance').getContext('2d');
            if(chartProductInstance) chartProductInstance.destroy();
            chartProductInstance = new Chart(ctxProduct, {
                type: 'bar',
                data: {
                    labels: prodLabels,
                    datasets: [{
                        label: 'Faturado no Mês (R$)',
                        data: prodData,
                        backgroundColor: '#78716c',
                        borderRadius: 6,
                        barPercentage: 0.6
                    }]
                },
                options: { 
                    indexAxis: 'y', 
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { 
                            beginAtZero: true,
                            suggestedMax: 100, // Teto inicial, a barra cresce para a direita
                            grid: { color: '#f0ede8' }, 
                            border: { display: false },
                            ticks: { callback: function(value) { return 'R$ ' + value; } }
                        },
                        y: { grid: { display: false }, border: { display: false } }
                    }
                }
            });
        }
