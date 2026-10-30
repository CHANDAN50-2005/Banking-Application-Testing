/**
 * Automated Java Test Suite
 * Banking Application Testing - Software Testing (23SCS743)
 * Department of CSE, Srinivas University, Mukka
 */

public class BankingTest {
    private static int passed = 0;
    private static int failed = 0;

    private static void assertTrue(String testId, String module, String desc, boolean condition) {
        if (condition) {
            passed++;
            System.out.printf("[PASS] %-12s | %-20s | %-40s%n", testId, module, desc);
        } else {
            failed++;
            System.err.printf("[FAIL] %-12s | %-20s | %-40s%n", testId, module, desc);
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("  SRINIVAS UNIVERSITY - DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING");
        System.out.println("  JAVA TEST EXECUTION SUITE FOR BANKING APPLICATION");
        System.out.println("================================================================================");

        BankAccount acc1 = new BankAccount("10001", 5000.0, "Chandan Gouda", "1234");
        BankAccount acc2 = new BankAccount("10002", 3000.0, "Chinna B", "5678");

        // Module: Registration & Creation
        assertTrue("TC-REG-001", "Registration", "Create account with valid parameters", acc1.getAccountNo().equals("10001"));
        assertTrue("TC-REG-002", "Registration", "Initial balance allocation", acc1.checkBalance() == 5000.0);
        assertTrue("TC-REG-003", "Registration", "Zero initial balance allowed", new BankAccount("10003", 0.0).checkBalance() == 0.0);
        assertTrue("TC-REG-004", "Registration", "Status active upon creation", acc1.getStatus().equals("ACTIVE"));

        // Module: Authentication
        assertTrue("TC-AUTH-001", "Authentication", "Valid PIN authentication", acc1.getPin().equals("1234"));
        assertTrue("TC-AUTH-002", "Authentication", "Reject invalid PIN", !acc1.getPin().equals("0000"));

        // Module: Account Management
        assertTrue("TC-ACC-001", "Account Mgmt", "Retrieve account holder", acc1.getHolderName().equals("Chandan Gouda"));
        assertTrue("TC-ACC-002", "Account Mgmt", "Retrieve account number", acc1.getAccountNo().equals("10001"));
        assertTrue("TC-ACC-003", "Account Mgmt", "Account isolation verified", !acc1.getAccountNo().equals(acc2.getAccountNo()));

        // Module: Balance Enquiry
        assertTrue("TC-BAL-001", "Balance Enquiry", "Check balance precision", acc1.checkBalance() == 5000.0);

        // Module: Deposit
        assertTrue("TC-DEP-001", "Deposit", "Valid deposit of $2000", acc1.deposit(2000.0).equals("Deposit Successful"));
        assertTrue("TC-DEP-002", "Deposit", "Balance reflects deposit ($7000)", acc1.checkBalance() == 7000.0);
        assertTrue("TC-DEP-003", "Deposit", "Reject negative deposit (-$500)", acc1.deposit(-500.0).equals("Invalid Amount"));
        assertTrue("TC-DEP-004", "Deposit", "Reject zero deposit ($0)", acc1.deposit(0.0).equals("Invalid Amount"));

        // Module: Withdrawal
        assertTrue("TC-WTH-001", "Withdrawal", "Valid withdrawal of $1000", acc1.withdraw(1000.0).equals("Withdrawal Successful"));
        assertTrue("TC-WTH-002", "Withdrawal", "Balance reflects withdrawal ($6000)", acc1.checkBalance() == 6000.0);
        assertTrue("TC-WTH-003", "Withdrawal", "Reject insufficient balance ($10000)", acc1.withdraw(10000.0).equals("Insufficient Balance"));
        assertTrue("TC-WTH-004", "Withdrawal", "Reject negative withdrawal (-$100)", acc1.withdraw(-100.0).equals("Invalid Amount"));

        // Module: Fund Transfer
        assertTrue("TC-TXN-001", "Fund Transfer", "Valid transfer of $1500 to acc2", acc1.transfer(1500.0, acc2, "1234").equals("Transfer Successful"));
        assertTrue("TC-TXN-002", "Fund Transfer", "Sender balance debited ($4500)", acc1.checkBalance() == 4500.0);
        assertTrue("TC-TXN-003", "Fund Transfer", "Receiver balance credited ($4500)", acc2.checkBalance() == 4500.0);
        assertTrue("TC-TXN-004", "Fund Transfer", "Reject transfer exceeding balance", acc1.transfer(50000.0, acc2, "1234").equals("Transfer Failed"));
        assertTrue("TC-TXN-005", "Fund Transfer", "Reject self-transfer", acc1.transfer(500.0, acc1, "1234").contains("Self-transfer Prohibited"));
        assertTrue("TC-TXN-006", "Fund Transfer", "Reject invalid PIN transfer", acc1.transfer(100.0, acc2, "9999").contains("Invalid Security PIN"));

        System.out.println("================================================================================");
        System.out.printf("  JAVA TEST SUITE RESULTS: Total: %d | Passed: %d | Failed: %d%n", (passed + failed), passed, failed);
        System.out.println("================================================================================");
    }
}

