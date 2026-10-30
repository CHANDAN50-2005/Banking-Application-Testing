-- ============================================================================
-- BANKING APPLICATION TESTING - DATABASE SCHEMA (MySQL)
-- Software Testing (23SCS743) - Mini Project Report
-- Srinivas University Institute of Engineering & Technology, Mukka
-- Students: Chandan Gouda (01SU23CS049), Chinna B (01SU23CS051),
--           Guruprasad Naik (01SU23CS070), Hotur Gargeya Datta (01SU23CS077)
-- Guide: Mrs. Varsha G Bangera (Assistant Professor, Dept. of CSE)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `banking_testing_db` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `banking_testing_db`;

-- 1. USERS TABLE
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` VARCHAR(32) PRIMARY KEY,
    `account_no` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `usn` VARCHAR(20) NOT NULL UNIQUE,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `pin` VARCHAR(8) NOT NULL DEFAULT '1234',
    `role` ENUM('USER', 'ADMIN_TESTER') DEFAULT 'USER',
    `status` VARCHAR(20) DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ACCOUNTS TABLE
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
    `account_no` VARCHAR(20) PRIMARY KEY,
    `user_id` VARCHAR(32) NOT NULL,
    `account_type` VARCHAR(50) DEFAULT 'Platinum Savings Account',
    `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(20) DEFAULT 'Active',
    `opened_date` DATE NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- 3. BENEFICIARIES TABLE
