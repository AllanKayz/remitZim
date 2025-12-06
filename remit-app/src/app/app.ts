import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Transaction,
  Beneficiary,
  NotificationItem,
  PaymentMethod,
  Rates,
  RATES,
  MOCK_NOTIFICATIONS,
  MOCK_PAYMENT_METHODS,
  FULL_HISTORY,
  BENEFICIARIES
} from './data';

// --- Gemini Configuration ---
const apiKey = ""; // Provided by environment

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // --- State Signals ---
  view = signal<string>('dashboard');
  sendStep = signal<number>(1);
  isLoading = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);
  isAuthenticated = signal<boolean>(false);

  // Wallet & Data
  walletBalance = signal<number>(1250.00);
  topUpAmount = 50;
  recentTransactions = FULL_HISTORY;
  notifications = MOCK_NOTIFICATIONS;
  paymentMethods = MOCK_PAYMENT_METHODS;

  // History Search
  searchQuery = signal<string>('');

  // Gemini State
  isAnalyzing = signal<boolean>(false);
  analysisResult = signal<string | null>(null);
  showSmartFill = signal<boolean>(false);
  smartFillText = signal<string>('');
  isSmartFilling = signal<boolean>(false);

  // Transfer Flow State
  amount = signal<number>(100);
  sourceCurr = signal<string>('GBP');
  destCurr = signal<string>('USD');
  deliveryMethod = signal<'cash' | 'mobile'>('cash');
  selectedRecipient = signal<Beneficiary | null>(null);
  refNumber = signal<number>(0);

  // Constants
  fee = 3.99;
  beneficiaries = BENEFICIARIES;

  // --- Computed ---
  currentRate = computed(() => RATES[this.sourceCurr()][this.destCurr()]);
  receiveAmount = computed(() => this.amount() * this.currentRate());
  totalPay = computed(() => this.amount() + this.fee);
  unreadCount = computed(() => this.notifications.filter(n => !n.read).length);

  // Filter history based on search
  filteredTransactions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.recentTransactions;
    return this.recentTransactions.filter(tx =>
      tx.recipient.toLowerCase().includes(query) ||
      tx.amount.toString().includes(query)
    );
  });

  // --- Methods ---

  signIn() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isAuthenticated.set(true);
      this.isLoading.set(false);
    }, 1000);
  }

  signOut() {
    this.isAuthenticated.set(false);
    this.isMenuOpen.set(false);
    this.view.set('dashboard');
  }

  navigateTo(target: string) {
    this.view.set(target);
    this.isMenuOpen.set(false);
  }

  performTopUp() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.walletBalance.update(b => b + this.topUpAmount);
      this.recentTransactions.unshift({
        id: Date.now(),
        recipient: "Wallet Top-up",
        amount: this.topUpAmount,
        currency: "GBP",
        type: "Wallet Top-up",
        status: "Completed",
        date: "Just now",
        direction: 'in'
      });
      this.isLoading.set(false);
      this.view.set('wallet');
      this.topUpAmount = 50; // Reset
    }, 1500);
  }

  selectBeneficiary(beneficiary: Beneficiary) {
    this.selectedRecipient.set(beneficiary);
    this.sendStep.set(3);
  }

  executeTransfer() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.walletBalance.update(b => b - this.totalPay()); // Deduct from wallet mock
      this.recentTransactions.unshift({
        id: Date.now(),
        recipient: this.selectedRecipient()?.name || 'Unknown',
        amount: this.amount(),
        currency: this.destCurr(),
        type: this.deliveryMethod() === 'cash' ? 'Cash Pickup' : 'Mobile Wallet',
        status: 'Processing',
        date: "Just now",
        direction: 'out'
      });
      this.refNumber.set(Math.floor(Math.random() * 1000000));
      this.view.set('success');
    }, 2000);
  }

  resetView() {
    this.view.set('dashboard');
    this.sendStep.set(1);
    this.amount.set(100);
    this.selectedRecipient.set(null);
  }

  // --- Gemini Integration (Preserved) ---

  async callGemini(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e) { console.error("Gemini Error:", e); return ''; }
  }

  async analyzeRates() {
    this.isAnalyzing.set(true);
    const prompt = `You are a savvy financial advisor for Zimbabwe remittances. Current rates: 1 ${this.sourceCurr()} = ${this.currentRate()} ${this.destCurr()}. Give a very short, fun, emoji-rich advice (max 20 words) to a user sending money now.`;
    const result = await this.callGemini(prompt);
    this.analysisResult.set(result);
    this.isAnalyzing.set(false);
  }

  async processSmartFill() {
    this.isSmartFilling.set(true);
    const prompt = `Extract transaction details from: "${this.smartFillText()}". Return JSON with keys: amount (number), currency (USD/ZiG/ZAR), method (cash/mobile).`;
    try {
      const resultText = await this.callGemini(prompt);
      const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      if (data.amount) this.amount.set(data.amount);
      if (data.currency) this.destCurr.set(data.currency);
      if (data.method) this.deliveryMethod.set(data.method);
      this.showSmartFill.set(false);
      this.smartFillText.set('');
    } catch (e) { console.error("Parse Error", e); }
    this.isSmartFilling.set(false);
  }
}
