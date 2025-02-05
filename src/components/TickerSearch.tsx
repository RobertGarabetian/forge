"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TICKER_OPTIONS = [
  { value: "AAPL", label: "Apple Inc." },
  { value: "GOOG", label: "Alphabet Inc." },
  { value: "TSLA", label: "Tesla, Inc." },
  { value: "AMZN", label: "Amazon.com, Inc." },
  { value: "MSFT", label: "Microsoft Corporation" },
  { value: "NVDA", label: "NVIDIA Corporation" },
];

interface TickerSearchProps {
  onTickerSelect: (ticker: string) => void;
}

const TickerSearch: React.FC<TickerSearchProps> = ({ onTickerSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(TICKER_OPTIONS[5].value);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filteredOptions = TICKER_OPTIONS.filter((ticker) =>
    ticker.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? TICKER_OPTIONS.find((ticker) => ticker.value === value)?.label
            : "Select stock..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="flex flex-col">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 text-sm border-b"
          />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">No stock found.</div>
            ) : (
              filteredOptions.map((ticker) => (
                <button
                  key={ticker.value}
                  className={cn(
                    "flex w-full items-center py-2 px-3 text-sm hover:bg-accent hover:text-accent-foreground",
                    value === ticker.value && "bg-accent"
                  )}
                  onClick={() => {
                    setValue(ticker.value === value ? "" : ticker.value);
                    onTickerSelect(ticker.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === ticker.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {ticker.label}
                </button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TickerSearch;
