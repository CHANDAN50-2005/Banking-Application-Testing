/**
 * Nova Bank - Customer Banking Application Logic
 * Matches screenshots and requirements from Srinivas University Project Report
 */

let currentUser = null;
let currentBeneficiaries = [];
let currentTransactions = [];

document.addEventListener("DOMContentLoaded", () => {
  loadAppState();
  initViewRouting();
  renderApp();
});

// Load state from localStorage or seed
function loadAppState() {
  const savedUser = localStorage.getItem("nova_active_user");
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {
      currentUser = JSON.parse(JSON.stringify(SEED_DATA.activeUser));
    }
  } else {
    currentUser = JSON.parse(JSON.stringify(SEED_DATA.activeUser));
  }

  const savedBens = localStorage.getItem("nova_beneficiaries");
  if (savedBens) {
    try {
      currentBeneficiaries = JSON.parse(savedBens);
    } catch (e) {
      currentBeneficiaries = JSON.parse(JSON.stringify(SEED_DATA.beneficiaries));
    }
  } else {
    currentBeneficiaries = JSON.parse(JSON.stringify(SEED_DATA.beneficiaries));
  }

  const savedTxns = localStorage.getItem("nova_transactions");
  if (savedTxns) {
    try {
      currentTransactions = JSON.parse(savedTxns);
    } catch (e) {
      currentTransactions = JSON.parse(JSON.stringify(SEED_DATA.transactions));
    }
  } else {
    currentTransactions = JSON.parse(JSON.stringify(SEED_DATA.transactions));
  }
}

function saveAppState() {
  localStorage.setItem("nova_active_user", JSON.stringify(currentUser));
  localStorage.setItem("nova_beneficiaries", JSON.stringify(currentBeneficiaries));
  localStorage.setItem("nova_transactions", JSON.stringify(currentTransactions));
}

// Navigation and View Switching
function initViewRouting() {
  const links = document.querySelectorAll("[data-nav-view]");
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = link.getAttribute("data-nav-view");
      switchView(targetView);
    });
  });
}

