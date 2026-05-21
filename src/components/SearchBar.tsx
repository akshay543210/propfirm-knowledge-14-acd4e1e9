import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PropFirm } from "@/types/supabase";
import { motion } from "framer-motion";

interface SearchBarProps {
  propFirms: PropFirm[];
  onFilteredResults: (results: PropFirm[]) => void;
  placeholder?: string;
}

const SearchBar = ({ propFirms, onFilteredResults, placeholder = "Search prop firms..." }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!searchTerm.trim()) {
        onFilteredResults(propFirms);
        setShowResults(false);
        return;
      }
      const q = searchTerm.toLowerCase();
      const filtered = propFirms.filter(f =>
        f.name.toLowerCase().includes(q) ||
        (f.brand && f.brand.toLowerCase().includes(q)) ||
        f.features?.some(x => x.toLowerCase().includes(q))
      );
      onFilteredResults(filtered);
      setShowResults(true);
    }, 250);
    return () => clearTimeout(t);
  }, [searchTerm, propFirms, onFilteredResults]);

  const clearSearch = () => {
    setSearchTerm("");
    onFilteredResults(propFirms);
    setShowResults(false);
  };

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-12 h-14 text-base bg-card border-border text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] rounded-2xl transition-all duration-300 shadow-[var(--shadow-luxury)] hover:shadow-[var(--shadow-luxury-lg)]"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && searchTerm && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-3 bg-card border border-border rounded-2xl shadow-[var(--shadow-luxury-lg)] z-50 max-h-72 overflow-y-auto"
        >
          {propFirms
            .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || (f.brand && f.brand.toLowerCase().includes(searchTerm.toLowerCase())))
            .slice(0, 6)
            .map((firm) => (
              <div
                key={firm.id}
                className="px-5 py-3.5 hover:bg-muted/60 cursor-pointer border-b border-border last:border-b-0 transition-colors"
              >
                <div className="font-semibold text-foreground text-sm">{firm.name}</div>
                {firm.brand && <div className="text-xs text-muted-foreground mt-0.5">{firm.brand}</div>}
              </div>
            ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;
