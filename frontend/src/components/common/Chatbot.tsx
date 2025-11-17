import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

declare global {
  interface Window {
    storage: {
      get: (key: string) => Promise<{ value: string } | null>;
      set: (key: string, value: string, shared?: boolean) => Promise<void>;
      delete: (key: string) => Promise<void>;
    };
  }
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface QuickQuestion {
  question: string;
  category: string;
}

interface Shop {
  id: number;
  shop_number: string;
  shop_type: string;
  floor_number: number;
  monthly_rent: number;
  total_paid: number;
  balance: number;
  next_due_date: string | null;
  payment_status: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
}

const Chatbot: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user data and chat history on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadChatHistory(parsedUser.id);
      fetchShopDetails(parsedUser.id);
    } else {
      // Default message if no user
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your HAM Mall Rent Assistant, you can call me HAMRA😊. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch shop details from API
  const fetchShopDetails = async (tenantId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/shops/tenant/${tenantId}/shops/`
      );
      setShops(response.data.shops);
    } catch (error) {
      console.error("Error fetching shop details:", error);
    }
  };

  // Load chat history from storage
  const loadChatHistory = async (userId: number) => {
    try {
      const result = await window.storage.get(`chat_history_${userId}`);
      if (result && result.value) {
        const savedMessages: Array<
          Omit<Message, "timestamp"> & { timestamp: string }
        > = JSON.parse(result.value);
        // Convert timestamp strings back to Date objects
        const parsedMessages: Message[] = savedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      } else {
        // No saved history, set welcome message
        const userData = localStorage.getItem("user");
        const parsedUser = userData ? JSON.parse(userData) : null;
        setMessages([
          {
            id: 1,
            text: `Hello ${
              parsedUser?.full_name.split(" ")[0] || ""
            }! I'm your HAM Mall Rent Assistant, you can call me HAMRA😊. How can I help you today?`,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      // Set default welcome message on error
      const userData = localStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      setMessages([
        {
          id: 1,
          text: `Hello ${
            parsedUser?.full_name.split(" ")[0] || ""
          }! I'm your HAM Mall Rent Assistant, you can call me HAMRA😊. How can I help you today?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Save chat history to storage
  const saveChatHistory = async (updatedMessages: Message[]) => {
    if (!user) return;

    try {
      await window.storage.set(
        `chat_history_${user.id}`,
        JSON.stringify(updatedMessages),
        false // personal data, not shared
      );
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // Clear chat history
  const clearChatHistory = async () => {
    if (!user) return;

    try {
      await window.storage.delete(`chat_history_${user.id}`);
      setMessages([
        {
          id: 1,
          text: `Hello ${
            user.full_name.split(" ")[0]
          }! I'm your HAM Mall Rent Assistant, you can call me HAMRA😊. How can I help you today?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  // Quick questions for easy access
  const quickQuestions: QuickQuestion[] = [
    { question: "How do I pay my rent?", category: "payment" },
    { question: "Show me my shop details", category: "shop" },
    { question: "What is my current balance?", category: "payment" },
    { question: "When is my rent due?", category: "payment" },
    { question: "What payment methods are accepted?", category: "payment" },
    { question: "Who do I contact for support?", category: "support" },
  ];

  // Generate dynamic response based on actual shop data
  const getDynamicResponse = (messageText: string): string => {
    const lowerMessage = messageText.toLowerCase();

    // Shop details related
    if (
      lowerMessage.includes("shop detail") ||
      lowerMessage.includes("my shop") ||
      lowerMessage.includes("view shop")
    ) {
      if (shops.length === 0) {
        return "You don't have any shops assigned to you yet. Please contact the admin at admin@hammall.com or call 0700 123 456.";
      }

      let response = `You have ${shops.length} shop${
        shops.length > 1 ? "s" : ""
      }:\n\n`;
      shops.forEach((shop, index) => {
        response += `📍 Shop ${shop.shop_number}\n`;
        response += `   • Type: ${shop.shop_type}\n`;
        response += `   • Floor: ${shop.floor_number}\n`;
        response += `   • Monthly Rent: UGX ${shop.monthly_rent.toLocaleString()}\n`;
        response += `   • Balance: UGX ${shop.balance.toLocaleString()}\n`;
        response += `   • Status: ${shop.payment_status}\n`;
        if (index < shops.length - 1) response += "\n";
      });

      response +=
        "\n\nWould you like to make a payment or view payment history?";
      return response;
    }

    // Balance inquiry
    if (
      lowerMessage.includes("balance") ||
      lowerMessage.includes("how much do i owe") ||
      lowerMessage.includes("outstanding")
    ) {
      if (shops.length === 0) {
        return "You don't have any shops assigned yet. Please contact admin.";
      }

      let response = "Here's your balance information:\n\n";
      shops.forEach((shop) => {
        response += `Shop ${
          shop.shop_number
        }: UGX ${shop.balance.toLocaleString()}`;
        if (shop.balance > 0) {
          response += ` (Outstanding)`;
        } else if (shop.balance === 0) {
          response += ` (Paid Up ✓)`;
        } else {
          response += ` (Overpaid)`;
        }
        response += "\n";
      });

      const totalBalance = shops.reduce((sum, shop) => sum + shop.balance, 0);
      response += `\nTotal Balance: UGX ${totalBalance.toLocaleString()}`;

      if (totalBalance > 0) {
        response += "\n\nWould you like to make a payment now?";
      }

      return response;
    }

    // Due date inquiry
    if (
      lowerMessage.includes("due date") ||
      lowerMessage.includes("when is rent due") ||
      lowerMessage.includes("payment deadline")
    ) {
      if (shops.length === 0) {
        return "You don't have any shops assigned yet. Please contact admin.";
      }

      let response = "Your rent due dates:\n\n";
      shops.forEach((shop) => {
        response += `Shop ${shop.shop_number}: `;
        if (shop.next_due_date) {
          const dueDate = new Date(shop.next_due_date);
          response += dueDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // Calculate days until due
          const today = new Date();
          const daysUntil = Math.ceil(
            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysUntil < 0) {
            response += ` (OVERDUE by ${Math.abs(daysUntil)} days!)`;
          } else if (daysUntil === 0) {
            response += ` (DUE TODAY!)`;
          } else if (daysUntil <= 7) {
            response += ` (Due in ${daysUntil} days)`;
          }
        } else {
          response += "Not set";
        }
        response += "\n";
      });

      response +=
        "\n💡 Tip: Pay a few days early to avoid any last-minute issues!";
      return response;
    }

    // Payment amount inquiry
    if (
      lowerMessage.includes("how much") &&
      (lowerMessage.includes("rent") || lowerMessage.includes("pay"))
    ) {
      if (shops.length === 0) {
        return "You don't have any shops assigned yet. Please contact admin.";
      }

      let response = "Your monthly rent:\n\n";
      shops.forEach((shop) => {
        response += `Shop ${
          shop.shop_number
        }: UGX ${shop.monthly_rent.toLocaleString()}/month\n`;
      });

      const totalRent = shops.reduce((sum, shop) => sum + shop.monthly_rent, 0);
      response += `\nTotal Monthly Rent: UGX ${totalRent.toLocaleString()}`;
      return response;
    }

    // Payment history
    if (
      lowerMessage.includes("payment history") ||
      lowerMessage.includes("past payment") ||
      lowerMessage.includes("total paid")
    ) {
      if (shops.length === 0) {
        return "You don't have any shops assigned yet. Please contact admin.";
      }

      let response = "Your payment summary:\n\n";
      shops.forEach((shop) => {
        response += `Shop ${shop.shop_number}:\n`;
        response += `   • Total Paid: UGX ${shop.total_paid.toLocaleString()}\n`;
        response += `   • Balance: UGX ${shop.balance.toLocaleString()}\n\n`;
      });

      response +=
        "To view detailed payment history, click the 'Payment History' button in your dashboard.";
      return response;
    }

    // Payment process
    if (
      lowerMessage.includes("pay rent") ||
      lowerMessage.includes("make payment") ||
      lowerMessage.includes("how do i pay")
    ) {
      return `To pay your rent:\n\n1. Click 'Make Payment' from your dashboard\n2. Select your shop${
        shops.length > 1 ? " (if you have multiple)" : ""
      }\n3. Enter payment amount\n4. Choose payment method:\n   • Mobile Money (MTN, Airtel, Africell)\n   • Bank Transfer\n   • Cash payment\n5. Add reference number (optional)\n6. Submit payment\n\nYou'll receive an instant successfull or error message! 📱\n\nWould you like me to take you to the payment page?`;
    }

    // Payment methods
    if (
      lowerMessage.includes("payment method") ||
      lowerMessage.includes("how to pay") ||
      lowerMessage.includes("mobile money")
    ) {
      return "We accept three payment methods:\n\n💳 Mobile Money\n   • MTN Mobile Money\n   • Airtel Money\n   • Africell Money\n\n🏦 Bank Transfer\n   • Any bank transfer\n   • Include your shop number as reference\n\n💵 Cash Payment\n   • Pay at the mall office\n   • Get instant receipt\n\nAll methods are secure and generate instant receipts!";
    }

    // Profile changes
    if (
      lowerMessage.includes("change profile") ||
      lowerMessage.includes("update information") ||
      lowerMessage.includes("edit details")
    ) {
      return "To change your profile information:\n\n1. Go to 'Profile' page from dashboard\n2. Click 'Request Profile Change'\n3. Enter the changes you want\n4. Provide a reason\n5. Submit request\n\nThe admin will review and approve within 24-48 hours.\n\nNote: You can change your password instantly without approval!";
    }

    // Password
    if (
      lowerMessage.includes("password") ||
      lowerMessage.includes("reset password") ||
      lowerMessage.includes("forgot password")
    ) {
      return "To change your password:\n\n1. Go to 'Profile' page\n2. Click 'Change Password'\n3. Enter current password\n4. Enter new password\n5. Confirm new password\n6. Save changes\n\nIf you forgot your password:\n• Click 'Forgot Password' on login page\n• Follow the reset instructions";
    }

    // Support
    if (
      lowerMessage.includes("support") ||
      lowerMessage.includes("help") ||
      lowerMessage.includes("contact") ||
      lowerMessage.includes("admin")
    ) {
      return "For additional support:\n\n📧 Email: admin@hammall.com\n📞 Phone: 0700 123 456\n📍 Office: Ground Floor, HAM Mall\n🕒 Hours: Mon-Fri, 8AM-5PM\n          Saturday, 9AM-2PM\n\nFor urgent issues, visit the mall administration office or call the emergency number.";
    }

    // Late payment
    if (
      lowerMessage.includes("late payment") ||
      lowerMessage.includes("missed payment") ||
      lowerMessage.includes("overdue")
    ) {
      return "If you missed a payment:\n\n⚠️ A 5% late fee may apply after grace period\n📞 Contact admin immediately: 0700 123 456\n💰 Discuss payment plans if needed\n⏰ Prolonged non-payment may lead to account suspension\n\n💡 Tip: Set up payment reminders on your phone to avoid late fees!";
    }

    // Greetings
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage.includes("good morning") ||
      lowerMessage.includes("good afternoon")
    ) {
      const greeting = user
        ? `Hello ${user.full_name.split(" ")[0]}!`
        : "Hello!";
      return `${greeting} Welcome to HAM Mall Assistant. I'm here to help you with:\n\n• Rent payments\n• Shop information\n• Account balance\n• Due dates\n• Payment methods\n• Profile changes\n\nHow can I assist you today?`;
    }

    // Thanks
    if (
      lowerMessage.includes("thank") ||
      lowerMessage.includes("thanks") ||
      lowerMessage.includes("appreciate")
    ) {
      return "You're welcome! 😊 Is there anything else I can help you with today?";
    }

    // Default response
    return "I'm not sure I understand that question. You can ask me about:\n\n• Your shop details\n• Current balance\n• Due dates\n• How to pay rent\n• Payment methods\n• Payment history\n• Profile changes\n• Support contact\n\nOr contact admin directly at:\n📧 admin@hammall.com\n📞 0700 123 456";
  };

  // Handle sending a message
  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();

    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages); // Save after user message

    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getDynamicResponse(messageText);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages); // Save after bot response
      setIsTyping(false);
    }, 1000);
  };

  // Handle quick question click
  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">HAM Mall Rent Assistant</h3>
                <p className="text-xs text-red-100">Always here to help</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={clearChatHistory}
                className="hover:bg-red-800 rounded-full p-1 transition"
                title="Clear chat history"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-red-800 rounded-full p-1 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Quick Questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 3).map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(q.question)}
                    className="text-xs bg-white border border-gray-300 hover:border-red-600 hover:text-red-600 rounded-full px-3 py-1 transition"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-red-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-full p-2 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
