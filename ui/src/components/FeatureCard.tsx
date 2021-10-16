import {
  Badge,
  Box,
  Heading,
  HStack,
  Image,
  Square,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { generateFromString } from 'generate-avatar';
import React, { useState } from 'react';
import type { Feature } from '../../../server/src/admin';

type Props = {
  application: string;
  feature: Feature;
  onDelete: () => void;
  onEdit: () => void;
};

export function FeatureCard({ application, feature, onEdit, onDelete }: Props) {
  const [showActions, setShowActions] = useState<boolean>(false);
  const hideActions = useBreakpointValue({ base: false, sm: !showActions });

  return (
    <Box
      display="absolute"
      alignItems="flex-start"
      rounded="lg"
      bgGradient="linear(to-b, #28292c, rgba(39,40,43,0.82) )"
      shadow="2xl"
      p="6"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <HStack justifyContent="space-between">
        <HStack>
          <Square size="8" overflow="hidden" rounded="md">
            <Image
              src={`data:image/svg+xml;utf8,${generateFromString(
                feature.name,
              )}`}
            />
          </Square>

          <VStack spacing="0" alignItems="flex-start">
            <Heading fontSize="md" fontFamily="inter" fontWeight="700">
              {feature.name}
            </Heading>
            <Text fontSize="sm" fontFamily="inter" fontWeight="400">
              {application}
            </Text>
          </VStack>
        </HStack>

        <HStack hidden={hideActions} alignSelf="flex-start" spacing="5">
          <Text
            py="2"
            fontSize="sm"
            cursor="pointer"
            onClick={onDelete}
            color="blue.300"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            delete
          </Text>

          <Text
            py="2"
            fontSize="sm"
            cursor="pointer"
            onClick={onEdit}
            color="blue.300"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            edit
          </Text>
        </HStack>
      </HStack>

      <HStack mt="3" wrap="wrap" h="48px">
        {!feature.enabled ? (
          <Text my="2">Disabled</Text>
        ) : feature.audiences.some((a) => a === true) ||
          feature.progression === 100 ? (
          <Text my="2">Enabled for everyone</Text>
        ) : (
          <>
            {feature.progression ? (
              <Badge key={'rollout'} variant="subtle" colorScheme="purple">
                {feature.progression}% rollout
              </Badge>
            ) : null}

            {feature.groups?.map((group) => (
              <Badge
                key={group.toString()}
                variant="subtle"
                colorScheme="purple"
              >
                {group}
              </Badge>
            ))}
          </>
        )}
      </HStack>

      <HStack mt="2">
        {feature.lastSeen ? (
          <Text fontSize="sm">
            {`last seen ${formatDistanceToNow(feature.lastSeen)} ago`}
          </Text>
        ) : (
          <Text fontSize="sm">{`never seen`}</Text>
        )}
      </HStack>
    </Box>
  );
}
