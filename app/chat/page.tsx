"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  listChats,
  createChat,
  getChat,
  sendChatMessageToChat,
  deleteChat,
  updateChatTitle,
  type ChatListItem,
  type ChatMessageOut,
} from "@/lib/api";
import { Loader2, Send, Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, Pencil, User, Bot, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";

function formatChatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatPage() {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageOut[]>([]);
  const [activeTitle, setActiveTitle] = useState<string>("New chat");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [useInternet, setUseInternet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const loadChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const data = await listChats();
      setChats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const loadChat = useCallback(
    async (chatId: string) => {
      setLoadingMessages(true);
      setError(null);
      try {
        const chat = await getChat(chatId);
        setMessages(chat.messages);
        setActiveTitle(chat.title);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    },
    []
  );

  useEffect(() => {
    if (activeChatId) {
      loadChat(activeChatId);
    } else {
      setMessages([]);
      setActiveTitle("New chat");
    }
  }, [activeChatId, loadChat]);

  const startEditTitle = (chat: ChatListItem) => {
    setEditingChatId(chat.id);
    setEditingValue(chat.title);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const saveEditTitle = useCallback(async () => {
    if (!editingChatId) return;
    const title = editingValue.trim() || "New chat";
    const chatIdToSave = editingChatId;
    try {
      const updated = await updateChatTitle(chatIdToSave, title);
      setEditingChatId(null);
      setEditingValue("");
      setChats((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, title: updated.title, updatedAt: updated.updatedAt } : c))
      );
      if (activeChatId === chatIdToSave) setActiveTitle(updated.title);
    } catch {
      // keep editing state on failure
    }
  }, [editingChatId, editingValue, activeChatId]);

  const cancelEditTitle = () => {
    setEditingChatId(null);
    setEditingValue("");
  };

  useEffect(() => {
    if (editingChatId) editInputRef.current?.focus();
  }, [editingChatId]);

  const handleNewChat = async () => {
    setError(null);
    try {
      const chat = await createChat();
      setChats((prev) => [chat, ...prev]);
      setActiveChatId(chat.id);
      setMessages([]);
      setActiveTitle(chat.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chat");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);

    let chatId = activeChatId;
    if (!chatId) {
      try {
        const chat = await createChat();
        setChats((prev) => [chat, ...prev]);
        setActiveChatId(chat.id);
        setActiveTitle("New chat");
        chatId = chat.id;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create chat");
        return;
      }
    }

    const userMessage: ChatMessageOut = {
      id: `temp-user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await sendChatMessageToChat(chatId, text, useInternet);
      setMessages((prev) => [
        ...prev,
        {
          id: result.assistantMessageId,
          role: "assistant",
          content: result.reply,
          createdAt: new Date().toISOString(),
        },
      ]);
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, updatedAt: new Date().toISOString() } : c
        )
      );
      const chat = await getChat(chatId);
      setActiveTitle(chat.title);
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, title: chat.title } : c))
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to get reply";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `temp-err-${Date.now()}`,
          role: "assistant",
          content: `Error: ${msg}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
        setActiveTitle("New chat");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chat");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="heading-brut text-4xl">Chat.</h1>
        </div>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="brut-button p-2.5 bg-indigo-600 text-white"
            title="Open Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden brut-card bg-white p-0 relative">
        {/* Sidebar */}
        <aside
          className={`
            absolute inset-y-0 left-0 z-20 w-72 bg-white border-r-4 border-black transition-transform duration-300 sm:relative sm:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:hidden"}
          `}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b-4 border-black flex gap-2">
              <button
                onClick={handleNewChat}
                className="flex-1 brut-button py-2.5 bg-indigo-600 text-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                NEW CHAT
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="brut-button p-2.5 bg-indigo-600 text-white"
                title="Minimize Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {loadingChats ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  <span className="font-black text-[10px] uppercase text-gray-400">Loading history...</span>
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <p className="font-black uppercase text-[10px] text-gray-400">No conversations yet</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => editingChatId !== chat.id && setActiveChatId(chat.id)}
                    className={`
                      group relative p-3 border-2 border-black cursor-pointer transition-all uppercase font-black text-[10px] tracking-wider
                      ${activeChatId === chat.id ? "bg-indigo-600 text-white shadow-[2px_2px_0px_0px_black] -translate-x-0.5 -translate-y-0.5" : "bg-white hover:bg-indigo-50"}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className={`w-3 h-3 ${activeChatId === chat.id ? "text-indigo-200" : "text-indigo-600"}`} />
                      {editingChatId === chat.id ? (
                        <input
                          ref={editInputRef}
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={saveEditTitle}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditTitle();
                            if (e.key === "Escape") cancelEditTitle();
                          }}
                          className="bg-transparent border-none outline-none w-full"
                        />
                      ) : (
                        <span className="truncate flex-1">{chat.title}</span>
                      )}
                    </div>

                    <div className="mt-1 flex justify-between items-center text-[8px] opacity-70">
                      <span>{formatChatDate(chat.updatedAt)}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); startEditTitle(chat); }} className="hover:text-indigo-900"><Pencil className="w-2.5 h-2.5" /></button>
                        <button onClick={(e) => handleDeleteChat(e, chat.id)} className="hover:text-rose-900"><Trash2 className="w-2.5 h-2.5" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5F5F5] relative">
          {/* Mobile Header */}
          <div className="sm:hidden p-4 border-b-4 border-black bg-white flex items-center justify-between">
            <h2 className="font-black uppercase text-xs truncate max-w-50">{activeTitle}</h2>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
            {loadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center rotate-[-5deg] shadow-[8px_8px_0px_0px_black]">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
                <span className="font-black uppercase text-[10px] tracking-widest text-gray-500">Retrieving brain state...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                <div className="w-20 h-20 bg-indigo-600 border-4 border-black flex items-center justify-center mb-8 rotate-[5deg] shadow-[8px_8px_0px_0px_black]">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="heading-brut text-3xl mb-4">How can I help you?</h2>
                <p className="font-black uppercase text-[10px] text-gray-400 tracking-tighter leading-snug">
                  ASK ANYTHING ABOUT YOUR MEMORIES. I&apos;LL USE YOUR NOTES AND SAVED CONTENT TO PROVIDE PRECISE ANSWERS BASED ON YOUR PRIVATE BRAIN.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 bg-black border border-black flex items-center justify-center -rotate-3">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="font-black uppercase text-[8px] tracking-widest text-gray-400">
                        {msg.role === "assistant" ? "Synapse Intelligence" : "Authenticated User"}
                      </span>
                      {msg.role === "user" && (
                        <div className="w-6 h-6 bg-indigo-600 border border-black flex items-center justify-center rotate-3">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div
                      className={`
                          relative p-5 border-4 border-black font-bold text-sm max-w-[90%] sm:max-w-[80%]
                          ${msg.role === "user"
                          ? "bg-indigo-600 text-white shadow-[6px_6px_0px_0px_black]"
                          : "bg-white text-black shadow-[-6px_6px_0px_0px_black]"
                        }
                        `}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-headings:font-black prose-headings:uppercase prose-p:leading-snug prose-li:leading-tight">
                          <ReactMarkdown>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-black border border-black flex items-center justify-center animate-bounce">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-black uppercase text-[8px] tracking-widest text-gray-400">Thinking...</span>
                    </div>
                    <div className="p-4 bg-white border-4 border-black flex items-center gap-3 shadow-[-6px_6px_0px_0px_black]">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t-4 border-black relative z-10">
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border-2 border-rose-500 text-rose-700 font-black text-[10px] uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_#F43F5E] animate-in slide-in-from-bottom-2">
                <Trash2 className="w-3 h-3" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-3 flex items-center justify-between gap-3 text-[10px] uppercase font-black tracking-widest text-gray-500">
              <span>Memory Context</span>
              <button
                type="button"
                onClick={() => setUseInternet((current) => !current)}
                className={`flex items-center gap-2 border-2 border-black px-3 py-2 transition-all ${useInternet ? "bg-emerald-500 text-white shadow-[3px_3px_0px_0px_black]" : "bg-white hover:bg-gray-100"}`}
                title="Toggle internet context"
              >
                <Globe className="w-3.5 h-3.5" />
                {useInternet ? "Internet On" : "Internet Off"}
              </button>
            </div>

            <form onSubmit={handleSend} className="flex border-4 border-black bg-white shadow-[8px_8px_0px_0px_black] focus-within:translate-x-0.5 focus-within:translate-y-0.5 focus-within:shadow-[4px_4px_0px_0px_black] transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ASK SYNAPSE ANYTHING..."
                disabled={loading}
                className="flex-1 py-6 pl-6 pr-4 bg-transparent outline-none text-md uppercase font-black tracking-widest placeholder:font-normal placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-8 bg-indigo-600 text-white border-l-4 border-black hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex items-center justify-center"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
