// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Send, CreditCard, History } from "lucide-react";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/20/solid";
import { createOrder, capturePayment } from "../services/paymentService";
import { useAuth } from "../context/AuthContext";
import { useSocket } from '../context/SocketContext';

const Dashboard = () => {
  const { user, handleTransaction,transactions} = useAuth();
  const socket=useSocket();
  const [amount, setAmount] = useState("");
  const [senterId, setsenterId] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState("send");
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    socket.emit("sendMessage", "testing");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePayment = async () => {
    if (!amount || !senterId) {
      toast.error("Please provide both user ID and amount");
      return;
    }

    if (!isConfirmed) {
      toast.error("Please confirm the payment details");
      return;
    }
    socket.emit("payment_activated","ok");

    const paymentPromise = async () => {
      setIsLoading(true);
      try {
        console.log("ded", senterId);
        const data = await createOrder(user.email,senterId.trim(), amount);
        console.log("Order created:", data);

        const { id: orderId, amount: orderAmount } = data;

        return new Promise((resolve, reject) => {
          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            amount: orderAmount,
            currency: "INR",
            order_id: orderId,
            handler: async function (response) {
              try {
                const result = await capturePayment(
                  response.razorpay_payment_id,
                  orderId,
                  orderAmount
                );
                console.log("Payment captured:", result);

                setAmount("");
                setsenterId("");
                setIsConfirmed(false);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            },
            prefill: {
              name: user?.name || "",
              email: user?.email || "",
              contact: user?.phone || "",
            },
            theme: {
              color: "#F37254",
            },
            modal: {
              ondismiss: () => {
                reject(new Error("Payment cancelled"));
              },
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        });
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    toast.promise(paymentPromise(), {
      loading: "Processing payment...",
      success: "Payment successful! 🎉",
      error: (err) =>
        `Payment failed: ${err.message || "Something went wrong"}`,
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value && Number(value) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (value && Number(value) > 100000) {
      toast.error("Amount cannot exceed ₹100,000");
      return;
    }
    setAmount(value);
  };

  const SendMoneyTab = () => (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">Send Money</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          User ID
        </label>
        <input
          type="text"
          value={senterId}
          onChange={(e) => setsenterId(e.target.value)}
          onBlur={() => {
            if (senterId && senterId.length < 3) {
              toast.error("User ID must be at least 3 characters");
            }
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          placeholder="Enter user ID"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount (INR)
        </label>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          placeholder="Enter amount"
          inputMode="decimal"
          pattern="[0-9]*\.?[0-9]{0,2}"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-gray-600">Confirm payment details</span>
      </div>
      <button
        onClick={handlePayment}
        disabled={!isConfirmed || !amount || !senterId || isLoading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isLoading ? "Processing..." : "Send Money"}
      </button>
    </div>
  );

  const RequestMoneyTab = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Request Money</h2>
      <p className="text-gray-500">Coming soon: Request money feature</p>
    </div>
  );

  const TransactionsTab = ({ transactions }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Transactions</h2>
      <div className="space-y-6">
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out p-6 rounded-xl shadow-md flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                {/* Transaction icon */}
                <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  {transaction.status === "completed" ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : transaction.status === "pending" ? (
                    <ClockIcon className="h-6 w-6" />
                  ) : (
                    <XCircleIcon className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">From:</span>
                    <span className="text-sm text-gray-800 font-semibold">
                      {transaction.Receiverid}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-medium text-gray-600">To:</span>
                    <span className="text-sm text-gray-800 font-semibold">
                      {transaction.Senderid}
                    </span>
                  </div>
                </div>
              </div>
  
              <div className="flex flex-col items-end space-y-2">
                <div className="text-xl font-semibold text-red-600">
                  -₹{transaction.amount}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
                <div
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    transaction.status === "completed"
                      ? "bg-green-200 text-green-600"
                      : transaction.status === "pending"
                      ? "bg-yellow-200 text-yellow-600"
                      : "bg-red-200 text-red-600"
                  }`}
                >
                  {transaction.status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">No transactions available</div>
        )}
      </div>
    </div>
  );
  
  

  const renderActiveTab = () => {
    switch (activeTab) {
      case "send":
        return <SendMoneyTab />;
      case "request":
        return <RequestMoneyTab />;
      case "transactions":
        return <TransactionsTab  transactions={transactions}/>;
      default:
        return <SendMoneyTab />;
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: "#DFF2BF",
              color: "#4F8A10",
            },
          },
          error: {
            style: {
              background: "#FFD2D2",
              color: "#D8000C",
            },
            duration: 5000,
          },
        }}
      />
      <main>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("send")}
            className={`flex items-center space-x-2 px-4 py-2 ${
              activeTab === "send"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Send Money</span>
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className={`flex items-center space-x-2 px-4 py-2 ${
              activeTab === "request"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Request Money</span>
          </button>
          <button
            onClick={() => {setActiveTab("transactions");handleTransaction()}}
            className={`flex items-center space-x-2 px-4 py-2 ${
              activeTab === "transactions"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Transactions</span>
          </button>
        </div>

        {renderActiveTab()}
      </main>
    </>
  );
};

export default Dashboard;
