import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const ticker = (await params).ticker

  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing Alpha Vantage API Key" },
      { status: 500 }
    );
  }

  // Build the Alpha Vantage URL for daily time series data.
  const alphaVantageUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${apiKey}`;

  try {
    const response = await fetch(alphaVantageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Error fetching data from Alpha Vantage" },
        { status: response.status }
      );
    }
    const data = await response.json();

    // Alpha Vantage returns a JSON that includes "Time Series (Daily)".
    const timeSeries = data["Time Series (Daily)"];
    
    if (!timeSeries) {
      return NextResponse.json(
        { error: "No time series data or meta data found for ticker" },
        { status: 404 }
      );
    }

    // Transform the data into an array of objects with time and price.
    // Here, we take the "4. close" value as the price.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
      time: date, // you might format this date as needed
      price: parseFloat(values["4. close"]),
    }));

    

    

    return NextResponse.json(
      { 
        results: chartData,
       }
      );
  } catch (error) {
    console.error("Error fetching Alpha Vantage data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}