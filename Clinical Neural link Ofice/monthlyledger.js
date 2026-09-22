window.renderMonthlyLedger = function(event) {
    const workspace = document.getElementById('program-workspace');
    if (!workspace) return;

    // Clear active slideshow timer when entering ledger workspace
    if (window.quoteTimer) {
        clearInterval(window.quoteTimer);
        window.quoteTimer = null;
    }

    // Highlight active state in sidebar buttons
    document.querySelectorAll('.program-nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600/20', 'border-blue-500/50');
        btn.classList.add('bg-slate-900/60', 'border-slate-700/50');
    });
    
    // Find and highlight Monthly Ledger button if event came from click
    if (event && event.currentTarget) {
        event.currentTarget.classList.remove('bg-slate-900/60', 'border-slate-700/50');
        event.currentTarget.classList.add('bg-blue-600/20', 'border-blue-500/50');
    }

    // Reset workspace layout styles to accommodate the full ledger
    workspace.className = "flex-1 bg-slate-900 p-6 sm:p-8 overflow-y-auto min-h-[calc(100vh-81px)]";

    workspace.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">

            <!-- Navigation / Back to Dashboard Button -->
            <div>
                <button type="button" onclick="window.renderOfficeDashboard()" 
                    class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-400 transition cursor-pointer group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 px-3 py-1.5 rounded-lg shadow-sm">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition"></i>
                    <span>Back to Dashboard</span>
                </button>
            </div>

            <!-- Workspace Header Bar -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-blue-950/80">
                <div>
                    <h2 class="text-lg sm:text-xl font-black text-white uppercase tracking-wider">Executive Monthly Ledger</h2>
                    <p class="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Continuous Cashbook & Annual Profit Engine</p>
                </div>
                
                <div class="flex items-center gap-3">
                    <select id="ledgerMonthSelect" onchange="window.ledgerEngine.loadMonth(this.value)" class="bg-[#050b18] border border-blue-900/80 text-white text-xs font-bold rounded-xl px-3.5 py-2 outline-none focus:border-blue-500 shadow-sm cursor-pointer">
                        <option value="2026-01">January 2026</option>
                        <option value="2026-02">February 2026</option>
                        <option value="2026-03">March 2026</option>
                        <option value="2026-04">April 2026</option>
                        <option value="2026-05">May 2026</option>
                        <option value="2026-06">June 2026</option>
                        <option value="2026-07">July 2026</option>
                        <option value="2026-08">August 2026</option>
                        <option value="2026-09" selected>September 2026</option>
                        <option value="2026-10">October 2026</option>
                        <option value="2026-11">November 2026</option>
                        <option value="2026-12">December 2026</option>
                    </select>
                    <span id="ledgerStatusBadge" class="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">DRAFT</span>
                </div>
            </div>

            <!-- Metric Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-[#050b18]/60 border border-blue-950/80 rounded-xl p-4 shadow-sm">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Opening Balance</span>
                    <span id="displayOpening" class="text-xl font-black text-slate-200 mt-1 block">K0.00</span>
                    <span class="text-[9px] text-slate-500 block mt-0.5">Carried over from prior month</span>
                </div>
                
                <div class="bg-[#050b18]/60 border border-blue-950/80 rounded-xl p-4 shadow-sm">
                    <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Total Monthly Inflow</span>
                    <span id="displayInflow" class="text-xl font-black text-emerald-400 mt-1 block">K0.00</span>
                    <span class="text-[9px] text-slate-500 block mt-0.5">Opening + Subscription Revenue</span>
                </div>

                <div class="bg-[#050b18]/60 border border-blue-950/80 rounded-xl p-4 shadow-sm">
                    <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Closing Net Profit</span>
                    <span id="displayClosing" class="text-xl font-black text-blue-400 mt-1 block">K0.00</span>
                    <span class="text-[9px] text-slate-500 block mt-0.5">Rollover liquidity to next month</span>
                </div>
            </div>

            <!-- Ledger Input Columns -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Column 1: Inflow & Operational Expenses -->
                <div class="bg-[#050b18]/40 border border-blue-950/80 rounded-xl p-5 space-y-4 shadow-sm">
                    <h3 class="text-xs font-black text-white uppercase tracking-wider border-b border-blue-900/40 pb-2.5 flex items-center gap-2">
                        <i data-lucide="arrow-down-left" class="w-4 h-4 text-emerald-400"></i>
                        1. Inflow & Operational Expenses (OpEx)
                    </h3>
                    
                    <div>
                        <label class="block text-[10px] font-bold text-slate-300 uppercase mb-1">Monthly Subscription Income (ZMW)</label>
                        <input type="number" id="in_revenue" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-bold focus:border-emerald-500 outline-none transition">
                    </div>

                    <div class="pt-2">
                        <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">OpEx Breakdown</span>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[9px] font-bold text-slate-400 uppercase mb-1">Web Hosting / Render</label>
                                <input type="number" id="opex_hosting" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-slate-400 uppercase mb-1">AI API Tokens</label>
                                <input type="number" id="opex_tokens" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-slate-400 uppercase mb-1">Database Instance</label>
                                <input type="number" id="opex_db" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-slate-400 uppercase mb-1">Bank / Sparco Fees</label>
                                <input type="number" id="opex_fees" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Column 2: Profit Allocations -->
                <div class="bg-[#050b18]/40 border border-blue-950/80 rounded-xl p-5 space-y-4 shadow-sm">
                    <h3 class="text-xs font-black text-white uppercase tracking-wider border-b border-blue-900/40 pb-2.5 flex items-center gap-2">
                        <i data-lucide="pie-chart" class="w-4 h-4 text-blue-400"></i>
                        2. Capital & Profit Allocations
                    </h3>

                    <div class="space-y-3">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-300 uppercase mb-1">Compulsory Long-Term Savings</label>
                            <input type="number" id="alloc_savings" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-300 uppercase mb-1">Family Support Allocation</label>
                            <input type="number" id="alloc_family" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-300 uppercase mb-1">Tax Provision Reserve</label>
                            <input type="number" id="alloc_tax" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-300 uppercase mb-1">Owner's Draw (Personal Take-Home)</label>
                            <input type="number" id="alloc_draw" placeholder="0.00" oninput="window.ledgerEngine.calculate()" class="w-full bg-[#050b18] border border-blue-900/60 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-blue-500 transition">
                        </div>
                    </div>
                </div>

            </div>

            <!-- Bottom Action Bar -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#050b18]/80 border border-blue-950/80 p-4 rounded-xl shadow-md">
                <div class="text-xs text-slate-400">
                    Total Monthly Outflows: <span id="totalOutflows" class="font-bold text-rose-400">K0.00</span>
                </div>
                <div class="flex gap-3">
                    <button type="button" onclick="window.ledgerEngine.saveDraft(event)" class="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer">Save Draft</button>
                    <button type="button" onclick="window.ledgerEngine.finalizeMonth(event)" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer">Finalize & Balance Month</button>
                </div>
            </div>

        </div>
    `;

    if (window.lucide) {
        lucide.createIcons();
    }

    // Initialize ledger state and calculations for current month
    window.ledgerEngine.init();
};

// Global calculation and state engine attached to window
window.ledgerEngine = {
    currentMonth: '2026-09',
    openingBalance: 0,

    async init() {
        const select = document.getElementById('ledgerMonthSelect');
        if (select) {
            this.currentMonth = select.value;
        }
        await this.loadMonth(this.currentMonth);
    },

    fmt(val) {
        return 'K' + (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    val(id) {
        const el = document.getElementById(id);
        return el ? (parseFloat(el.value) || 0) : 0;
    },

    getPreviousMonthKey(monthStr) {
        const [year, month] = monthStr.split('-').map(Number);
        let prevYear = year;
        let prevMonth = month - 1;

        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear -= 1;
        }

        return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    },

    getClient() {
        const client = window.supabaseClient || window.supabase;
        if (!client) {
            console.error("Supabase client is missing from window.supabaseClient or window.supabase.");
            alert("Connection Error: Supabase client is not loaded.");
            return null;
        }
        return client;
    },

    async fetchPriorClosing(monthStr) {
        const prevKey = this.getPreviousMonthKey(monthStr);
        const client = this.getClient();
        if (!client) return 0;

        try {
            const { data, error } = await client
                .from('monthly_ledgers')
                .select('closing_profit')
                .eq('month_key', prevKey)
                .maybeSingle();

            if (error) {
                console.warn("Could not retrieve prior month closing balance:", error.message);
                return 0;
            }

            return data ? parseFloat(data.closing_profit) || 0 : 0;
        } catch (e) {
            console.error("Exception fetching prior closing balance:", e);
            return 0;
        }
    },

    calculate() {
        const revenue = this.val('in_revenue');
        const totalInflow = this.openingBalance + revenue;

        const opex = this.val('opex_hosting') + this.val('opex_tokens') + this.val('opex_db') + this.val('opex_fees');
        const allocations = this.val('alloc_savings') + this.val('alloc_family') + this.val('alloc_tax') + this.val('alloc_draw');

        const totalOutflows = opex + allocations;
        const closingNetProfit = totalInflow - totalOutflows;

        const displayOpening = document.getElementById('displayOpening');
        const displayInflow = document.getElementById('displayInflow');
        const displayClosing = document.getElementById('displayClosing');
        const totalOutflowsEl = document.getElementById('totalOutflows');

        if (displayOpening) displayOpening.innerText = this.fmt(this.openingBalance);
        if (displayInflow) displayInflow.innerText = this.fmt(totalInflow);
        if (displayClosing) displayClosing.innerText = this.fmt(closingNetProfit);
        if (totalOutflowsEl) totalOutflowsEl.innerText = this.fmt(totalOutflows);

        return {
            opening_balance: this.openingBalance,
            subscription_revenue: revenue,
            opex_hosting: this.val('opex_hosting'),
            opex_tokens: this.val('opex_tokens'),
            opex_db: this.val('opex_db'),
            opex_fees: this.val('opex_fees'),
            alloc_savings: this.val('alloc_savings'),
            alloc_family: this.val('alloc_family'),
            alloc_tax: this.val('alloc_tax'),
            alloc_draw: this.val('alloc_draw'),
            closing_profit: closingNetProfit
        };
    },

    async saveRecord(status, evt, buttonText) {
        if (evt && evt.preventDefault) evt.preventDefault();

        const btn = evt?.currentTarget || (event && event.currentTarget);
        const originalText = btn ? btn.innerText : '';
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Saving...";
        }

        const state = this.calculate();
        const client = this.getClient();

        if (!client) {
            if (btn) {
                btn.disabled = false;
                btn.innerText = originalText;
            }
            return;
        }

        const payload = {
            month_key: this.currentMonth,
            ...state,
            status: status,
            updated_at: new Date().toISOString()
        };

        try {
            console.log("Saving ledger state to Supabase table 'monthly_ledgers':", payload);

            const { data, error } = await client
                .from('monthly_ledgers')
                .upsert(payload, { onConflict: 'month_key' })
                .select();

            if (error) {
                console.error("Supabase upsert error:", error);
                alert("Database Insert Failed: " + error.message + "\nCheck table RLS policies in Supabase.");
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = originalText;
                }
                return;
            }

            console.log("Successfully saved ledger state:", data);

            const badge = document.getElementById('ledgerStatusBadge');
            if (badge) {
                badge.innerText = status;
                badge.className = status === 'BALANCED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider';
            }

            if (btn) {
                btn.innerText = buttonText;
                btn.classList.add("bg-emerald-600");
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.remove("bg-emerald-600");
                    btn.disabled = false;
                }, 1800);
            }

        } catch (err) {
            console.error("Exception during ledger save:", err);
            alert("Failed to save ledger record: " + err.message);
            if (btn) {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }
    },

    async saveDraft(evt) {
        await this.saveRecord('DRAFT', evt, "✓ Draft Saved!");
    },

    async finalizeMonth(evt) {
        await this.saveRecord('BALANCED', evt, "✓ Month Finalized!");
    },

    async loadMonth(monthStr) {
        this.currentMonth = monthStr;
        const client = this.getClient();

        this.openingBalance = await this.fetchPriorClosing(monthStr);

        let data = null;
        if (client) {
            try {
                const { data: res, error } = await client
                    .from('monthly_ledgers')
                    .select('*')
                    .eq('month_key', monthStr)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching record for month:", error);
                } else {
                    data = res;
                }
            } catch (err) {
                console.error("Exception loading month data:", err);
            }
        }

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = (val !== undefined && val !== null && val !== 0) ? val : '';
        };

        setVal('in_revenue', data?.subscription_revenue);
        setVal('opex_hosting', data?.opex_hosting);
        setVal('opex_tokens', data?.opex_tokens);
        setVal('opex_db', data?.opex_db);
        setVal('opex_fees', data?.opex_fees);
        setVal('alloc_savings', data?.alloc_savings);
        setVal('alloc_family', data?.alloc_family);
        setVal('alloc_tax', data?.alloc_tax);
        setVal('alloc_draw', data?.alloc_draw);

        const badge = document.getElementById('ledgerStatusBadge');
        if (badge) {
            const status = data?.status || 'DRAFT';
            badge.innerText = status;
            badge.className = status === 'BALANCED'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider';
        }

        this.calculate();
    }
};