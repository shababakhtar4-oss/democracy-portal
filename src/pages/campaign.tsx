import React, { useState } from "react";
import DetailPageLayout from "@/components/layout/DetailPageLayout";

const Campaign: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const handleSend = () => {
    if (!message.trim()) return;

    // For now, just log the message
    console.log("Message sent:", message);

    // You can replace this with API call to send message
    alert(`Message sent: ${message}`);

    // Clear textarea
    setMessage("");
  };

  return (
     <DetailPageLayout title="Campaign">
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-16 px-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-12">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Election Campaign</h1>

        {/* Information message */}
        <p className="text-gray-600 mb-6">
          Welcome to the Election Campaign message portal. You can send updates, information, 
          or campaign messages to the selected voters. Please ensure your message is clear and 
          concise.
        </p>

        {/* Textarea for campaign message */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg"
          rows={6}
          placeholder="Type your campaign message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Send button */}
        <div className="flex justify-end">
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
    </DetailPageLayout>
  );
};

export default Campaign;