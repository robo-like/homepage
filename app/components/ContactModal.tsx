import React, { useState } from "react";
import { TextInput } from "./TextInput";
import { TextArea } from "./TextArea";
import { useOutletContext } from "react-router";
import { type OutletContext } from "~/root";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
  showHistory?: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "OPEN" | "CLOSED" | "IN_PROGRESS";
  createdAt: string;
}

export function ContactModal({
  isOpen,
  onClose,
  defaultSubject = "",
  showHistory = false,
}: ContactModalProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"new" | "history">(
    showHistory ? "history" : "new"
  );
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);
  
  const { user } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  
  // Handle modal backdrop click (close only if clicking the backdrop)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/auth/login?returnTo=/pricing");
      return;
    }
    
    if (!subject.trim() || !message.trim()) {
      setError("Please complete all fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch("/api/support-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit ticket");
      }
      
      setSuccess("Your message has been sent successfully!");
      setSubject("");
      setMessage("");
      
      // If successful and showing history, refresh tickets
      if (showHistory) {
        loadTickets();
      }
    } catch (err) {
      setError("There was an error submitting your message. Please try again.");
      console.error("Error submitting support ticket:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Load user's ticket history
  const loadTickets = async () => {
    if (!user || ticketsLoaded) return;
    
    try {
      const response = await fetch("/api/support-tickets");
      
      if (!response.ok) {
        throw new Error("Failed to load tickets");
      }
      
      const data = await response.json();
      setTickets(data.tickets);
      setTicketsLoaded(true);
    } catch (err) {
      console.error("Error loading support tickets:", err);
    }
  };
  
  // Load tickets if showing history tab
  React.useEffect(() => {
    if (isOpen && showHistory && activeTab === "history" && !ticketsLoaded) {
      loadTickets();
    }
  }, [isOpen, showHistory, activeTab, ticketsLoaded]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-black w-full max-w-md rounded-lg border-2 border-[#07b0ef] p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 
          className="text-2xl font-bold mb-4 gradient-text"
          style={{ fontFamily: 'var(--heading-font, "Press Start 2P", cursive)' }}
        >
          CONTACT SUPPORT
        </h2>
        
        {/* Tabs - Show only if history feature is enabled */}
        {showHistory && (
          <div className="flex mb-4 border-b border-gray-700">
            <button
              className={cn(
                "py-2 px-4 font-bold",
                activeTab === "new"
                  ? "text-[#07b0ef] border-b-2 border-[#07b0ef]"
                  : "text-gray-400 hover:text-gray-300"
              )}
              onClick={() => setActiveTab("new")}
              style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
            >
              NEW TICKET
            </button>
            <button
              className={cn(
                "py-2 px-4 font-bold",
                activeTab === "history"
                  ? "text-[#07b0ef] border-b-2 border-[#07b0ef]"
                  : "text-gray-400 hover:text-gray-300"
              )}
              onClick={() => setActiveTab("history")}
              style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
            >
              HISTORY
            </button>
          </div>
        )}
        
        {/* New Message Form */}
        {(!showHistory || activeTab === "new") && (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-50 text-red-200 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-900 bg-opacity-50 text-green-200 rounded-md">
                {success}
              </div>
            )}
            
            <div className="mb-4">
              <label 
                htmlFor="subject" 
                className="block mb-2 font-bold"
                style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
              >
                SUBJECT
              </label>
              <TextInput
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Enter subject..."
                className="w-full bg-black bg-opacity-70 border border-[#07b0ef] text-white"
              />
            </div>
            
            <div className="mb-4">
              <label 
                htmlFor="message" 
                className="block mb-2 font-bold"
                style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
              >
                MESSAGE
              </label>
              <TextArea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="How can we help you?"
                className="w-full h-32 bg-black bg-opacity-70 border border-[#07b0ef] text-white"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 retro-button primary"
              style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
            >
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        )}
        
        {/* Ticket History */}
        {showHistory && activeTab === "history" && (
          <div className="mt-4">
            {!ticketsLoaded ? (
              <p className="text-center text-gray-400">Loading your tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-center text-gray-400">You haven't submitted any support tickets yet.</p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="border border-gray-700 rounded-md p-3 bg-black bg-opacity-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="font-bold text-[#07b0ef]"
                        style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
                      >
                        {ticket.subject}
                      </h3>
                      <span 
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          ticket.status === "OPEN" ? "bg-blue-900 text-blue-200" :
                          ticket.status === "IN_PROGRESS" ? "bg-yellow-900 text-yellow-200" :
                          "bg-green-900 text-green-200"
                        )}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{ticket.message}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setActiveTab("new")}
              className="mt-4 w-full py-2 retro-button"
              style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
            >
              CREATE NEW TICKET
            </button>
          </div>
        )}
      </div>
    </div>
  );
}