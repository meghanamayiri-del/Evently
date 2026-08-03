"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const CATEGORIES = ["All", "Raves", "Festivals", "Tech", "Live Music"];

export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("query") || "";
  const currentCategory = searchParams.get("category") || "All";

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  function handleCategory(category: string) {
    const params = new URLSearchParams(searchParams);
    if (category !== "All") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search events or locations..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-cyan-500 text-zinc-950 font-semibold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}