import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Heading,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import { isNumber } from '@chakra-ui/utils';
import React from 'react';
import type { Feature } from '../utils/types';

type Props = {
  feature: Feature;
  onDelete: () => void;
  onEdit: () => void;
};

export function FeatureCard({ feature, onDelete, onEdit }: Props) {
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

        <HStack spacing="3.5">
          <DeleteIcon aria-label="delete" cursor="pointer" onClick={onDelete} />
          <EditIcon aria-label="edit" cursor="pointer" onClick={onEdit} />
        </HStack>
      </HStack>

      <Box px="3">
        <Heading
          mt="2"
          letterSpacing="tight"
          textTransform="uppercase"
          fontSize="12px"
        >
          Audiences
        </Heading>

        <HStack pt="2">
          {feature.audiences
            .map((a) => (isNumber(a) ? 'rollout' : a))
            .map((audience) => (
              <Badge key={audience} variant="subtle" colorScheme="orange">
                {audience}
              </Badge>
            ))}
        </HStack>

        <HStack mt="2">
          <Heading
            letterSpacing="tight"
            textTransform="uppercase"
            fontSize="12px"
          >
            Progression
          </Heading>
          {feature.progression ? (
            <Text fontSize="xs">({feature.progression}%)</Text>
          ) : undefined}
        </HStack>

        <Box mb="2">
          {feature.progression === undefined ? (
            <Text fontWeight="thin">No rollout ongoing</Text>
          ) : (
            <Slider size="sm" value={feature.progression}>
              <SliderTrack>
                <SliderFilledTrack bgColor="orange.100" />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          )}
        </Box>

        <Heading
          letterSpacing="tight"
          textTransform="uppercase"
          fontSize="12px"
        >
          Last seen
        </Heading>

        <HStack>
          <Text fontWeight="thin">Yesterday</Text>
        </HStack>
      </Box>
    </Box>
  );
}
