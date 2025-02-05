// "use client";
// import React, { useState } from "react";

// interface TickerSearchProps {
//   onTickerSelect: (ticker: string) => void;
// }

// // A static list of tickers for demonstration. In a real app, you might fetch these from an API.
// const TICKER_OPTIONS = ["AAPL", "GOOG", "TSLA", "AMZN", "MSFT"];

// const TickerSearch: React.FC<TickerSearchProps> = ({ onTickerSelect }) => {
//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState<string[]>([]);

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value.toUpperCase();
//     setQuery(value);

//     // Filter tickers that include the current query.
//     if (value.length > 0) {
//       const filtered = TICKER_OPTIONS.filter((ticker) =>
//         ticker.includes(value)
//       );
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };
//   const handleSuggestionClick = (ticker: string) => {
//     setQuery(ticker);
//     setSuggestions([]);
//     onTickerSelect(ticker);
//   };

//   return (
//     <div className="relative max-w-xs">
//       <input
//         type="text"
//         value={query}
//         onChange={handleInputChange}
//         placeholder="Search ticker..."
//         className="w-full p-2 border rounded"
//       />
//       {suggestions.length > 0 && (
//         <ul className="absolute z-10 w-full bg-white border rounded mt-1">
//           {suggestions.map((ticker) => (
//             <li
//               key={ticker}
//               className="p-2 hover:bg-gray-100 cursor-pointer"
//               onClick={() => handleSuggestionClick(ticker)}
//             >
//               {ticker}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default TickerSearch;
"use client";

import type React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
        <Command>
          <CommandInput placeholder="Search stock..." />
          <CommandList>
            <CommandEmpty>No stock found.</CommandEmpty>
            <CommandGroup>
              {TICKER_OPTIONS.map((ticker) => (
                <CommandItem
                  key={ticker.value}
                  value={ticker.value}
                  onSelect={(selectedValue) => {
                    setValue(selectedValue === value ? "" : selectedValue);
                    onTickerSelect(selectedValue);
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
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TickerSearch;
