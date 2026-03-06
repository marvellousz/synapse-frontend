"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Loader2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  FileCode,
  Globe,
  Youtube,
  ChevronUp,
  ChevronDown,
  Calendar,
  Zap,
  Brain,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { searchAPI } from "@/lib/api";
import Dropdown from "@/components/Dropdown";

interface SearchResult {
  memoryId: string;
  title: string;
  contentType: "pdf" | "image" | "video" | "text" | "webpage" | "youtube";
  summary: string;
  sourceUrl?: string;
  createdAt: string;
  matches?: Array<{
    chunk: string;
    chunkIndex: number;
    similarity: number;
  }>;
  semanticScore?: number;
  keywordScore?: number;
  combinedScore?: number;
}

interface SearchTabProps {
  onMemorySelect?: (memoryId: string) => void;
}

export default function SemanticSearch({ onMemorySelect }: SearchTabProps) {
  const { state } = useAuth();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"hybrid" | "semantic" | "keyword">(
    "hybrid"
  );
  const [contentType, setContentType] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(
    new Set()
  );
  const [searchExecuted, setSearchExecuted] = useState(false);

  const searchTypeOptions = [
    { value: "hybrid" as const, label: "Hybrid (Semantic + Keywords)", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { value: "semantic" as const, label: "Semantic (Meaning-based)", icon: <Brain className="w-4 h-4 text-pink-500" /> },
    { value: "keyword" as const, label: "Keyword (Exact matches)", icon: <Search className="w-4 h-4 text-slate-500" /> },
  ];

  const contentTypeOptions = [
    { value: "" as const, label: "All Types" },
    { value: "pdf" as const, label: "PDF", icon: <FileText className="w-4 h-4" /> },
    { value: "image" as const, label: "Image / Handwritten", icon: <ImageIcon className="w-4 h-4" /> },
    { value: "video" as const, label: "Video", icon: <Video className="w-4 h-4" /> },
    { value: "text" as const, label: "Text Notes", icon: <FileCode className="w-4 h-4" /> },
    { value: "webpage" as const, label: "Webpages", icon: <Globe className="w-4 h-4" /> },
    { value: "youtube" as const, label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "image":
        return <ImageIcon className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "text":
        return <FileCode className="w-5 h-5" />;
      case "webpage":
        return <Globe className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const performSearch = useCallback(
    async (q: string) => {
      if (!q.trim() || state.status !== 'authenticated') return;

      setLoading(true);
      setError(null);
      setSearchExecuted(true);

      try {
        let apiResults;

        if (searchType === "semantic") {
          apiResults = await searchAPI.semantic(q, {
            limit: 10,
            contentType: contentType || undefined,
          });
        } else if (searchType === "keyword") {
          apiResults = await searchAPI.keyword(q, {
            limit: 10,
            contentType: contentType || undefined,
          });
        } else {
          apiResults = await searchAPI.hybrid(q, {
            limit: 10,
            contentType: contentType || undefined,
          });
        }

        setResults(apiResults || []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Search failed. Please try again.";
        setError(message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [state.status, searchType, contentType]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const toggleExpanded = (memoryId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(memoryId)) {
      newExpanded.delete(memoryId);
    } else {
      newExpanded.add(memoryId);
    }
    setExpandedResults(newExpanded);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { dateStyle: 'medium' });
    } catch {
      return dateStr;
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return "text-emerald-600";
    if (similarity >= 0.6) return "text-indigo-600";
    return "text-amber-600";
  };

  return (
    <div className="space-y-10">
      {/* Search Form */}
      <div className="space-y-6">
        <form onSubmit={handleSearch} className="space-y-8">
          <div className="flex bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] focus-within:shadow-[4px_4px_0px_0px_black] focus-within:translate-x-[2px] focus-within:translate-y-[2px] transition-all">
            <div className="flex items-center justify-center pl-6 pr-2 text-black">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... 'Find notes about ML', 'Quote from my handwritten note'"
              className="flex-1 px-4 py-6 text-lg md:text-xl bg-transparent outline-none font-bold placeholder:text-gray-400 placeholder:font-normal tracking-tight"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 md:px-10 bg-indigo-600 text-white font-black uppercase tracking-widest border-l-4 border-black hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex items-center justify-center min-w-[120px]"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "SEARCH"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-black uppercase text-[10px] mb-2 tracking-widest text-gray-500">Method</label>
              <Dropdown
                value={searchType}
                options={searchTypeOptions}
                onChange={(v) => v && setSearchType(v as "hybrid" | "semantic" | "keyword")}
                placeholder="Search type"
              />
            </div>

            <div className="flex-1">
              <label className="block font-black uppercase text-[10px] mb-2 tracking-widest text-gray-500">Resource Type</label>
              <Dropdown
                value={contentType}
                options={contentTypeOptions}
                onChange={setContentType}
                placeholder="All Types"
              />
            </div>
          </div>
        </form>

        <p className="font-bold text-sm text-gray-400 uppercase tracking-wide">
          <span className="text-indigo-600 mr-2">PRO TIP:</span>
          {searchType === "semantic" && "Synapse understands your question instead of matching keywords."}
          {searchType === "keyword" && "Useful for finding specific terms or unique IDs."}
          {searchType === "hybrid" && "The best of both worlds. Highly recommended."}
        </p>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 border-4 border-rose-500 flex gap-4 shadow-[8px_8px_0px_0px_#F43F5E]">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
          <div>
            <p className="font-black uppercase text-sm text-rose-700">Search Error</p>
            <p className="font-bold text-rose-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {searchExecuted && !loading && results.length === 0 && !error && (
        <div className="brut-card p-16 bg-white text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h3 className="heading-brut text-2xl mb-2">No results found.</h3>
          <p className="font-bold text-gray-400 uppercase text-xs tracking-widest">
            Try adjusting your search query or search type.
          </p>
        </div>
      )}

      {/* Results List */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b-4 border-black pb-4">
            <h3 className="font-black text-2xl uppercase italic">Results ({results.length})</h3>
            <div className="brut-badge bg-black text-white px-3 py-1 text-xs">AI Powered</div>
          </div>

          <div className="grid gap-6">
            {results.map((result) => {
              const isExpanded = expandedResults.has(result.memoryId);
              const bestScore = Math.max(
                result.semanticScore || 0,
                result.combinedScore || 0
              );

              return (
                <div
                  key={result.memoryId}
                  className="brut-card bg-white overflow-hidden group hover:-translate-y-1 transition-all"
                >
                  <button
                    onClick={() => toggleExpanded(result.memoryId)}
                    className="w-full p-6 text-left flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform shadow-[4px_4px_0px_0px_black]">
                      {getContentIcon(result.contentType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-black text-xl group-hover:text-indigo-600 transition-colors uppercase truncate">
                          {result.title}
                        </h3>
                        {bestScore > 0 && (
                          <div className={`brut-badge py-0.5 px-2 text-[10px] font-black border-2 border-black ${getSimilarityColor(bestScore)} bg-white`}>
                            {(bestScore * 100).toFixed(0)}% MATCH
                          </div>
                        )}
                      </div>

                      <p className="font-bold text-sm text-gray-500 line-clamp-2 leading-snug mb-4">
                        {result.summary || "No summary available"}
                      </p>

                      <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(result.createdAt)}</span>
                        <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_black]">{result.contentType}</span>
                        {result.sourceUrl && <span className="text-indigo-600 truncate underline">{result.sourceUrl}</span>}
                      </div>
                    </div>

                    <div className="bg-white border-2 border-black p-1 self-center">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t-4 border-black p-6 bg-indigo-50 space-y-6 animate-in slide-in-from-top-2 duration-200">
                      {result.matches && result.matches.length > 0 && (
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-widest text-indigo-900 mb-4 border-b-2 border-indigo-200 pb-2">
                            Matching Passages
                          </h4>
                          <div className="grid gap-3">
                            {result.matches.slice(0, 3).map((match, idx) => (
                              <div
                                key={idx}
                                className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`font-black text-[10px] uppercase ${getSimilarityColor(match.similarity)}`}>
                                    {(match.similarity * 100).toFixed(0)}% Precise Match
                                  </span>
                                </div>
                                <p className="font-bold text-sm text-gray-700 italic">
                                  "{match.chunk}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <button
                          onClick={() => onMemorySelect?.(result.memoryId)}
                          className="w-full sm:flex-1 brut-button py-3 bg-indigo-600 text-sm"
                        >
                          OPEN MEMORY
                        </button>

                        <div className="flex gap-4">
                          {result.semanticScore !== undefined && (
                            <div className="text-center">
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Semantic</p>
                              <p className="font-black text-indigo-600">{(result.semanticScore * 100).toFixed(0)}%</p>
                            </div>
                          )}
                          {result.keywordScore !== undefined && (
                            <div className="text-center">
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Keyword</p>
                              <p className="font-black text-emerald-600">{(result.keywordScore * 100).toFixed(0)}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
