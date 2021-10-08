import {
  Box,
  Button,
  chakra,
  Circle,
  Grid,
  Heading,
  HStack,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { capitalize } from 'lodash';
import React, { useCallback, useState } from 'react';
import type { Application, Feature } from '../../../server/src/admin';
import { ApplicationCreateModal } from '../components/ApplicationCreateModal';
import { FeatureCard } from '../components/FeatureCard';
import { ToggleModal } from '../components/FeatureToggleModal';
import { trpc } from '../utils/trpc';

export function IndexPage() {
  const {
    isLoading,
    data: applications,
    refetch,
  } = trpc.useQuery(['applications']);

  const [feature, setFeature] = useState<Feature | null>(null);
  const [application, setApplication] = useState<Application | null>(null);

  const toggleDisclosure = useDisclosure();
  const createApplicationDisclosure = useDisclosure();

  const deleteApplication = trpc.useMutation('deleteApplication');
  const removeFeature = trpc.useMutation('removeFeature');

  const onDelete = useCallback(
    async (application: Application) => {
      try {
        await deleteApplication.mutateAsync({
          name: application.name,
        });
        await refetch();
      } catch (err) {
        console.error(err, 'delete application failed');
      }
    },
    [deleteApplication],
  );

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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box as="main" mx="auto" maxW="3xl">
      <HStack>
        <Heading>Applications</Heading>

        <Button
          size="sm"
          colorScheme="whiteAlpha"
          onClick={createApplicationDisclosure.onOpen}
        >
          Create
        </Button>
      </HStack>

      {applications?.map((application) => {
        return (
          <section key={application.name}>
            <HStack my="2">
              <Heading>{capitalize(application.name)}</Heading>

              <Button
                size="sm"
                colorScheme="whiteAlpha"
                onClick={() => onDelete(application)}
              >
                Delete
              </Button>

              <Button
                size="sm"
                colorScheme="whiteAlpha"
                onClick={() => {
                  setApplication(application);
                  toggleDisclosure.onOpen();
                }}
              >
                Add feature
                {application.suggestedFeatures.length ? (
                  <Box paddingLeft="3">
                    <Circle size="18px" background="orange.100" display="flex">
                      <chakra.span color="orange.700" fontSize="xs">
                        {application.suggestedFeatures.length}
                      </chakra.span>
                    </Circle>
                  </Box>
                ) : null}
              </Button>
            </HStack>

            <Heading size="sm" my="2">
              Manage
            </Heading>

            <Grid
              templateColumns="repeat(auto-fill, minmax(320px, 320px));"
              justifyContent={{ base: 'center', sm: 'start' }}
              gridGap="4"
            >
              {application.features.map((feature) => {
                return (
                  <FeatureCard
                    key={feature.name}
                    feature={feature}
                    onDelete={() =>
                      onDeleteFeature(application.name, feature.name)
                    }
                    onEdit={() => {
                      setFeature(feature);
                      setApplication(application);
                      toggleDisclosure.onOpen();
                    }}
                  />
                );
              })}
            </Grid>
          </section>
        );
      })}

      <ApplicationCreateModal
        {...createApplicationDisclosure}
        onClose={() => {
          createApplicationDisclosure.onClose();
          refetch();
        }}
      />

      {application && (
        <ToggleModal
          feature={feature}
          isOpen={toggleDisclosure.isOpen}
          application={application.name}
          suggestedFeatures={application.suggestedFeatures}
          suggestedAudiences={application.audiences}
          onClose={() => {
            setApplication(null);
            setFeature(null);
            toggleDisclosure.onClose();
            refetch();
          }}
        />
      )}
    </Box>
  );
}