function switchView(viewName) {
  // Hide all view sections
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("d-none"));

  // Show target section
  const targetSec = document.getElementById(`view-${viewName}`);
  if (targetSec) {
    targetSec.classList.remove("d-none");
  }

  // Update navbar links
  document.querySelectorAll(".nova-nav-link").forEach(link => {
    if (link.getAttribute("data-nav-view") === viewName) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Handle Testing Mode toggle pill appearance
  const testPill = document.getElementById("toggleTestingModeBtn");
  if (viewName === "testing") {
    testPill.classList.add("testing-active");
    testPill.innerHTML = `<i class="fa-solid fa-building-columns"></i> Switch to Banking Portal`;
  } else {
    testPill.classList.remove("testing-active");
    testPill.innerHTML = `<i class="fa-solid fa-flask-vial"></i> Testing Dashboard`;
  }

  // Specific view refresh
  if (viewName === "dashboard") renderDashboard();
  if (viewName === "transfer") renderTransferView();
  if (viewName === "beneficiaries") renderBeneficiariesView();
  if (viewName === "bills") renderBillsView();
  if (viewName === "transactions") renderTransactionsView();
  if (viewName === "testing") {
    renderTestingKPIs();
    renderCharts();
    renderTestMatrix();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleTestingMode() {
  const isTestingVisible = !document.getElementById("view-testing").classList.contains("d-none");
  if (isTestingVisible) {
    switchView("dashboard");
  } else {
    switchView("testing");
  }
}

// Render Core Elements
function renderApp() {
  updateUserBadges();
  renderDashboard();
  renderBeneficiariesDropdown();
}

function updateUserBadges() {
  document.querySelectorAll(".val-user-name").forEach(el => el.textContent = currentUser.name);
  document.querySelectorAll(".val-user-usn").forEach(el => el.textContent = currentUser.usn);
  document.querySelectorAll(".val-user-acc").forEach(el => el.textContent = currentUser.accountNo);
  document.querySelectorAll(".val-user-bal").forEach(el => el.textContent = formatCurrency(currentUser.balance));
  document.querySelectorAll(".val-user-avatar").forEach(el => el.textContent = currentUser.name.charAt(0));
}

function formatCurrency(amount) {
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ----------------------------------------------------
// 1. DASHBOARD VIEW (Screenshot Page 13 Top)
// ----------------------------------------------------
function renderDashboard() {
  updateUserBadges();

  // Recent transactions table (limit 5)
  const tbody = document.getElementById("dashboardRecentTxnsBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const recent = currentTransactions.slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-muted">No transactions recorded yet.</td></tr>`;
    return;
  }

  recent.forEach(t => {
    const isCredit = t.direction === "CREDIT";
    const amtClass = isCredit ? "amount-positive" : "amount-negative";
    const amtSign = isCredit ? "+" : "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><small class="text-muted">${t.date}</small></td>
      <td>
        <span class="fw-semibold text-dark">${t.description}</span>
        <br><small class="text-muted"><i class="fa-solid fa-receipt me-1"></i>Ref: ${t.id}</small>
      </td>
      <td><span class="badge bg-light text-secondary border">${t.category}</span></td>
      <td><span class="${amtClass} font-monospace">${amtSign}${formatCurrency(t.amount)}</span></td>
      <td><span class="badge-status badge-completed"><i class="fa-solid fa-check me-1"></i>${t.status}</span></td>
      <td>
        <button class="btn btn-sm btn-light border py-1 px-2" onclick="viewReceipt('${t.id}')">
          <i class="fa-solid fa-eye me-1"></i>Receipt
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ----------------------------------------------------
// 2. ELECTRONIC FUND TRANSFER (Screenshot Page 13 Bottom)
// ----------------------------------------------------
function renderTransferView() {
  updateUserBadges();
  renderBeneficiariesDropdown();
}

function renderBeneficiariesDropdown() {
  const select = document.getElementById("transferBeneficiarySelect");
  if (!select) return;

  select.innerHTML = `<option value="">-- Choose Beneficiary Account --</option>`;
  currentBeneficiaries.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.accountNo;
    opt.textContent = `${b.payeeName} - ${b.bankName} (${b.accountNo})`;
    select.appendChild(opt);
  });
}

function toggleTransferDestination(type) {
  const benContainer = document.getElementById("destBeneficiaryContainer");
  const otherContainer = document.getElementById("destOtherAccountContainer");

  if (type === "beneficiary") {
    benContainer.classList.remove("d-none");
    otherContainer.classList.add("d-none");
  } else {
    benContainer.classList.add("d-none");
    otherContainer.classList.remove("d-none");
  }
}

function setTransferAmount(amt) {
  if (amt === "MAX") {
    document.getElementById("transferAmountInput").value = currentUser.balance;
  } else {
    document.getElementById("transferAmountInput").value = amt;
  }
}

function handleFundTransferSubmit(e) {
  e.preventDefault();

  const isBeneficiaryMode = document.getElementById("destTypeBen").checked;
  let targetAccount = "";
  let targetName = "";

  if (isBeneficiaryMode) {
    const sel = document.getElementById("transferBeneficiarySelect");
    targetAccount = sel.value;
    const selectedOption = sel.options[sel.selectedIndex];
    targetName = selectedOption ? selectedOption.text.split(" - ")[0] : "Beneficiary";

    if (!targetAccount) {
      alert("Please select a beneficiary from the dropdown");
      return;
    }
  } else {
    targetAccount = document.getElementById("otherAccountNo").value.trim();
    targetName = document.getElementById("otherAccountName").value.trim() || "Recipient";
    const confirmAcc = document.getElementById("otherConfirmAccountNo").value.trim();

    if (!targetAccount || targetAccount.length < 6) {
      alert("Please enter a valid bank account number (at least 6 digits)");
      return;
    }
    if (targetAccount !== confirmAcc) {
      alert("Account numbers do not match! Please check and retry.");
      return;
    }
  }

  // Prevent self-transfer
  if (targetAccount === currentUser.accountNo) {
    alert("Self-transfer Prohibited: You cannot transfer money to your own source account!");
    return;
  }

  const amount = parseFloat(document.getElementById("transferAmountInput").value);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid transfer amount greater than $0.00");
    return;
  }

  if (amount > currentUser.balance) {
    alert(`Transfer Failed: Insufficient Balance! Your available balance is ${formatCurrency(currentUser.balance)}`);
    return;
  }

  const pin = document.getElementById("transferPinInput").value.trim();
  if (pin !== currentUser.pin) {
    alert("Transfer Failed: Invalid 4-Digit Security PIN!");
    return;
  }

  const remarks = document.getElementById("transferRemarksInput").value.trim() || "Electronic Fund Transfer";

  // Execute transfer
  currentUser.balance -= amount;
  const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const txnRecord = {
    id: txnId,
    date: now,
    description: `Transfer to ${targetName} (${targetAccount}) - ${remarks}`,
    category: "Fund Transfer",
    type: "TRANSFER_DEBIT",
    direction: "DEBIT",
    amount: amount,
    balanceAfter: currentUser.balance,
    status: "COMPLETED",
    beneficiaryName: targetName,
    beneficiaryAcc: targetAccount,
    remarks: remarks,
    reference: `REF-${Date.now().toString().slice(-6)}`
  };

  currentTransactions.unshift(txnRecord);
  saveAppState();
  renderApp();

  // Reset form
  document.getElementById("fundTransferForm").reset();

  // Show Digital Receipt
  showDigitalReceipt(txnRecord);
}

// ----------------------------------------------------
// 3. BENEFICIARY MANAGEMENT (Screenshot Page 14 Top)
// ----------------------------------------------------
function renderBeneficiariesView() {
  const container = document.getElementById("savedBeneficiariesList");
  const countBadge = document.getElementById("beneficiariesCountBadge");
  if (!container) return;

  countBadge.textContent = currentBeneficiaries.length;
  container.innerHTML = "";

  if (currentBeneficiaries.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <div class="mb-3"><i class="fa-solid fa-users-slash fa-3x text-secondary"></i></div>
        <h6 class="fw-bold">No Beneficiaries Added Yet</h6>
        <p class="small">Add a frequent recipient using the form on the left for 1-click transfers.</p>
      </div>
    `;
    return;
  }

  currentBeneficiaries.forEach(b => {
    const card = document.createElement("div");
    card.className = "card border rounded-3 p-3 mb-3 shadow-sm";
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <div class="user-profile-avatar" style="width:42px;height:42px;font-size:1.1rem;">
            ${b.payeeName.charAt(0)}
          </div>
          <div>
            <h6 class="mb-0 fw-bold text-dark">${b.payeeName}</h6>
            <small class="text-muted d-block">${b.bankName} | IFSC: <span class="font-monospace text-primary">${b.ifsc}</span></small>
            <small class="text-muted font-monospace">Acc: •••• ${b.accountNo.slice(-4)} (${b.nickname})</small>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-primary" onclick="quickTransferTo('${b.accountNo}')">
            <i class="fa-solid fa-paper-plane me-1"></i>Send
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteBeneficiary('${b.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function handleAddBeneficiary(e) {
  e.preventDefault();

  const payeeName = document.getElementById("benPayeeName").value.trim();
  const accountNo = document.getElementById("benAccountNo").value.trim();
  const confirmAcc = document.getElementById("benConfirmAccountNo").value.trim();
  const bankName = document.getElementById("benBankName").value.trim();
  const ifsc = document.getElementById("benIfscCode").value.trim().toUpperCase();
  const nickname = document.getElementById("benNickname").value.trim() || "Recipient";

  if (!payeeName || !accountNo || !bankName || !ifsc) {
    alert("Please fill in all mandatory beneficiary fields!");
    return;
  }

  if (accountNo !== confirmAcc) {
    alert("Account numbers do not match!");
    return;
  }

  if (accountNo.length < 6) {
    alert("Account number must be at least 6 digits!");
    return;
  }

  const newBen = {
    id: `BEN-${Math.floor(1000 + Math.random() * 9000)}`,
    payeeName,
    accountNo,
    bankName,
    ifsc,
    nickname,
    createdAt: new Date().toISOString().replace("T", " ").slice(0, 16)
  };

  currentBeneficiaries.push(newBen);
  saveAppState();
  renderBeneficiariesView();
  renderBeneficiariesDropdown();

  document.getElementById("addBeneficiaryForm").reset();
  showToast(`Beneficiary ${payeeName} successfully saved!`);
}

function deleteBeneficiary(id) {
  if (!confirm("Are you sure you want to remove this saved beneficiary?")) return;
  currentBeneficiaries = currentBeneficiaries.filter(b => b.id !== id);
  saveAppState();
  renderBeneficiariesView();
  renderBeneficiariesDropdown();
  showToast("Beneficiary removed.");
}

function quickTransferTo(accNo) {
  switchView("transfer");
  document.getElementById("destTypeBen").checked = true;
  toggleTransferDestination("beneficiary");
  const sel = document.getElementById("transferBeneficiarySelect");
  if (sel) sel.value = accNo;
}

// ----------------------------------------------------
// 4. UTILITY BILL PAYMENT CENTER (Screenshot Page 14 Bottom)
// ----------------------------------------------------
function renderBillsView() {
  updateUserBadges();
}

function handleBillPaymentSubmit(e) {
  e.preventDefault();

  const biller = document.getElementById("billerSelect").value;
  const billRef = document.getElementById("billRefNumber").value.trim();
  const amount = parseFloat(document.getElementById("billAmountInput").value);
  const pin = document.getElementById("billPinInput").value.trim();

  if (!biller || !billRef) {
    alert("Please select a biller and enter the bill reference number");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid bill amount greater than $0.00");
    return;
  }

  if (amount > currentUser.balance) {
    alert(`Bill Payment Failed: Insufficient Balance! (Balance: ${formatCurrency(currentUser.balance)})`);
    return;
  }

  if (pin !== currentUser.pin) {
    alert("Bill Payment Failed: Invalid 4-Digit Security PIN!");
    return;
  }

  // Deduct & Record
  currentUser.balance -= amount;
  const txnId = `BILL-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const txnRecord = {
    id: txnId,
    date: now,
    description: `Utility Payment: ${biller} (Ref: ${billRef})`,
    category: "Utility Bill",
    type: "BILL_PAYMENT",
    direction: "DEBIT",
    amount: amount,
    balanceAfter: currentUser.balance,
    status: "COMPLETED",
    reference: `BIL-${Date.now().toString().slice(-6)}`
  };

  currentTransactions.unshift(txnRecord);
  saveAppState();
  renderApp();

  document.getElementById("billPaymentForm").reset();
  showDigitalReceipt(txnRecord);
}

// ----------------------------------------------------
// 5. TRANSACTION LEDGER & STATEMENTS (Screenshot Page 15 Top)
// ----------------------------------------------------
function renderTransactionsView() {
  const tbody = document.getElementById("ledgerTableBody");
  if (!tbody) return;

  const searchVal = (document.getElementById("ledgerSearchInput")?.value || "").toLowerCase();
  const typeFilter = document.getElementById("ledgerTypeFilter")?.value || "ALL";

  let list = currentTransactions;

  if (typeFilter !== "ALL") {
    list = list.filter(t => t.type === typeFilter || t.category.toLowerCase().includes(typeFilter.toLowerCase()));
  }

  if (searchVal) {
    list = list.filter(t => 
      t.description.toLowerCase().includes(searchVal) ||
      t.id.toLowerCase().includes(searchVal) ||
      t.reference.toLowerCase().includes(searchVal)
    );
  }

  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No transactions found matching your criteria.</td></tr>`;
    return;
  }

  list.forEach(t => {
    const isCredit = t.direction === "CREDIT";
    const amtClass = isCredit ? "amount-positive" : "amount-negative";
    const amtSign = isCredit ? "+" : "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><small class="text-muted font-monospace">${t.date}</small></td>
      <td><span class="font-monospace fw-bold text-primary">${t.id}</span></td>
      <td>
        <span class="fw-semibold text-dark">${t.description}</span>
      </td>
      <td><span class="badge bg-light text-secondary border">${t.category}</span></td>
      <td><span class="badge ${isCredit ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">${t.direction}</span></td>
      <td><span class="${amtClass} font-monospace">${amtSign}${formatCurrency(t.amount)}</span></td>
      <td><span class="font-monospace text-muted">${formatCurrency(t.balanceAfter)}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary py-0 px-2" onclick="viewReceipt('${t.id}')">
          <i class="fa-solid fa-receipt me-1"></i>Receipt
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ----------------------------------------------------
// DEPOSIT MODAL (Sample Test in Chapter 4)
// ----------------------------------------------------
function handleDepositSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("depositAmountInput").value);
  if (isNaN(amount) || amount <= 0) {
    alert("Deposit Failed: Invalid Amount! Amount must be greater than $0.00");
    return;
  }

  const remarks = document.getElementById("depositRemarksInput").value.trim() || "Wire / Branch Deposit";

  currentUser.balance += amount;
  const txnId = `TXN-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const txnRecord = {
    id: txnId,
    date: now,
    description: remarks,
    category: "Direct Deposit",
    type: "DEPOSIT",
    direction: "CREDIT",
    amount: amount,
    balanceAfter: currentUser.balance,
    status: "COMPLETED",
    reference: `DEP-${Date.now().toString().slice(-6)}`
  };

  currentTransactions.unshift(txnRecord);
  saveAppState();
  renderApp();

  bootstrap.Modal.getInstance(document.getElementById("depositModal")).hide();
  document.getElementById("depositForm").reset();

  showToast(`Successfully deposited ${formatCurrency(amount)} into your account!`);
}

// ----------------------------------------------------
// DIGITAL RECEIPT MODAL
// ----------------------------------------------------
function showDigitalReceipt(txn) {
  document.getElementById("receiptTxnId").textContent = txn.id;
  document.getElementById("receiptDate").textContent = txn.date;
  document.getElementById("receiptDesc").textContent = txn.description;
  document.getElementById("receiptAmount").textContent = formatCurrency(txn.amount);
  document.getElementById("receiptBalance").textContent = formatCurrency(txn.balanceAfter);
  document.getElementById("receiptRef").textContent = txn.reference;
  document.getElementById("receiptStatus").textContent = txn.status;

  const modal = new bootstrap.Modal(document.getElementById("receiptModal"));
  modal.show();
}

function viewReceipt(txnId) {
  const txn = currentTransactions.find(t => t.id === txnId);
  if (txn) {
    showDigitalReceipt(txn);
  }
}

// ----------------------------------------------------
// SWITCH / LOGIN USER MODAL
// ----------------------------------------------------
function switchActiveUser(userAccNo) {
  const target = SEED_DATA.users.find(u => u.accountNo === userAccNo);
  if (target) {
    currentUser = JSON.parse(JSON.stringify(target));
    saveAppState();
    renderApp();
    showToast(`Switched active session to ${currentUser.name} (${currentUser.usn})`);
  }
}

// Statement Export CSV
function exportStatementCSV() {
  let csv = "Date & Time,Transaction ID,Description,Category,Type,Amount,Balance After,Status\n";
  currentTransactions.forEach(t => {
    csv += `"${t.date}","${t.id}","${t.description.replace(/"/g, '""')}","${t.category}","${t.direction}","${t.amount}","${t.balanceAfter}","${t.status}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `NovaBank_Statement_${currentUser.accountNo}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

