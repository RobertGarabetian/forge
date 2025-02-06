"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
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
import { mockFetchStockData } from "@/lib/mockData";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const fetchStockData = async (ticker: string): Promise<StockData | null> => {
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
  const [useMockData, setUseMockData] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!ticker) return;
    setIsLoading(true);
    setError(null);
    const fetchData = useMockData ? mockFetchStockData : fetchStockData;
    fetchData(ticker).then((data) => {
      if (data) {
        setStockData(data);
      } else {
        setError("Failed to fetch stock data");
      }
      setIsLoading(false);
    });
  }, [ticker, useMockData]);

  const chartData = stockData?.results || [];

  const latestPrice = chartData[chartData.length - 1]?.price;
  const previousPrice = chartData[chartData.length - 2]?.price;
  const priceChange =
    latestPrice && previousPrice
      ? ((latestPrice - previousPrice) / previousPrice) * 100
      : 0;

  const chartConfig: ChartConfig = {
    price: {
      label: "Price",
      color: priceChange >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)", // Green for up, Red for down
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center ">
      {isClient ? (
        <div className=" py-6 flex-grow flex flex-col w-full">
          <h1 className="text-3xl font-bold text-center mb-6">
            Stock Price Tracker
          </h1>
          <div className="flex justify-center items-center gap-4 mb-6">
            <TickerSearch onTickerSelect={setTicker} />
            <div className="flex items-center space-x-2">
              <Switch
                id="use-mock-data"
                checked={useMockData}
                onCheckedChange={setUseMockData}
                className=""
              />
              <Label htmlFor="use-mock-data">Use Mock Data</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-1 w-full">
            <div className="col-span-1 justify-self-center p-3 w-full">
              <Card className="flex flex-col bg-gray-800 border-gray-700 ">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-white">
                    <span className="text-4xl">{ticker}</span>
                    {!isLoading && latestPrice && (
                      <span className="text-3xl font-bold">
                        ${latestPrice.toFixed(2)}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Stock price chart</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {isLoading ? (
                    <Skeleton className="w-full h-full bg-gray-700" />
                  ) : error ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : (
                    <ChartContainer
                      config={chartConfig}
                      className="h-full max-w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#4a5568"
                          />
                          <XAxis
                            dataKey="time"
                            tickFormatter={(value) =>
                              new Date(value).toLocaleTimeString()
                            }
                            stroke="#a0aec0"
                          />
                          <YAxis stroke="#a0aec0" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={chartConfig.price.color}
                            fill={chartConfig.price.color}
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 font-medium leading-none text-white text-2xl">
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
                      <div className="flex items-center gap-2 leading-none text-gray-400">
                        Last updated: {new Date().toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            <div className="justify-self-center col-span-1 p-3 w-full">
              <Card className="flex flex-col bg-gray-800 border-gray-700 ">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-white">
                    <span className="text-4xl">{ticker}</span>
                    {!isLoading && latestPrice && (
                      <span className="text-3xl font-bold">
                        ${latestPrice.toFixed(2)}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Stock price chart</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {isLoading ? (
                    <Skeleton className="w-full h-full bg-gray-700" />
                  ) : error ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : (
                    <ChartContainer
                      config={chartConfig}
                      className="h-full max-w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#4a5568"
                          />
                          <XAxis
                            dataKey="time"
                            tickFormatter={(value) =>
                              new Date(value).toLocaleTimeString()
                            }
                            stroke="#a0aec0"
                          />
                          <YAxis stroke="#a0aec0" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={chartConfig.price.color}
                            fill={chartConfig.price.color}
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2 font-medium leading-none text-white text-2xl">
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
                      <div className="flex items-center gap-2 leading-none text-gray-400">
                        Last updated: {new Date().toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        "Prerendered"
      )}
    </div>
  );
}
