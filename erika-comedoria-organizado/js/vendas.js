// --- SALES ---
        const saleSelect = document.getElementById('sale-product');
        const saleQty = document.getElementById('sale-qty');
        const salePrice = document.getElementById('sale-price');
        
        function populateSalesSelect() {
            saleSelect.innerHTML = '<option value="">Localizar produto no estoque...</option>';
            products.filter(p => p.qty > 0).forEach((p) => {
                saleSelect.innerHTML += `<option value="${p.id}">${escapeHTML(p.name)} (${p.qty} un) - ${formatMoney(p.price)}</option>`;
            });
            renderSalesHistory();
        }

        saleSelect.addEventListener('change', (e) => {
            const prod = products.find(p => p.id === e.target.value);
            if(prod) { salePrice.value = prod.price; saleQty.max = prod.qty; saleQty.value = 1; updateSaleTotal(); } 
            else { salePrice.value = ''; saleQty.value = ''; document.getElementById('sale-total').innerText = 'R$ 0,00'; }
        });
        saleQty.addEventListener('input', updateSaleTotal);
        function updateSaleTotal() { document.getElementById('sale-total').innerText = formatMoney((parseInt(saleQty.value)||0) * (parseFloat(salePrice.value)||0)); }

        document.getElementById('form-sale').addEventListener('submit', (e) => {
            e.preventDefault();
            const productId = saleSelect.value;
            const qty = parseInt(saleQty.value, 10);
            if(productId !== '' && qty > 0) {
                const prod = products.find(p => p.id === productId);
                if (!prod) { alert('Produto não encontrado no estoque.'); return; }
                if(qty > prod.qty) { alert('Quantidade insuficiente no estoque!'); return; }
                
                const unitProfit = prod.price - prod.cost;
                allSales.unshift({
                    date: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
                    monthId: activeMonthId,
                    productName: prod.name,
                    qty: qty,
                    total: prod.price * qty,
                    profit: unitProfit * qty
                });
                prod.qty -= qty;
                saveData(); populateSalesSelect(); document.getElementById('form-sale').reset(); document.getElementById('sale-total').innerText = 'R$ 0,00';
            }
        });

        function renderSalesHistory() {
            const tbody = document.getElementById('sales-history-body');
            tbody.innerHTML = '';
            if(currentMonthSales.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-400 text-sm">Nenhuma venda registrada neste mês.</td></tr>`; return;
            }
            currentMonthSales.slice(0, 10).forEach(s => {
                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50/50 transition border-b border-slate-50 last:border-0">
                        <td class="px-6 py-4 text-[11px] font-medium text-textMuted">${s.date}</td>
                        <td class="px-6 py-4 text-sm font-semibold text-slate-800">${escapeHTML(s.productName)}</td>
                        <td class="px-6 py-4 text-sm text-textMuted text-center">${s.qty}</td>
                        <td class="px-6 py-4 text-sm font-bold text-primary">${formatMoney(s.total)}</td>
                    </tr>`;
            });
        }
