// Global memory array to store temporary grid rows during data entry
window.activeRegisterRows = [];

/**
 * Helper to ensure Supabase client instance exists
 */
function getSupabaseClient() {
    if (window.supabaseClient) return window.supabaseClient;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        // Fallback initialization if supabase object is globally loaded
        return window.supabase;
    }
    console.error("Supabase client is not initialized on window.supabaseClient");
    return null;
}

/**
 * Renders the Interactive Spreadsheet Register Form in the Workspace
 */
window.handleCreateRegister = function(programKey, yearId) {
    const programData = PROGRAM_CONFIG[programKey];
    if (!programData) return;

    // Highlight active action button in sidebar
    document.querySelectorAll('.action-nav-btn').forEach(btn => {
        if (btn.getAttribute('onclick')?.includes('handleCreateRegister')) {
            btn.className = "action-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600/30 border border-blue-500/80 transition flex items-center justify-between group cursor-pointer shadow-md shadow-blue-950/40";
        } else {
            btn.className = "action-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900/60 border border-slate-700/50 hover:bg-slate-800/80 transition flex items-center justify-between group cursor-pointer shadow-sm";
        }
    });

    const workspace = document.getElementById('program-workspace');
    if (!workspace) return;

    // Reset grid rows and populate 5 default empty rows
    window.activeRegisterRows = [1, 2, 3, 4, 5];

    workspace.innerHTML = `
        <div class="w-full max-w-6xl mx-auto flex flex-col space-y-6 animate-in fade-in duration-300 pb-12">
            
            <!-- Navigation / Back Button -->
            <div>
                <button type="button" onclick="window.selectYear('${programKey}', ${yearId})" 
                    class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-400 transition cursor-pointer group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 px-3 py-1.5 rounded-lg shadow-sm">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition"></i>
                    <span>Back to Module Actions</span>
                </button>
            </div>

            <!-- Top Workspace Header -->
            <div class="border-b border-blue-950/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-md border border-blue-800/40">
                            ${programData.title}
                        </span>
                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-800/40">
                            Year ${yearId}
                        </span>
                    </div>
                    <h2 class="text-xl font-black text-white uppercase tracking-tight mt-2.5">Create New Class Register</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Enter student details manually below or add rows as needed before saving to Supabase.</p>
                </div>

                <div class="flex items-center gap-3">
                    <button type="button" onclick="window.addStudentRow('${programKey}', ${yearId})" 
                        class="px-4 py-2.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-800/60 hover:bg-blue-900/60 transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm">
                        <i data-lucide="plus-circle" class="w-4 h-4 text-blue-400"></i>
                        <span>Add Student Row</span>
                    </button>
                </div>
            </div>

            <!-- Spreadsheet Data Entry Table -->
            <div class="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#050b18] border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                <th class="py-3.5 px-4 w-12 text-center">#</th>
                                <th class="py-3.5 px-4 min-w-[200px]">Full Name</th>
                                <th class="py-3.5 px-4 min-w-[140px]">Student ID</th>
                                <th class="py-3.5 px-4 min-w-[150px]">Program</th>
                                <th class="py-3.5 px-4 w-28">Year</th>
                                <th class="py-3.5 px-4 min-w-[160px]">Phone Number</th>
                                <th class="py-3.5 px-4 w-14 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody id="spreadsheet-body" class="divide-y divide-slate-800/60 text-xs">
                            ${window.activeRegisterRows.map((index) => window.renderRowHtml(index, programData.title, yearId)).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Table Footer Controls -->
                <div class="p-4 bg-[#050b18]/80 border-t border-slate-800 flex items-center justify-between gap-4">
                    <button type="button" onclick="window.addStudentRow('${programKey}', ${yearId})" 
                        class="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition cursor-pointer">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>Add Row</span>
                    </button>

                    <div class="flex items-center space-x-3">
                        <span id="row-counter-badge" class="text-[11px] font-semibold text-slate-400">
                            Total Entries: ${window.activeRegisterRows.length}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Save Action Area -->
            <div class="flex items-center justify-end space-x-4 pt-2">
                <button type="button" id="save-register-btn" onclick="window.saveRegister('${programKey}', ${yearId})" 
                    class="px-6 py-3 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg shadow-emerald-950/50">
                    <i data-lucide="save" class="w-4 h-4"></i>
                    <span id="save-btn-text">Save to Supabase</span>
                </button>
            </div>

        </div>
    `;

    if (window.lucide) {
        lucide.createIcons();
    }
};

/**
 * Returns HTML string for a single grid input row.
 */
