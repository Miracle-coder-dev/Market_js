document.addEventListener('DOMContentLoaded', function () {
    const mainPage = document.getElementById('mainPage');
    const reportPage = document.getElementById('reportPage');
    const marketForm = document.getElementById('marketForm');
    const productTable = document.getElementById('productTable');
    const reportTable = document.getElementById('reportTable');

    let products = JSON.parse(localStorage.getItem('products')) || [];

    renderTable();

    window.submitForm = function () {
        const xaridorNomi = document.getElementById('xaridorNomi').value;
        const maxsulotNomi = document.getElementById('maxsulotNomi').value;
        const maxsulotSoni = document.getElementById('maxsulotSoni').value;
        const maxsulotNarxi = document.getElementById('maxsulotNarxi').value;
        const manzili = document.getElementById('manzili').value;

        const jamiNarxi = maxsulotSoni * maxsulotNarxi;

        const product = {
            xaridorNomi,
            maxsulotNomi,
            maxsulotSoni,
            maxsulotNarxi,
            jamiNarxi,
            manzili
        };

        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        renderTable();
        marketForm.reset();
    };

    window.deleteProduct = function (index) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        renderTable();
    };

    window.showMain = function () {
        mainPage.style.display = 'block';
        reportPage.style.display = 'none';
    };

    window.showReport = function () {
        generateReport();
        mainPage.style.display = 'none';
        reportPage.style.display = 'block';
    };

    window.exportToExcel = function () {
        const worksheet = XLSX.utils.json_to_sheet(products);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        XLSX.writeFile(workbook, 'products.xlsx');
    };

    function renderTable() {
        productTable.innerHTML = '';

        products.forEach((product, index) => {
            const row = productTable.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);
            const cell7 = row.insertCell(6);

            cell1.textContent = product.xaridorNomi;
            cell2.textContent = product.maxsulotNomi;
            cell3.textContent = product.maxsulotSoni;
            cell4.textContent = product.maxsulotNarxi;
            cell5.textContent = product.jamiNarxi;
            cell6.textContent = product.manzili;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'O\'chirish';
            deleteButton.onclick = function () {
                deleteProduct(index);
            };

            cell7.appendChild(deleteButton);
        });
    }

    function generateReport() {
        reportTable.innerHTML = '';

        const report = {};

        products.forEach(product => {
            // Xaridor nomi bo'yicha hisobot
            if (!report[product.xaridorNomi]) {
                report[product.xaridorNomi] = {
                    count: 1,
                    totalNarx: product.jamiNarxi
                };
            } else {
                report[product.xaridorNomi].count++;
                report[product.xaridorNomi].totalNarx += product.jamiNarxi;
            }

            // Maxsulot nomi bo'yicha hisobot
            if (!report[product.maxsulotNomi]) {
                report[product.maxsulotNomi] = {
                    count: 1,
                    totalNarx: product.jamiNarxi
                };
            } else {
                report[product.maxsulotNomi].count++;
                report[product.maxsulotNomi].totalNarx += product.jamiNarxi;
            }

            // Manzil bo'yicha hisobot
            if (!report[product.manzili]) {
                report[product.manzili] = {
                    count: 1
                };
            } else {
                report[product.manzili].count++;
            }
        });

        const headerRow = reportTable.insertRow(-1);
        headerRow.innerHTML = '<th>Parametr</th><th>Hisobot</th>';

        for (const key in report) {
            const row = reportTable.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);

            cell1.textContent = key;
            cell2.textContent = `Ko'rsatilgan marta: ${report[key].count}, Jami narxi: ${report[key].totalNarx || report[key].count}`;
        }
    }
});
