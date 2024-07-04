import { NextRequest, NextResponse } from "next/server";

type Geocode = {
  address: string;
  lat: number;
  lng: number;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const passengersCount = searchParams.get("passengersCount");
  const includeStops = searchParams.get("includeStops") || undefined;
  const includeNonEnglishSpeaking = searchParams.get("includeNonEnglishSpeaking")  || undefined;
  const date = searchParams.get("date") as string;

  if (!origin || !destination || !passengersCount) {
    return NextResponse.json(
      { error: "Origin, destination and passengersCount are required params" },
      { status: 400 }
    );
  }

  try {
    const [originGeocode, destinationGeocode] = await Promise.all([
      getAddressGeoCode(origin),
      getAddressGeoCode(destination),
    ]);

    const daytripApiUrl = createDaytripApiUrl(
      originGeocode,
      destinationGeocode,
      date,
      parseInt(passengersCount),
      includeStops,
      includeNonEnglishSpeaking
    );
    const result = await fetchDaytripApi(daytripApiUrl);

    return NextResponse.json(
      {
        originReturned: originGeocode.address,
        destinationReturned: destinationGeocode.address,
        daytripResponse: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({error: error.message}, { status: 500 });
  }
}

async function getAddressGeoCode(address: string) {
  const apiKey = process.env.RAPIDAPI_KEY;
  const rapidApiEndpoint = process.env.RAPIDAPI_ENDPOINT;

  if (!apiKey) throw new Error("RAPIDAPI_KEY is not defined");
  if (!rapidApiEndpoint) throw new Error("RAPIDAPI_ENDPOINT is not defined");

  const url = new URL(rapidApiEndpoint);
  url.searchParams.append("address", address);

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": new URL(rapidApiEndpoint).host,
    },
  };

  const response = await fetch(url.toString(), options);

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error("Failed to fetch geocode");
  }

  return {address: result.address, lat: result.latitude, lng: result.longitude} as Geocode
}

function createDaytripApiUrl(
  originGeocode: Geocode,
  destinationGeocode: Geocode,
  date: string,
  passengersCount: number,
  includeStops?: string,
  includeNonEnglishSpeaking?: string,
) {
  const endpoint = process.env.DAYTRIPAPI_ENDPOINT;
  const apiKey = process.env.DAYTRIPAPI_KEY;

  if (!endpoint || !apiKey) {
    throw new Error("DAYTRIPAPI_ENDPOINT or DAYTRIPAPI_KEY is not defined");
  }

  const url = new URL(endpoint);
  url.searchParams.append("originLongitude", String(originGeocode.lng));
  url.searchParams.append("originLatitude", String(originGeocode.lat));
  url.searchParams.append(
    "destinationLongitude",
    String(destinationGeocode.lng)
  );
  url.searchParams.append(
    "destinationLatitude",
    String(destinationGeocode.lat)
  );
  url.searchParams.append("departureTime", date);
  url.searchParams.append("passengersCount", passengersCount.toString());
  url.searchParams.append("includeStops", includeStops === "true" ? "true" : "false");
  url.searchParams.append("includeNonEnglishSpeaking", includeNonEnglishSpeaking === "true" ? "true" : "false");

  return url.toString();
}

async function fetchDaytripApi(url: string) {
  const apiKey = process.env.DAYTRIPAPI_KEY;
  if (!apiKey) throw new Error("DAYTRIPAPI_KEY is not defined");

  const options = {
    method: "GET",
    headers: { "x-api-key": apiKey },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
