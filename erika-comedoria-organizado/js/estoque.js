// --- INVENTORY ---
        function renderInventory(filter = '') {
            const tbody = document.getElementById('inventory-table-body');
            tbody.innerHTML = '';
            const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.sku.toLowerCase().includes(filter.toLowerCase()));
            if(filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-slate-400 text-sm">Nenhum registro.</td></tr>`; return;
            }
            filtered.forEach((p) => {
                const { profit } = calculateMetrics(p.cost, p.price);
                let stockBadge = `<span class="px-2.5 py-1 inline-flex text-[11px] font-bold rounded-md bg-blue-50 text-primary border border-blue-100">${p.qty} un</span>`;
                if(p.qty === 0) stockBadge = `<span class="px-2.5 py-1 inline-flex text-[11px] font-bold rounded-md bg-red-50 text-red-600 border border-red-100">Zerado</span>`;
                else if(p.qty <= p.minStock) stockBadge = `<span class="px-2.5 py-1 inline-flex text-[11px] font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200">${p.qty} un (Baixo)</span>`;

                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50/50 transition border-b border-slate-50 last:border-0">
                        <td class="px-6 py-4"><div class="text-sm font-semibold text-slate-800">${escapeHTML(p.name)}</div><div class="text-xs text-textMuted mt-0.5">${escapeHTML(p.sku)} &bull; ${escapeHTML(p.category)}</div></td>
                        <td class="px-6 py-4 whitespace-nowrap">${stockBadge}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-textMuted">${formatMoney(p.cost)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">${formatMoney(p.price)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">+${formatMoney(profit)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-center"><button onclick="deleteProduct('${p.id}')" class="text-slate-400 hover:text-red-500 w-8 h-8 rounded-lg hover:bg-red-50 transition" title="Excluir"><i class="fa-solid fa-trash-can text-sm"></i></button></td>
                    </tr>`;
            });
        }
        document.getElementById('search-product').addEventListener('input', (e) => renderInventory(e.target.value));

        document.getElementById('form-product').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('prod-name').value.trim();
            const sku = document.getElementById('prod-sku').value.trim();
            const category = document.getElementById('prod-category').value.trim() || 'Geral';
            const cost = parseFloat(document.getElementById('prod-cost').value);
            const price = parseFloat(document.getElementById('prod-price').value);
            const qty = parseInt(document.getElementById('prod-qty').value, 10);
            const minStock = parseInt(document.getElementById('prod-min').value, 10);

            if (!name || !sku || !Number.isFinite(cost) || !Number.isFinite(price) || !Number.isInteger(qty) || !Number.isInteger(minStock)) {
                alert('Preencha todos os campos obrigatórios corretamente.');
                return;
            }
            if (cost < 0 || price < 0 || qty < 0 || minStock < 0) {
                alert('Custos, preços e quantidades não podem ser negativos.');
                return;
            }
            if (products.some(p => p.sku.toLowerCase() === sku.toLowerCase())) {
                alert('Já existe um produto com esse SKU / código.');
                return;
            }

            products.push({ id: generateId(), name, sku, category, cost, price, qty, minStock });
            saveData(); closeModal(); alert('✅ Produto salvo no estoque!');
            if(!document.getElementById('view-sales').classList.contains('hidden-view')) populateSalesSelect();
        });

        function deleteProduct(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) {
                alert('Produto não encontrado. Atualize a página e tente novamente.');
                return;
            }

            if (confirm(`Certeza que deseja remover "${product.name}" do estoque?`)) {
                products = products.filter(p => p.id !== productId);
                saveData();
                populateSalesSelect();
            }
        }
