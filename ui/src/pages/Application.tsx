import { SearchIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  chakra,
  Circle,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Feature } from '../../../server/src/admin';
import { FeatureCard } from '../components/FeatureCard';
import { ToggleModal } from '../components/FeatureToggleModal';
import { AppMenu } from '../components/AppMenu';
import { trpc } from '../utils/trpc';
import { ApplicationNotFoundPage } from './ApplicationNotFound';

export function ApplicationPage() {
  const params = useParams<'application'>();
  const {
    isLoading,
    data: app,
    refetch,
  } = trpc.useQuery(['application', { name: params.application! }]);

  const [search, setSearch] = useState('');
  const searchedFeatures = useMemo(() => {
    return (
      app?.features.filter((feature) => feature.name.includes(search)) ?? []
    );
  }, [app, search]);

  const [feature, setFeature] = useState<Feature | null>(null);

  const toggleDisclosure = useDisclosure();
  const removeFeature = trpc.useMutation('removeFeature');

  const onDeleteFeature = useCallback(
    async (application: string, feature: string) => {
      try {
        await removeFeature.mutateAsync({
          application,
          name: feature,
        });

        await refetch();
      } catch (err) {
        console.error(err, 'remove feature failed');
      }
    },
    [removeFeature],
  );

  if (!app) {
    return <ApplicationNotFoundPage />;
  }

  if (isLoading) {
    return (
      <Center w="100%" h="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <Box as="main" mx="auto" maxW="5xl">
      <Box mx="6">
        <AppMenu />

        <HStack my="2">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              placeholder="Search..."
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </InputGroup>

          <Button
            mr="4"
            height="38px"
            size="sm"
            colorScheme="purple"
            px="6"
            onClick={toggleDisclosure.onOpen}
          >
            <chakra.span>New Feature</chakra.span>
            {app.suggestedFeatures.length > 0 ? (
              <Box paddingLeft="3">
                <Circle size="18px" background="purple.100" display="flex">
                  <chakra.span color="purple.700" fontSize="xs">
                    {app.suggestedFeatures.length}
                  </chakra.span>
                </Circle>
              </Box>
            ) : null}
          </Button>
          <Button
            hidden={true}
            variant="outline"
            colorScheme="purple"
            width="38px"
            height="38px"
          >
            <SettingsIcon />
          </Button>
        </HStack>

        {app.features.length === 0 ? (
          <Center
            mt="7"
            flexDir="column"
            p="12"
            h="sm"
            borderWidth="1px"
            borderColor="white"
            borderRadius="md"
          >
            <Heading>No Features, yet!</Heading>
            <Text mt="4">
              Start using Keat client to discover features or manually add your
              first feature.
            </Text>
          </Center>
        ) : searchedFeatures.length === 0 ? (
          <Center
            flexDir="column"
            mt="7"
            p="12"
            h="sm"
            borderWidth="1px"
            borderColor="white"
            borderRadius="md"
          >
            <Heading size="md">No Features found.</Heading>
            <Text mt="4">
              Your search for "{search}" did not match any features.
            </Text>
          </Center>
        ) : (
          <SimpleGrid mt="7" columns={{ base: 1, sm: 2, lg: 3 }} gridGap="4">
            {searchedFeatures.map((feature) => {
              return (
                <FeatureCard
                  key={feature.name}
                  application={app.name}
                  feature={feature}
                  onDelete={() => {
                    onDeleteFeature(app.name, feature.name);
                  }}
                  onEdit={() => {
                    setFeature(feature);
                    toggleDisclosure.onOpen();
                  }}
                />
              );
            })}
          </SimpleGrid>
        )}

        <ToggleModal
          isOpen={toggleDisclosure.isOpen}
          application={app.name}
          feature={feature}
          suggestedFeatures={app.suggestedFeatures}
          suggestedAudiences={app.suggestedAudiences}
          onClose={() => {
            setFeature(null);
            toggleDisclosure.onClose();
            refetch();
          }}
        />
      </Box>
    </Box>
  );
}
