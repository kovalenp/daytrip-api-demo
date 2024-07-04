"use client";

import { Box, Callout, Code, Container, Heading } from "@radix-ui/themes";
import RouteOptions from "@/components/RouteOptions";
import SearchForm from "@/components/SearchForm";
import { CodeIcon, InfoCircledIcon } from "@radix-ui/react-icons";
// @ts-ignore
import * as Collapsible from "@radix-ui/react-collapsible";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FormApi, useForm } from "@tanstack/react-form";

export type TripSearchParams = {
  origin: string;
  destination: string;
  passengersCount: number;
  includeStops: boolean;
  includeNonEnglishSpeaking: boolean;
  date: Date;
};

export default function Home() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const form = useForm<TripSearchParams>({
    defaultValues: {
      origin: "",
      destination: "",
      passengersCount: 2,
      includeStops: true,
      includeNonEnglishSpeaking: true,
      date: tomorrow,
    },
    onSubmit: async () => {
      refetch();
    },
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "routeData",
      {
        origin: form.state.values.origin,
        destination: form.state.values.destination,
        passengersCount: form.state.values.passengersCount,
        includeStops: form.state.values.includeStops,
        includeNonEnglishSpeaking: form.state.values.includeNonEnglishSpeaking,
        date: form.state.values.date,
      },
    ],
    queryFn: fetchRouteData,
    enabled: false,
    retry: false,
  });

  return (
    <main className="min-h-screen p-24">
      <Container size="3">
        <Heading>Search your trip</Heading>
        <SearchForm form={form} isLoading={isLoading} />
        {error && (
          <Callout.Root color="red">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{(error as Error).message}</Callout.Text>
          </Callout.Root>
        )}
        {data && (
          <Collapsible.Root className="mb-10">
            <Collapsible.Trigger className="mb-4">
              <Code size={"1"} className="p-1">
                <CodeIcon className="inline-block" /> Toggle API reponse
              </Code>
            </Collapsible.Trigger>
            <Collapsible.Content className="CollapsibleContent">
              <Box className="bg-white p-4 rounded-lg w-full max-h-96 overflow-y-scroll scrollable-content">
                <pre>
                  <code className="language-json whitespace-pre-wrap font-mono text-xs">
                    {JSON.stringify(data.daytripResponse, null, 2)}
                  </code>
                </pre>
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        )}
      </Container>
      {data && (
        <RouteOptions
          data={data}
          includeStops={form.state.values.includeStops}
          isLoading={isLoading}
        />
      )}
    </main>
  );
}

async function fetchRouteData({
  queryKey,
}: QueryFunctionContext<[string, TripSearchParams]>): Promise<any> {
  const [
    _key,
    {
      origin,
      destination,
      passengersCount,
      includeStops,
      includeNonEnglishSpeaking,
      date,
    },
  ] = queryKey;

  const params = new URLSearchParams();
  params.append("origin", origin);
  params.append("destination", destination);
  params.append("passengersCount", passengersCount.toString());
  params.append("includeStops", includeStops.toString());
  params.append(
    "includeNonEnglishSpeaking",
    includeNonEnglishSpeaking.toString()
  );
  const timestamp = Math.floor(date.getTime() / 1000);
  params.append("date", timestamp.toString());

  const queryString = params.toString();
  const apiUrl = `/api?${queryString}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Failed to fetch route data");
  }

  return response.json();
}
