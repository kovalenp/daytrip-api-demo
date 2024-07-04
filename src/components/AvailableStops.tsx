import { Heading, Flex, Card, Box, Text } from "@radix-ui/themes";
// @ts-ignore
import * as Collapsible from "@radix-ui/react-collapsible";
import React from "react";
import Image from "next/image";
import Icon from "./Icon";
import { convertMinutes } from "@/utils/time.utils";

type AvailableStopsProps = {
  options: any[];
  currency: string;
};

const AvailableStops: React.FC<AvailableStopsProps> = ({
  options,
  currency,
}) => {
  const [open, setOpen] = React.useState<any[]>([]);

  return (
    <Flex className="gap-6" direction={"column"}>
      {options.map(
        ({
          id,
          name,
          image,
          title,
          description,
          perex,
          price,
          durationInMinutes,
        }: any) => (
          <Card key={id} className="p-6">
            <Flex
              className="border-b-2 border-slate-100 gap-6 last:border-none"
              align={"start"}
            >
              <Image
                src={image}
                alt={name}
                width={300}
                height={300}
                className="rounded-lg"
                objectPosition="center"
                objectFit="cover"
                loading="lazy"
              />
              <Flex direction="column" gap="2" className="w-full">
                <Box>
                  <Heading>{name}</Heading>
                  <Text size={"4"} className="">
                    {title}
                  </Text>
                </Box>
                <Text size={"2"}>{perex}</Text>
                <Collapsible.Root
                  open={open.includes(id)}
                  onOpenChange={() => setOpen([...open, id])}
                  className="mb-5"
                >
                  <Collapsible.Content className="CollapsibleContent">
                    <Text>{description}</Text>
                  </Collapsible.Content>
                  {!open.includes(id) && (
                    <Collapsible.Trigger>
                      <Text size={"1"} className="cursor-pointer text-blue-600">
                        Read more
                      </Text>
                    </Collapsible.Trigger>
                  )}
                </Collapsible.Root>
                <Flex
                  className="mt-auto"
                  gap={"4"}
                  direction={"row"}
                  align={"center"}
                >
                  <Flex align={"center"} gap={"1"}>
                    <Icon name="hourglass-start" />
                    <Text size={"2"}>
                      <strong>Duration</strong>{" "}
                      {convertMinutes(durationInMinutes)}
                    </Text>
                  </Flex>
                  <Flex align={"center"} gap={"1"}>
                    <Text size={"2"}>
                      <strong>Price</strong> {price} {currency}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        )
      )}
    </Flex>
  );
};

export default AvailableStops;
