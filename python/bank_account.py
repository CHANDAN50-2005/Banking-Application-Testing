"""
Banking Application Testing - Core Domain Model
Department of Computer Science and Engineering, Srinivas University
Software Testing (23SCS743) Mini Project

Implements the exact BankAccount architecture specified in Chapter 4 of the project report,
extended with security checks, transaction ledger, and beneficiary management.
"""

import datetime
import uuid


class BankAccount:
    def __init__(self, account_no, balance=0.0, holder_name="Cardholder", pin="1234", email=""):
        self.account_no = str(account_no)
        self.balance = float(balance)
        self.holder_name = holder_name
        self.pin = str(pin)
        self.email = email
        self.status = "ACTIVE"
        self.transactions = []
        self.beneficiaries = []

        # Record opening balance transaction if positive
        if self.balance > 0:
            self.transactions.append({
                "id": "TXN-INIT-001",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "type": "DEPOSIT",
                "category": "Account Opening",
                "description": "Welcome Account Opening Balance",
                "amount": self.balance,
                "balance_after": self.balance,
                "status": "COMPLETED"
            })

    def deposit(self, amount):
        """Deposits funds into the account. Validates amount > 0."""
        try:
            amt = float(amount)
        except (ValueError, TypeError):
            return "Invalid Amount"

        if amt > 0:
            self.balance += amt
            self.transactions.append({
                "id": f"TXN-{uuid.uuid4().hex[:6].upper()}",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "type": "DEPOSIT",
                "category": "Direct Deposit",
                "description": "Cash / Wire Deposit",
                "amount": amt,
                "balance_after": self.balance,
                "status": "COMPLETED"
            })
            return "Deposit Successful"
        return "Invalid Amount"

    def withdraw(self, amount):
        """Withdraws funds if amount > 0 and balance is sufficient."""
        try:
            amt = float(amount)
        except (ValueError, TypeError):
            return "Invalid Amount"

        if amt <= 0:
            return "Invalid Amount"
        if amt <= self.balance:
            self.balance -= amt
            self.transactions.append({
                "id": f"TXN-{uuid.uuid4().hex[:6].upper()}",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "type": "WITHDRAWAL",
                "category": "ATM / Cash Out",
                "description": "Cash Withdrawal",
                "amount": amt,
                "balance_after": self.balance,
                "status": "COMPLETED"
            })
            return "Withdrawal Successful"
        return "Insufficient Balance"

    def check_balance(self):
        """Returns the current account balance."""
        return round(self.balance, 2)

    def transfer(self, amount, receiver, pin=None, remarks="Fund Transfer"):
        """
        Transfers funds from this account to a receiver account.
        Validates receiver existence, self-transfer, PIN authentication, and balance.
        """
        try:
            amt = float(amount)
        except (ValueError, TypeError):
            return "Transfer Failed: Invalid Amount"

        if receiver is None:
            return "Transfer Failed: Beneficiary Account Not Found"

        if receiver.account_no == self.account_no:
            return "Transfer Failed: Self-transfer Prohibited"

        if pin is not None and str(pin) != self.pin:
            return "Transfer Failed: Invalid Security PIN"

        if amt <= 0:
            return "Transfer Failed: Invalid Amount"

        if amt <= self.balance:
            self.balance -= amt
            receiver.balance += amt

            txn_id = f"TXN-{uuid.uuid4().hex[:6].upper()}"
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Debit record on sender
            self.transactions.append({
                "id": txn_id,
                "timestamp": now,
                "type": "TRANSFER_DEBIT",
                "category": "Fund Transfer",
                "description": f"Transfer to {receiver.holder_name} ({receiver.account_no}) - {remarks}",
                "amount": amt,
                "balance_after": self.balance,
                "status": "COMPLETED"
            })

            # Credit record on receiver
            receiver.transactions.append({
                "id": txn_id,
                "timestamp": now,
                "type": "TRANSFER_CREDIT",
                "category": "Fund Transfer",
                "description": f"Received from {self.holder_name} ({self.account_no}) - {remarks}",
                "amount": amt,
                "balance_after": receiver.balance,
                "status": "COMPLETED"
            })

            return "Transfer Successful"
        return "Transfer Failed"

    def pay_bill(self, biller_name, bill_ref, amount, pin):
        """Authorizes and executes utility bill payment."""
        try:
            amt = float(amount)
        except (ValueError, TypeError):
            return "Bill Payment Failed: Invalid Amount"

        if str(pin) != self.pin:
            return "Bill Payment Failed: Invalid Security PIN"

        if amt <= 0:
            return "Bill Payment Failed: Invalid Amount"

        if amt <= self.balance:
            self.balance -= amt
            txn_id = f"BILL-{uuid.uuid4().hex[:6].upper()}"
            self.transactions.append({
                "id": txn_id,
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "type": "BILL_PAYMENT",
                "category": "Utilities",
                "description": f"Bill Payment - {biller_name} (Ref: {bill_ref})",
                "amount": amt,
                "balance_after": self.balance,
                "status": "COMPLETED"
            })
            return "Bill Payment Successful"
        return "Bill Payment Failed: Insufficient Balance"

    def add_beneficiary(self, name, account_no, bank_name, ifsc, nickname=""):
        """Adds a verified beneficiary to the account list."""
        if not name or not account_no or not ifsc:
            return False, "All required fields must be provided"
        if len(str(account_no)) < 6:
            return False, "Account number must be at least 6 digits"
        if len(str(ifsc)) < 4:
            return False, "Invalid IFSC / Routing code format"

        beneficiary = {
            "id": f"BEN-{uuid.uuid4().hex[:4].upper()}",
            "name": name,
            "account_no": str(account_no),
            "bank_name": bank_name,
            "ifsc": ifsc,
            "nickname": nickname
        }
        self.beneficiaries.append(beneficiary)
        return True, "Beneficiary Added Successfully"

