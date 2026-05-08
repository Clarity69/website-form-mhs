// config API database
const DB_KEY = "sb_publishable_cETj0RHh2XRB98XPu74AEg_SYea_WWX";
const DB_URL = "https://jzytmeqcrlxrwixopnxo.supabase.co/rest/v1/";
const supabase = supabase.createClient(DB_KEY, DB_URL);

// Data Input
const tableBody = document.getElementById("table-body");
const form = document.getElementById("grid-form");
const searchInput = document.getElementById("data-search");

let currentPage = 1;
const rowsPerPage = 5;

// Ambil Data
async function fetchData() {
    const keyword = searchInput.value.toLowerCase();
    const start = (currentPage-1) * rowsPerPage;
    const end = start + rowsPerPage - 1;

    // Query
    let query = supabase
    .from('mahasiswa')
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
        updatePagination(count);
    }
}

// Render Table
function renderTable(start, startIdx){
    tableBody.innerHTML = "";
    data.array.forEach(mhs, index  => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${startIdx + index + 1}</td>
                <td>${mhs.nim}</td>
                <td>${mhs.nama}</td>
                <td>${mhs.alamat}</td>
                <td>${mhs.tgl}</td>
                <td><span class="badge">${mhs.gender}</span></td>
                <td>
                    <span class="pw-text" data-opened="false" data-pw="${mhs.password}">••••••••</span>            
                </td>
                <td class="action-btns">
                    <button class="edit-btn" onclick="editRow(${realIndex})">
                        <img class="edit-img" src="assets/edit.png"  width="20">
                    </button>
                    <button class="delete-btn" onclick="deleteRow(${realIndex})">
                        <img class="delete-img" src="assets/trash.png" width="20">
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
        nim : document.getElementById("nim").value,
        nama : document.getElementById("nama").value,
        alamat : document.getElementById("alamat").value,
        tl : document.getElementById("tl").value,
        password : document.getElementById("pw").value,
        gender : document.querySelector('input[name="gender"]:checked')?.value || "-"
    };

    const {error} = await supabase.from('mahasiswa').insert([payload]);

    if(error){
        alert("gagal simpan: "+ error.message);
    } else {
        form.reset();
        fetchData();
    }
});

// SEARCH, PAGINATION