window.renderRowHtml = function(index, programName, yearId) {
    return `
        <tr id="student-row-${index}" class="hover:bg-slate-900/50 transition group">
            <td class="py-2.5 px-4 text-center font-bold text-slate-500 text-[11px] row-number">
                ${index}
            </td>
            <td class="py-2 px-3">
                <input type="text" placeholder="e.g. John Doe" 
                    class="student-fullname w-full bg-slate-900/80 border border-slate-700/60 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none transition" />
            </td>
            <td class="py-2 px-3">
                <input type="text" placeholder="e.g. 231000123" 
                    class="student-id w-full bg-slate-900/80 border border-slate-700/60 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none transition" />
            </td>
            <td class="py-2 px-3">
                <input type="text" value="${programName}" readonly 
                    class="student-program w-full bg-slate-950/60 border border-slate-800 text-slate-400 rounded-lg px-3 py-2 text-xs outline-none cursor-not-allowed font-medium" />
            </td>
            <td class="py-2 px-3">
                <input type="text" value="Year ${yearId}" readonly 
                    class="student-year w-full bg-slate-950/60 border border-slate-800 text-slate-400 rounded-lg px-3 py-2 text-xs outline-none cursor-not-allowed font-medium text-center" />
            </td>
            <td class="py-2 px-3">
                <input type="tel" placeholder="e.g. +260970000000" 
                    class="student-phone w-full bg-slate-900/80 border border-slate-700/60 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none transition" />
            </td>
            <td class="py-2 px-2 text-center">
                <button type="button" onclick="window.removeStudentRow('${index}')" 
                    title="Remove Row"
                    class="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition cursor-pointer">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `;
};

/**
 * Appends a new input row to the spreadsheet.
 */
window.addStudentRow = function(programKey, yearId) {
    const tbody = document.getElementById('spreadsheet-body');
    if (!tbody) return;

    const programData = PROGRAM_CONFIG[programKey];
    const newIndex = Date.now();

    const tr = document.createElement('tr');
    tr.id = `student-row-${newIndex}`;
    tr.className = "hover:bg-slate-900/50 transition group";
    tr.innerHTML = window.renderRowHtml(newIndex, programData.title, yearId);

    tbody.appendChild(tr);
    window.updateRowNumbers();

    if (window.lucide) {
        lucide.createIcons();
    }
};

/**
 * Removes a row from the spreadsheet grid.
 */
window.removeStudentRow = function(rowIndex) {
    const row = document.getElementById(`student-row-${rowIndex}`);
    if (row) {
        row.remove();
        window.updateRowNumbers();
    }
};

/**
 * Re-indexes row numbers and updates total counter badge.
 */
window.updateRowNumbers = function() {
    const rows = document.querySelectorAll('#spreadsheet-body tr');
    rows.forEach((row, idx) => {
        const numCell = row.querySelector('.row-number');
        if (numCell) numCell.textContent = idx + 1;
    });

    const badge = document.getElementById('row-counter-badge');
    if (badge) {
        badge.textContent = `Total Entries: ${rows.length}`;
    }
};

/**
 * Saves or updates student records directly in the Supabase 'class_registers' table[cite: 12].
 */
window.saveRegister = async function(programKey, yearId) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        alert("Database connection uninitialized. Please refresh and try again.");
        return;
    }

    const rows = document.querySelectorAll('#spreadsheet-body tr');
    const studentList = [];

    rows.forEach(row => {
        const fullName = row.querySelector('.student-fullname')?.value.trim();
        const studentId = row.querySelector('.student-id')?.value.trim();
        const program = row.querySelector('.student-program')?.value.trim();
        const year = row.querySelector('.student-year')?.value.trim();
        const phone = row.querySelector('.student-phone')?.value.trim();

        if (fullName || studentId) {
            studentList.push({
                full_name: fullName,
                student_id: studentId,
                program: program,
                year: year,
                phone: phone,
                program_key: programKey,
                year_id: parseInt(yearId, 10)
            });
        }
    });

    if (studentList.length === 0) {
        alert("Please enter at least one student record before saving.");
        return;
    }

    const saveBtn = document.getElementById('save-register-btn');
    const btnText = document.getElementById('save-btn-text');
    if (saveBtn) saveBtn.disabled = true;
    if (btnText) btnText.textContent = "Saving to Database...";

    try {
        // Delete existing records for this program & year before bulk inserting to perform a clean update
        await supabase
            .from('class_registers')
            .delete()
            .eq('program_key', programKey)
            .eq('year_id', parseInt(yearId, 10));

        // Insert new/updated student list
        const { data, error } = await supabase
            .from('class_registers')
            .insert(studentList)
            .select();

        if (error) throw error;

        alert(`Successfully saved ${data.length} records to Supabase!`);
        window.handleViewRegister(programKey, yearId);

    } catch (err) {
        console.error("Supabase Save Error:", err);
        alert("Failed to save register to database: " + (err.message || err));
    } finally {
        if (saveBtn) saveBtn.disabled = false;
        if (btnText) btnText.textContent = "Save to Supabase";
    }
};

