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
import React from 'react';
import type { Feature } from '../../../server/src/admin';

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

      <Box px="3" mt="2">
        <Heading
          mt="2"
          letterSpacing="tight"
          textTransform="uppercase"
          fontSize="12px"
        >
          Groups
        </Heading>

        <HStack wrap="wrap">
          {!feature.enabled ? (
            <Badge my="2" variant="subtle" colorScheme="yellow">
              Nobody
            </Badge>
          ) : feature.audiences.some((a) => a === true) ||
            feature.progression === 100 ? (
            <Badge my="2" variant="subtle" colorScheme="yellow">
              Everyone
            </Badge>
          ) : feature.groups === undefined || feature.groups.length === 0 ? (
            <Text fontWeight="thin">No groups enabled</Text>
          ) : (
            feature.groups?.map((group) => (
              <Badge
                key={group.toString()}
                variant="subtle"
                colorScheme="orange"
                my="2"
              >
                {group}
              </Badge>
            ))
          )}
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
      </Box>
    </Box>
  );
}

function determineAudiences(feature: Feature): string[] {
  if (!feature.enabled) return ['Nobody'];

  let audiences = [];

  if (feature.progression) {
    audiences.push('Rollout');
  }

  feature.groups?.forEach((group) => {
    audiences.push(group);
  });

  if (audiences.length === 0) {
    audiences.push('Everyone');
  }

  return audiences;
}
