// "use client";
// import React, { useEffect, useState } from "react";
// import { TrendingUp } from "lucide-react";
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import TickerSearch from "@/components/TickerSearch";
// import { StockData } from "@/lib/types";

// // Chart configuration for your UI (shadcn/ui style)
// const chartConfig = {
//   price: {
//     label: "price",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig;

// // Client-side helper that calls your secure API route
// const fetchStockData = async (ticker: string) => {
//   try {
//     console.log("Fetching data for:", ticker);
//     const res = await fetch(`/api/stock/${ticker}`);
//     if (!res.ok) {
//       throw new Error("Failed to fetch Alpha Vantage data");
//     }
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching Alpha Vantage data:", error);
//     return null;
//   }
// };

// export default function Home() {
//   const [ticker, setTicker] = useState("NVDA");
//   const [stockData, setStockData] = useState<StockData | null>(null);

//   useEffect(() => {
//     if (!ticker) return;
//     fetchStockData(ticker).then((data) => {
//       if (data) {
//         setStockData(data);
//       }
//     });
//   }, [ticker]);

//   // Fallback/dummy chart data if your API data doesn’t include chart data
//   const defaultChartData = [
//     { time: "9:30", price: 150 },
//     { time: "10:00", price: 155 },
//     { time: "10:30", price: 153 },
//     { time: "11:00", price: 157 },
//     { time: "11:30", price: 160 },
//     { time: "12:00", price: 158 },
//     { time: "12:30", price: 162 },
//     { time: "1:00", price: 161 },
//     { time: "1:30", price: 164 },
//     { time: "2:00", price: 165 },
//     { time: "2:30", price: 163 },
//     { time: "3:00", price: 166 },
//     { time: "3:30", price: 168 },
//     { time: "4:00", price: 120 },
//   ];

//   let chartData = defaultChartData; // Default value

//   if (stockData?.results) {
//     const sortedData = stockData.results.sort(
//       (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
//     );
//     chartData = sortedData.slice(-100);
//   }

//   return (
//     <div className="flex justify-center items-center">
//       {/* Ticker Search Component */}
//       <TickerSearch
//         onTickerSelect={(selectedTicker) => setTicker(selectedTicker)}
//       />

//       {/* Card containing the area chart */}
//       <Card className="w-1/2">
//         <CardHeader>
//           <CardTitle>{ticker}</CardTitle>
//           <CardDescription>
//             Showing total visitors for the last 6 months
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer config={chartConfig}>
//             <AreaChart
//               data={chartData}
//               margin={{
//                 left: 12,
//                 right: 12,
//               }}
//             >
//               <CartesianGrid vertical={false} />
//               <XAxis
//                 dataKey="time"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 tickFormatter={(value) => value.slice(0, 3)}
//               />
//               <ChartTooltip
//                 cursor={false}
//                 content={<ChartTooltipContent indicator="line" />}
//               />
//               <Area
//                 dataKey="price"
//                 type="natural"
//                 fill="var(--color-desktop)"
//                 fillOpacity={0.4}
//                 stroke="var(--color-desktop)"
//               />
//             </AreaChart>
//           </ChartContainer>
//         </CardContent>
//         <CardFooter>
//           <div className="flex w-full items-start gap-2 text-sm">
//             <div className="grid gap-2">
//               <div className="flex items-center gap-2 font-medium leading-none">
//                 Trending up by 5.2% this month{" "}
//                 <TrendingUp className="h-4 w-4" />
//               </div>
//               <div className="flex items-center gap-2 leading-none text-muted-foreground">
//                 January - June 2024
//               </div>
//             </div>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import TickerSearch from "@/components/TickerSearch";
import type { StockData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const fetchStockData = async (ticker: string) => {
  try {
    const res = await fetch(`/api/stock/${ticker}`);
    if (!res.ok) {
      throw new Error("Failed to fetch stock data");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
};

export default function Home() {
  const [ticker, setTicker] = useState("NVDA");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!ticker) return;
    setIsLoading(true);
    setError(null);
    fetchStockData(ticker).then((data) => {
      if (data) {
        setStockData(data);
      } else {
        setError("Failed to fetch stock data");
      }
      setIsLoading(false);
    });
  }, [ticker]);

  const chartData = stockData?.results
    ? stockData.results
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        .slice(-100)
    : [];

  const latestPrice = chartData[chartData.length - 1]?.price;
  const previousPrice = chartData[chartData.length - 2]?.price;
  const priceChange =
    latestPrice && previousPrice
      ? ((latestPrice - previousPrice) / previousPrice) * 100
      : 0;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Stock Price Tracker
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <TickerSearch onTickerSelect={setTicker} />
        <Card className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{ticker}</span>
              {!isLoading && latestPrice && (
                <span className="text-2xl font-bold">
                  ${latestPrice.toFixed(2)}
                </span>
              )}
            </CardTitle>
            <CardDescription>Stock price chart</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-full h-[300px]" />
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <ChartContainer config={chartConfig}>
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString()
                    }
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="var(--color-price)"
                    fill="var(--color-price)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  {priceChange > 0 ? (
                    <>
                      Trending up by {priceChange.toFixed(2)}%{" "}
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      Trending down by {Math.abs(priceChange).toFixed(2)}%{" "}
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  {mounted && <>Last updated: {new Date().toLocaleString()}</>}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
