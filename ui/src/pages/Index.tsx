import {
  Box,
  Button,
  Grid,
  Heading,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { capitalize } from 'lodash';
import React, { useCallback, useState } from 'react';
import { FeatureAddModal } from '../components/FeatureAddModal';
import { ApplicationCreateModal } from '../components/ApplicationCreateModal';
import { FeatureCard } from '../components/FeatureCard';
import { ToggleModal } from '../components/FeatureToggleModal';
import { trpc } from '../utils/trpc';
import type { Application, Feature } from '../../../server/src/admin';

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
  const addFeatureDisclosure = useDisclosure();

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
      <Heading>Applications</Heading>
      <Button
        my="2"
        colorScheme="orange"
        onClick={createApplicationDisclosure.onOpen}
      >
        Create
      </Button>

      {applications?.map((application) => {
        return (
          <section key={application.name}>
            <Heading my="2">{capitalize(application.name)}</Heading>

            <Button
              my="2"
              colorScheme="orange"
              onClick={() => onDelete(application)}
            >
              Delete
            </Button>

            <Button
              ml="2"
              my="2"
              colorScheme="orange"
              onClick={() => {
                setApplication(application);
                addFeatureDisclosure.onOpen();
              }}
            >
              Add feature
            </Button>

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
        <FeatureAddModal
          application={application.name}
          isOpen={addFeatureDisclosure.isOpen}
          onClose={() => {
            setApplication(null);
            setFeature(null);
            addFeatureDisclosure.onClose();
            refetch();
          }}
        />
      )}
      {application && feature && (
        <ToggleModal
          feature={feature}
          isOpen={toggleDisclosure.isOpen}
          application={application.name}
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
