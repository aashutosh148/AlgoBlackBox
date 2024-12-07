import { Search } from "lucide-react";
import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import axios from "axios";
import CodeBox from "./CodeBox";
import React from "react";

type AlgorithmDatabase = {
  [key: string]: {
    cpp: string;
    java: string;
    python: string;
  };
};

interface Suggestion {
  name: string;
  input: {
    dataStructures: string[];
    parameters: string[];
  };
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState<Suggestion>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(
    null
  );
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [algorithmDatabase, setAlgorithmDatabase] = useState<AlgorithmDatabase>({});
  const inputValue = useRef<string>("");
  const MemoizedCodeBox = React.memo(CodeBox);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await axios.get("https://algoblackbox.vercel.app/api/algorithms");
        const rawData = response.data;

        const allAlgorithms = new Map<string, { cpp: string; java: string; python: string }>();
        const allSuggestions: Suggestion[] = rawData.map(
          (algo: {
            name: string;
            codes: { cpp: string; java: string; python: string };
            input: { dataStructures: string[]; parameters: string[] };
          }) => {
            allAlgorithms.set(algo.name.toLowerCase(), algo.codes);
            return { name: algo.name, input: algo.input };
          }
        );

        setAlgorithmDatabase(Object.fromEntries(allAlgorithms));
        setSuggestions(allSuggestions);
      } catch (error) {
        console.error("Failed to fetch algorithms", error);
      }
    };

    fetchAlgorithms();
    inputRef.current?.focus();
  }, []);

  const handleSearchQueryChange = (value: string) => {
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        setSearchQuery((prev) => ({
          ...prev,
          name: value,
          input: prev?.input || { dataStructures: [], parameters: [] },
        }));
      }, 300)
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputValue.current = event.target.value;
    handleSearchQueryChange(inputValue.current);
  };

  const handleSearch = (query: Suggestion) => {
    setSearchQuery(query);
    const algorithm = query.name.toLowerCase();
    if (algorithmDatabase[algorithm]) {
      setSelectedAlgorithm(algorithm);
    } else {
      setSelectedAlgorithm(null);
    }
  };

  const filteredSuggestions = useMemo(() => {
    const query = searchQuery?.name.toLowerCase() || "";
    const result: Suggestion[] = [];
    for (const suggestion of suggestions) {
      if (suggestion.name.toLowerCase().includes(query)) {
        result.push(suggestion);
        if (result.length === 6) break; 
      }
    }
    return result;
  }, [suggestions, searchQuery]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <header className="text-center">
        <h1 className="text-5xl font-serif mb-4 text-foreground">
          Discover the world's top algorithms
        </h1>
        <p className="text-muted-foreground mb-8">
          Explore and understand complex algorithms through interactive visualizations
        </p>

        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              ref={inputRef}
              placeholder="What algorithm are you looking for?"
              className="w-full bg-gray-100 px-4 py-3 pl-12 rounded-full bg-secondary/10 border border-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder:text-muted-foreground text-foreground"
              defaultValue={searchQuery?.name || ""}
              onChange={handleInputChange}
            />
          </div>

          {searchQuery && filteredSuggestions.length > 0 && (
            <div
              className="absolute w-full mt-2 bg-background rounded-lg shadow-lg border border-border max-h-60 overflow-auto z-50"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-secondary/10 focus:outline-none focus:bg-secondary/10"
                  onClick={() => handleSearch(suggestion)}
                >
                  <span className="text-black font-medium">{suggestion.name}</span>
                  <span className="text-gray-500 text-sm">
                    {suggestion.input.dataStructures.join(", ")} | {suggestion.input.parameters.join(", ")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {selectedAlgorithm && algorithmDatabase[selectedAlgorithm] && (
        <Suspense fallback={<div>Loading...</div>}>
          <div
            className={`transition-all duration-300 ${
              searchQuery && filteredSuggestions.length > 0 ? "mt-48" : "mt-20"
            }`}
          >
            <MemoizedCodeBox code={algorithmDatabase[selectedAlgorithm]} />
          </div>
        </Suspense>
      )}
    </div>
  );
}
