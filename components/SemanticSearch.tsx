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
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { searchAPI } from "@/lib/api";

interface SearchResult {
  memoryId: string;
  title: string;
  contentType: "pdf" | "image" | "video" | "text" | "webpage";
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

  const getContentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "text":
        return <FileCode className="w-4 h-4" />;
      case "webpage":
        return <Globe className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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
          // hybrid
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
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return "text-green-400";
    if (similarity >= 0.6) return "text-blue-400";
    return "text-yellow-400";
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Query Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... 'Find notes about ML', 'Quote from my handwritten note', etc."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Type */}
            <div className="flex-1">
              <label className="block text-sm text-slate-400 mb-2">
                Search Type
              </label>
              <select
                value={searchType}
                onChange={(e) =>
                  setSearchType(e.target.value as typeof searchType)
                }
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="hybrid">
                  Hybrid (Semantic + Keywords) ⚡
                </option>
                <option value="semantic">
                  Semantic (Meaning-based) 🧠
                </option>
                <option value="keyword">Keyword (Exact matches) 🔍</option>
              </select>
            </div>

            {/* Content Type Filter */}
            <div className="flex-1">
              <label className="block text-sm text-slate-400 mb-2">
                Filter by Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">All Types</option>
                <option value="pdf">PDF</option>
                <option value="image">Image / Handwritten</option>
                <option value="video">Video</option>
                <option value="text">Text Notes</option>
                <option value="webpage">Webpages</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Info Text */}
        <p className="text-sm text-slate-400">
          {searchType === "semantic" &&
            "💡 Finds content by meaning. Try: 'notes about productivity'"}
          {searchType === "keyword" &&
            "💡 Finds exact word matches. Try: 'machine learning'"}
          {searchType === "hybrid" &&
            "💡 Combines semantic and keyword search. Best for general queries."}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-700 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-300">Search Error</p>
            <p className="text-sm text-red-200 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {searchExecuted && !loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No results found for "{query}"</p>
          <p className="text-sm text-slate-500 mt-2">
            Try different keywords or search type
          </p>
        </div>
      )}

      {/* Results List */}
      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Found {results.length} result{results.length !== 1 ? "s" : ""}
          </p>

          {results.map((result) => {
            const isExpanded = expandedResults.has(result.memoryId);
            const bestScore = Math.max(
              result.semanticScore || 0,
              result.combinedScore || 0
            );

            return (
              <div
                key={result.memoryId}
                className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden hover:border-slate-600 transition-colors"
              >
                {/* Result Header */}
                <button
                  onClick={() => toggleExpanded(result.memoryId)}
                  className="w-full p-4 text-left hover:bg-slate-800 transition-colors flex items-start gap-3"
                >
                  {/* Icon */}
                  <div className="text-slate-500 mt-1">
                    {getContentIcon(result.contentType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {result.title}
                      </h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {result.contentType}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                      {result.summary || "No summary available"}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{formatDate(result.createdAt)}</span>
                      {result.sourceUrl && (
                        <span className="text-blue-400 truncate">
                          {result.sourceUrl}
                        </span>
                      )}
                      {bestScore > 0 && (
                        <span className={`font-medium ${getSimilarityColor(bestScore)}`}>
                          Match: {(bestScore * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="text-slate-500 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-700 p-4 bg-slate-800/50 space-y-3">
                    {/* Matching Chunks */}
                    {result.matches && result.matches.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">
                          Matching Passages:
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {result.matches.slice(0, 3).map((match, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded bg-slate-900 border border-slate-700"
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <span className="text-xs text-slate-500">
                                  Chunk {match.chunkIndex + 1}
                                </span>
                                <span
                                  className={`text-xs font-medium ${getSimilarityColor(match.similarity)}`}
                                >
                                  {(match.similarity * 100).toFixed(0)}% match
                                </span>
                              </div>
                              <p className="text-sm text-slate-300 line-clamp-3">
                                "{match.chunk}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Score Details */}
                    {(result.semanticScore !== undefined ||
                      result.keywordScore !== undefined) && (
                      <div className="pt-2 border-t border-slate-700">
                        <p className="text-xs text-slate-500 mb-2">Scores:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {result.semanticScore !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Semantic:</span>
                              <span className="text-blue-400 font-medium">
                                {(result.semanticScore * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                          {result.keywordScore !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Keyword:</span>
                              <span className="text-purple-400 font-medium">
                                {(result.keywordScore * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                          {result.combinedScore !== undefined && (
                            <div className="flex justify-between col-span-2 pt-2 border-t border-slate-700">
                              <span className="text-slate-400">Combined:</span>
                              <span className="text-green-400 font-medium">
                                {(result.combinedScore * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Button */}
                    <button
                      onClick={() => onMemorySelect?.(result.memoryId)}
                      className="mt-3 w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      View Memory
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
