// Register Service Worker & Install Handler
window.deferredPwaPrompt = null;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((reg) => console.log('Service Worker Registered:', reg.scope))
            .catch((err) => console.error('Service Worker Registration Failed:', err));
    });
}

// Capture native install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPwaPrompt = e;
    
    // Show custom UI install button if present
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.classList.remove('hidden');
    }
});

// Trigger Install Action
window.installPWA = async function() {
    if (!window.deferredPwaPrompt) return;
    
    window.deferredPwaPrompt.prompt();
    const { outcome } = await window.deferredPwaPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('User installed Clinical Neural Link Office');
    }
    window.deferredPwaPrompt = null;
    
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.classList.add('hidden');
    }
};

// Hide button once app is successfully installed
window.addEventListener('appinstalled', () => {
    console.log('CNL Office PWA Installed successfully');
    window.deferredPwaPrompt = null;
});
/**
 * Renders the Office Executive Access Portal with Refined Glassmorphism & Field Theme
 */
window.renderOfficeLogin = function() {
    const viewport = document.getElementById('app-viewport');
    if (!viewport) return;

    // Set background image and flex centering layout
    viewport.removeAttribute('style');
    viewport.style.backgroundImage = "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop')";
    viewport.className = "w-full h-full min-h-screen flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat";

    viewport.innerHTML = `
        <div id="login-container" class="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/50 ring-1 ring-white/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/20 relative overflow-hidden animate-in fade-in zoom-in duration-300">
            
            <!-- Top Light Reflection Sweep -->
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-white/30 blur-2xl pointer-events-none rounded-full"></div>

            <!-- Header Section -->
            <div class="text-center mb-8 relative">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-white/40 border border-white/60 backdrop-blur-md rounded-2xl mb-4 text-emerald-950 shadow-md shadow-emerald-950/10">
                    <i data-lucide="shield-check" class="w-8 h-8"></i>
                </div>
                <h1 class="text-2xl font-black uppercase tracking-tight text-slate-900 drop-shadow-sm">Office Access</h1>
                <p class="text-xs font-bold text-slate-800/80 tracking-wider uppercase mt-1">Clinical Neural Link Management</p>
            </div>

            <!-- Login Form -->
            <form id="office-login-form" class="space-y-6">
                
                <!-- Administrator PIN Input -->
                <div>
                    <label for="admin-key" class="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 drop-shadow-sm">
                        Executive Key / Passcode
                    </label>
                    <div class="relative">
                        <input type="password" id="admin-key" required autocomplete="off" placeholder="••••••••"
                            class="w-full bg-white/40 border border-white/60 rounded-xl px-4 py-3.5 pr-12 text-slate-950 font-bold placeholder-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-900/40 focus:bg-white/60 backdrop-blur-md transition-all text-lg font-mono shadow-inner">
                        
                        <button type="button" onclick="window.toggleAdminKeyVisibility()" 
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-950 p-1 transition cursor-pointer"
                            aria-label="Toggle Passcode Visibility">
                            <span id="eye-icon-container">
                                <i data-lucide="eye" class="w-5 h-5"></i>
                            </span>
                        </button>
                    </div>
                </div>

                <!-- Submission Button -->
                <button type="submit" 
                    class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-slate-950/20 transition-all cursor-pointer text-sm flex items-center justify-center space-x-2 active:scale-[0.98]">
                    <span>Unlock Office</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </form>

            <!-- Footer Badge -->
            <div class="mt-8 pt-6 border-t border-slate-900/10 text-center">
                <span class="text-[10px] uppercase font-mono tracking-widest text-slate-800/80 font-semibold drop-shadow-sm">
                    Class Register & Executive Ledger v1.0
                </span>
            </div>

        </div>
    `;

    // Initialize Lucide icons on newly rendered view elements
    if (window.lucide) {
        lucide.createIcons();
    }

    // Attach form submission event listener
    const loginForm = document.getElementById('office-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const passcode = document.getElementById('admin-key').value;
            window.handleOfficeLogin(passcode);
        });
    }
};

