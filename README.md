# Nova Bank — Banking Application Testing

**A Mini-Project Report & Working Implementation for Software Testing (23SCS743)**  
*Department of Computer Science and Engineering, Srinivas University Institute of Engineering & Technology, Mukka, Mangaluru – 574146*

---

## 👥 Project Team & Academic Credits

- **Chandan Gouda** — `01SU23CS049`
- **Chinna B** — `01SU23CS051`
- **Guruprasad Naik** — `01SU23CS070`
- **Hotur Gargeya Datta** — `01SU23CS077`

- **Mini Project Guide**: Mrs. Varsha G Bangera (Assistant Professor, Dept. of CSE)
- **Head of Department**: Dr. Shifana Begum (HOD, CSE)
- **Dean**: Dr. Ramakrishna N Hegde
- **Academic Year**: 2026–2027 (Degree Award 2025–2026)

---

## 📖 Project Abstract (from Chapter 1 & 4)

The **Banking Application Testing** is a comprehensive web-based application designed to provide a secure and efficient platform for testing and validating online banking operations before production deployment. It verifies core banking modules including:
1. User Registration & Onboarding
2. Authentication & 4-Digit Security PIN Validation
3. Account Management & Sensitive Data Masking
4. Real-time Balance Enquiry & Consistency
5. Cash Deposits & Boundary Checks
6. Cash Withdrawals & Overdraft Prevention
7. Peer-to-Peer Electronic Fund Transfers (Double-entry accounting)
8. Beneficiary Management & Routing Code Validation
9. Utility Bill Payments (Electricity, Water, Broadband)
10. Software Testing Engine with Automated Execution of **45 Test Cases** (100% Pass Rate)

---

## 🖥️ User Interface Overview (Matching PDF Chapter 5 Screenshots)

| Screen | File / Route | Description |
| :--- | :--- | :--- |
| **Customer Dashboard** (Page 13 Top) | `/` (`#view-dashboard`) | Sleek metallic blue virtual debit card (`$5,000.00 USD`, masked `**** 1001`), quick action tiles, and recent account activity ledger. |
| **Electronic Fund Transfer** (Page 13 Bottom) | `#view-transfer` | Registered beneficiary selection, custom account destination, quick amount pills (`+$100`, `+$500`, `+$1000`, `Max`), PIN verification, and digital receipt modal. |
| **Beneficiary Management** (Page 14 Top) | `#view-beneficiaries` | Two-column split layout: `+ Add New Beneficiary` form with IFSC validation, and `Saved Beneficiaries` list with quick-send actions. |
| **Utility Bill Payment Center** (Page 14 Bottom) | `#view-bills` | Biller selection (MESCOM Electricity, Airtel Fiber, Water Supply), bill reference number input, and authorized debit. |
| **Transaction Ledger & Statements** (Page 15 Top) | `#view-transactions` | Search filter, category filters, CSV export, and printable bank statement generation. |
| **Software Testing Dashboard** (Page 15 Middle & Bottom) | `#view-testing` | Centralized QA tester engine featuring 5 KPI cards, Donut chart, Module horizontal bar chart, 45 test case matrix, live runner progress bar, and academic report generator. |

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3, FontAwesome 6, Chart.js
- **Backend**: Node.js with Express REST APIs + In-Memory / LocalStorage Persistence
- **Python Domain Engine**: Chapter 4 `BankAccount` class & automated console test runner
- **Java Suite**: Chapter 2 `BankAccount.java` & `BankingTest.java`
- **Testing Capabilities**: Automated regression suite, test case CRUD, manual toggle pass/fail for defect simulation, CSV export, and academic report generation.

---

## 🚀 How to Run the Project

### Option 1: One-Click Windows Launcher
Double-click `start.bat` in the project root folder. It will:
1. Verify node dependencies
2. Run the 45-test Python suite
3. Start the Express server on `http://localhost:3000`
4. Automatically open your default browser to Nova Bank!

---

### Option 2: Run via Node.js
```bash
# 1. Install dependencies
npm install

# 2. Start the web application
npm start
```
Visit **`http://localhost:3000`** in any web browser.

