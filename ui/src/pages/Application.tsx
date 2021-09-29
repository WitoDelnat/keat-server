import { Grid, Spinner, useDisclosure } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { FeatureCard } from '../components/FeatureCard';
import { Layout } from '../components/Layout';
import { ToggleModal } from '../components/FeatureToggleModal';
import { trpc } from '../utils/trpc';
import type { Feature } from '../utils/types';
import { ApplicationNotFoundPage } from './ApplicationNotFound';

export function ApplicationPage() {
  const { id } = useParams();
  const { isLoading, data: applications, refetch } = trpc.useQuery([
    'applications',
  ]);
  const application = useMemo(() => {
    return applications?.find((a) => a.name === id);
  }, [id, applications]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feature, setFeature] = useState<Feature | null>(null);

  if (isLoading) {
    return <Spinner />;
  }

  if (!application) {
    return <ApplicationNotFoundPage />;
  }

  return (
    <Layout title={application.name} applications={applications ?? []}>
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
              onEdit={() => {
                setFeature(feature);
                onOpen();
              }}
            />
          );
        })}
      </Grid>

      {feature ? (
        <ToggleModal
          application={application.name}
          availableAudiences={application.audiences}
          feature={feature}
          isOpen={isOpen}
          onClose={() => {
            setFeature(null);
            onClose();
            refetch();
          }}
        />
      ) : null}
    </Layout>
  );
}