/**
 * Toggles input password masking for the passcode field
 */
window.toggleAdminKeyVisibility = function() {
    const input = document.getElementById('admin-key');
    const eyeContainer = document.getElementById('eye-icon-container');
    if (!input || !eyeContainer) return;

    if (input.type === 'password') {
        input.type = 'text';
        eyeContainer.innerHTML = `<i data-lucide="eye-off" class="w-5 h-5"></i>`;
    } else {
        input.type = 'password';
        eyeContainer.innerHTML = `<i data-lucide="eye" class="w-5 h-5"></i>`;
    }

    if (window.lucide) lucide.createIcons();
};


window.handleOfficeLogin = async function(passcode) {
    if (!passcode) {
        alert("Please enter a valid Executive Key.");
        return;
    }

    try {
        // Call the secure database function via Supabase RPC
        const { data: isValid, error } = await supabaseClient.rpc('verify_executive_key', {
            input_key: passcode
        });

        if (error) {
            console.error("Supabase RPC error:", error);
            alert("Error validating passcode. Please try again.");
            return;
        }

        if (isValid) {
            // Store session status in SessionStorage (cleared when browser closes)
            sessionStorage.setItem('cnl_office_session', 'authenticated');
            window.renderOfficeDashboard();
        } else {
            alert("Invalid Executive Key / Passcode!");
        }

    } catch (err) {
        console.error("Login verification failed:", err);
        alert("Unable to connect to verification server.");
    }
};
/**
 * Handles user logout and clears saved session
 */
window.handleOfficeLogout = function() {
    localStorage.removeItem('cnl_office_session');
    window.renderOfficeLogin();
};

// Auto-check session on page load / live reload
document.addEventListener('DOMContentLoaded', function() {
    const session = localStorage.getItem('cnl_office_session');
    if (session === 'authenticated') {
        window.renderOfficeDashboard();
    } else {
        window.renderOfficeLogin();
    }
});

/**
 * Renders the Executive Dashboard Layout with Flush Sidebar & Workspace
 */
