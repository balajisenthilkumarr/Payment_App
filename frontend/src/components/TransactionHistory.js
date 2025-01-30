import React, { useState, useEffect } from 'react';

const TransactionHistory = ({ userId }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fetch transaction history for this user
        fetch(`/api/transactions/${userId}`)
            .then((response) => response.json())
            .then((data) => setTransactions(data));
    }, [userId]);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-4">Transaction History</h1>
            <div className="space-y-4">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="border p-4 rounded-md">
                            <p><strong>From:</strong> {transaction.fromUser}</p>
                            <p><strong>To:</strong> {transaction.toUser}</p>
                            <p><strong>Amount:</strong> ${transaction.amount}</p>
                            <p><strong>Status:</strong> {transaction.status}</p>
                        </div>
                    ))
                ) : (
                    <p>No transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;