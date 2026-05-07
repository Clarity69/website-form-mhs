let mahasiswaData = [];
let currentPage = 1;
const rowsPerPage = 5;
const STORAGE_KEY = "mhs_data";

loadData();

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        mahasiswaData = JSON.parse(saved);
    }
    renderTable(mahasiswaData);
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mahasiswaData));
}

const formElement = document.querySelector('.grid-form');
formElement.addEventListener('submit', function (e) {
    e.preventDefault();
    submitData();
});

function submitData() {
    const namaValue   = document.getElementById('nama').value.trim();
    const nimValue    = document.getElementById('nim').value.trim();
    const alamatValue = document.getElementById('alamat').value.trim();
    const tglValue    = document.getElementById('tgl').value;
    const passValue   = document.getElementById('password').value;
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    const genderValue = selectedGender ? selectedGender.value : "";

    if (!namaValue || !nimValue || !genderValue) {
        alert("Nama, NIM, dan Jenis Kelamin wajib diisi!");
        return;
    }

    mahasiswaData.push({ nim: nimValue, nama: namaValue, alamat: alamatValue, tgl: tglValue, gender: genderValue, password: passValue });

    saveData();          // FIX: persist to localStorage
    currentPage = 1;
    renderTable(mahasiswaData);
    formElement.reset();
}

function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end   = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:20px;opacity:.5;">Tidak ada data.</td></tr>`;
        updatePagination(data, 0);
        return;
    }

    paginatedData.forEach((mhs, index) => {
        const realIndex = mahasiswaData.indexOf(mhs);
        const row = `
            <tr>
                <td>${start + index + 1}</td>
                <td>${mhs.nim}</td>
                <td>${mhs.nama}</td>
                <td>${mhs.alamat}</td>
                <td>${mhs.tgl}</td>
                <td><span class="badge">${mhs.gender}</span></td>
                <td>
                    <div class="pw-container">
                        <span class="pw-text" data-opened="false" data-pw="${mhs.password}">••••••••</span>
                        <button type="button" class="view-btn" onclick="toggleView(this)">
                            <img src="assets/eye.png" width="20">
                        </button>
                    </div>
                </td>
                <td class="action-btns">
                    <button class="edit-btn"   onclick="editRow(${realIndex})">
                        <img class="edit-img"   src="assets/edit.png"  width="20">
                    </button>
                    <button class="delete-btn" onclick="deleteRow(${realIndex})">
                        <img class="delete-img" src="assets/trash.png" width="20">
                    </button>
                </td>
            </tr>`;
        tableBody.innerHTML += row;
    });

    updatePagination(data, data.length);
}

function updatePagination(data, totalData) {
    const totalPages = Math.ceil(totalData / rowsPerPage);
    const container  = document.getElementById('pagination-numbers');
    const info       = document.getElementById('pagination-info');

    container.innerHTML = "";

    const start = totalData === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const end   = Math.min(currentPage * rowsPerPage, totalData);
    info.innerText = totalData === 0 ? "Tidak ada data" : `Menampilkan ${start}–${end} dari ${totalData} data`;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText  = i;
        btn.className  = `page-num ${i === currentPage ? 'active' : ''}`;
        btn.onclick    = () => {
            currentPage = i;
            renderTable(data);
        };
        container.appendChild(btn);
    }
}

document.getElementById('data-search').addEventListener('input', function (e) {
    const keyword = e.target.value.toLowerCase();
    const filteredData = mahasiswaData.filter(mhs =>
        mhs.nama.toLowerCase().includes(keyword) ||
        mhs.nim.includes(keyword)
    );
    currentPage = 1;
    renderTable(filteredData);
});

function toggleView(btn) {
    const container  = btn.parentElement;
    const textSpan   = container.querySelector('.pw-text');
    const isOpened   = textSpan.getAttribute('data-opened') === 'true';
    const originalPw = textSpan.getAttribute('data-pw');

    if (isOpened) {
        textSpan.innerText = "••••••••";
        textSpan.setAttribute('data-opened', 'false');
        btn.innerHTML = `<img src="assets/eye.png" width="20">`;
    } else {
        textSpan.innerText = originalPw;
        textSpan.setAttribute('data-opened', 'true');
        btn.innerHTML = `<img src="assets/hide.png" width="20">`;
    }
}

function deleteRow(index) {
    if (!confirm(`Hapus data "${mahasiswaData[index].nama}"?`)) return;
    mahasiswaData.splice(index, 1);
    saveData();
    const totalPages = Math.ceil(mahasiswaData.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = Math.max(totalPages, 1);
    renderTable(mahasiswaData);
}

function editRow(index) {
    const mhs = mahasiswaData[index];
    document.getElementById('nama').value     = mhs.nama;
    document.getElementById('nim').value      = mhs.nim;
    document.getElementById('alamat').value   = mhs.alamat;
    document.getElementById('tgl').value      = mhs.tgl;
    document.getElementById('password').value = mhs.password;

    const radios = document.querySelectorAll('input[name="gender"]');
    radios.forEach(r => { r.checked = r.value === mhs.gender; });

    mahasiswaData.splice(index, 1);
    saveData();

    document.getElementById('submit-btn').innerText = "Update";
    document.getElementById('nama').focus();
}

function exportToCSV() {
    if (mahasiswaData.length === 0) { alert("Tidak ada data untuk diekspor."); return; }
    let csvContent = "data:text/csv;charset=utf-8,No,NIM,Nama,Alamat,Tanggal,Gender\n";
    mahasiswaData.forEach((mhs, i) => {
        csvContent += `${i + 1},${mhs.nim},${mhs.nama},${mhs.alamat},${mhs.tgl},${mhs.gender}\n`;
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "data_mahasiswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}