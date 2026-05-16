// config API database(HARDCODED)
const DB_URL = "https://jzytmeqcrlxrwixopnxo.supabase.co";
const DB_KEY = "sb_publishable_cETj0RHh2XRB98XPu74AEg_SYea_WWX";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

// Data Input
const tableBody = document.getElementById("table-body");
const form = document.getElementById("grid-form");
const searchInput = document.getElementById("data-search");

// Setting untuk menampilkan data pagination
let currentPage = 1;
const rowsPerPage = 5;

// Ambil Data
async function fetchData() {
    const keyword = searchInput.value.toLowerCase();
    const start = (currentPage-1) * rowsPerPage;
    const end = start + rowsPerPage - 1;

    // Query
    let query = _supabase
    .from('data_mhs')
    .select('*', {count: 'exact'});

    // Filter Input
    if(keyword){
        query = query.or(`nama.ilike.%${keyword}%,nim.ilike.%${keyword}%`);
    }

    const {data, count, error} = await query
    .range(start, end)
    .order('created_at', {ascending:false});


    if(error){
        console.error("Gagal Ambil Data:", error);
    }
    else {
        renderTable(data, start);
        pagination(count);
    }
}

// Render Table
function renderTable(data, startIdx) { 
    tableBody.innerHTML = "";
    data.forEach((mhs, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${startIdx + index + 1}</td>
            <td>${mhs.nim}</td>
            <td>${mhs.nama}</td>
            <td>${mhs.alamat}</td>
            <td>${mhs.tgl}</td>
            <td>${mhs.gender}</td>
            <td>
                <span class="pw-text" data-opened="false" data-pw="${mhs.pw}">••••••••</span>            
            </td>
            <td class="action-btns">
                <button class="edit-btn" onclick="editData('${mhs.nim}')">
                    <img src="assets/edit.png" width="20">
                </button>
                <button class="delete-btn" onclick="deleteData('${mhs.nim}')">
                    <img src="assets/trash.png" width="20">
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// SUBMIT
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        nim: document.getElementById("nim").value,
        nama: document.getElementById("nama").value,
        alamat: document.getElementById("alamat").value,
        tgl: document.getElementById("tgl").value,
        password: document.getElementById("pw").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || "-"
    };

    let result;
    
    if (form.dataset.mode === "edit") {
        // LOGIKA UPDATE
        result = await _supabase
            .from('data_mhs')
            .update(payload)
            .eq('nim', form.dataset.targetNim);
            
        // Kembalikan form ke mode tambah
        form.dataset.mode = "add";
        form.querySelector('button[type="submit"]').innerText = "Submit";
    } else {
        // LOGIKA INSERT BARU
        result = await _supabase.from('data_mhs').insert([payload]);
    }

    if (result.error) {
        alert("Gagal memproses data: " + result.error.message);
    } else {
        form.reset();
        fetchData();
    }
});

// SEARCH, PAGINATION
searchInput.addEventListener("input", () => {
    currentPage = 1;
    fetchData();
});

function pagination(totalCount) {
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    const container = document.getElementById("pagination-numbers");
    const info = document.getElementById("pagination-info");

    if (info) {
        info.innerHTML = `[ PAGE <span class="accent">${currentPage}</span> OF <span class="accent">${totalPages || 1}</span> ]`;
    }
    
    if (container) {
        container.innerHTML = ""; 
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
            btn.onclick = () => {
                currentPage = i;
                fetchData();
            };
            container.appendChild(btn);
        }
    }
}

// EDIT DELETE
async function deleteData(nim) {
    const konfirmasi = confirm(`Apakah Yakin Ingin Mengahpus Data dengan NIM : ${nim}`);
    
    if(konfirmasi){
        const {error} = await _supabase
        .from('data_mhs')
        .delete()
        .eq('nim', nim);

        if(error){
            alert("Gagal Menghapus:" + error.message);
        } else {
            fetchData();
        }
    }
}

async function editData(nim) {
    const {data, error} = await _supabase
    .from('data_mhs')
    .select('*')
    .eq('nim', nim)
    .single();

        if(error){
            alert("Gagal mengambil data untuk edit: "+ error.message);
            return;
        }

    document.getElementById("nim").value = data.nim;
    document.getElementById("nama").value = data.nama; 
    document.getElementById("alamat").value = data.alamat;
    document.getElementById("tgl").value = data.tgl;
    document.getElementById("pw").value = data.password;

    const genderRadio = document.getElementsByName("gender");
    genderRadio.forEach(radio => {
        if(radio.value === data.gender) radio.checked = true;
    });

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerText = "Update";

    form.dataset.mode = "edit";
    form.dataset.targetNim = nim;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// EXPORT
async function exportCSV() {
    const {data, error} = await _supabase
    .from('data_mhs')
    .select('nim, nama, alamat, tgl, gender');

    if(error){
        alert("Gagal Mengabil Data:" + error.message);
        return;
    }

    const headers = ["nim", "nama", "alamat", "tgl_lahir", "gender"];

    const csvRows = [
        headers.join(','),
        ...data.map(row => [
            `"${row.nim}"`,      
            `"${row.nama}"`,
            `"${row.alamat}"`,
            `"${row.tgl}"`,
            `"${row.gender}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `data_mahasiswa_${new Date().getTime()}.csv`);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}



fetchData();