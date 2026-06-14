import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/store/useWorldStore";

interface CharacterChatProps {
  characterId: string;
  characterName: string;
  characterRole: string;
  history: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => void;
}

export function CharacterChat({
  characterId,
  characterName,
  characterRole,
  history = [],
  onSendMessage,
  onClearHistory
}: CharacterChatProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const queryText = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      await onSendMessage(queryText);
    } finally {
      setIsTyping(false);
    }
  };

  const sendSuggestion = async (suggestion: string) => {
    setIsTyping(true);
    try {
      await onSendMessage(suggestion);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Who are you?",
    "Tell me about your memory vault.",
    "Do you remember the project launch?",
    "What is our current quest?"
  ];

  return (
    <div className="glass-panel rounded-xl border border-white/5 bg-slate-950/40 flex flex-col h-[500px] overflow-hidden shadow-2xl">
      
      {/* Chat Header */}
      <div className="bg-slate-900/50 border-b border-white/5 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px] flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {characterName[0]}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display leading-tight">{characterName}</h3>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Shield className="h-2.5 w-2.5 text-secondary-light" />
              {characterRole}
            </span>
          </div>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="h-8 text-slate-500 hover:text-red-400 hover:bg-red-950/20 gap-1.5 px-2.5"
            title="Clear Chat Logs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear Logs</span>
          </Button>
        )}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
            <User className="h-8 w-8 text-slate-600 animate-pulse" />
            <p className="text-xs font-mono">No transmission history recorded.</p>
            <p className="text-[10px] max-w-xs leading-relaxed opacity-70">
              Type a message or click one of the quick suggestions below to initiate connection.
            </p>
          </div>
        ) : (
          history.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow ${
                    isUser
                      ? "bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none"
                      : "bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none font-serif"
                  }`}
                >
                  {/* Message body */}
                  <div>{msg.content}</div>

                  {/* Timestamp */}
                  {msg.createdAt && (
                    <div className="text-[8px] text-slate-500 text-right mt-1.5 font-mono select-none">
                      {msg.createdAt}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Bot Typing indicator animation */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-white/5 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs shadow flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {history.length === 0 && (
        <div className="px-5 py-2.5 bg-slate-950/20 border-t border-white/5 flex flex-wrap gap-2 justify-center">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => sendSuggestion(sug)}
              disabled={isTyping}
              className="text-[10px] font-mono border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-2.5 py-1 rounded-full transition-all disabled:opacity-50"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <form onSubmit={handleSend} className="bg-slate-900/30 border-t border-white/5 p-4 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
          placeholder={`Speak with ${characterName}...`}
          className="flex-1 bg-slate-950 border border-white/5 focus:border-primary/50 text-white rounded-lg px-3.5 py-2 text-xs outline-none transition-colors disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isTyping || !inputText.trim()}
          variant="glow"
          className="h-9 w-9 p-0 flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

    </div>
  );
}
