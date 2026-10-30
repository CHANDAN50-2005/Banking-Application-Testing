/**
 * Banking Application Testing - Java Domain Model
 * Department of Computer Science and Engineering, Srinivas University, Mukka
 * Software Testing (23SCS743) Mini Project
 * 
 * Guide: Mrs. Varsha G Bangera (Assistant Professor, Dept. of CSE)
 * Students: Chandan Gouda (01SU23CS049), Chinna B (01SU23CS051),
 *           Guruprasad Naik (01SU23CS070), Hotur Gargeya Datta (01SU23CS077)
 */

import java.util.ArrayList;
import java.util.List;

public class BankAccount {
    private String accountNo;
    private double balance;
    private String holderName;
    private String pin;
    private String status;
    private List<String> transactions;

    public BankAccount(String accountNo, double balance) {
        this(accountNo, balance, "Account Holder", "1234");
    }

    public BankAccount(String accountNo, double balance, String holderName, String pin) {
        this.accountNo = accountNo;
        this.balance = balance;
        this.holderName = holderName;
        this.pin = pin;
        this.status = "ACTIVE";
        this.transactions = new ArrayList<>();
        if (balance > 0) {
            this.transactions.add("Welcome Account Opening Balance: $" + balance);
        }
    }

    public String deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
            this.transactions.add("Deposit Successful: +$" + amount);
            return "Deposit Successful";
        }
        return "Invalid Amount";
    }

    public String withdraw(double amount) {
        if (amount <= 0) {
            return "Invalid Amount";
        }
        if (amount <= this.balance) {
            this.balance -= amount;
            this.transactions.add("Withdrawal Successful: -$" + amount);
            return "Withdrawal Successful";
        }
        return "Insufficient Balance";
    }

    public double checkBalance() {
        return Math.round(this.balance * 100.0) / 100.0;
    }

    public String transfer(double amount, BankAccount receiver) {
        return transfer(amount, receiver, this.pin);
    }

    public String transfer(double amount, BankAccount receiver, String inputPin) {
        if (receiver == null) {
            return "Transfer Failed: Beneficiary Not Found";
        }
        if (receiver.getAccountNo().equals(this.accountNo)) {
            return "Transfer Failed: Self-transfer Prohibited";
        }
        if (inputPin != null && !inputPin.equals(this.pin)) {
            return "Transfer Failed: Invalid Security PIN";
        }
        if (amount <= 0) {
            return "Transfer Failed: Invalid Amount";
        }
        if (amount <= this.balance) {
            this.balance -= amount;
            receiver.balance += amount;
            this.transactions.add("Transferred $" + amount + " to " + receiver.getAccountNo());
            receiver.transactions.add("Received $" + amount + " from " + this.accountNo);
            return "Transfer Successful";
        }
        return "Transfer Failed";
    }

    public String getAccountNo() {
        return accountNo;
    }

    public String getHolderName() {
        return holderName;
    }

    public String getStatus() {
        return status;
    }

    public String getPin() {
        return pin;
    }

    public List<String> getTransactions() {
        return transactions;
    }
}

