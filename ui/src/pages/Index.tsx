import { SearchIcon, SettingsIcon, TriangleDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Circle,
  DarkMode,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Feature } from '../../../server/src/admin';
import { ApplicationCreateModal } from '../components/ApplicationCreateModal';
import { FeatureCard } from '../components/FeatureCard';
import { ToggleModal } from '../components/FeatureToggleModal';
import { DividerIcon } from '../components/icons/DividerIcon';
import { trpc } from '../utils/trpc';

export function IndexPage() {
  const {
    isLoading,
    data: applications,
    refetch,
  } = trpc.useQuery(['applications']);

  const [currentApp, setCurrentApp] = useState<string | undefined>(undefined);
  const currentApplication = useMemo(() => {
    return applications?.find((a) => a.name === currentApp);
  }, [applications, currentApp]);

  const [search, setSearch] = useState('');
  const searchedFeatures = useMemo(() => {
    return (
      currentApplication?.features.filter((feature) =>
        feature.name.includes(search),
      ) ?? []
    );
  }, [currentApplication, search]);

  useEffect(() => {
    if (!currentApp && applications) {
      setCurrentApp(applications[0].name);
    }
  }, [applications, setCurrentApp]);

  const [feature, setFeature] = useState<Feature | null>(null);

  const toggleDisclosure = useDisclosure();
  const newAppDisclosure = useDisclosure();
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

  if (isLoading || !applications || !currentApplication) {
    return <Spinner />;
  }

  return (
    <Box as="main" mx="auto" maxW="5xl">
      <HStack mx="6">
        <Heading py="3">Keat</Heading>
        <DividerIcon w="8" h="8" color="white" />

        <DarkMode>
          <Menu gutter={2}>
            <MenuButton>
              <HStack>
                <Heading py="3">{currentApplication.name}</Heading>
                <TriangleDownIcon pt="2" />
              </HStack>
            </MenuButton>
            <MenuList>
              {applications.map((app) => (
                <MenuItem
                  key={app.name}
                  onClick={() => setCurrentApp(app.name)}
                >
                  {app.name}
                </MenuItem>
              ))}
              <MenuDivider />
              <MenuItem onClick={newAppDisclosure.onOpen}>
                New application
              </MenuItem>
            </MenuList>
          </Menu>
        </DarkMode>
      </HStack>

      <Box mx="6">
        <HStack my="2">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              type="tel"
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
            {currentApplication.suggestedFeatures.length > 0 ? (
              <Box paddingLeft="3">
                <Circle size="18px" background="purple.100" display="flex">
                  <chakra.span color="purple.700" fontSize="xs">
                    {currentApplication.suggestedFeatures.length}
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

        {currentApplication.features.length === 0 ? (
          <Box>
            <Text maxW="lg" mt="7">
              Start using the Keat client to automatically discover features or
              add your first feature from within the dashboard by clicking{' '}
              <Link color="purple.400" onClick={toggleDisclosure.onOpen}>
                here
              </Link>
              .
            </Text>
          </Box>
        ) : (
          <SimpleGrid mt="7" columns={{ base: 1, sm: 2, lg: 3 }} gridGap="4">
            {searchedFeatures.map((feature) => {
              return (
                <FeatureCard
                  key={feature.name}
                  application={currentApplication.name}
                  feature={feature}
                  onDelete={() => {
                    onDeleteFeature(currentApplication.name, feature.name);
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

        <ApplicationCreateModal
          isOpen={newAppDisclosure.isOpen}
          onClose={newAppDisclosure.onClose}
          onSuccess={async (name) => {
            newAppDisclosure.onClose();
            await refetch();
            setCurrentApp(name);
          }}
        />

        <ToggleModal
          isOpen={toggleDisclosure.isOpen}
          application={currentApplication.name}
          feature={feature}
          suggestedFeatures={currentApplication.suggestedFeatures}
          suggestedAudiences={currentApplication.suggestedAudiences}
          onClose={() => {
            setFeature(null);
            toggleDisclosure.onClose();
            console.log('refetch');
            refetch();
          }}
        />
      </Box>
    </Box>
  );
}
