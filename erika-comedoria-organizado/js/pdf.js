// --- RELATÓRIOS PDF MENSAL ---
        function renderReportsTable() {
            const tbody = document.getElementById('reports-table-body');
            tbody.innerHTML = '';
            if(reports.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-12 text-center text-slate-400 text-sm">Nenhum mês fechado ainda. Os relatórios aparecerão aqui quando o mês atual virar.</td></tr>`; return;
            }
            
            reports.forEach((rep, index) => {
                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50/50 transition border-b border-slate-50 last:border-0">
                        <td class="px-6 py-4">
                            <div class="text-sm font-bold text-slate-800 uppercase tracking-wider">${rep.name}</div>
                            <div class="text-[10px] text-textMuted mt-0.5">Fechado em: ${rep.closureDate}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">${formatMoney(rep.totalRevenue)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">+${formatMoney(rep.totalProfit)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <button onclick="downloadPDF(${index})" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow hover:shadow-md flex items-center justify-center mx-auto">
                                <i class="fa-solid fa-download mr-2"></i> PDF
                            </button>
                        </td>
                    </tr>`;
            });
        }

        function downloadPDF(index) {
            const rep = reports[index];
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(22);
            doc.setTextColor(180, 83, 9);
            doc.text("Erika Comedoria", 14, 20);
            
            doc.setFontSize(12);
            doc.setTextColor(100, 116, 139);
            doc.text(`Relatório Gerencial de Vendas e Lucro`, 14, 28);
            doc.text(`Período Referência: ${rep.name.toUpperCase()}`, 14, 34);
            
            doc.setDrawColor(226, 232, 240);
            doc.line(14, 40, 196, 40);

            doc.setFontSize(14);
            doc.setTextColor(51, 65, 85);
            doc.text("Resumo Financeiro do Mês:", 14, 50);
            
            doc.setFontSize(12);
            doc.text(`Faturamento Total:`, 14, 60);
            doc.setFont(undefined, 'bold');
            doc.text(`${formatMoney(rep.totalRevenue)}`, 60, 60);
            
            doc.setFont(undefined, 'normal');
            doc.text(`Lucro Bruto:`, 14, 68);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(180, 83, 9);
            doc.text(`+ ${formatMoney(rep.totalProfit)}`, 60, 68);

            if(rep.topProducts && rep.topProducts.length > 0) {
                const tableData = rep.topProducts.map((p, i) => [i+1, p.name, p.qty, formatMoney(p.total)]);
                doc.autoTable({
                    startY: 80,
                    head: [['#', 'Produto Mais Vendido', 'Qtd Vendida', 'Total Faturado']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [180, 83, 9] },
                    styles: { fontSize: 10, cellPadding: 4 }
                });
            }

            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Gerado via Sistema Erika Comedoria em ${new Date().toLocaleDateString('pt-BR')}`, 14, doc.internal.pageSize.height - 10);
            
            doc.save(`Relatorio_Comedoria_${rep.name.replace(' ', '_')}.pdf`);
        }