window.renderOfficeDashboard = function() {
    const viewport = document.getElementById('app-viewport');
    if (!viewport) return;

    // Clear any active quote slideshow timer on full re-render
    if (window.quoteTimer) clearInterval(window.quoteTimer);

    viewport.removeAttribute('style');
    viewport.className = "w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col transition-colors duration-500 overflow-x-hidden";

    viewport.innerHTML = `
        <div id="dashboard-shell" class="w-full flex-1 flex flex-col animate-in fade-in duration-300">
            
            <!-- Navigation Header -->
            <header class="w-full bg-[#050b18] border-b border-blue-950/80 px-6 sm:px-10 py-4 shadow-xl shadow-blue-950/20 flex items-center justify-between gap-4 z-20 sticky top-0">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 shadow-md shadow-blue-950/50">
                        <i data-lucide="building-2" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h1 class="text-base font-black uppercase tracking-tight text-white">Clinical Neural Link Office</h1>
                        <p class="text-[10px] font-bold text-blue-400/80 tracking-wider uppercase">Executive Admin Ledger</p>
                    </div>
                </div>

                <div class="flex-1"></div>

                <button type="button" onclick="window.handleOfficeLogout()" 
                    title="Logout"
                    aria-label="Logout"
                    class="w-11 h-11 bg-blue-950/60 hover:bg-rose-950/60 text-blue-200 hover:text-rose-300 border border-blue-800/50 hover:border-rose-800/60 rounded-xl flex items-center justify-center transition cursor-pointer active:scale-95 shadow-sm">
                    <i data-lucide="log-out" class="w-5 h-5"></i>
                </button>
            </header>

            <!-- Dashboard Content Container -->
            <main id="dashboard-content" class="w-full flex-1 flex flex-col">
                <div class="w-full flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-81px)]">
                    
                    <!-- LEFT FIXED & STEADY SIDEBAR -->
                    <aside class="w-full lg:w-80 bg-[#050b18]/80 border-r border-blue-950/80 p-5 shrink-0 flex flex-col sticky top-[81px] self-start h-[calc(100vh-81px)] overflow-y-auto z-10">
                        
                        <!-- ACADEMIC PROGRAMS SECTION -->
                        <div class="mb-5 pb-3 border-b border-blue-900/40 shrink-0">
                            <h3 class="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                                <i data-lucide="book-open" class="w-4 h-4"></i>
                                Academic Programs
                            </h3>
                            <p class="text-[10px] text-slate-400 font-medium mt-0.5">Select a program to manage rosters</p>
                        </div>

                        <nav class="space-y-2.5 mb-6">
                            <button type="button" 
                                data-nav-id="MBCHB_BDS_CM" 
                                onclick="window.setActiveSidebarTab(this); window.selectProgram('MBCHB_BDS_CM')" 
                                class="office-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-900/60 border border-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500/50 transition flex items-center justify-between group cursor-pointer shadow-sm">
                                <div class="flex flex-col">
                                    <span class="text-blue-400 font-black">MBCHB, BDS AND CM</span>
                                    <span class="text-[10px] text-slate-400 font-normal">Joint Basic Medical Sciences</span>
                                </div>
                                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition"></i>
                            </button>

                            <button type="button" 
                                data-nav-id="BIOMEDICAL" 
                                onclick="window.setActiveSidebarTab(this); window.selectProgram('BIOMEDICAL')" 
                                class="office-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-900/60 border border-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500/50 transition flex items-center justify-between group cursor-pointer shadow-sm">
                                <span>BIOMEDICAL SCIENCE</span>
                                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition"></i>
                            </button>

                            <button type="button" 
                                data-nav-id="PUBLIC_HEALTH" 
                                onclick="window.setActiveSidebarTab(this); window.selectProgram('PUBLIC_HEALTH')" 
                                class="office-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-900/60 border border-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500/50 transition flex items-center justify-between group cursor-pointer shadow-sm">
                                <span>PUBLIC HEALTH</span>
                                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition"></i>
                            </button>

                            <button type="button" 
                                data-nav-id="ENVIRONMENTAL_HEALTH" 
                                onclick="window.setActiveSidebarTab(this); window.selectProgram('ENVIRONMENTAL_HEALTH')" 
                                class="office-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-900/60 border border-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500/50 transition flex items-center justify-between group cursor-pointer shadow-sm">
                                <span>ENVIRONMENTAL HEALTH</span>
                                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition"></i>
                            </button>
                        </nav>

                        <!-- FINANCIAL MANAGEMENT SECTION -->
                        <div class="mb-5 pb-3 border-b border-blue-900/40 shrink-0">
                            <h3 class="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                                <i data-lucide="wallet" class="w-4 h-4"></i>
                                Financial Management
                            </h3>
                            <p class="text-[10px] text-slate-400 font-medium mt-0.5">Executive cashbook & profit engine</p>
                        </div>

                        <nav class="space-y-2.5">
                            <button type="button" 
                                data-nav-id="MONTHLY_LEDGER" 
                                onclick="window.setActiveSidebarTab(this); window.renderMonthlyLedger()" 
                                class="office-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-900/60 border border-slate-700/50 hover:bg-blue-600/20 hover:border-blue-500/50 transition flex items-center justify-between group cursor-pointer shadow-sm">
                                <div class="flex flex-col">
                                    <span class="text-emerald-400 font-black">MONTHLY LEDGER</span>
                                    <span class="text-[10px] text-slate-400 font-normal">Cash-flow & Profit Allocation</span>
                                </div>
                                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition"></i>
                            </button>
                        </nav>

                    </aside>

                    <!-- RIGHT WORKSPACE: Updates dynamically without reloading the sidebar -->
                    <section id="program-workspace" class="flex-1 bg-slate-900 p-6 flex flex-col justify-center min-w-0 overflow-y-auto">
                    </section>

                </div>
            </main>

        </div>
    `;

    // Render the initial quote slideshow into workspace
    window.renderDashboardSlideshow();

    if (window.lucide) {
        lucide.createIcons();
    }
};

