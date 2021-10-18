import { Center, Box, Heading, Link as ChakraLink } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { AppMenu } from '../components/AppMenu';

export function ApplicationNotFoundPage() {
  return (
    <Box as="main" mx="auto" maxW="5xl">
      <Box mx="6">
        <AppMenu />

        <Center
          flexDir="column"
          mt="68px"
          p="12"
          h="sm"
          borderWidth="1px"
          borderColor="white"
          borderRadius="md"
        >
          <Heading size="md">Application not found.</Heading>
          <ChakraLink as={Link} to="/">
            Click here to return to the overview.
          </ChakraLink>
        </Center>
      </Box>
    </Box>
  );
}
