import { Badge, Box, Button, Heading, HStack } from '@chakra-ui/react';
import React from 'react';
import type { Feature } from '../../../server/src/admin';

type Props = {
  feature: { name: string; lastSeen: string };
  onAccept: () => void;
  onSnooze: () => void;
};

export function FeatureSuggestion({ feature, onAccept, onSnooze }: Props) {
  return (
    <Box
      minW="xs"
      maxW="md"
      rounded="lg"
      bgGradient="linear(to-b, #44403C, #292524)"
      shadow="lg"
      py="3"
    >
      <HStack
        pb="2"
        mb="3"
        justifyContent="space-between"
        alignItems="flex-start"
        borderBottomWidth="thin"
        borderColor="#6f6a64"
        px="3"
      >
        <Heading fontSize="md" fontFamily="inter">
          {feature.name}
        </Heading>
      </HStack>

      <Box px="3" mt="2">
        <Heading
          mt="2"
          letterSpacing="tight"
          textTransform="uppercase"
          fontSize="12px"
        >
          Last seen
        </Heading>

        <Badge my="2" variant="subtle" colorScheme="orange">
          {feature.lastSeen}
        </Badge>

        <HStack>
          <Button
            size="sm"
            aria-label="accept"
            cursor="pointer"
            colorScheme="orange"
            onClick={onAccept}
          >
            Accept
          </Button>
          <Button
            size="sm"
            aria-label="snooze"
            cursor="pointer"
            colorScheme="orange"
            onClick={onSnooze}
          >
            Snooze
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
