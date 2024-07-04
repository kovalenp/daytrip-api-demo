import { convertMinutes } from "@/utils/time.utils";
import {
  Heading,
  Flex,
  Card,
  Text,
  Button,
  Container,
  Box,
  Callout,
} from "@radix-ui/themes";
import React, { use, useEffect, useState } from "react";
import Icon from "./Icon";
import { RouteData } from "@/hooks/useRouteData";
import Image from "next/image";
import AvailableStops from "./AvailableStops";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type RouteOptionsProps = {
  data: RouteData;
  includeStops: boolean;
  isLoading: boolean;
};

const RouteOptions: React.FC<RouteOptionsProps> = ({
  data,
  includeStops,
  isLoading,
}) => {
  const { daytripResponse, originReturned, destinationReturned } = data;
  const { options, currency } = daytripResponse;

  const [selectedOption, setSelectedOption] = useState<any | null>(null);

  const priceFrom = options
    .map(({ pricing }) => pricing.totalPrice)
    .reduce((a, b) => Math.min(a, b));

  const stopsAvailable = options.find(
    ({ possibleStops }) => possibleStops.length > 0
  );

  const sortedOptions = options.sort(
    (a, b) => a.pricing.totalPrice - b.pricing.totalPrice
  );

  useEffect(() => {
    if (selectedOption) {
      const element = document.getElementById("selection");
      const offset = element!.offsetTop - 80;
      setTimeout(() => {
        window.scrollTo({ top: offset, behavior: "smooth" });
      }, 250);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (isLoading) {
      setSelectedOption(null);
    }
  }, [isLoading]);

  return (
    <>
      <Container size="3">
        <Heading className="text-4xl">
          {originReturned} <Icon name="arrow-right" /> {destinationReturned}
        </Heading>
        <Heading className="font-normal mt-1">
          from {priceFrom} {currency}
        </Heading>
        <Flex
          direction={"row"}
          mt={"4"}
          className="w-full text-gray-400"
          gap={"4"}
        >
          <Flex gap={"2"} direction={"row"} align={"center"}>
            <Icon name="route" />
            <Text size={"2"}>{options[0].distanceKm} km</Text>
          </Flex>
          {includeStops && stopsAvailable && (
            <Flex gap={"2"} direction={"row"} align={"center"}>
              <Icon name="location" />
              <Text size={"2"}>Stops available</Text>
            </Flex>
          )}
          <Flex gap={"2"} direction={"row"} align={"center"}>
            <Icon name="pin-clock" />
            <Text size={"2"}>
              {convertMinutes(options[0].travelTimeMinutes)}
            </Text>
          </Flex>
        </Flex>
      </Container>
      <Flex
        id="options"
        className="max-w-[60vw] mx-auto gap-4 mt-10 justify-center"
      >
        {sortedOptions.map((option) => {
          const { id, vehicle, pricing, possibleStops, englishSpeakingDriver } =
            option;

          const isSelected = selectedOption?.id === id;
          const isNotCurrentlySelected = selectedOption && !isSelected;

          return (
            <Card
              key={id}
              className={`group p-6 flex-grow-0 transition-all duration-200 ease-out w-[240px] ${
                isSelected && ["bg-blue-100", "scale-105"].join(" ")
              } ${isNotCurrentlySelected && "opacity-70"}`}
            >
              <Flex
                direction={"column"}
                gap="2"
                flexGrow={"1"}
                className="w-full h-full"
              >
                <Flex height={"100px"} className="px-2 items-center">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.type}
                    width={100}
                    height={100}
                    className={`w-full backdrop-blur-sm duration-300 ease-out transition-all group-hover:translate-y-[2px] group-hover:scale-[1.05] ${
                      isSelected
                        ? "scale-[1.25] translate-y-[2px] group-hover:scale-[1.25] group-hover:translate-y-[2px]"
                        : ""
                    }`}
                  />
                </Flex>
                <Flex
                  direction={"column"}
                  gap={"0"}
                  className={`transition-all  ${isSelected && "text-blue-600"}`}
                >
                  <Heading as="h3">{vehicle.type}</Heading>
                  <Heading as="h2" className="text-4xl">
                    {pricing.totalPrice} {currency}
                  </Heading>
                </Flex>
                <Flex
                  direction={"column"}
                  gap={"1"}
                  my={"4"}
                  className="divide-y divide-slate-100"
                >
                  <Flex
                    direction={"row"}
                    gap={"2"}
                    align={"center"}
                    className="py-1"
                  >
                    <Icon name="users-5" />
                    <Text size={"1"}>Passengers: {vehicle.maxPassengers}</Text>
                  </Flex>
                  {possibleStops.length > 0 && (
                    <Flex
                      direction={"row"}
                      gap={"2"}
                      align={"center"}
                      className="py-1"
                    >
                      <Icon name="location" />
                      <Text size={"1"}>
                        {possibleStops.length} stops available
                      </Text>
                    </Flex>
                  )}
                  {englishSpeakingDriver && (
                    <Flex
                      gap={"2"}
                      direction={"row"}
                      align={"center"}
                      className="py-1"
                    >
                      <Icon name="message-bubble-user" />
                      <Text size={"1"}>English speaking driver</Text>
                    </Flex>
                  )}
                </Flex>
                <Flex direction={"column"} gap={"2"} mt={"auto"}>
                  <Button
                    className={`mt-auto cursor-pointer`}
                    variant={`${isNotCurrentlySelected ? "outline" : "solid"}`}
                    onClick={() =>
                      isSelected
                        ? setSelectedOption(null)
                        : setSelectedOption(option)
                    }
                  >
                    {isSelected ? "Clear selection" : "Select"}
                  </Button>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>
      {selectedOption && (
        <Container id="selection" size="3" className="mt-20">
          <Flex gap={"8"} direction={"column"}>
            <Box>
              <Heading className="text-4xl mb-2">
                {selectedOption.vehicle.type}
              </Heading>
              <Text size={"4"} className="mb-4">
                {selectedOption.vehicle.description}
              </Text>
              <Flex
                direction={"row"}
                gap={"4"}
                align={"center"}
                className="py-1 mt-6 divide-x-2"
              >
                <Flex direction={"row"} align={"center"} gap={"2"}>
                  <Icon name="users-5" />
                  <Text size={"1"}>
                    Passengers: {selectedOption.vehicle.maxPassengers}
                  </Text>
                </Flex>
                {selectedOption.availableChildSeatTypes.length > 0 && (
                  <Flex
                    direction={"row"}
                    align={"center"}
                    gap={"2"}
                    className="pl-4"
                  >
                    <Icon name="baby-car-seat" />
                    <Text size={"1"}>
                      {selectedOption.availableChildSeatTypes.length} Child
                      seats types available
                    </Text>
                  </Flex>
                )}
                <Flex
                  direction={"row"}
                  align={"center"}
                  gap={"2"}
                  className="pl-4"
                >
                  <Icon name="suitcase-6" />
                  <Text size={"1"}>
                    Suitcases: {selectedOption.luggage.maxTotalSuitcases}
                  </Text>
                </Flex>
                <Flex
                  direction={"row"}
                  align={"center"}
                  gap={"2"}
                  className="pl-4"
                >
                  <Icon name="luggage-custom" />
                  <Text size={"1"}>
                    Carryons: {selectedOption.luggage.maxTotalCarryons}
                  </Text>
                </Flex>
              </Flex>
            </Box>
            <Box>
              <Heading className="text-4xl mb-10">Available Stops</Heading>
              {selectedOption.possibleStops.length > 0 ? (
                <AvailableStops
                  options={selectedOption.possibleStops}
                  currency={currency}
                ></AvailableStops>
              ) : (
                <Callout.Root>
                  <Callout.Icon>
                    <InfoCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    This selection has no stops available.
                  </Callout.Text>
                </Callout.Root>
              )}
            </Box>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default RouteOptions;
