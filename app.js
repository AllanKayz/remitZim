const RATES = {
  GBP: { USD: 1.27, ZiG: 34.5, ZAR: 23.1 },
  USD: { USD: 1.00, ZiG: 27.3, ZAR: 18.2 },
  ZAR: { USD: 0.055, ZiG: 1.5, ZAR: 1.00 }
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Transfer Complete', message: 'Your transfer to Tafadzwa Moyo has been collected.', time: '2 mins ago', read: false, type: 'success' },
  { id: 2, title: 'Rate Alert', message: 'USD to ZiG rates have improved by 2%!', time: '1 hour ago', read: false, type: 'info' },
  { id: 3, title: 'Security Alert', message: 'New login detected from Harare, Zimbabwe.', time: '1 day ago', read: true, type: 'alert' },
];

const MOCK_PAYMENT_METHODS = [
  { id: 1, type: 'card', name: 'Barclays Visa', details: '**** 4242', expiry: '12/26' },
  { id: 2, type: 'bank', name: 'Lloyds Bank', details: 'Sort: 30-**-** Acc: ****1234' },
];

const FULL_HISTORY = [
  { id: 1, recipient: "Tafadzwa Moyo", amount: 150.00, currency: "USD", type: "Cash Pickup", status: "Completed", date: "24 Nov 2025", direction: 'out' },
  { id: 2, recipient: "Grace Chiwenga", amount: 2500.00, currency: "ZiG", type: "Mobile Wallet", status: "Processing", date: "25 Nov 2025", direction: 'out' },
  { id: 3, recipient: "Wallet Top-up", amount: 500.00, currency: "GBP", type: "Wallet Top-up", status: "Completed", date: "22 Nov 2025", direction: 'in' },
  { id: 4, recipient: "Kudzanai Dube", amount: 50.00, currency: "USD", type: "Bank Transfer", status: "Completed", date: "20 Nov 2025", direction: 'out' },
  { id: 5, recipient: "Blessing Mahere", amount: 1200.00, currency: "ZAR", type: "Mobile Wallet", status: "Failed", date: "15 Nov 2025", direction: 'out' },
  { id: 6, recipient: "Wallet Top-up", amount: 200.00, currency: "GBP", type: "Wallet Top-up", status: "Completed", date: "10 Nov 2025", direction: 'in' },
];

const BENEFICIARIES = [
  { id: 1, name: "Tafadzwa Moyo", mobile: "+263 77 123 4567", provider: "EcoCash" },
  { id: 2, name: "Grace Chiwenga", mobile: "+263 71 987 6543", provider: "NetOne" },
  { id: 3, name: "Kudzanai Dube", mobile: "+263 77 555 9999", provider: "CABS" },
];

// Application state
const state = {
    view: 'dashboard', // Current view
    sendStep: 1, // Current step in the send money flow
    isLoading: false, // Loading state
    isMenuOpen: false,
    isAuthenticated: false,
    walletBalance: 1250.00,
    topUpAmount: 50,
    recentTransactions: FULL_HISTORY,
    notifications: MOCK_NOTIFICATIONS,
    paymentMethods: MOCK_PAYMENT_METHODS,
    searchQuery: '',
    isAnalyzing: false,
    analysisResult: null,
    showSmartFill: false,
    smartFillText: '',
    isSmartFilling: false,
    amount: 100,
    sourceCurr: 'GBP',
    destCurr: 'USD',
    deliveryMethod: 'cash',
    selectedRecipient: null,
    refNumber: 0,
    fee: 3.99,
    beneficiaries: BENEFICIARIES,
};

