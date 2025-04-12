import React from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from 'react-hot-toast';

const Subscribe = () => {
  const { user, setCredits } = useAuth();

  const handlePayment = async () => {
    try {
      // Step 1: Get subscription_id from backend
      const res = await fetch("http://localhost:5000/api/razorpay/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      const subscriptionId = data.subscriptionId;

      if (!subscriptionId) {
        alert("Subscription creation failed. Try again.");
        return;
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "ResumeRanker",
        description: "Credit Subscription (100 credits)",
        image: "/logo.png",
        handler: async function (response) {
          // Payment success
          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, { credits: 100 });
          setCredits(100);
          toast.success("Payment successful! You now have 100 credits.");
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment setup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-10 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buy Credits</h1>
        <p className="text-gray-600 dark:text-gray-300">
          You're out of credits. Purchase 100 credits for ₹100.
        </p>
        <button
          onClick={handlePayment}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-all"
        >
          Pay ₹100
        </button>
      </div>
    </div>
  );
};

export default Subscribe;