/**
 * Fetches and renders saved class register directly from Supabase[cite: 12].
 */
window.handleViewRegister = async function(programKey, yearId) {
    const programData = PROGRAM_CONFIG[programKey];
    if (!programData) return;

    // Highlight active sidebar action button
    document.querySelectorAll('.action-nav-btn').forEach(btn => {
        if (btn.getAttribute('onclick')?.includes('handleViewRegister')) {
            btn.className = "action-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600/30 border border-blue-500/80 transition flex items-center justify-between group cursor-pointer shadow-md shadow-blue-950/40";
        } else {
            btn.className = "action-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900/60 border border-slate-700/50 hover:bg-slate-800/80 transition flex items-center justify-between group cursor-pointer shadow-sm";
        }
    });

    const workspace = document.getElementById('program-workspace');
    if (!workspace) return;

    // Show Loading Spinner
    workspace.innerHTML = `
        <div class="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-20 space-y-4">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs text-slate-400 font-semibold">Fetching roster from database...</p>
        </div>
    `;

    const supabase = getSupabaseClient();
    let studentList = [];

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('class_registers')
                .select('*')
                .eq('program_key', programKey)
                .eq('year_id', parseInt(yearId, 10))
                .order('created_at', { ascending: true });

            if (error) throw error;
            studentList = data || [];
        } catch (err) {
            console.error("Supabase Fetch Error:", err);
        }
    }

    const storeKey = `${programKey}_Y${yearId}`;
    window.lastFetchedRoster = studentList; // Cache last fetched list for CSV export

    // 1. Render Empty State if no records exist in database
    if (studentList.length === 0) {
        workspace.innerHTML = `
            <div class="w-full max-w-5xl mx-auto flex flex-col space-y-6 animate-in fade-in duration-300 pb-12">
                
                <!-- Navigation / Back Button -->
                <div>
                    <button type="button" onclick="window.selectYear('${programKey}', ${yearId})" 
                        class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-400 transition cursor-pointer group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 px-3 py-1.5 rounded-lg shadow-sm">
                        <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition"></i>
                        <span>Back to Module Actions</span>
                    </button>
                </div>

                <div class="border-b border-blue-950/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-md border border-blue-800/40">
                                ${programData.title}
                            </span>
                            <span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-800/40">
                                Year ${yearId}
                            </span>
                        </div>
                        <h2 class="text-xl font-black text-white uppercase tracking-tight mt-2.5">Class Roster Register</h2>
                    </div>
                </div>

                <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
                    <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                        <i data-lucide="database" class="w-8 h-8"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">No Database Records Found</h3>
                        <p class="text-xs text-slate-400 mt-1 max-w-md">There are no active records in Supabase for ${programData.title} Year ${yearId}. Click below to create a roster.</p>
                    </div>
                    <button type="button" onclick="window.handleCreateRegister('${programKey}', ${yearId})" 
                        class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-950/50">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        <span>Create Register Now</span>
                    </button>
                </div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    // 2. Render Active Register Table View
    workspace.innerHTML = `
        <div class="w-full max-w-6xl mx-auto flex flex-col space-y-6 animate-in fade-in duration-300 pb-12">
            
            <!-- Navigation / Back Button -->
            <div>
                <button type="button" onclick="window.selectYear('${programKey}', ${yearId})" 
                    class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-400 transition cursor-pointer group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 px-3 py-1.5 rounded-lg shadow-sm">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition"></i>
                    <span>Back to Module Actions</span>
                </button>
            </div>

            <!-- Workspace Header -->
            <div class="border-b border-blue-950/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-md border border-blue-800/40">
                            ${programData.title}
                        </span>
                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-800/40">
                            Year ${yearId}
                        </span>
                    </div>
                    <h2 class="text-xl font-black text-white uppercase tracking-tight mt-2.5">Saved Class Roster</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Verified active enrolled students loaded directly from Supabase database.</p>
                </div>

                <!-- Action Controls Header -->
                <div class="flex items-center gap-3">
                    <button type="button" onclick="window.exportToCSV('${storeKey}')" 
                        class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-700/60 hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer">
                        <i data-lucide="download" class="w-4 h-4 text-slate-400"></i>
                        <span>Export CSV</span>
                    </button>
                    
                    <button type="button" onclick="window.handleEditRegister('${programKey}', ${yearId})" 
                        class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition flex items-center gap-2 cursor-pointer shadow-md shadow-blue-950/40 active:scale-95">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                        <span>Update Register</span>
                    </button>
                </div>
            </div>

            <!-- Search Filter Bar & Counter -->
            <div class="flex items-center justify-between gap-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <div class="relative flex-1 max-w-xs">
                    <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                    <input type="text" id="roster-search-input" onkeyup="window.filterRosterTable()" placeholder="Search by name or ID..." 
                        class="w-full bg-slate-900 border border-slate-700/60 focus:border-blue-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 outline-none transition" />
                </div>
                <span class="text-xs font-bold text-slate-400">Total Students: <span class="text-blue-400 font-black">${studentList.length}</span></span>
            </div>

            <!-- Display Table -->
            <div class="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse" id="view-roster-table">
                        <thead>
                            <tr class="bg-[#050b18] border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                <th class="py-3.5 px-4 w-12 text-center">#</th>
                                <th class="py-3.5 px-4 min-w-[200px]">Full Name</th>
                                <th class="py-3.5 px-4 min-w-[140px]">Student ID</th>
                                <th class="py-3.5 px-4 min-w-[150px]">Program</th>
                                <th class="py-3.5 px-4 w-28">Year</th>
                                <th class="py-3.5 px-4 min-w-[160px]">Phone Number</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60 text-xs">
                            ${studentList.map((st, idx) => `
                                <tr class="hover:bg-slate-900/40 transition">
                                    <td class="py-3.5 px-4 text-center font-bold text-slate-500 text-[11px]">${idx + 1}</td>
                                    <td class="py-3.5 px-4 font-bold text-white">${st.full_name || '-'}</td>
                                    <td class="py-3.5 px-4 text-slate-300 font-mono">${st.student_id || '-'}</td>
                                    <td class="py-3.5 px-4 text-slate-400">${st.program}</td>
                                    <td class="py-3.5 px-4"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800/60">${st.year}</span></td>
                                    <td class="py-3.5 px-4 text-slate-300">${st.phone || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Bottom Update Action Bar -->
            <div class="flex items-center justify-between border-t border-slate-800/80 pt-4">
                <p class="text-xs text-slate-500">Need to modify student records or add new entries?</p>
                <button type="button" onclick="window.handleEditRegister('${programKey}', ${yearId})" 
                    class="px-6 py-3 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg shadow-blue-950/50">
                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                    <span>Update Register</span>
                </button>
            </div>

        </div>
    `;

    if (window.lucide) {
        lucide.createIcons();
    }
};

/**
 * Opens Create Register in Edit Mode pre-populated with database records
 */
window.handleEditRegister = async function(programKey, yearId) {
    window.handleCreateRegister(programKey, yearId);

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const tbody = document.getElementById('spreadsheet-body');
    if (!tbody) return;

    try {
        const { data: existingList } = await supabase
            .from('class_registers')
            .select('*')
            .eq('program_key', programKey)
            .eq('year_id', parseInt(yearId, 10))
            .order('created_at', { ascending: true });

        if (existingList && existingList.length > 0) {
            tbody.innerHTML = '';
            existingList.forEach((st, idx) => {
                const rowIdx = idx + 1;
                const tr = document.createElement('tr');
                tr.id = `student-row-${rowIdx}`;
                tr.className = "hover:bg-slate-900/50 transition group";
                tr.innerHTML = window.renderRowHtml(rowIdx, st.program, yearId);
                
                tr.querySelector('.student-fullname').value = st.full_name || '';
                tr.querySelector('.student-id').value = st.student_id || '';
                tr.querySelector('.student-phone').value = st.phone || '';

                tbody.appendChild(tr);
            });
            window.updateRowNumbers();
        }
    } catch (err) {
        console.error("Error populating edit rows from Supabase:", err);
    }

    if (window.lucide) lucide.createIcons();
};

/**
 * Client-side table search filter
 */
window.filterRosterTable = function() {
    const query = document.getElementById('roster-search-input')?.value.toLowerCase() || '';
    const rows = document.querySelectorAll('#view-roster-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
};

/**
 * CSV Exporter Handler
 */
window.exportToCSV = function(storeKey) {
    const studentList = window.lastFetchedRoster || [];
    if (studentList.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,Full Name,Student ID,Program,Year,Phone Number\n";
    studentList.forEach(st => {
        csvContent += `"${st.full_name}","${st.student_id}","${st.program}","${st.year}","${st.phone}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${storeKey}_Class_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};