document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('sign-in-btn');
    const signOutBtn = document.getElementById('sign-out-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const sideMenuBg = document.getElementById('side-menu-bg');
    const authView = document.getElementById('auth-view');
    const mainAppView = document.getElementById('main-app-view');
    const signupView = document.getElementById('signup-view');
    const signUpLink = document.getElementById('sign-up-link');

    signUpLink.addEventListener('click', () => {
        state.view = 'signup';
        authView.classList.add('hidden');
        signupView.classList.remove('hidden');
        render();
    });

    signInBtn.addEventListener('click', () => {
        state.isLoading = true;
        signInBtn.textContent = 'Signing In...';
        signInBtn.disabled = true;
        setTimeout(() => {
            state.isAuthenticated = true;
            state.isLoading = false;
            authView.classList.add('hidden');
            mainAppView.classList.remove('hidden');
            mainAppView.classList.add('flex', 'flex-col', 'w-full');
            render();
        }, 1000);
    });

    signOutBtn.addEventListener('click', () => {
        state.isAuthenticated = false;
        state.isMenuOpen = false;
        authView.classList.remove('hidden');
        mainAppView.classList.add('hidden');
        sideMenuOverlay.classList.add('hidden');
        render();
    });

    closeMenuBtn.addEventListener('click', () => {
        state.isMenuOpen = false;
        sideMenuOverlay.classList.add('hidden');
    });

    sideMenuBg.addEventListener('click', () => {
        state.isMenuOpen = false;
        sideMenuOverlay.classList.add('hidden');
    });

    // Main render function
    function render() {
        renderTopNav();
        renderBottomNav();
        renderMainContent();
    }

    // Render main content based on the current view
    function renderMainContent() {
        const mainContent = document.getElementById('main-content');
        const signupView = document.getElementById('signup-view');
        const addPaymentMethodView = document.getElementById('add-payment-method-view');
        mainContent.innerHTML = '';
        signupView.innerHTML = '';
        addPaymentMethodView.innerHTML = '';
        switch (state.view) {
            case 'dashboard':
                renderDashboard(mainContent);
                break;
            case 'signup':
                renderSignup(signupView);
                break;
            case 'add-payment-method':
                renderAddPaymentMethod(addPaymentMethodView);
                break;
            case 'history':
                renderHistory(mainContent);
                break;
            case 'send':
                renderSend(mainContent);
                break;
            case 'wallet':
                renderWallet(mainContent);
                break;
            case 'profile':
                renderProfile(mainContent);
                break;
            case 'notifications':
                renderNotifications(mainContent);
                break;
            case 'payment_methods':
                renderPaymentMethods(mainContent);
                break;
            case 'security':
                renderSecurity(mainContent);
                break;
            case 'success':
                renderSuccess(mainContent);
                break;
            case 'topup':
                renderTopup(mainContent);
                break;
        }
    }

    function renderAddPaymentMethod(container) {
        container.innerHTML = `
            <div class="animate-slideIn p-6">
                ${renderViewHeader('Add Payment Method', 'payment_methods')}
                <div class="space-y-4">
                    <button id="add-card-option-btn" class="w-full p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-emerald-500 transition-colors flex items-center gap-4">
                        <div class="p-3 rounded-full bg-slate-100 text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        </div>
                        <div>
                            <div class="font-bold text-slate-900">Credit/Debit Card</div>
                            <div class="text-xs text-slate-500">Visa, Mastercard, etc.</div>
                        </div>
                    </button>
                    <button id="add-bank-option-btn" class="w-full p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-emerald-500 transition-colors flex items-center gap-4">
                        <div class="p-3 rounded-full bg-slate-100 text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V3"/><path d="M5 12H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3"/><path d="M19 12h3a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3"/><path d="M3 21h18"/></svg>
                        </div>
                        <div>
                            <div class="font-bold text-slate-900">Bank Account</div>
                            <div class="text-xs text-slate-500">Add your bank account</div>
                        </div>
                    </button>
                </div>
            </div>
        `;

        document.getElementById('back-btn').addEventListener('click', () => {
            state.view = 'payment_methods';
            render();
        });

        document.getElementById('add-card-option-btn').addEventListener('click', () => {
            renderAddCardForm(container);
        });

        document.getElementById('add-bank-option-btn').addEventListener('click', () => {
            renderAddBankForm(container);
        });
    }

    function renderAddBankForm(container) {
        container.innerHTML = `
            <div class="animate-slideIn p-6">
                ${renderViewHeader('Add Bank Account', 'add-payment-method')}
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div>
                        <label for="bank-name" class="text-sm font-semibold text-slate-600 mb-2 block">Account Holder Name</label>
                        <input id="bank-name" type="text" class="w-full text-lg font-medium text-slate-900 border-b-2 border-slate-200 focus:border-primary focus:outline-none py-2" placeholder="e.g. John Doe">
                    </div>
                    <div>
                        <label for="bank-account-number" class="text-sm font-semibold text-slate-600 mb-2 block">Account Number</label>
                        <input id="bank-account-number" type="text" class="w-full text-lg font-medium text-slate-900 border-b-2 border-slate-200 focus:border-primary focus:outline-none py-2" placeholder="**** **** **** ****">
                    </div>
                    <div>
                        <label for="bank-sort-code" class="text-sm font-semibold text-slate-600 mb-2 block">Sort Code</label>
                        <input id="bank-sort-code" type="text" class="w-full text-lg font-medium text-slate-900 border-b-2 border-slate-200 focus:border-primary focus:outline-none py-2" placeholder="**-**-**">
                    </div>
                    <button id="add-bank-btn" class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 disabled:opacity-70">
                        Add Bank Account
                    </button>
                </div>
            </div>
        `;

        document.getElementById('back-btn').addEventListener('click', () => {
            state.view = 'add-payment-method';
            render();
        });

        document.getElementById('add-bank-btn').addEventListener('click', () => {
            const accountHolderName = document.getElementById('bank-name').value;
            const accountNumber = document.getElementById('bank-account-number').value;
            const sortCode = document.getElementById('bank-sort-code').value;

            if (accountHolderName && accountNumber && sortCode) {
                // Add bank logic here
                state.paymentMethods.push({
                    id: Date.now(),
                    type: 'bank',
                    name: 'New Bank Account',
                    details: `**** ${accountNumber.slice(-4)}`,
                });

                state.view = 'payment_methods';
                const mainContent = document.getElementById('main-content');
                const addPaymentMethodView = document.getElementById('add-payment-method-view');
                mainContent.classList.remove('hidden');
                addPaymentMethodView.classList.add('hidden');
                render();
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });
    }

    function renderAddCardForm(container) {
        container.innerHTML = `
            <div class="animate-slideIn p-6">
                ${renderViewHeader('Add Card', 'add-payment-method')}
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div>
                        <label for="card-number" class="text-sm font-semibold text-slate-600 mb-2 block">Card Number</label>
                        <input id="card-number" type="text" class="w-full text-lg font-medium text-slate-900 border-b-2 border-slate-200 focus:border-primary focus:outline-none py-2" placeholder="**** **** **** ****">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="card-expiry" class="text-sm font-semibold text-slate-600 mb-2 block">Expiry Date</label>
                            <input id="card-expiry" type="text" class="w-full text-lg font-medium text-slate-900 border-b-2 border-slate-200 focus:border-primary focus:outline-none py-2" placeholder="MM/YY">
                        </div>
                        <div>
                            <label for="card-cvv" class="text-sm font-semibold text-slate-600 mb-2 block">CVV</label>
                            <input id="card-cvv" type="text" class="w-full text-lg font-medium text-slate-900 border-b-2 border-slate-200 focus:border-primary focus:outline-none py-2" placeholder="***">
                        </div>
                    </div>
                    <div>
                        <label for="card-name" class="text-sm font-semibold text-slate-600 mb-2 block">Cardholder Name</label>
                        <input id="card-name" type="text" class="w-full text-lg font-medium text-slate-900 border-b-2 border-slate-200 focus:border-primary focus:outline-none py-2" placeholder="e.g. John Doe">
                    </div>
                    <button id="add-card-btn" class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 disabled:opacity-70">
                        Add Card
                    </button>
                </div>
            </div>
        `;

        document.getElementById('back-btn').addEventListener('click', () => {
            state.view = 'add-payment-method';
            render();
        });

        document.getElementById('add-card-btn').addEventListener('click', () => {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('card-expiry').value;
            const cvv = document.getElementById('card-cvv').value;
            const cardholderName = document.getElementById('card-name').value;

            if (cardNumber && expiryDate && cvv && cardholderName) {
                // Add card logic here
                state.paymentMethods.push({
                    id: Date.now(),
                    type: 'card',
                    name: 'New Card',
                    details: `**** ${cardNumber.slice(-4)}`,
                    expiry: expiryDate,
                });

                state.view = 'payment_methods';
                const mainContent = document.getElementById('main-content');
                const addPaymentMethodView = document.getElementById('add-payment-method-view');
                mainContent.classList.remove('hidden');
                addPaymentMethodView.classList.add('hidden');
                render();
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });
    }

    function renderSignup(container) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-screen p-8 bg-gradient-to-br from-secondary to-slate-900 text-white animate-fadeIn">
                <div class="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
                    <span class="text-4xl font-bold">R</span>
                </div>
                <h1 class="text-3xl font-bold mb-2">Create Account</h1>
                <p class="text-slate-400 mb-10 text-center">Join RemitZim and start sending money with ease.</p>
                <div class="w-full space-y-4">
                    <input id="signup-full-name" type="text" placeholder="Full Name" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors">
                    <input id="signup-email" type="email" placeholder="Email Address" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors">
                    <input id="signup-password" type="password" placeholder="Password" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors">
                    <button id="sign-up-btn" class="w-full bg-primary hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                        Sign Up
                    </button>
                </div>
                <div class="mt-8 text-sm text-slate-400">
                    <span class="opacity-70">Already have an account?</span> <button id="sign-in-link" class="text-primary font-bold hover:underline">Sign In</button>
                </div>
            </div>
        `;

        document.getElementById('sign-in-link').addEventListener('click', () => {
            state.view = 'auth';
            const signupView = document.getElementById('signup-view');
            const authView = document.getElementById('auth-view');
            signupView.classList.add('hidden');
            authView.classList.remove('hidden');
        });

        document.getElementById('sign-up-btn').addEventListener('click', () => {
            const fullName = document.getElementById('signup-full-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            if (fullName && email && password) {
                // Add sign up logic here
                state.isAuthenticated = true;
                const signupView = document.getElementById('signup-view');
                const mainAppView = document.getElementById('main-app-view');
                signupView.classList.add('hidden');
                mainAppView.classList.remove('hidden');
                render();
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });
    }

    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            state.view = e.currentTarget.dataset.view;
            state.isMenuOpen = false;
            document.getElementById('side-menu-overlay').classList.add('hidden');
            render();
        });
    });

    function renderViewHeader(title, backView) {
        return `
            <div class="flex items-center gap-2 mb-6">
                <button id="back-btn" class="p-2 hover:bg-slate-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </button>
                <h2 class="text-xl font-bold text-slate-800">${title}</h2>
            </div>
        `;
    }

    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `flex items-center p-4 mb-4 text-sm rounded-lg ${
            type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`;
        const icon = type === 'error' ? `
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        ` : `
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        `;
        notification.innerHTML = `${icon}<div>${message}</div>`;
        container.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function renderDashboard(container) {
        const recentTransactions = state.recentTransactions.slice(0, 3);
        container.innerHTML = `
            <div class="space-y-6 animate-fadeIn">
                <!-- Balance Card -->
                <div class="bg-gradient-to-br from-secondary to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div class="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <div class="text-slate-400 text-sm font-medium mb-1">Total Balance</div>
                            <div class="text-3xl font-bold">£ ${state.walletBalance.toFixed(2)}</div>
                        </div>
                        <div id="wallet-btn" class="p-2 bg-white/10 rounded-lg backdrop-blur-sm cursor-pointer hover:bg-white/20 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                        </div>
                    </div>
                    <div class="flex gap-3 relative z-10">
                        <button id="send-btn" class="flex-1 bg-primary hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                            Send
                        </button>
                        <button id="topup-btn" class="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            Top Up
                        </button>
                    </div>
                </div>
                <!-- Rates Ticker -->
                <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    <div class="min-w-[140px] p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div class="text-xs text-slate-500 mb-1">GBP to USD</div>
                        <div class="font-bold text-slate-800 text-lg">1.27</div>
                        <div class="text-xs text-emerald-600 font-medium">+0.5% today</div>
                    </div>
                    <div class="min-w-[140px] p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div class="text-xs text-slate-500 mb-1">USD to ZiG</div>
                        <div class="font-bold text-slate-800 text-lg">27.30</div>
                        <div class="text-xs text-slate-400 font-medium">Stable</div>
                    </div>
                    <div class="min-w-[140px] p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div class="text-xs text-slate-500 mb-1">USD to ZAR</div>
                        <div class="font-bold text-slate-800 text-lg">18.20</div>
                        <div class="text-xs text-red-500 font-medium">-1.2% today</div>
                    </div>
                </div>
                <!-- ✨ Gemini AI Rate Insight -->
                <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 relative overflow-hidden">
                    <div class="flex justify-between items-start relative z-10">
                        <div class="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                            <span class="font-bold text-indigo-900 text-sm">Gemini Market Insight</span>
                        </div>
                    </div>
                    <p class="text-sm text-indigo-400">
                        Get AI-powered advice on today's ${state.sourceCurr}/${state.destCurr} exchange rates.
                    </p>
                </div>
                <!-- Recent Activity Preview -->
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 text-lg">Recent Transfers</h3>
                        <button id="see-all-btn" class="text-emerald-600 text-sm font-semibold">See All</button>
                    </div>
                    <div class="space-y-3">
                        ${recentTransactions.map(tx => `
                            <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        ${tx.direction === 'in' ?
                                            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>` :
                                            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`
                                        }
                                    </div>
                                    <div>
                                        <div class="font-bold text-slate-900">${tx.recipient}</div>
                                        <div class="text-xs text-slate-500">${tx.date} • ${tx.status}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold ${tx.direction === 'in' ? 'text-emerald-600' : 'text-slate-900'}">
                                        ${tx.direction === 'in' ? '+' : '-'} ${tx.currency} ${tx.amount.toFixed(2)}
                                    </div>
                                    <div class="text-xs text-slate-400">${tx.type}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.getElementById('wallet-btn').addEventListener('click', () => { state.view = 'wallet'; render(); });
        document.getElementById('send-btn').addEventListener('click', () => { state.view = 'send'; render(); });
        document.getElementById('topup-btn').addEventListener('click', () => { state.view = 'topup'; render(); });
        document.getElementById('see-all-btn').addEventListener('click', () => { state.view = 'history'; render(); });
    }

    // Render transaction history view
    function renderHistory(container) {
        const filteredTransactions = state.recentTransactions.filter(tx =>
            tx.recipient.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            tx.amount.toString().includes(state.searchQuery)
        );
        container.innerHTML = `
            <div class="animate-slideIn">
                <div class="flex items-center gap-2 mb-6">
                    <button id="back-to-dashboard-btn" class="p-2 hover:bg-slate-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </button>
                    <h2 class="text-xl font-bold text-slate-800">Transaction History</h2>
                </div>
                <div class="mb-6 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input id="search-input" type="text" placeholder="Search recipients or amount..." class="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500" value="${state.searchQuery}">
                </div>
                <div class="space-y-3">
                    ${filteredTransactions.length > 0 ? filteredTransactions.map(tx => `
                        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between animate-fadeIn">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    ${tx.direction === 'in' ?
                                        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>` :
                                        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`
                                    }
                                </div>
                                <div>
                                    <div class="font-bold text-slate-900">${tx.recipient}</div>
                                    <div class="text-xs text-slate-500">${tx.date} • ${tx.status}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold ${tx.direction === 'in' ? 'text-emerald-600' : 'text-slate-900'}">
                                    ${tx.direction === 'in' ? '+' : '-'} ${tx.currency} ${tx.amount.toFixed(2)}
                                </div>
                                <div class="text-xs text-slate-400">${tx.type}</div>
                            </div>
                        </div>
                    `).join('') : '<div class="text-center py-10 text-slate-400">No transactions found.</div>'}
                </div>
            </div>
        `;
        document.getElementById('back-to-dashboard-btn').addEventListener('click', () => { state.view = 'dashboard'; render(); });
        document.getElementById('search-input').addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderHistory(container);
        });
    }

    function renderSend(container) {
        if (state.sendStep === 1) {
            const receiveAmount = state.amount * RATES[state.sourceCurr][state.destCurr];
            container.innerHTML = `
                <div class="animate-slideUp">
                    <div class="flex items-center gap-2 mb-6">
                        <button id="back-to-dashboard-btn" class="p-2 hover:bg-slate-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                        </button>
                        <h2 class="text-xl font-bold text-slate-800">Send Money</h2>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6 space-y-6">
                        <div>
                            <div class="flex justify-between mb-2">
                                <label class="text-sm font-semibold text-slate-600">You Send</label>
                                <div class="flex gap-2">
                                    ${['GBP', 'USD', 'ZAR'].map(curr => `
                                        <button class="source-curr-btn px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border ${state.sourceCurr === curr ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}" data-curr="${curr}">${curr}</button>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="relative">
                                <input id="amount-input" type="number" class="w-full text-3xl font-bold text-slate-900 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 focus:outline-none py-2" value="${state.amount}">
                                <span class="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-slate-400">Fee: ${state.sourceCurr} ${state.fee}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-center">
                            <div class="bg-slate-100 px-4 py-1.5 rounded-full text-xs font-medium text-slate-600 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                1 ${state.sourceCurr} = ${RATES[state.sourceCurr][state.destCurr]} ${state.destCurr}
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-2">
                                <label class="text-sm font-semibold text-slate-600">Recipient Gets</label>
                                <div class="flex gap-2">
                                    ${['USD', 'ZiG'].map(curr => `
                                        <button class="dest-curr-btn px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border ${state.destCurr === curr ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}" data-curr="${curr}">${curr}</button>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="w-full text-3xl font-bold text-emerald-600 border-b-2 border-transparent py-2">${receiveAmount.toFixed(2)}</div>
                        </div>
                    </div>
                    <h3 class="text-sm font-semibold text-slate-600 mb-3 px-1">Delivery Method</h3>
                    <div class="grid grid-cols-1 gap-3 mb-8">
                        <button class="delivery-method-btn p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left ${state.deliveryMethod === 'cash' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}" data-method="cash">
                            <div class="${state.deliveryMethod === 'cash' ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-100 text-slate-500'} p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                            </div>
                            <div>
                                <div class="font-bold text-slate-900">Cash Pickup</div>
                                <div class="text-xs text-slate-500">Instant at 500+ locations</div>
                            </div>
                        </button>
                        <button class="delivery-method-btn p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left ${state.deliveryMethod === 'mobile' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}" data-method="mobile">
                            <div class="${state.deliveryMethod === 'mobile' ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-100 text-slate-500'} p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                            </div>
                            <div>
                                <div class="font-bold text-slate-900">Mobile Money</div>
                                <div class="text-xs text-slate-500">EcoCash, InnBucks, OneMoney</div>
                            </div>
                        </button>
                    </div>
                    <button id="continue-btn" class="w-full py-4 text-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95">Continue</button>
                </div>
            `;
            document.getElementById('back-to-dashboard-btn').addEventListener('click', () => { state.view = 'dashboard'; render(); });
            document.getElementById('amount-input').addEventListener('input', (e) => { state.amount = parseFloat(e.target.value) || 0; renderSend(container); });
            document.querySelectorAll('.source-curr-btn').forEach(btn => btn.addEventListener('click', (e) => { state.sourceCurr = e.currentTarget.dataset.curr; renderSend(container); }));
            document.querySelectorAll('.dest-curr-btn').forEach(btn => btn.addEventListener('click', (e) => { state.destCurr = e.currentTarget.dataset.curr; renderSend(container); }));
            document.querySelectorAll('.delivery-method-btn').forEach(btn => btn.addEventListener('click', (e) => { state.deliveryMethod = e.currentTarget.dataset.method; renderSend(container); }));
            document.getElementById('continue-btn').addEventListener('click', () => { state.sendStep = 2; renderSend(container); });
        } else if (state.sendStep === 2) {
            container.innerHTML = `
                <div class="animate-slideIn">
                    <button id="back-to-amount-btn" class="mb-6 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">← Back to Amount</button>
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Select Recipient</h2>
                    <div class="space-y-3 mb-6">
                        ${state.beneficiaries.map(b => `
                            <div class="beneficiary-card bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-500 cursor-pointer transition-all" data-id="${b.id}">
                                <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">${b.name.charAt(0)}</div>
                                <div>
                                    <div class="font-bold text-slate-900">${b.name}</div>
                                    <div class="text-sm text-slate-500">${b.provider} • ${b.mobile}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            document.getElementById('back-to-amount-btn').addEventListener('click', () => { state.sendStep = 1; renderSend(container); });
            document.querySelectorAll('.beneficiary-card').forEach(card => card.addEventListener('click', (e) => {
                state.selectedRecipient = state.beneficiaries.find(b => b.id === parseInt(e.currentTarget.dataset.id));
                state.sendStep = 3;
                renderSend(container);
            }));
        } else if (state.sendStep === 3) {
            const receiveAmount = state.amount * RATES[state.sourceCurr][state.destCurr];
            const totalPay = state.amount + state.fee;
            container.innerHTML = `
                <div class="animate-slideIn">
                    <button id="back-to-recipient-btn" class="mb-6 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">← Back to Recipient</button>
                    <h2 class="text-xl font-bold text-slate-800 mb-6">Confirm Transfer</h2>
                    <div class="bg-white rounded-2xl p-5 mb-6 border border-slate-100 space-y-3">
                        <div class="flex justify-between"><span class="text-slate-500">To</span><span class="font-bold">${state.selectedRecipient.name}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Pay</span><span class="font-bold">${state.sourceCurr} ${totalPay.toFixed(2)}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">They Get</span><span class="font-bold text-emerald-600">${state.destCurr} ${receiveAmount.toFixed(2)}</span></div>
                    </div>
                    <button id="confirm-btn" class="w-full py-4 text-lg bg-emerald-600 text-white rounded-xl font-medium">Confirm & Send</button>
                </div>
            `;
            document.getElementById('back-to-recipient-btn').addEventListener('click', () => { state.sendStep = 2; renderSend(container); });
            document.getElementById('confirm-btn').addEventListener('click', () => {
                state.isLoading = true;
                document.getElementById('confirm-btn').textContent = 'Processing...';
                document.getElementById('confirm-btn').disabled = true;
                setTimeout(() => {
                    state.isLoading = false;
                    state.walletBalance -= totalPay;
                    state.recentTransactions.unshift({
                        id: Date.now(),
                        recipient: state.selectedRecipient.name,
                        amount: state.amount,
                        currency: state.destCurr,
                        type: state.deliveryMethod === 'cash' ? 'Cash Pickup' : 'Mobile Wallet',
                        status: 'Processing',
                        date: "Just now",
                        direction: 'out'
                    });
                    state.refNumber = Math.floor(Math.random() * 1000000);
                    state.view = 'success';
                    render();
                }, 2000);
            });
        }
    }
    // Render wallet view
    function renderWallet(container) {
        container.innerHTML = `
            <div class="animate-slideIn space-y-6">
                <div class="flex items-center gap-2 mb-2">
                    <button id="back-to-dashboard-btn" class="p-2 hover:bg-slate-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </button>
                    <h2 class="text-xl font-bold text-slate-800">My Wallet</h2>
                </div>
                <div class="grid gap-4">
                    <div class="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-lg">
                        <div>
                            <div class="text-slate-400 text-sm">British Pound</div>
                            <div class="text-3xl font-bold">£ ${state.walletBalance.toFixed(2)}</div>
                        </div>
                        <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">GBP</div>
                    </div>
                    <div class="bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-center opacity-75">
                        <div>
                            <div class="text-slate-500 text-sm">US Dollar</div>
                            <div class="text-2xl font-bold text-slate-800">$ 0.00</div>
                        </div>
                        <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">USD</div>
                    </div>
                </div>
                <button id="add-funds-btn" class="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-colors font-medium flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Add Funds
                </button>
            </div>
        `;
        document.getElementById('back-to-dashboard-btn').addEventListener('click', () => { state.view = 'dashboard'; render(); });
        document.getElementById('add-funds-btn').addEventListener('click', () => { state.view = 'topup'; render(); });
    }

    function renderProfile(container) {
        container.innerHTML = `
            <div class="animate-slideIn space-y-6">
                <div class="flex items-center gap-2 mb-2">
                    <button id="back-to-dashboard-btn" class="p-2 hover:bg-slate-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </button>
                    <h2 class="text-xl font-bold text-slate-800">My Profile</h2>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <div class="w-24 h-24 bg-slate-200 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-slate-500">JD</div>
                    <h3 class="text-lg font-bold">John Doe</h3>
                    <p class="text-slate-500 text-sm">john.doe@example.com</p>
                    <div class="mt-4 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                        Identity Verified (Tier 2)
                    </div>
                </div>
            </div>
        `;
        document.getElementById('back-to-dashboard-btn').addEventListener('click', () => { state.view = 'dashboard'; render(); });
    }

    function renderNotifications(container) {
        container.innerHTML = `
            <div class="animate-slideIn">
                <div class="flex items-center gap-2 mb-6">
                    <button id="back-to-dashboard-btn" class="p-2 hover:bg-slate-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </button>
                    <h2 class="text-xl font-bold text-slate-800">Notifications</h2>
                </div>
                <div class="space-y-3">
                    ${state.notifications.map(notif => `
                        <div class="bg-white p-4 rounded-xl border-l-4 shadow-sm ${notif.read ? 'opacity-60' : ''}"
                            style="border-color: ${notif.type === 'success' ? '#10B981' : notif.type === 'info' ? '#3B82F6' : '#EF4444'}">
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="font-bold text-slate-900">${notif.title}</h4>
                                <span class="text-xs text-slate-400">${notif.time}</span>
                            </div>
                            <p class="text-sm text-slate-600">${notif.message}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.getElementById('back-to-dashboard-btn').addEventListener('click', () => { state.view = 'dashboard'; render(); });
    }
    function renderPaymentMethods(container) {
        container.innerHTML = `
            <div class="animate-slideIn">
                <div class="flex items-center gap-2 mb-6">
                    <button id="back-to-dashboard-btn" class="p-2 hover:bg-slate-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </button>
                    <h2 class="text-xl font-bold text-slate-800">Payment Methods</h2>
                </div>
                <div class="space-y-4 mb-6">
                    ${state.paymentMethods.map(method => `
                        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-8 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">
                                    ${method.type === 'card' ? 'VISA' : 'BANK'}
                                </div>
                                <div>
                                    <div class="font-bold text-slate-900">${method.name}</div>
                                    <div class="text-sm text-slate-500">${method.details}</div>
                                </div>
                            </div>
                            <button class="text-slate-400 hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button id="add-payment-method-btn" class="w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-colors font-medium">
                    + Add New Card or Bank
                </button>
            </div>
        `;
        document.getElementById('back-to-dashboard-btn').addEventListener('click', () => { state.view = 'dashboard'; render(); });
        document.getElementById('add-payment-method-btn').addEventListener('click', () => {
            state.view = 'add-payment-method';
            const mainContent = document.getElementById('main-content');
            const addPaymentMethodView = document.getElementById('add-payment-method-view');
            mainContent.classList.add('hidden');
            addPaymentMethodView.classList.remove('hidden');
            render();
        });
    }

    function renderSecurity(container) {
        container.innerHTML = `
            <div class="animate-slideIn">
                <div class="flex items-center gap-2 mb-6">
                    <button id="back-to-dashboard-btn" class="p-2 hover:bg-slate-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </button>
                    <h2 class="text-xl font-bold text-slate-800">Security</h2>
                </div>
                <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div class="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <div class="font-bold text-slate-900">Change Password</div>
                            <div class="text-xs text-slate-500">Last changed 3 months ago</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                    <div class="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <div class="font-bold text-slate-900">Biometric Login</div>
                            <div class="text-xs text-slate-500">Use FaceID/TouchID to sign in</div>
                        </div>
                        <div class="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                    </div>
                    <div class="p-4 flex justify-between items-center">
                        <div>
                            <div class="font-bold text-slate-900">Two-Factor Auth (2FA)</div>
                            <div class="text-xs text-slate-500">Extra security layer</div>
                        </div>
                        <div class="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('back-to-dashboard-btn').addEventListener('click', () => { state.view = 'dashboard'; render(); });
    }

    function renderSuccess(container) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center animate-zoomIn p-6 pt-12">
                <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Transfer Initiated!</h2>
                <p class="text-slate-500 mb-8 max-w-xs mx-auto">Your transfer is being processed.</p>
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 w-full mb-8 bg-slate-50">
                    <div class="text-sm text-slate-500 mb-1">Transaction Reference</div>
                    <div class="font-mono font-bold text-lg text-slate-800">RZ-${state.refNumber}</div>
                </div>
                <button id="done-btn" class="w-full py-4 text-lg bg-emerald-600 text-white rounded-xl font-medium">Done</button>
            </div>
        `;
        document.getElementById('done-btn').addEventListener('click', () => {
            state.view = 'dashboard';
            state.sendStep = 1;
            state.amount = 100;
            state.selectedRecipient = null;
            render();
        });
    }

    function renderTopup(container) {
        container.innerHTML = `
            <div class="animate-slideUp">
                <div class="flex items-center gap-2 mb-6">
                    <button id="back-to-wallet-btn" class="p-2 hover:bg-slate-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </button>
                    <h2 class="text-xl font-bold text-slate-800">Top Up Wallet</h2>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div>
                        <label class="text-sm font-semibold text-slate-600 mb-2 block">Amount (GBP)</label>
                        <input id="topup-amount-input" type="number" class="w-full text-3xl font-bold text-slate-900 border-b-2 border-slate-200 focus:border-emerald-500 focus:outline-none py-2" placeholder="0.00" value="${state.topUpAmount}">
                    </div>
                    <div>
                        <label class="text-sm font-semibold text-slate-600 mb-2 block">Payment Method</label>
                        <div class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                            <div class="w-10 h-6 bg-slate-300 rounded"></div>
                            <div class="flex-1 font-medium">Barclays Visa **** 4242</div>
                            <button class="text-emerald-600 text-sm font-bold">Change</button>
                        </div>
                    </div>
                    <button id="pay-btn" class="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 disabled:opacity-70">
                        Pay £${state.topUpAmount}
                    </button>
                </div>
            </div>
        `;
        document.getElementById('back-to-wallet-btn').addEventListener('click', () => { state.view = 'wallet'; render(); });
        document.getElementById('topup-amount-input').addEventListener('input', (e) => {
            state.topUpAmount = parseFloat(e.target.value) || 0;
            document.getElementById('pay-btn').textContent = `Pay £${state.topUpAmount}`;
        });
        document.getElementById('pay-btn').addEventListener('click', () => {
            state.isLoading = true;
            document.getElementById('pay-btn').textContent = 'Processing...';
            document.getElementById('pay-btn').disabled = true;
            setTimeout(() => {
                state.isLoading = false;
                state.walletBalance += state.topUpAmount;
                state.recentTransactions.unshift({
                    id: Date.now(),
                    recipient: "Wallet Top-up",
                    amount: state.topUpAmount,
                    currency: "GBP",
                    type: "Wallet Top-up",
                    status: "Completed",
                    date: "Just now",
                    direction: 'in'
                });
                state.view = 'wallet';
                state.topUpAmount = 50;
                render();
            }, 1500);
        });
    }

    function renderTopNav() {
        const topNav = document.getElementById('top-nav');
        const unreadCount = state.notifications.filter(n => !n.read).length;
        let content = '';
        if (state.view === 'dashboard') {
            content = `
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
                    <span class="font-bold text-lg text-slate-800 tracking-tight">RemitZim</span>
                </div>
            `;
        } else {
            content = `
                <span class="font-bold text-lg text-slate-800 tracking-tight capitalize">${state.view.replace('_', ' ')}</span>
            `;
        }
        content += `
            <div class="flex gap-4">
                <button id="notifications-btn" class="text-slate-600 hover:text-emerald-600 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    ${unreadCount > 0 ? '<span class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>' : ''}
                </button>
                <button id="open-menu-btn" class="text-slate-600 hover:text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
            </div>
        `;
        topNav.innerHTML = content;

        document.getElementById('open-menu-btn').addEventListener('click', () => {
            state.isMenuOpen = true;
            document.getElementById('side-menu-overlay').classList.remove('hidden');
        });
        document.getElementById('notifications-btn').addEventListener('click', () => {
            state.view = 'notifications';
            render();
        });
    }

    function renderBottomNav() {
        const bottomNav = document.getElementById('bottom-nav');
        const views = ['dashboard', 'history', 'send', 'wallet', 'profile'];
        if (views.includes(state.view)) {
            bottomNav.classList.remove('hidden');
        } else {
            bottomNav.classList.add('hidden');
        }
        bottomNav.innerHTML = `
            <button class="bottom-nav-btn flex flex-col items-center gap-1 p-2 transition-colors ${state.view === 'dashboard' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}" data-view="dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${state.view === 'dashboard' ? 'fill-emerald-100' : ''}"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                <span class="text-[10px] font-medium">Home</span>
            </button>
            <button class="bottom-nav-btn flex flex-col items-center gap-1 p-2 transition-colors ${state.view === 'history' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}" data-view="history">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${state.view === 'history' ? 'fill-emerald-100' : ''}"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
                <span class="text-[10px] font-medium">History</span>
            </button>
            <div class="relative -top-6">
                <button class="bottom-nav-btn w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 hover:scale-105 transition-transform" data-view="send">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
            </div>
            <button class="bottom-nav-btn flex flex-col items-center gap-1 p-2 transition-colors ${state.view === 'wallet' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}" data-view="wallet">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${state.view === 'wallet' ? 'fill-emerald-100' : ''}"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                <span class="text-[10px] font-medium">Wallet</span>
            </button>
            <button class="bottom-nav-btn flex flex-col items-center gap-1 p-2 transition-colors ${state.view === 'profile' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}" data-view="profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${state.view === 'profile' ? 'fill-emerald-100' : ''}"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span class="text-[10px] font-medium">Profile</span>
            </button>
        `;

        document.querySelectorAll('.bottom-nav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                state.view = e.currentTarget.dataset.view;
                render();
            });
        });
    }

    render();
});