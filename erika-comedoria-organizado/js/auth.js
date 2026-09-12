// --- AUTENTICAÇÃO ---
        // Observação: este login continua sendo apenas demonstrativo/local.
        // Sem backend, não é possível proteger credenciais de forma realmente segura no navegador.
        const loginScreen = document.getElementById('login-screen');
        const appLayout = document.getElementById('app-layout');
        const loginForm = document.getElementById('form-login');
        const loginError = document.getElementById('login-error');

        function checkAuth() {
            const isAuth = localStorage.getItem('erikacomedoria_auth');
            if (isAuth === 'true') {
                loginScreen.style.display = 'none';
                appLayout.classList.remove('hidden');
                checkMonthRollover(); 
                updateDashboard();
                renderInventory();
            } else {
                loginScreen.style.display = 'flex';
                appLayout.classList.add('hidden');
            }
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('login-user').value.trim();
            const pass = document.getElementById('login-pass').value;

            if (user.toLowerCase() === 'erikabezerra' && pass === 'Erika2020') {
                localStorage.setItem('erikacomedoria_auth', 'true');
                loginError.classList.add('hidden');
                checkAuth();
            } else {
                loginError.classList.remove('hidden');
            }
        });

        function logout() { localStorage.removeItem('erikacomedoria_auth'); checkAuth(); }
        checkAuth();

        function saveData() {
            localStorage.setItem('erikacomedoria_products', JSON.stringify(products));
            localStorage.setItem('erikacomedoria_sales', JSON.stringify(allSales));
            currentMonthSales = allSales.filter(s => s.monthId === activeMonthId);
            updateDashboard();
            renderInventory();
        }
