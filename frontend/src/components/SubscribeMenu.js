import React, { useState } from "react";
import axios from "axios";

const SubscribeMenu = ({ senderEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState("immediate");
  const [status, setStatus] = useState(null); // success | error | null
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/subscriptions", {
        type: "sender",
        value: senderEmail,
        frequency,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus(null);
        setIsOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Subscribe
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border rounded shadow w-48">
          <div className="p-2 text-sm">
            <label className="block mb-1 text-gray-700">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full mt-2 text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
            >
              {loading ? "Subscribing..." : "Confirm"}
            </button>
            {status === "success" && (
              <p className="mt-1 text-green-600">Subscribed!</p>
            )}
            {status === "error" && (
              <p className="mt-1 text-red-600">Error. Try again.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribeMenu;