/**
 * Helper to keep active button state active & firm without layout shifting
 */
window.setActiveSidebarTab = function(activeBtn) {
    document.querySelectorAll('.office-nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600/30', 'border-blue-500/80', 'ring-1', 'ring-blue-500/50');
        btn.classList.add('bg-slate-900/60', 'border-slate-700/50');
    });

    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-900/60', 'border-slate-700/50');
        activeBtn.classList.add('bg-blue-600/30', 'border-blue-500/80', 'ring-1', 'ring-blue-500/50');
    }
};
// 1. Array of 10 Financial Discipline & Motivation Quotes with Unsplash Stock Backgrounds
window.OFFICE_QUOTES = [
    {
        quote: "Do not save what is left after spending, but spend what is left after saving.",
        author: "Warren Buffett",
        bg: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
        author: "Dave Ramsey",
        bg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "A budget is telling your money where to go instead of wondering where it went.",
        author: "John C. Maxwell",
        bg: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "Beware of little expenses. A small leak will sink a great ship.",
        author: "Benjamin Franklin",
        bg: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.",
        author: "Warren Buffett",
        bg: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "Financial discipline is not about restriction; it is about intentional freedom.",
        author: "Executive Wisdom",
        bg: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "It’s not how much money you make, but how much money you keep.",
        author: "Robert Kiyosaki",
        bg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "An investment in knowledge pays the best interest.",
        author: "Benjamin Franklin",
        bg: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "The goal isn't more money. The goal is living life on your terms.",
        author: "Chris Brogan",
        bg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop"
    },
    {
        quote: "Discipline is the bridge between goals and accomplishment.",
        author: "Jim Rohn",
        bg: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
    }
];

window.quoteTimer = null;
window.currentQuoteIndex = 0;

// 2. Function to Render Slideshow into Workspace
window.renderDashboardSlideshow = function() {
    const workspace = document.getElementById('program-workspace');
    if (!workspace) return;

    // Clear any existing timer when re-rendering
    if (window.quoteTimer) clearInterval(window.quoteTimer);

    const slide = window.OFFICE_QUOTES[window.currentQuoteIndex];

    workspace.innerHTML = `
        <div class="w-full h-full min-h-[500px] flex-1 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-end p-8 sm:p-12 transition-all duration-700 group">
            
            <!-- Background Image with Dark Overlay -->
            <div id="slide-bg" class="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 group-hover:scale-100" 
                 style="background-image: url('${slide.bg}');">
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20"></div>

            <!-- Slide Content -->
            <div class="relative z-10 max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600/30 border border-blue-400/40 text-blue-300 backdrop-blur-md">
                        Financial Wisdom
                    </span>
                    <span id="slide-counter" class="text-[10px] font-bold text-slate-400 tracking-wider">
                        ${window.currentQuoteIndex + 1} / ${window.OFFICE_QUOTES.length}
                    </span>
                </div>

                <blockquote id="slide-quote" class="text-lg sm:text-2xl font-black text-white leading-relaxed tracking-tight drop-shadow-md">
                    "${slide.quote}"
                </blockquote>

                <p id="slide-author" class="text-xs sm:text-sm font-bold text-blue-400 flex items-center gap-2">
                    <span class="w-6 h-0.5 bg-blue-500 rounded-full inline-block"></span>
                    ${slide.author}
                </p>
            </div>

            <!-- Progress Indicators / Dots -->
            <div class="relative z-10 flex items-center gap-2 mt-8">
                ${window.OFFICE_QUOTES.map((_, i) => `
                    <button type="button" onclick="window.goToQuote(${i})" 
                        class="h-1.5 rounded-full transition-all duration-300 ${i === window.currentQuoteIndex ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-500'}">
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Initialize 5-second interval timer
    window.quoteTimer = setInterval(() => {
        window.currentQuoteIndex = (window.currentQuoteIndex + 1) % window.OFFICE_QUOTES.length;
        window.updateSlideContent();
    }, 10000);
};

