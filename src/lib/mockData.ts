import type { StockData } from "@/lib/types"

export const mockStockData: Record<string, StockData> = {
  NVDA: {
    results: Array.from({ length: 100 }, (_, i) => ({
      time: new Date(Date.now() - (99 - i) * 60000).toISOString(),
      price: 400 + Math.random() * 50,
    })),
  },
  AAPL: {
    results: Array.from({ length: 100 }, (_, i) => ({
      time: new Date(Date.now() - (99 - i) * 60000).toISOString(),
      price: 150 + Math.random() * 20,
    })),
  },
  GOOG: {
    results: Array.from({ length: 100 }, (_, i) => ({
      time: new Date(Date.now() - (99 - i) * 60000).toISOString(),
      price: 2500 + Math.random() * 100,
    })),
  },
}

export const mockFetchStockData = async (ticker: string): Promise<StockData | null> => {
  // await new Promise((resolve) => setTimeout(resolve, 0)) // Simulate network delay
  return mockStockData[ticker] || null
}

