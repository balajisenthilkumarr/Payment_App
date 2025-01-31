import React from "react";

const PaymentForm = ({
  recipientId,
  setRecipientId,
  amount,
  setAmount,
  isConfirmed,
  setIsConfirmed,
  onInitiatePayment,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">Send Money</h2>

      {/* Recipient Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recipient ID
        </label>
        <input
          type="text"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          placeholder="Enter recipient ID"
        />
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount (INR)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          placeholder="Enter amount"
        />
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-gray-600">Confirm payment details</span>
      </div>

      {/* Submit Button */}
      <button
        onClick={onInitiatePayment}
        disabled={!isConfirmed || !amount || !recipientId}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        Send Money
      </button>
    </div>
  );
};

export default PaymentForm;
