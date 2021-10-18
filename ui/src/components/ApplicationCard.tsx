import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  application: string;
  featureCount: number;
  onClick: () => void;
};

export function ApplicationCard({ application, featureCount, onClick }: Props) {
  return (
    <Box
      cursor="pointer"
      display="absolute"
      alignItems="flex-start"
      rounded="lg"
      bgGradient="linear(to-b, #28292c, rgba(39,40,43,0.82) )"
      shadow="2xl"
      p="6"
      onClick={onClick}
    >
      <Heading fontFamily="inter" fontWeight="700">
        {application}
      </Heading>

      <HStack mt="2">
        {featureCount !== 0 ? (
          <Text fontSize="sm">{`${featureCount} features`}</Text>
        ) : (
          <Text fontSize="sm">no features</Text>
        )}
      </HStack>
    </Box>
  );
}
