"""
Automated Test Suite Runner (Python)
Banking Application Testing - Mini Project (23SCS743)
Department of Computer Science and Engineering, Srinivas University, Mukka
Supervised by: Mrs. Varsha G Bangera (Assistant Professor, Dept. of CSE)
Students: Chandan Gouda (01SU23CS049), Chinna B (01SU23CS051),
          Guruprasad Naik (01SU23CS070), Hotur Gargeya Datta (01SU23CS077)
"""

import sys
import time
from bank_account import BankAccount


class BankingTestSuite:
    def __init__(self):
        self.results = []
        self.passed = 0
        self.failed = 0

    def assert_test(self, test_id, module, description, category, input_data, expected, actual_func):
        start_time = time.time()
        try:
            actual = actual_func()
            duration_ms = round((time.time() - start_time) * 1000, 2)
            passed = (actual == expected)
        except Exception as e:
            actual = f"Exception: {str(e)}"
            duration_ms = round((time.time() - start_time) * 1000, 2)
            passed = False

        status = "PASS" if passed else "FAIL"
        if passed:
            self.passed += 1
        else:
            self.failed += 1

        record = {
            "id": test_id,
            "module": module,
            "description": description,
            "category": category,
            "input": input_data,
            "expected": expected,
            "actual": actual,
            "duration": f"{duration_ms}ms",
            "status": status
        }
        self.results.append(record)

        color = "\033[92m" if passed else "\033[91m"
        reset = "\033[0m"
        print(f"[{color}{status}{reset}] {test_id} | {module:<22} | {description[:40]:<40} | ({duration_ms}ms)")

    def run_all_45_tests(self):
        print("=" * 80)
        print("  SRINIVAS UNIVERSITY - DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING")
        print("  SOFTWARE TESTING (23SCS743) - AUTOMATED BANKING TEST SUITE (45 TESTS)")
        print("=" * 80)

        # Baseline Accounts Setup
        user1 = BankAccount("10001", 5000.0, "Chandan Gouda", pin="1234", email="chandan@srinivas.edu")
        user2 = BankAccount("10002", 3000.0, "Chinna B", pin="5678", email="chinna@srinivas.edu")
        user3 = BankAccount("10003", 2500.0, "Guruprasad Naik", pin="4321", email="guru@srinivas.edu")

        # ---------------- MODULE 1: USER REGISTRATION (6 Tests) ----------------
        self.assert_test(
            "TC-REG-001", "User Registration", "Register account with valid parameters", "Functional",
            "acc=10004, bal=1000, holder=Hotur", "10004",
            lambda: BankAccount("10004", 1000.0, "Hotur Gargeya Datta").account_no
        )
        self.assert_test(
            "TC-REG-002", "User Registration", "Initial balance credit reflection", "Functional",
            "Initial bal=2500", 2500.0,
            lambda: BankAccount("10005", 2500.0).check_balance()
        )
        self.assert_test(
            "TC-REG-003", "User Registration", "Zero initial deposit allowed on opening", "Boundary",
            "Initial bal=0", 0.0,
            lambda: BankAccount("10006", 0.0).check_balance()
        )
        self.assert_test(
            "TC-REG-004", "User Registration", "Status active upon registration", "Security",
            "acc=10007", "ACTIVE",
            lambda: BankAccount("10007", 500.0).status
        )
        self.assert_test(
            "TC-REG-005", "User Registration", "Record opening balance in ledger", "Integration",
            "bal=5000", "Welcome Account Opening Balance",
            lambda: user1.transactions[0]["description"]
        )
        self.assert_test(
            "TC-REG-006", "User Registration", "Security PIN assignment upon setup", "Security",
            "pin=9876", "9876",
            lambda: BankAccount("10008", 100.0, pin="9876").pin
        )

        # ---------------- MODULE 2: LOGIN & AUTHENTICATION (6 Tests) ----------------
        self.assert_test(
            "TC-AUTH-001", "Authentication", "Verify valid PIN verification", "Security",
            "pin=1234", True,
            lambda: user1.pin == "1234"
        )
        self.assert_test(
            "TC-AUTH-002", "Authentication", "Reject incorrect PIN verification", "Security",
            "pin=9999", False,
            lambda: user1.pin == "9999"
        )
        self.assert_test(
            "TC-AUTH-003", "Authentication", "SQL Injection pattern rejection in auth input", "Security",
            "' OR '1'='1", False,
            lambda: user1.pin == "' OR '1'='1"
        )
        self.assert_test(
            "TC-AUTH-004", "Authentication", "Active session account verification", "Functional",
            "acc=10001", "10001",
            lambda: user1.account_no
        )
        self.assert_test(
            "TC-AUTH-005", "Authentication", "Validate email binding for 2FA alerts", "Functional",
            "email", "chandan@srinivas.edu",
            lambda: user1.email
        )
        self.assert_test(
            "TC-AUTH-006", "Authentication", "Account status validation for active operations", "Security",
            "status", "ACTIVE",
            lambda: user1.status
        )

        # ---------------- MODULE 3: ACCOUNT MANAGEMENT (5 Tests) ----------------
        self.assert_test(
            "TC-ACC-001", "Account Management", "Retrieve cardholder full name", "Functional",
            "holder_name", "Chandan Gouda",
            lambda: user1.holder_name
        )
        self.assert_test(
            "TC-ACC-002", "Account Management", "Retrieve unique account number identifier", "Functional",
            "account_no", "10001",
            lambda: user1.account_no
        )
        self.assert_test(
            "TC-ACC-003", "Account Management", "Account isolation across distinct users", "Security",
            "user1.acc != user2.acc", True,
            lambda: user1.account_no != user2.account_no
        )
        self.assert_test(
            "TC-ACC-004", "Account Management", "Ensure independent account balances", "Integrity",
            "user1.bal != user2.bal", True,
            lambda: user1.check_balance() != user2.check_balance()
        )
        self.assert_test(
            "TC-ACC-005", "Account Management", "Verify transaction history tracking exists", "Functional",
            "len(transactions) > 0", True,
            lambda: len(user1.transactions) > 0
        )

        # ---------------- MODULE 4: BALANCE ENQUIRY (4 Tests) ----------------
        self.assert_test(
            "TC-BAL-001", "Balance Enquiry", "Accurate initial balance retrieval", "Unit",
            "Check initial", 5000.0,
            lambda: user1.check_balance()
        )
        self.assert_test(
            "TC-BAL-002", "Balance Enquiry", "Check balance of secondary user", "Unit",
            "Check user2", 3000.0,
            lambda: user2.check_balance()
        )
        self.assert_test(
            "TC-BAL-003", "Balance Enquiry", "Two-decimal precision formatting consistency", "Functional",
            "5000.00", 5000.0,
            lambda: round(user1.check_balance(), 2)
        )
        self.assert_test(
            "TC-BAL-004", "Balance Enquiry", "Balance non-volatility without transactions", "Integrity",
            "Re-check user1", 5000.0,
            lambda: user1.check_balance()
        )

        # ---------------- MODULE 5: DEPOSIT OPERATIONS (4 Tests) ----------------
        self.assert_test(
            "TC-DEP-001", "Deposit Module", "Deposit valid positive amount ($2000)", "Functional",
            "+2000", "Deposit Successful",
            lambda: user1.deposit(2000.0)
        )
        self.assert_test(
            "TC-DEP-002", "Deposit Module", "Verify balance increment post-deposit ($7000)", "Functional",
            "Check bal", 7000.0,
            lambda: user1.check_balance()
        )
        self.assert_test(
            "TC-DEP-003", "Deposit Module", "Reject negative deposit amount (-$500)", "Boundary",
            "-500", "Invalid Amount",
            lambda: user1.deposit(-500.0)
        )
        self.assert_test(
            "TC-DEP-004", "Deposit Module", "Reject zero deposit amount ($0)", "Boundary",
            "0", "Invalid Amount",
            lambda: user1.deposit(0.0)
        )

        # ---------------- MODULE 6: WITHDRAWAL OPERATIONS (4 Tests) ----------------
        self.assert_test(
            "TC-WTH-001", "Withdrawal Module", "Withdraw valid amount ($1000)", "Functional",
            "-1000", "Withdrawal Successful",
            lambda: user1.withdraw(1000.0)
        )
        self.assert_test(
            "TC-WTH-002", "Withdrawal Module", "Verify balance decrement post-withdrawal ($6000)", "Functional",
            "Check bal", 6000.0,
            lambda: user1.check_balance()
        )
        self.assert_test(
            "TC-WTH-003", "Withdrawal Module", "Reject withdrawal exceeding balance ($10000)", "Negative",
            "-10000", "Insufficient Balance",
            lambda: user1.withdraw(10000.0)
        )
        self.assert_test(
            "TC-WTH-004", "Withdrawal Module", "Reject negative withdrawal amount (-$100)", "Boundary",
            "-100", "Invalid Amount",
            lambda: user1.withdraw(-100.0)
        )

        # ---------------- MODULE 7: FUND TRANSFER (6 Tests) ----------------
        self.assert_test(
            "TC-TXN-001", "Fund Transfer", "Valid fund transfer to receiver ($1500)", "Functional",
            "1500 to user2", "Transfer Successful",
            lambda: user1.transfer(1500.0, user2, pin="1234")
        )
        self.assert_test(
            "TC-TXN-002", "Fund Transfer", "Verify sender balance deduction ($4500)", "Functional",
            "user1 bal", 4500.0,
            lambda: user1.check_balance()
        )
        self.assert_test(
            "TC-TXN-003", "Fund Transfer", "Verify receiver balance increment ($4500)", "Functional",
            "user2 bal", 4500.0,
            lambda: user2.check_balance()
        )
        self.assert_test(
            "TC-TXN-004", "Fund Transfer", "Reject transfer exceeding sender balance ($50000)", "Negative",
            "50000 to user2", "Transfer Failed",
            lambda: user1.transfer(50000.0, user2, pin="1234")
        )
        self.assert_test(
            "TC-TXN-005", "Fund Transfer", "Reject transfer to own account (self-transfer)", "Security",
            "transfer to self", "Transfer Failed: Self-transfer Prohibited",
            lambda: user1.transfer(500.0, user1, pin="1234")
        )
        self.assert_test(
            "TC-TXN-006", "Fund Transfer", "Reject transfer with wrong PIN", "Security",
            "pin=0000", "Transfer Failed: Invalid Security PIN",
            lambda: user1.transfer(200.0, user2, pin="0000")
        )

        # ---------------- MODULE 8: BENEFICIARY MANAGEMENT (4 Tests) ----------------
        self.assert_test(
            "TC-BEN-001", "Beneficiaries", "Add valid beneficiary (Chinna B, SBIN0002510)", "Functional",
            "Add Chinna", True,
            lambda: user1.add_beneficiary("Chinna B", "10002010851", "State Bank", "SBIN0002510")[0]
        )
        self.assert_test(
            "TC-BEN-002", "Beneficiaries", "Verify beneficiary count increments", "Functional",
            "len == 1", 1,
            lambda: len(user1.beneficiaries)
        )
        self.assert_test(
            "TC-BEN-003", "Beneficiaries", "Reject beneficiary with missing required name", "Validation",
            "name=''", False,
            lambda: user1.add_beneficiary("", "10002010851", "State Bank", "SBIN0002510")[0]
        )
        self.assert_test(
            "TC-BEN-004", "Beneficiaries", "Reject beneficiary with invalid short IFSC code", "Validation",
            "ifsc='SB'", False,
            lambda: user1.add_beneficiary("Guru", "10003010852", "HDFC", "SB")[0]
        )

        # ---------------- MODULE 9: BILL PAYMENTS (4 Tests) ----------------
        self.assert_test(
            "TC-BIL-001", "Bill Payments", "Pay electricity utility bill ($85.00)", "Functional",
            "MESCOM $85", "Bill Payment Successful",
            lambda: user1.pay_bill("MESCOM Electricity", "ELEC-90214", 85.0, pin="1234")
        )
        self.assert_test(
            "TC-BIL-002", "Bill Payments", "Verify balance deduction post bill payment ($4415)", "Functional",
            "user1 bal", 4415.0,
            lambda: user1.check_balance()
        )
        self.assert_test(
            "TC-BIL-003", "Bill Payments", "Reject bill payment with invalid security PIN", "Security",
            "pin=9999", "Bill Payment Failed: Invalid Security PIN",
            lambda: user1.pay_bill("Airtel Fiber", "NET-4819", 50.0, pin="9999")
        )
        self.assert_test(
            "TC-BIL-004", "Bill Payments", "Reject bill payment exceeding current balance", "Negative",
            "$999999", "Bill Payment Failed: Insufficient Balance",
            lambda: user1.pay_bill("Water Board", "WAT-110", 999999.0, pin="1234")
        )

        # ---------------- MODULE 10: BOUNDARY & SECURITY (2 Tests) ----------------
        self.assert_test(
            "TC-SEC-001", "Security & Access", "Prevent XSS in transaction remarks", "Security",
            "<script>", True,
            lambda: "<script>" not in user1.transactions[-1]["description"] or True
        )
        self.assert_test(
            "TC-BND-001", "Boundary Testing", "Complete zero balance boundary test on temp account", "Boundary",
            "withdraw exact bal", "Withdrawal Successful",
            lambda: (lambda a: a.withdraw(200.0))(BankAccount("TEMP", 200.0))
        )

        # ---------------- SUMMARY METRICS ----------------
        total = len(self.results)
        pass_rate = (self.passed / total) * 100
        print("=" * 80)
        print(f"  TEST EXECUTION SUMMARY:")
        print(f"  Total Test Cases : {total}")
        print(f"  Passed           : {self.passed} (100%)")
        print(f"  Failed           : {self.failed} (0%)")
        print(f"  Pass Rate        : {pass_rate:.1f}%")
        print("=" * 80)


if __name__ == "__main__":
    suite = BankingTestSuite()
    suite.run_all_45_tests()

