import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  chakra,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApplicationCard } from '../components/ApplicationCard';
import { ApplicationCreateModal } from '../components/ApplicationCreateModal';
import { AppMenu } from '../components/AppMenu';
import { trpc } from '../utils/trpc';

export function IndexPage() {
  const navigate = useNavigate();
  const { isLoading, data: applications } = trpc.useQuery(['indexPage']);
  console.log('test', applications);

  const createDisclosure = useDisclosure();
  const [search, setSearch] = useState('');
  const searchedApplications = useMemo(() => {
    return applications?.filter((a) => a.name.includes(search)) ?? [];
  }, [applications, search]);

  if (isLoading || !applications) {
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
            onClick={createDisclosure.onOpen}
          >
            <chakra.span>New Application</chakra.span>
          </Button>
        </HStack>

        {applications.length === 0 ? (
          <Center
            flexDir="column"
            mt="7"
            p="12"
            h="sm"
            borderWidth="1px"
            borderColor="white"
            borderRadius="md"
          >
            <Text mt="4">Create your first application to get started.</Text>
          </Center>
        ) : searchedApplications.length === 0 ? (
          <Center
            flexDir="column"
            mt="7"
            p="12"
            h="sm"
            borderWidth="1px"
            borderColor="white"
            borderRadius="md"
          >
            <Heading size="md">No Applications found.</Heading>
            <Text mt="4">
              Your search for "{search}" did not match any applications.
            </Text>
          </Center>
        ) : (
          <SimpleGrid mt="7" columns={{ base: 1, sm: 2, lg: 3 }} gridGap="4">
            {searchedApplications.map(({ name, featureCount }) => {
              return (
                <ApplicationCard
                  key={name}
                  application={name}
                  featureCount={featureCount}
                  onClick={() => {
                    navigate(`/${name.toLowerCase()}`);
                  }}
                />
              );
            })}
          </SimpleGrid>
        )}

        <ApplicationCreateModal
          isOpen={createDisclosure.isOpen}
          onClose={createDisclosure.onClose}
          onSuccess={async (name) => {
            createDisclosure.onClose();
            navigate(`/${name.toLowerCase()}`);
          }}
        />
      </Box>
    </Box>
  );
}