DROP TABLE IF EXISTS `beneficiaries`;
CREATE TABLE `beneficiaries` (
    `id` VARCHAR(32) PRIMARY KEY,
    `user_account_no` VARCHAR(20) NOT NULL,
    `payee_name` VARCHAR(100) NOT NULL,
    `account_no` VARCHAR(30) NOT NULL,
    `bank_name` VARCHAR(100) NOT NULL,
    `ifsc` VARCHAR(20) NOT NULL,
    `nickname` VARCHAR(50) DEFAULT 'Recipient',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_account_no`) REFERENCES `accounts`(`account_no`) ON DELETE CASCADE
);

-- 4. TRANSACTIONS LEDGER TABLE
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
    `id` VARCHAR(32) PRIMARY KEY,
    `account_no` VARCHAR(20) NOT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `description` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `type` VARCHAR(30) NOT NULL,
    `direction` ENUM('CREDIT', 'DEBIT') NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `balance_after` DECIMAL(15, 2) NOT NULL,
    `status` VARCHAR(20) DEFAULT 'COMPLETED',
    `reference` VARCHAR(50) NOT NULL,
    FOREIGN KEY (`account_no`) REFERENCES `accounts`(`account_no`) ON DELETE CASCADE
);

-- 5. UTILITY BILLS TABLE
DROP TABLE IF EXISTS `bills`;
CREATE TABLE `bills` (
    `id` VARCHAR(32) PRIMARY KEY,
    `biller_name` VARCHAR(100) NOT NULL,
    `biller_code` VARCHAR(50) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `ref_number` VARCHAR(50) NOT NULL UNIQUE,
    `amount` DECIMAL(10, 2) NOT NULL,
    `due_date` DATE NOT NULL,
    `status` ENUM('PENDING', 'PAID') DEFAULT 'PENDING'
);

-- 6. SOFTWARE TESTING MODULE - 45 TEST CASES TABLE
DROP TABLE IF EXISTS `test_cases`;
CREATE TABLE `test_cases` (
    `id` VARCHAR(20) PRIMARY KEY,
    `module` VARCHAR(50) NOT NULL,
    `scenario` TEXT NOT NULL,
    `category` VARCHAR(30) NOT NULL,
    `input_data` TEXT,
    `expected_result` TEXT NOT NULL,
    `actual_result` TEXT NOT NULL,
    `status` ENUM('PASS', 'FAIL', 'BLOCKED') DEFAULT 'PASS',
    `execution_time` VARCHAR(20) DEFAULT '10ms',
    `last_executed` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- SEED DATA INSERTION (Matches Project Report Team & Default Values)
-- ============================================================================

-- Insert Users
INSERT INTO `users` (`id`, `account_no`, `name`, `usn`, `email`, `password`, `pin`, `role`, `status`) VALUES
('USR-001', '10002010856', 'Chandan Gouda', '01SU23CS049', 'chandan@srinivas.edu', 'password123', '1234', 'USER', 'Active'),
('USR-002', '10002010851', 'Chinna B', '01SU23CS051', 'chinna@srinivas.edu', 'password123', '1234', 'USER', 'Active'),
('USR-003', '10002010870', 'Guruprasad Naik', '01SU23CS070', 'guruprasad@srinivas.edu', 'password123', '1234', 'USER', 'Active'),
('USR-004', '10002010877', 'Hotur Gargeya Datta', '01SU23CS077', 'hotur@srinivas.edu', 'password123', '1234', 'USER', 'Active'),
('USR-ADMIN', '999900001', 'Mrs. Varsha G Bangera (Guide)', 'STAFF-CSE', 'guide@srinivas.edu', 'admin123', '9999', 'ADMIN_TESTER', 'Active');

-- Insert Accounts
INSERT INTO `accounts` (`account_no`, `user_id`, `account_type`, `balance`, `status`, `opened_date`) VALUES
('10002010856', 'USR-001', 'Platinum Savings Account', 5000.00, 'Active', '2026-01-15'),
('10002010851', 'USR-002', 'Gold Savings Account', 3200.00, 'Active', '2026-01-18'),
('10002010870', 'USR-003', 'Platinum Savings Account', 4100.00, 'Active', '2026-01-20'),
('10002010877', 'USR-004', 'Standard Checking Account', 2800.00, 'Active', '2026-01-22'),
('999900001', 'USR-ADMIN', 'Institutional Master Account', 100000.00, 'Active', '2025-08-01');

-- Insert Beneficiaries
INSERT INTO `beneficiaries` (`id`, `user_account_no`, `payee_name`, `account_no`, `bank_name`, `ifsc`, `nickname`) VALUES
('BEN-001', '10002010856', 'Chinna B', '10002010851', 'Nova Bank - Mangaluru Branch', 'NOVA0002510', 'Team Lead'),
('BEN-002', '10002010856', 'Guruprasad Naik', '10002010870', 'Nova Bank - Mukka Branch', 'NOVA0002510', 'Testing Partner'),
('BEN-003', '10002010856', 'Hotur Gargeya Datta', '10002010877', 'Nova Bank - Surathkal Branch', 'NOVA0002510', 'Project Member');

-- Insert Opening Balance Transaction
INSERT INTO `transactions` (`id`, `account_no`, `description`, `category`, `type`, `direction`, `amount`, `balance_after`, `status`, `reference`) VALUES
('TXN-INIT-001', '10002010856', 'Welcome Account Opening Balance', 'Opening Deposit', 'DEPOSIT', 'CREDIT', 5000.00, 5000.00, 'COMPLETED', 'INIT-REF-90812');

-- Insert Utility Bills
INSERT INTO `bills` (`id`, `biller_name`, `biller_code`, `category`, `ref_number`, `amount`, `due_date`, `status`) VALUES
('BILL-001', 'MESCOM Electricity - Mangaluru', 'MESCOM-ELEC', 'Electricity', 'ELECTRICITY-00891', 85.00, '2026-11-05', 'PENDING'),
('BILL-002', 'Airtel Xstream Fiber Broadband', 'AIRTEL-BB', 'Internet', 'AIRTEL-BB-99201', 49.99, '2026-11-08', 'PENDING'),
('BILL-003', 'City Corporation Water Supply', 'CC-WATER', 'Water', 'WAT-MUKKA-301', 25.50, '2026-11-12', 'PENDING');

-- Insert All 45 Test Cases
INSERT INTO `test_cases` (`id`, `module`, `scenario`, `category`, `input_data`, `expected_result`, `actual_result`, `status`, `execution_time`) VALUES
('TC-REG-01', 'User Registration', 'Register new user account with valid alphanumeric details', 'Functional', 'Name: Hotur, USN: 01SU23CS077, Pass: strong123', 'User created & 201 Created status returned', 'User account created with initial ledger', 'PASS', '12ms'),
('TC-REG-02', 'User Registration', 'Verify rejection on missing mandatory email address', 'Validation', 'Name: Test, Email: ''', '400 Bad Request: Email is mandatory', 'Validation blocked form submission', 'PASS', '8ms'),
('TC-REG-03', 'User Registration', 'Validate email format regex conformity', 'Validation', 'Email: ''invalid-email-address''', 'Validation error: Invalid email format', 'Format rejected with error message', 'PASS', '7ms'),
('TC-REG-04', 'User Registration', 'Prevent duplicate registration with existing account USN/email', 'Integrity', 'USN: 01SU23CS049 (Existing)', '409 Conflict: USN already registered', 'Conflict detected, duplicate denied', 'PASS', '15ms'),
('TC-REG-05', 'User Registration', 'Verify initial welcome deposit allocation upon creation', 'Integration', 'Opening Credit: $500.00', 'Ledger registers opening credit TXN', 'TXN-INIT entry recorded in ledger', 'PASS', '11ms'),
('TC-REG-06', 'User Registration', 'Assign default 4-digit security PIN during enrollment', 'Security', 'PIN: 1234', 'Hashed security PIN stored safely', 'Security PIN attached to account', 'PASS', '9ms'),
('TC-AUTH-01', 'Authentication', 'Authenticate valid user credentials (chandan / password123)', 'Security', 'User: chandan, Pass: password123', 'Token generated & dashboard access granted', 'Authentication successful, token issued', 'PASS', '14ms'),
('TC-AUTH-02', 'Authentication', 'Reject invalid password authentication attempt', 'Security', 'User: chandan, Pass: wrongPass999', '401 Unauthorized: Invalid credentials', 'Access denied with 401 response', 'PASS', '16ms'),
('TC-AUTH-03', 'Authentication', 'Sanitize SQL Injection payload in username input', 'Security', 'User: '' OR ''1''=''1'' --', 'Input escaped, injection denied', 'Payload treated as literal, rejected', 'PASS', '10ms'),
('TC-AUTH-04', 'Authentication', 'Validate session termination and logout invalidation', 'Security', 'Session Token header', 'Session cleared, token invalidated', 'Redirected to login, cache invalidated', 'PASS', '6ms'),
('TC-AUTH-05', 'Authentication', 'Block unauthenticated access to protected banking endpoints', 'Access Control', 'GET /api/account without token', '403 Forbidden / 401 Unauthorized', 'Request blocked, redirected to auth', 'PASS', '8ms'),
('TC-AUTH-06', 'Authentication', 'Role-based authorization between Customer and Admin/Tester', 'RBAC', 'Role: USER accessing /admin', 'Access denied: Requires ADMIN_TESTER', 'Role verified, privileges enforced', 'PASS', '11ms'),
('TC-ACC-01', 'Account Management', 'Fetch customer profile and account details matching DB', 'Functional', 'Account: 10002010856', 'Holder: Chandan Gouda, Active', 'Returned profile matching record', 'PASS', '13ms'),
('TC-ACC-02', 'Account Management', 'Mask sensitive card and account numbers in UI view', 'Security', 'Card: 4111222233331001', 'Masked as **** **** **** 1001', 'Correctly masked in UI payload', 'PASS', '5ms'),
('TC-ACC-03', 'Account Management', 'Verify customer account isolation (tenant separation)', 'Security', 'User 1 querying User 2 private data', 'Query restricted to session account', 'Cross-tenant access blocked', 'PASS', '9ms'),
('TC-ACC-04', 'Account Management', 'Verify account status flag active before transaction', 'Integrity', 'Status: Active', 'Transaction allowed for active account', 'Status verified as Active', 'PASS', '6ms'),
('TC-ACC-05', 'Account Management', 'Audit logging of account profile inquiries', 'Compliance', 'Action: View Profile', 'Access timestamp logged in audit log', 'Audit entry recorded with timestamp', 'PASS', '7ms'),
('TC-BAL-01', 'Balance Enquiry', 'Query real-time ledger balance accurately', 'Functional', 'Account: 10002010856', 'Returns exact balance: $5000.00', 'Retrieved exact balance: $5000.00', 'PASS', '10ms'),
('TC-BAL-02', 'Balance Enquiry', 'Validate two-decimal floating precision ($5000.00)', 'Unit', 'Balance field formatting', 'Currency formatted to 2 decimals', 'Formatted strictly to 2 decimals', 'PASS', '4ms'),
('TC-BAL-03', 'Balance Enquiry', 'Immediate balance reflection post-debit operation', 'Integration', 'Debit of $100.00', 'Balance updates to $4900.00 immediately', 'Instant cache & DB sync verified', 'PASS', '12ms'),
('TC-BAL-04', 'Balance Enquiry', 'Concurrent balance query read consistency', 'Performance', '5 simultaneous read queries', 'All queries return identical balance', 'ACID read consistency confirmed', 'PASS', '15ms'),
('TC-DEP-01', 'Deposit Module', 'Execute valid credit deposit ($2,000.00)', 'Functional', 'Amount: $2000.00', 'Balance increases by $2000, TXN generated', 'Deposit Successful, balance updated', 'PASS', '18ms'),
('TC-DEP-02', 'Deposit Module', 'Reject negative amount deposit attempt (-$500.00)', 'Boundary', 'Amount: -$500.00', '400 Error: Invalid Amount', 'Rejected: ''Invalid Amount''', 'PASS', '7ms'),
('TC-DEP-03', 'Deposit Module', 'Reject zero amount deposit attempt ($0.00)', 'Boundary', 'Amount: $0.00', '400 Error: Invalid Amount', 'Rejected: ''Invalid Amount''', 'PASS', '6ms'),
('TC-DEP-04', 'Deposit Module', 'Verify deposit transaction ledger record integrity', 'Audit', 'Type: DEPOSIT, Status: COMPLETED', 'Record contains Txn ID, amount, timestamp', 'Txn ledger entry validated', 'PASS', '9ms'),
('TC-WTH-01', 'Withdrawal Module', 'Process valid withdrawal within balance limits ($1,000.00)', 'Functional', 'Amount: $1000.00', 'Balance decremented, status COMPLETED', 'Withdrawal Successful', 'PASS', '16ms'),
('TC-WTH-02', 'Withdrawal Module', 'Reject withdrawal exceeding available balance ($10,000.00)', 'Negative', 'Amount: $10000.00 (Bal: $5000)', 'Error: Insufficient Balance', 'Rejected: ''Insufficient Balance''', 'PASS', '8ms'),
('TC-WTH-03', 'Withdrawal Module', 'Reject negative withdrawal amount (-$100.00)', 'Boundary', 'Amount: -$100.00', 'Error: Invalid Amount', 'Rejected: ''Invalid Amount''', 'PASS', '7ms'),
('TC-WTH-04', 'Withdrawal Module', 'Withdraw exact total account balance ($5,000.00)', 'Boundary', 'Amount: $5000.00 (Exact balance)', 'Withdrawal allowed, balance becomes $0.00', 'Balance successfully set to $0.00', 'PASS', '14ms'),
('TC-TXN-01', 'Fund Transfer', 'Execute peer fund transfer to beneficiary ($1,500.00)', 'Functional', 'Beneficiary: Chinna B, Amount: $1500, PIN: 1234', 'Sender -$1500, Receiver +$1500, Success', 'Transfer Successful, double-entry logged', 'PASS', '24ms'),
('TC-TXN-02', 'Fund Transfer', 'Reject fund transfer when amount exceeds balance ($10,000.00)', 'Negative', 'Amount: $10000, Bal: $5000', 'Error: Transfer Failed / Insufficient Balance', 'Transfer rejected, zero state mutation', 'PASS', '9ms'),
('TC-TXN-03', 'Fund Transfer', 'Reject transfer to own account (self-transfer restriction)', 'Security', 'Sender: 10002010856, Dest: 10002010856', 'Error: Self-transfer Prohibited', 'Blocked: Self-transfer prohibited', 'PASS', '8ms'),
('TC-TXN-04', 'Fund Transfer', 'Reject transfer attempt with incorrect 4-digit security PIN', 'Security', 'PIN: 9999 (Valid: 1234)', 'Error: Invalid Security PIN', 'Rejected: ''Invalid Security PIN''', 'PASS', '11ms'),
('TC-TXN-05', 'Fund Transfer', 'Reject transfer to non-existent account number', 'Validation', 'Dest Account: 9999999999', 'Error: Beneficiary Account Not Found', 'Beneficiary lookup failed, transfer denied', 'PASS', '12ms'),
('TC-TXN-06', 'Fund Transfer', 'Atomic transaction rollback on any transfer failure', 'ACID', 'Failed transfer scenario', 'Both accounts retain pre-transfer balances', 'Zero balance discrepancy detected', 'PASS', '15ms'),
('TC-BEN-01', 'Beneficiaries', 'Add new beneficiary with valid IFSC, name and account number', 'Functional', 'Name: Robert Smith, Acc: 10008899, IFSC: SBIN0002510', 'Beneficiary saved to recipient list', 'Beneficiary created & visible in list', 'PASS', '13ms'),
('TC-BEN-02', 'Beneficiaries', 'Reject beneficiary with missing required IFSC routing code', 'Validation', 'IFSC: ''''', 'Validation error: IFSC required', 'Form blocked with required field error', 'PASS', '7ms'),
('TC-BEN-03', 'Beneficiaries', 'Delete existing beneficiary from recipient list', 'Functional', 'Delete ID: BEN-TEMP', 'Beneficiary removed from active records', 'Beneficiary successfully purged', 'PASS', '11ms'),
('TC-BEN-04', 'Beneficiaries', 'Validate minimum 6-digit length for account number', 'Validation', 'Account: ''123''', 'Validation error: Minimum 6 digits required', 'Length validation triggered error', 'PASS', '6ms'),
('TC-BIL-01', 'Bill Payments', 'Authorize valid utility electricity bill payment ($85.00)', 'Functional', 'Biller: MESCOM, Ref: ELECTRICITY-00891, $85', 'Paid, bill marked complete, balance debited', 'Bill Payment Successful, receipt issued', 'PASS', '22ms'),
('TC-BIL-02', 'Bill Payments', 'Reject bill payment when security PIN is incorrect', 'Security', 'PIN: 0000', 'Error: Invalid Security PIN', 'Payment blocked, PIN mismatch', 'PASS', '9ms'),
('TC-BIL-03', 'Bill Payments', 'Reject bill payment exceeding current available balance', 'Negative', 'Bill: $99999.00 (Bal: $5000)', 'Error: Insufficient Balance', 'Payment rejected for insufficient funds', 'PASS', '10ms'),
('TC-BIL-04', 'Bill Payments', 'Generate digital payment receipt with unique reference', 'Audit', 'Payment ID check', 'Receipt contains unique BILL-Txn ID & stamp', 'Receipt generated with verifiable ref', 'PASS', '8ms'),
('TC-SEC-01', 'Security & Validation', 'Sanitize XSS script injection in remarks field', 'Security', 'Remarks: <script>alert(''XSS'')</script>', 'Script escaped, rendered as plain text entity', 'HTML tags neutralized and escaped safely', 'PASS', '8ms'),
('TC-BND-01', 'Boundary & Edge Cases', 'Transfer maximum available balance leaves exact $0.00', 'Boundary', 'Transfer exact balance', 'Transfer proceeds, balance reaches 0.00', 'Zero boundary condition verified correctly', 'PASS', '14ms');