// 3. Smooth Transition Handler for Slide Changes
window.updateSlideContent = function() {
    const bgElem = document.getElementById('slide-bg');
    const quoteElem = document.getElementById('slide-quote');
    const authorElem = document.getElementById('slide-author');
    const counterElem = document.getElementById('slide-counter');

    if (!bgElem || !quoteElem) return;

    const slide = window.OFFICE_QUOTES[window.currentQuoteIndex];

    // Fade out elements briefly
    quoteElem.classList.add('opacity-0');
    authorElem.classList.add('opacity-0');

    setTimeout(() => {
        bgElem.style.backgroundImage = `url('${slide.bg}')`;
        quoteElem.textContent = `"${slide.quote}"`;
        authorElem.innerHTML = `<span class="w-6 h-0.5 bg-blue-500 rounded-full inline-block"></span> ${slide.author}`;
        if (counterElem) counterElem.textContent = `${window.currentQuoteIndex + 1} / ${window.OFFICE_QUOTES.length}`;

        quoteElem.classList.remove('opacity-0');
        authorElem.classList.remove('opacity-0');
    }, 250);

    // Update active dot indicators
    const dots = document.querySelectorAll('#program-workspace button');
    dots.forEach((dot, i) => {
        if (i === window.currentQuoteIndex) {
            dot.className = "h-1.5 rounded-full transition-all duration-300 w-8 bg-blue-500";
        } else {
            dot.className = "h-1.5 rounded-full transition-all duration-300 w-2 bg-slate-700 hover:bg-slate-500";
        }
    });
};

window.goToQuote = function(index) {
    window.currentQuoteIndex = index;
    window.updateSlideContent();
    // Reset timer on manual click
    if (window.quoteTimer) clearInterval(window.quoteTimer);
    window.quoteTimer = setInterval(() => {
        window.currentQuoteIndex = (window.currentQuoteIndex + 1) % window.OFFICE_QUOTES.length;
        window.updateSlideContent();
    }, 5000);
};
/**
 * Configuration mapping for programs and their respective academic year ranges.
 */
const PROGRAM_CONFIG = {
    'MBCHB_BDS_CM': {
        title: 'MBCHB, BDS AND CM',
        subtitle: 'Joint Basic Medical Sciences',
        years: [
            { id: 2, label: '2nd Year', description: 'Pre-clinical Foundation & Basic Sciences' },
            { id: 3, label: '3rd Year', description: 'Systemic Pathology & Paraclinical Sciences' },
            { id: 4, label: '4th Year', description: 'Junior Clinical Rotations' },
            { id: 5, label: '5th Year', description: 'Intermediate Clinical Clerkships' },
            { id: 6, label: '6th Year', description: 'Senior Registrar & Internship Preparation' }
        ]
    },
    'BIOMEDICAL': {
        title: 'BIOMEDICAL SCIENCE',
        subtitle: 'Department of Biomedical Sciences',
        years: [
            { id: 2, label: '2nd Year', description: 'Molecular Foundations & Anatomy' },
            { id: 3, label: '3rd Year', description: 'Advanced Hematology & Diagnostics' },
            { id: 4, label: '4th Year', description: 'Clinical Biochemistry & Research Methods' },
            { id: 5, label: '5th Year', description: 'Advanced Applied Pathology & Practicum' }
        ]
    },
    'PUBLIC_HEALTH': {
        title: 'PUBLIC HEALTH',
        subtitle: 'School of Public Health',
        years: [
            { id: 2, label: '2nd Year', description: 'Epidemiology & Biostatistics' },
            { id: 3, label: '3rd Year', description: 'Environmental Health & Disease Control' },
            { id: 4, label: '4th Year', description: 'Health Policy & Community Health' },
            { id: 5, label: '5th Year', description: 'Field Practicum & Health Management' }
        ]
    },
    'ENVIRONMENTAL_HEALTH': {
        title: 'ENVIRONMENTAL HEALTH',
        subtitle: 'Department of Environmental Health',
        years: [
            { id: 2, label: '2nd Year', description: 'Environmental Toxicology & Microbiology' },
            { id: 3, label: '3rd Year', description: 'Occupational Health & Hygiene' },
            { id: 4, label: '4th Year', description: 'Waste Management & Food Safety' },
            { id: 5, label: '5th Year', description: 'Environmental Impact & Field Projects' }
        ]
    }
};

