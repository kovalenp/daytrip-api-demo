import { useQuery, QueryFunctionContext } from "@tanstack/react-query";

export interface RouteData {
  daytripResponse: {
    searchId: string;
    expiresAt: string;
    passengersCount: number;
    currency: string;
    options: TripOption[];
  };
  originReturned: string;
  destinationReturned: string;
}

type TripOption = {
  id: any;
  type: any;
  englishSpeakingDriver: any;
  distanceKm: any;
  travelTimeMinutes: any;
  pickUp: any;
  dropOff: any;
  pricing: any;
  vehicle: any;
  luggage: any;
  seatsAvailable: any;
  availableChildSeatTypes: any;
  possibleStops: any;
  includedStops: any;
};

interface QueryParams {
  origin: string;
  destination: string;
}

const fetchRouteData = async ({
  queryKey,
}: QueryFunctionContext<[string, QueryParams]>): Promise<RouteData> => {
  const [_key, { origin, destination }] = queryKey;
  const response = await fetch(
    `/api?origin=${origin}&destination=${destination}`
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Failed to fetch route data");
  }

  return response.json();
};

export const useRouteData = (origin: string, destination: string) => {
  return useQuery({
    queryKey: ["routeData", { origin, destination }],
    queryFn: fetchRouteData,
    enabled: false,
    retry: false,
  });
};