---

### Option 3: Standalone Offline Mode (Zero Dependencies)
You can directly open `public/index.html` in Chrome, Edge, or Firefox! The application automatically falls back to client-side localStorage and client-side test assertion execution.

---

### Option 4: Run the Python Automated Test Suite
Implements the exact `BankAccount` specification from Chapter 4 of the report:
```bash
python python/test_suite.py
```
Outputs colored test assertions and 100.0% execution summary across all 45 test cases.

---

### Option 5: Run the Java Test Suite
Implements the Java Servlets / JUnit specification from Chapter 2 of the report:
```bash
javac java/*.java
java -cp java BankingTest
```

---

## 📊 Summary of 45 Automated Test Cases (Chapter 5)

| Module | Test Range | Scenarios Verified | Status |
| :--- | :--- | :--- | :---: |
| **User Registration** | `TC-REG-01` to `06` | Alphanumeric validation, missing email rejection, email regex, duplicate USN detection, initial deposit allocation, PIN setup. | **PASS** (100%) |
| **Authentication** | `TC-AUTH-01` to `06` | Valid login, wrong password rejection, SQL injection sanitization, session logout, RBAC between Customer and Admin/Tester. | **PASS** (100%) |
| **Account Management** | `TC-ACC-01` to `05` | Profile retrieval, masked card numbers (`**** 1001`), tenant isolation, active status check, audit logging. | **PASS** (100%) |
| **Balance Enquiry** | `TC-BAL-01` to `04` | Real-time balance retrieval, two-decimal precision, immediate post-debit sync, concurrent read consistency. | **PASS** (100%) |
| **Deposit Operations** | `TC-DEP-01` to `04` | Valid credit (+$2,000.00), negative deposit rejection, zero deposit rejection, ledger record integrity. | **PASS** (100%) |
| **Withdrawal Operations** | `TC-WTH-01` to `04` | Valid cash out (-$1,000.00), overdraft rejection ($10,000.00), negative withdrawal rejection, exact zero balance boundary test. | **PASS** (100%) |
| **Fund Transfer** | `TC-TXN-01` to `06` | Peer transfer to Chinna B ($1,500.00), insufficient balance rejection, self-transfer block, wrong PIN block, atomic rollback. | **PASS** (100%) |
| **Beneficiaries** | `TC-BEN-01` to `04` | Add beneficiary with IFSC, missing field rejection, deletion, minimum 6-digit account length validation. | **PASS** (100%) |
| **Utility Bill Payments** | `TC-BIL-01` to `04` | MESCOM Electricity bill payment ($85.00), wrong PIN rejection, excess balance rejection, verifiable receipt generation. | **PASS** (100%) |
| **Security & Boundary** | `TC-SEC-01`, `TC-BND-01` | XSS payload script escaping in remarks, exact balance zero-boundary check. | **PASS** (100%) |
| **TOTAL** | **45 Tests** | **Comprehensive Full System Coverage** | **100.0% PASS** |

---

## 📁 Repository Structure

```
Banking application Testing/
├── public/
│   ├── index.html            # Complete Web Application (Banking Portal + QA Dashboard)
│   ├── css/
│   │   └── style.css         # Custom styling matching screenshots (Page 13, 14, 15)
│   └── js/
│       ├── data.js           # Default accounts, beneficiaries, bills, 45 test definitions
│       ├── app.js            # Banking application logic (Transfers, Bills, Receipts)
│       └── testing.js        # Software Testing Dashboard (Runner, Chart.js, CRUD)
├── python/
│   ├── bank_account.py       # Core domain model (Chapter 4 sample code expanded)
│   └── test_suite.py         # Python test runner with colored console execution
├── java/
│   ├── BankAccount.java      # Java domain model
│   └── BankingTest.java      # Java testing suite
├── server.js                 # Express REST API server
├── package.json              # Node.js project manifest
├── start.bat                 # One-click Windows startup script
└── README.md                 # Complete documentation
```

---
*Developed for Software Testing (23SCS743), Srinivas University Institute of Engineering & Technology, Mukka.*