/**
 * Handles program selection, updates sidebar styling, and renders academic year cards.
 * @param {string} programKey - Key matching PROGRAM_CONFIG entry.
 */
window.selectProgram = function(programKey) {
    const programData = PROGRAM_CONFIG[programKey];
    if (!programData) return;

    // 1. Highlight selected sidebar button and reset non-selected buttons
    document.querySelectorAll('.program-nav-btn').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${programKey}'`)) {
            btn.className = "program-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600/30 border border-blue-500/80 transition flex items-center justify-between group cursor-pointer shadow-md shadow-blue-950/40";
        } else {
            btn.className = "program-nav-btn w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900/60 border border-slate-700/40 hover:bg-slate-800/80 hover:border-slate-600/60 transition flex items-center justify-between group cursor-pointer shadow-sm opacity-80 hover:opacity-100";
        }
    });

    // 2. Render dynamic program header & academic year selection grid
    const workspace = document.getElementById('program-workspace');
    if (!workspace) return;

    workspace.innerHTML = `
        <div class="w-full max-w-5xl mx-auto flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            <!-- Program Header Banner with Back Button -->
            <div class="border-b border-blue-950/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <!-- Back to Dashboard Button -->
                        <button type="button" onclick="window.renderOfficeDashboard()" 
                            class="text-xs font-bold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 transition cursor-pointer group bg-slate-800/50 hover:bg-blue-950/60 px-3 py-1 rounded-lg border border-slate-700/50 hover:border-blue-500/50">
                            <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition"></i>
                            <span>Dashboard</span>
                        </button>

                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-md border border-blue-800/40">
                            Academic Program
                        </span>
                    </div>

                    <h2 class="text-xl font-black text-white uppercase tracking-tight mt-1">${programData.title}</h2>
                    <p class="text-xs text-slate-400 mt-0.5">${programData.subtitle}</p>
                </div>

                <div class="text-xs text-slate-400 bg-slate-800/40 border border-slate-700/40 px-3.5 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto">
                    <i data-lucide="layers" class="w-4 h-4 text-blue-400"></i>
                    <span>${programData.years.length} Academic Levels Available</span>
                </div>
            </div>

            <!-- Academic Years Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${programData.years.map(y => `
                    <button type="button" onclick="window.selectYear('${programKey}',${y.id})" 
                        class="text-left bg-slate-800/40 hover:bg-blue-950/40 border border-slate-700/60 hover:border-blue-500/60 rounded-2xl p-5 transition group cursor-pointer flex flex-col justify-between hover:shadow-lg hover:shadow-blue-950/30">
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs group-hover:scale-105 transition">
                                    Y${y.id}
                                </span>
                                <i data-lucide="arrow-right" class="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition group-hover:translate-x-1"></i>
                            </div>
                            <h4 class="text-sm font-black text-white group-hover:text-blue-300 transition">${y.label}</h4>
                            <p class="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">${y.description}</p>
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-slate-400">
                            <span>Manage Roster</span>
                            <span class="font-bold text-blue-400/80 group-hover:text-blue-400">Open Register &rarr;</span>
                        </div>
                    </button>
                `).join('')}
            </div>

        </div>
    `;

    if (window.lucide) {
        lucide.createIcons();
    }
};

/**
 * Placeholder handler for academic year selection.
 */
