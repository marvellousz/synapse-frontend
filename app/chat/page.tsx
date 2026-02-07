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
import { Loader2, Send, Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, Pencil } from "lucide-react";
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
      const result = await sendChatMessageToChat(chatId, text);
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
    <div className="space-y-4">
      <h1 className="instrument-serif text-3xl font-bold" style={{ color: "#F8FAFC" }}>
        Chat
      </h1>
      <div className="flex h-[calc(100vh-12rem)] min-h-[400px] rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(148, 163, 184, 0.2)", backgroundColor: "rgba(15, 23, 42, 0.4)" }}>
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r shrink-0 transition-[width] overflow-hidden ${sidebarOpen ? "w-64" : "w-0"}`}
        style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}
      >
        <div className="p-3 shrink-0">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#93C5FD" }}
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {loadingChats ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#94A3B8" }} />
            </div>
          ) : chats.length === 0 ? (
            <p className="text-center text-sm py-4" style={{ color: "#64748B" }}>
              No chats yet
            </p>
          ) : (
            <ul className="space-y-0.5">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => editingChatId !== chat.id && setActiveChatId(chat.id)}
                    onKeyDown={(e) => {
                      if (editingChatId === chat.id) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveChatId(chat.id);
                      }
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 group truncate cursor-pointer ${
                      activeChatId === chat.id ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    style={{ color: "#E2E8F0" }}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0 text-slate-500" />
                    {editingChatId === chat.id ? (
                      <div className="flex-1 min-w-0 flex items-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          ref={editingChatId === chat.id ? editInputRef : undefined}
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={saveEditTitle}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") saveEditTitle();
                            if (e.key === "Escape") cancelEditTitle();
                          }}
                          className="w-full min-w-0 px-1.5 py-0.5 text-sm rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          style={{ color: "#E2E8F0" }}
                        />
                      </div>
                    ) : (
                      <>
                        <span
                          className="flex-1 truncate text-sm"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            startEditTitle(chat);
                          }}
                        >
                          {chat.title}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditTitle(chat);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-400 shrink-0"
                          title="Edit title"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <span className="text-xs shrink-0" style={{ color: "#64748B" }}>
                      {formatChatDate(chat.updatedAt)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400 shrink-0"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0 px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}>
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
          <h2 className="font-semibold text-lg truncate" style={{ color: "#F8FAFC" }}>
            {activeTitle}
          </h2>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.3)" }}
        >
          {loadingMessages ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#94A3B8" }} />
            </div>
          ) : messages.length === 0 && !loading ? (
            <p className="text-center py-12 text-sm" style={{ color: "#94A3B8" }}>
              Ask anything about your memories. I&apos;ll use your notes and saved content to answer.
            </p>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${msg.role === "assistant" ? "markdown-content" : "whitespace-pre-wrap"}`}
                    style={{
                      backgroundColor:
                        msg.role === "user"
                          ? "rgba(59, 130, 246, 0.25)"
                          : "rgba(148, 163, 184, 0.12)",
                      color: "#F8FAFC",
                      borderWidth: 1,
                      borderColor:
                        msg.role === "user"
                          ? "rgba(59, 130, 246, 0.4)"
                          : "rgba(148, 163, 184, 0.2)",
                    }}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0" style={{ color: "#F8FAFC" }}>{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold" style={{ color: "#FFFFFF" }}>{children}</strong>,
                          em: ({ children }) => <em style={{ color: "#E2E8F0" }}>{children}</em>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5" style={{ color: "#F8FAFC" }}>{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5" style={{ color: "#F8FAFC" }}>{children}</ol>,
                          li: ({ children }) => <li className="ml-2">{children}</li>,
                          code: ({ className, children, ...props }) =>
                            className ? (
                              <code className={className} {...props}>{children}</code>
                            ) : (
                              <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#E2E8F0" }} {...props}>{children}</code>
                            ),
                          pre: ({ children }) => <pre className="overflow-x-auto rounded-lg p-3 text-xs mb-2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>{children}</pre>,
                          h1: ({ children }) => <h1 className="text-base font-bold mt-2 mb-1 first:mt-0" style={{ color: "#FFFFFF" }}>{children}</h1>,
                          h2: ({ children }) => <h2 className="text-sm font-bold mt-2 mb-1 first:mt-0" style={{ color: "#FFFFFF" }}>{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1 first:mt-0" style={{ color: "#FFFFFF" }}>{children}</h3>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm"
                    style={{
                      backgroundColor: "rgba(148, 163, 184, 0.12)",
                      color: "#94A3B8",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                    }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && (
          <p className="px-4 py-2 text-sm shrink-0" style={{ color: "#FCA5A5" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSend} className="p-4 border-t flex gap-2 shrink-0" style={{ borderColor: "rgba(148, 163, 184, 0.2)" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your memories…"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              borderColor: "rgba(148, 163, 184, 0.3)",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            style={{ background: "#3B82F6", color: "#FFFFFF" }}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}