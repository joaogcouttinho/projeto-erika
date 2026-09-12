// --- NAVIGATION & MODAL ---
        function navigate(viewId) {
            document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden-view'));
            document.getElementById(`view-${viewId}`).classList.remove('hidden-view');
            document.querySelectorAll('.nav-btn').forEach(el => {
                el.classList.remove('active-nav');
                if(el.dataset.target === viewId) el.classList.add('active-nav');
            });
            const titles = { 'dashboard': 'Visão Geral (Mês Atual)', 'inventory': 'Controle de Estoque', 'sales': 'Frente de Caixa', 'reports': 'Relatórios PDF' };
            document.getElementById('page-title').innerText = titles[viewId];
            if(viewId === 'sales') populateSalesSelect();
        }

        function openModal() {
            const m = document.getElementById('modal-product');
            const mc = document.getElementById('modal-content');
            m.style.display = 'flex';
            setTimeout(() => { m.classList.remove('opacity-0'); mc.classList.remove('scale-95'); }, 10);
        }
        function closeModal() {
            const m = document.getElementById('modal-product');
            const mc = document.getElementById('modal-content');
            m.classList.add('opacity-0'); mc.classList.add('scale-95');
            setTimeout(() => { m.style.display = 'none'; document.getElementById('form-product').reset(); }, 300);
        }

        function formatMoney(value) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
        function calculateMetrics(cost, price) {
            const profit = price - cost;
            const margin = price > 0 ? (profit / price) * 100 : 0;
            return { profit, margin };
        }

        function escapeHTML(value) {
            return String(value)
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#039;');
        }

        function generateId() {
            if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                return window.crypto.randomUUID();
            }
            return `prod-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        }

        // Compatibilidade com produtos salvos por versões anteriores, que ainda não possuem ID.
        let productsMigrated = false;
        products = products.map(p => {
            if (p.id) return p;
            productsMigrated = true;
            return { ...p, id: generateId() };
        });
        if (productsMigrated) {
            localStorage.setItem('erikacomedoria_products', JSON.stringify(products));
        }