/**
 * Renders the Year Actions view in the left sidebar (Create Register / View Register)
 * and updates the workspace canvas.
 * 
 * @param {string} programKey - Program identifier
 * @param {number} yearId - Academic year (2, 3, 4, 5, 6)
 */
window.selectYear = function(programKey, yearId) {
    const programData = PROGRAM_CONFIG[programKey];
    if (!programData) return;

    const workspace = document.getElementById('program-workspace');

    // Populate Workspace with Interactive Module Action Cards
    if (workspace) {
        const storeKey = `${programKey}_Y${yearId}`;
        const savedList = (window.savedRegistersStore && window.savedRegistersStore[storeKey]) || [];
        const studentCount = savedList.length;

        workspace.innerHTML = `
            <div class="w-full max-w-5xl mx-auto flex flex-col space-y-8 animate-in fade-in duration-300 pb-12">
                
                <!-- Navigation / Back Button -->
                <div>
                    <button type="button" onclick="window.selectProgram('${programKey}')" 
                        class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-400 transition cursor-pointer group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 px-3 py-1.5 rounded-lg shadow-sm">
                        <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition"></i>
                        <span>Back to ${programData.title || 'Program'} Years</span>
                    </button>
                </div>

                <!-- Workspace Header -->
                <div class="border-b border-blue-950/80 pb-5">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-md border border-blue-800/40">
                            ${programData.title}
                        </span>
                        <span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-800/40">
                            Year ${yearId}
                        </span>
                    </div>
                    <h2 class="text-xl font-black text-white uppercase tracking-tight mt-2.5">Select Module Action</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Manage class rosters, enter new student records, or export verified data sheets.</p>
                </div>

                <!-- Interactive Action Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Card 1: Create Register -->
                    <div onclick="window.handleCreateRegister('${programKey}', ${yearId})" 
                        class="group relative bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-blue-950/50 flex flex-col justify-between space-y-6">
                        <div class="space-y-4">
                            <div class="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition duration-300">
                                <i data-lucide="file-spreadsheet" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h3 class="text-base font-black text-white group-hover:text-blue-400 transition">Create New Register</h3>
                                <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                    Open the interactive spreadsheet grid to manually enter or bulk-add new student names, IDs, and phone contacts.
                                </p>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                            <span>Open Data Grid</span>
                            <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition"></i>
                        </div>
                    </div>

                    <!-- Card 2: View Register -->
                    <div onclick="window.handleViewRegister('${programKey}', ${yearId})" 
                        class="group relative bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-emerald-950/30 flex flex-col justify-between space-y-6">
                        <div class="space-y-4">
                            <div class="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300">
                                <i data-lucide="users" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <div class="flex items-center justify-between">
                                    <h3 class="text-base font-black text-white group-hover:text-emerald-400 transition">View Class Roster</h3>
                                    ${studentCount > 0 ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800/60">${studentCount} Students</span>` : ''}
                                </div>
                                <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                    Access saved student records, search entries in real-time, or export class lists directly to CSV/Excel format.
                                </p>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                            <span>View Saved List</span>
                            <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition"></i>
                        </div>
                    </div>

                </div>

            </div>
        `;
    }

    if (window.lucide) {
        lucide.createIcons();
    }
};

/**
 * Restores the default sidebar list of Academic Programs.
 * 
 * @param {string} activeProgramKey - Optional key to remain selected upon return.
 */

/**
 * Placeholder action handlers
 */
window.handleCreateRegister = function(programKey, yearId) {
    console.log(`Create Register triggered for ${programKey} - Year ${yearId}`);
};

window.handleViewRegister = function(programKey, yearId) {
    console.log(`View Register triggered for ${programKey} - Year ${yearId}`);
};

/**
 * Reads local PC image file and displays it in the circular WhatsApp-style avatar frame
 */
window.handleAvatarUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const container = document.getElementById('avatar-container');
        if (container) {
            container.innerHTML = `<img src="${e.target.result}" alt="Danny Phiri" class="w-full h-full object-cover">`;
        }
    };
    reader.readAsDataURL(file);
};