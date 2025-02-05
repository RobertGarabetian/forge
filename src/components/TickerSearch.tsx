"use client";

import type React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
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
