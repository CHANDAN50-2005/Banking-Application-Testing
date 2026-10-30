/**
 * Default Seed Data & 45 Automated Test Cases
 * Banking Application Testing - Software Testing (23SCS743)
 * Srinivas University, Mukka, Mangaluru
 */

const SEED_DATA = {
  activeUser: {
    id: "USR-001",
    accountNo: "10002010856",
    name: "Chandan Gouda",
    usn: "01SU23CS049",
    email: "chandan@srinivas.edu",
    pin: "1234",
    role: "USER",
    accountType: "Platinum Savings Account",
    balance: 5000.00,
    status: "Active",
    openedDate: "2026-01-15"
  },
  users: [
    {
      id: "USR-001",
      accountNo: "10002010856",
      name: "Chandan Gouda",
      usn: "01SU23CS049",
      email: "chandan@srinivas.edu",
      pin: "1234",
      role: "USER",
      accountType: "Platinum Savings Account",
      balance: 5000.00,
      status: "Active"
    },
    {
      id: "USR-002",
      accountNo: "10002010851",
      name: "Chinna B",
      usn: "01SU23CS051",
      email: "chinna@srinivas.edu",
      pin: "1234",
      role: "USER",
      accountType: "Gold Savings Account",
      balance: 3200.00,
      status: "Active"
    },
    {
      id: "USR-003",
      accountNo: "10002010870",
      name: "Guruprasad Naik",
      usn: "01SU23CS070",
      email: "guruprasad@srinivas.edu",
      pin: "1234",
      role: "USER",
      accountType: "Platinum Savings Account",
      balance: 4100.00,
      status: "Active"
    },
    {
      id: "USR-004",
      accountNo: "10002010877",
      name: "Hotur Gargeya Datta",
      usn: "01SU23CS077",
      email: "hotur@srinivas.edu",
      pin: "1234",
      role: "USER",
      accountType: "Standard Checking Account",
      balance: 2800.00,
      status: "Active"
    }
  ],
  beneficiaries: [
    {
      id: "BEN-001",
      payeeName: "Chinna B",
      accountNo: "10002010851",
      bankName: "Nova Bank - Mangaluru",
      ifsc: "NOVA0002510",
      nickname: "Team Lead",
      createdAt: "2026-02-01 10:30"
    },
    {
      id: "BEN-002",
      payeeName: "Guruprasad Naik",
      accountNo: "10002010870",
      bankName: "Nova Bank - Mukka",
      ifsc: "NOVA0002510",
      nickname: "Testing Partner",
      createdAt: "2026-02-05 14:15"
    },
    {
      id: "BEN-003",
      payeeName: "Hotur Gargeya Datta",
      accountNo: "10002010877",
      bankName: "Nova Bank - Surathkal",
      ifsc: "NOVA0002510",
      nickname: "Project Member",
      createdAt: "2026-02-10 11:20"
    }
  ],
  transactions: [
    {
      id: "TXN-INIT-001",
      date: "2026-10-30 09:00:00",
      description: "Welcome Account Opening Balance",
      category: "Opening Deposit",
      type: "DEPOSIT",
      direction: "CREDIT",
      amount: 5000.00,
      balanceAfter: 5000.00,
      status: "COMPLETED",
      reference: "INIT-REF-90812"
    }
  ],
  pendingBills: [
    {
      id: "BILL-001",
      billerName: "MESCOM Electricity - Mangaluru",
      category: "Electricity",
      refNumber: "ELECTRICITY-00891",
      amount: 85.00,
      dueDate: "2026-11-05",
      status: "PENDING"
    },
    {
      id: "BILL-002",
      billerName: "Airtel Xstream Fiber Broadband",
      category: "Internet",
      refNumber: "AIRTEL-BB-99201",
      amount: 49.99,
      dueDate: "2026-11-08",
      status: "PENDING"
    },
    {
      id: "BILL-003",
      billerName: "City Corporation Water Board",
      category: "Water",
      refNumber: "WAT-MUKKA-301",
      amount: 25.50,
      dueDate: "2026-11-12",
      status: "PENDING"
    }
  ],
  testCases: [
    { id: "TC-REG-01", module: "User Registration", scenario: "Register new user account with valid alphanumeric details", category: "Functional", inputData: "Name: Hotur, USN: 01SU23CS077, Pass: strong123", expectedResult: "User created & 201 Created status returned", actualResult: "User account created with initial ledger", status: "PASS", executionTime: "12ms" },
    { id: "TC-REG-02", module: "User Registration", scenario: "Verify rejection on missing mandatory email address", category: "Validation", inputData: "Name: Test, Email: ''", expectedResult: "400 Bad Request: Email is mandatory", actualResult: "Validation blocked form submission", status: "PASS", executionTime: "8ms" },
    { id: "TC-REG-03", module: "User Registration", scenario: "Validate email format regex conformity", category: "Validation", inputData: "Email: 'invalid-email-address'", expectedResult: "Validation error: Invalid email format", actualResult: "Format rejected with error message", status: "PASS", executionTime: "7ms" },
    { id: "TC-REG-04", module: "User Registration", scenario: "Prevent duplicate registration with existing account USN/email", category: "Integrity", inputData: "USN: 01SU23CS049 (Existing)", expectedResult: "409 Conflict: USN already registered", actualResult: "Conflict detected, duplicate denied", status: "PASS", executionTime: "15ms" },
    { id: "TC-REG-05", module: "User Registration", scenario: "Verify initial welcome deposit allocation upon creation", category: "Integration", inputData: "Opening Credit: $500.00", expectedResult: "Ledger registers opening credit TXN", actualResult: "TXN-INIT entry recorded in ledger", status: "PASS", executionTime: "11ms" },
    { id: "TC-REG-06", module: "User Registration", scenario: "Assign default 4-digit security PIN during enrollment", category: "Security", inputData: "PIN: 1234", expectedResult: "Hashed security PIN stored safely", actualResult: "Security PIN attached to account", status: "PASS", executionTime: "9ms" },

    { id: "TC-AUTH-01", module: "Authentication", scenario: "Authenticate valid user credentials (chandan / password123)", category: "Security", inputData: "User: chandan, Pass: password123", expectedResult: "Token generated & dashboard access granted", actualResult: "Authentication successful, token issued", status: "PASS", executionTime: "14ms" },
    { id: "TC-AUTH-02", module: "Authentication", scenario: "Reject invalid password authentication attempt", category: "Security", inputData: "User: chandan, Pass: wrongPass999", expectedResult: "401 Unauthorized: Invalid credentials", actualResult: "Access denied with 401 response", status: "PASS", executionTime: "16ms" },
    { id: "TC-AUTH-03", module: "Authentication", scenario: "Sanitize SQL Injection payload in username input", category: "Security", inputData: "User: ' OR '1'='1' --", expectedResult: "Input escaped, injection denied", actualResult: "Payload treated as literal, rejected", status: "PASS", executionTime: "10ms" },
    { id: "TC-AUTH-04", module: "Authentication", scenario: "Validate session termination and logout invalidation", category: "Security", inputData: "Session Token header", expectedResult: "Session cleared, token invalidated", actualResult: "Redirected to login, cache invalidated", status: "PASS", executionTime: "6ms" },
    { id: "TC-AUTH-05", module: "Authentication", scenario: "Block unauthenticated access to protected banking endpoints", category: "Access Control", inputData: "GET /api/account without token", expectedResult: "403 Forbidden / 401 Unauthorized", actualResult: "Request blocked, redirected to auth", status: "PASS", executionTime: "8ms" },
    { id: "TC-AUTH-06", module: "Authentication", scenario: "Role-based authorization between Customer and Admin/Tester", category: "RBAC", inputData: "Role: USER accessing /admin", expectedResult: "Access denied: Requires ADMIN_TESTER", actualResult: "Role verified, privileges enforced", status: "PASS", executionTime: "11ms" },

    { id: "TC-ACC-01", module: "Account Management", scenario: "Fetch customer profile and account details matching DB", category: "Functional", inputData: "Account: 10002010856", expectedResult: "Holder: Chandan Gouda, Active", actualResult: "Returned profile matching record", status: "PASS", executionTime: "13ms" },
    { id: "TC-ACC-02", module: "Account Management", scenario: "Mask sensitive card and account numbers in UI view", category: "Security", inputData: "Card: 4111222233331001", expectedResult: "Masked as **** **** **** 1001", actualResult: "Correctly masked in UI payload", status: "PASS", executionTime: "5ms" },
    { id: "TC-ACC-03", module: "Account Management", scenario: "Verify customer account isolation (tenant separation)", category: "Security", inputData: "User 1 querying User 2 private data", expectedResult: "Query restricted to session account", actualResult: "Cross-tenant access blocked", status: "PASS", executionTime: "9ms" },
    { id: "TC-ACC-04", module: "Account Management", scenario: "Verify account status flag active before transaction", category: "Integrity", inputData: "Status: Active", expectedResult: "Transaction allowed for active account", actualResult: "Status verified as Active", status: "PASS", executionTime: "6ms" },
    { id: "TC-ACC-05", module: "Account Management", scenario: "Audit logging of account profile inquiries", category: "Compliance", inputData: "Action: View Profile", expectedResult: "Access timestamp logged in audit log", actualResult: "Audit entry recorded with timestamp", status: "PASS", executionTime: "7ms" },

    { id: "TC-BAL-01", module: "Balance Enquiry", scenario: "Query real-time ledger balance accurately", category: "Functional", inputData: "Account: 10002010856", expectedResult: "Returns exact balance: $5000.00", actualResult: "Retrieved exact balance: $5000.00", status: "PASS", executionTime: "10ms" },
    { id: "TC-BAL-02", module: "Balance Enquiry", scenario: "Validate two-decimal floating precision ($5000.00)", category: "Unit", inputData: "Balance field formatting", expectedResult: "Currency formatted to 2 decimals", actualResult: "Formatted strictly to 2 decimals", status: "PASS", executionTime: "4ms" },
    { id: "TC-BAL-03", module: "Balance Enquiry", scenario: "Immediate balance reflection post-debit operation", category: "Integration", inputData: "Debit of $100.00", expectedResult: "Balance updates to $4900.00 immediately", actualResult: "Instant cache & DB sync verified", status: "PASS", executionTime: "12ms" },
    { id: "TC-BAL-04", module: "Balance Enquiry", scenario: "Concurrent balance query read consistency", category: "Performance", inputData: "5 simultaneous read queries", expectedResult: "All queries return identical balance", actualResult: "ACID read consistency confirmed", status: "PASS", executionTime: "15ms" },

    { id: "TC-DEP-01", module: "Deposit Module", scenario: "Execute valid credit deposit ($2,000.00)", category: "Functional", inputData: "Amount: $2000.00", expectedResult: "Balance increases by $2000, TXN generated", actualResult: "Deposit Successful, balance updated", status: "PASS", executionTime: "18ms" },
    { id: "TC-DEP-02", module: "Deposit Module", scenario: "Reject negative amount deposit attempt (-$500.00)", category: "Boundary", inputData: "Amount: -$500.00", expectedResult: "400 Error: Invalid Amount", actualResult: "Rejected: 'Invalid Amount'", status: "PASS", executionTime: "7ms" },
    { id: "TC-DEP-03", module: "Deposit Module", scenario: "Reject zero amount deposit attempt ($0.00)", category: "Boundary", inputData: "Amount: $0.00", expectedResult: "400 Error: Invalid Amount", actualResult: "Rejected: 'Invalid Amount'", status: "PASS", executionTime: "6ms" },
    { id: "TC-DEP-04", module: "Deposit Module", scenario: "Verify deposit transaction ledger record integrity", category: "Audit", inputData: "Type: DEPOSIT, Status: COMPLETED", expectedResult: "Record contains Txn ID, amount, timestamp", actualResult: "Txn ledger entry validated", status: "PASS", executionTime: "9ms" },

    { id: "TC-WTH-01", module: "Withdrawal Module", scenario: "Process valid withdrawal within balance limits ($1,000.00)", category: "Functional", inputData: "Amount: $1000.00", expectedResult: "Balance decremented, status COMPLETED", actualResult: "Withdrawal Successful", status: "PASS", executionTime: "16ms" },
    { id: "TC-WTH-02", module: "Withdrawal Module", scenario: "Reject withdrawal exceeding available balance ($10,000.00)", category: "Negative", inputData: "Amount: $10000.00 (Bal: $5000)", expectedResult: "Error: Insufficient Balance", actualResult: "Rejected: 'Insufficient Balance'", status: "PASS", executionTime: "8ms" },
    { id: "TC-WTH-03", module: "Withdrawal Module", scenario: "Reject negative withdrawal amount (-$100.00)", category: "Boundary", inputData: "Amount: -$100.00", expectedResult: "Error: Invalid Amount", actualResult: "Rejected: 'Invalid Amount'", status: "PASS", executionTime: "7ms" },
    { id: "TC-WTH-04", module: "Withdrawal Module", scenario: "Withdraw exact total account balance ($5,000.00)", category: "Boundary", inputData: "Amount: $5000.00 (Exact balance)", expectedResult: "Withdrawal allowed, balance becomes $0.00", actualResult: "Balance successfully set to $0.00", status: "PASS", executionTime: "14ms" },

    { id: "TC-TXN-01", module: "Fund Transfer", scenario: "Execute peer fund transfer to beneficiary ($1,500.00)", category: "Functional", inputData: "Beneficiary: Chinna B, Amount: $1500, PIN: 1234", expectedResult: "Sender -$1500, Receiver +$1500, Success", actualResult: "Transfer Successful, double-entry logged", status: "PASS", executionTime: "24ms" },
    { id: "TC-TXN-02", module: "Fund Transfer", scenario: "Reject fund transfer when amount exceeds balance ($10,000.00)", category: "Negative", inputData: "Amount: $10000, Bal: $5000", expectedResult: "Error: Transfer Failed / Insufficient Balance", actualResult: "Transfer rejected, zero state mutation", status: "PASS", executionTime: "9ms" },
    { id: "TC-TXN-03", module: "Fund Transfer", scenario: "Reject transfer to own account (self-transfer restriction)", category: "Security", inputData: "Sender: 10002010856, Dest: 10002010856", expectedResult: "Error: Self-transfer Prohibited", actualResult: "Blocked: Self-transfer prohibited", status: "PASS", executionTime: "8ms" },
    { id: "TC-TXN-04", module: "Fund Transfer", scenario: "Reject transfer attempt with incorrect 4-digit security PIN", category: "Security", inputData: "PIN: 9999 (Valid: 1234)", expectedResult: "Error: Invalid Security PIN", actualResult: "Rejected: 'Invalid Security PIN'", status: "PASS", executionTime: "11ms" },
    { id: "TC-TXN-05", module: "Fund Transfer", scenario: "Reject transfer to non-existent account number", category: "Validation", inputData: "Dest Account: 9999999999", expectedResult: "Error: Beneficiary Account Not Found", actualResult: "Beneficiary lookup failed, transfer denied", status: "PASS", executionTime: "12ms" },
    { id: "TC-TXN-06", module: "Fund Transfer", scenario: "Atomic transaction rollback on any transfer failure", category: "ACID", inputData: "Failed transfer scenario", expectedResult: "Both accounts retain pre-transfer balances", actualResult: "Zero balance discrepancy detected", status: "PASS", executionTime: "15ms" },

    { id: "TC-BEN-01", module: "Beneficiaries", scenario: "Add new beneficiary with valid IFSC, name and account number", category: "Functional", inputData: "Name: Robert Smith, Acc: 10008899, IFSC: SBIN0002510", expectedResult: "Beneficiary saved to recipient list", actualResult: "Beneficiary created & visible in list", status: "PASS", executionTime: "13ms" },
    { id: "TC-BEN-02", module: "Beneficiaries", scenario: "Reject beneficiary with missing required IFSC routing code", category: "Validation", inputData: "IFSC: ''", expectedResult: "Validation error: IFSC required", actualResult: "Form blocked with required field error", status: "PASS", executionTime: "7ms" },
    { id: "TC-BEN-03", module: "Beneficiaries", scenario: "Delete existing beneficiary from recipient list", category: "Functional", inputData: "Delete ID: BEN-TEMP", expectedResult: "Beneficiary removed from active records", actualResult: "Beneficiary successfully purged", status: "PASS", executionTime: "11ms" },
    { id: "TC-BEN-04", module: "Beneficiaries", scenario: "Validate minimum 6-digit length for account number", category: "Validation", inputData: "Account: '123'", expectedResult: "Validation error: Minimum 6 digits required", actualResult: "Length validation triggered error", status: "PASS", executionTime: "6ms" },

    { id: "TC-BIL-01", module: "Bill Payments", scenario: "Authorize valid utility electricity bill payment ($85.00)", category: "Functional", inputData: "Biller: MESCOM, Ref: ELECTRICITY-00891, $85", expectedResult: "Paid, bill marked complete, balance debited", actualResult: "Bill Payment Successful, receipt issued", status: "PASS", executionTime: "22ms" },
    { id: "TC-BIL-02", module: "Bill Payments", scenario: "Reject bill payment when security PIN is incorrect", category: "Security", inputData: "PIN: 0000", expectedResult: "Error: Invalid Security PIN", actualResult: "Payment blocked, PIN mismatch", status: "PASS", executionTime: "9ms" },
    { id: "TC-BIL-03", module: "Bill Payments", scenario: "Reject bill payment exceeding current available balance", category: "Negative", inputData: "Bill: $99999.00 (Bal: $5000)", expectedResult: "Error: Insufficient Balance", actualResult: "Payment rejected for insufficient funds", status: "PASS", executionTime: "10ms" },
    { id: "TC-BIL-04", module: "Bill Payments", scenario: "Generate digital payment receipt with unique reference", category: "Audit", inputData: "Payment ID check", expectedResult: "Receipt contains unique BILL-Txn ID & stamp", actualResult: "Receipt generated with verifiable ref", status: "PASS", executionTime: "8ms" },

    { id: "TC-SEC-01", module: "Security & Validation", scenario: "Sanitize XSS script injection in remarks field", category: "Security", inputData: "Remarks: <script>alert('XSS')</script>", expectedResult: "Script escaped, rendered as plain text entity", actualResult: "HTML tags neutralized and escaped safely", status: "PASS", executionTime: "8ms" },
    { id: "TC-BND-01", module: "Boundary & Edge Cases", scenario: "Transfer maximum available balance leaves exact $0.00", category: "Boundary", inputData: "Transfer exact balance", expectedResult: "Transfer proceeds, balance reaches 0.00", actualResult: "Zero boundary condition verified correctly", status: "PASS", executionTime: "14ms" }
  ]
};

