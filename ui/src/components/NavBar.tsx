import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Grid,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FlagIcon } from './FlagIcon';

export function NavBar() {
  return (
    <Box
      as="nav"
      // w="256px"
      backgroundColor="rgb(21, 21, 22)"
      borderRightWidth="thin"
      borderRightColor="rgb(38,	38,	40)"
    >
      <HStack mx="4" pt="4">
        <FlagIcon fill="orange.700" />
        <Text>Keat</Text>
      </HStack>

      <Applications />
      <Features />
      <Audiences />
    </Box>
  );
}

function Applications() {
  return (
    <>
      <Heading
        ml="4"
        mt="6"
        letterSpacing="tight"
        textTransform="uppercase"
        fontSize="12px"
      >
        Applications
      </Heading>

      <VStack mt="2" width="full" pl="8" pr="4" alignItems="flex-start">
        <Text textDecoration="underline">Blog</Text>
        <Text>TP Vision - Platform</Text>
      </VStack>
    </>
  );
}

function Features() {
  return (
    <>
      <Heading
        m="4"
        letterSpacing="tight"
        textTransform="uppercase"
        fontSize="12px"
      >
        Features
      </Heading>

      <Box mt="2" px="2">
        <InputGroup size="sm" mx="auto" w="190px">
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input placeholder="Search" focusBorderColor="blue.400" />
        </InputGroup>
      </Box>
    </>
  );
}

function Audiences() {
  const [isEditing] = useState<boolean>(false);

  return (
    <Box mx="2" mt="2" p="2">
      <Heading letterSpacing="tight" textTransform="uppercase" fontSize="12px">
        Audiences
      </Heading>

      <VStack mt="2" width="full" alignItems="flex-start">
        <HStack>
          <Checkbox
            visibility={isEditing ? 'visible' : 'hidden'}
            size="sm"
            colorScheme="orange"
          />
          <Text>Progressive</Text>
        </HStack>

        <SimpleGrid
          display={isEditing ? 'grid' : 'none'}
          columns={4}
          gap="2"
          alignContent="flex-end"
          pl="6"
        >
          <Badge colorScheme="whiteAlpha">0%</Badge>
          <Badge colorScheme="orange">1%</Badge>
          <Badge colorScheme="whiteAlpha">2%</Badge>
          <Badge colorScheme="whiteAlpha">3%</Badge>
          <Badge colorScheme="whiteAlpha">5%</Badge>
          <Badge colorScheme="whiteAlpha">8%</Badge>
          <Badge colorScheme="whiteAlpha">13%</Badge>
          <Badge colorScheme="whiteAlpha">21%</Badge>
          <Badge colorScheme="whiteAlpha">34%</Badge>
          <Badge colorScheme="whiteAlpha">55%</Badge>
          <Badge colorScheme="whiteAlpha">89%</Badge>
          <Badge colorScheme="whiteAlpha">100%</Badge>
        </SimpleGrid>

        <HStack>
          <Checkbox
            visibility={isEditing ? 'visible' : 'hidden'}
            size="sm"
            colorScheme="orange"
          />
          <Text>Staff</Text>
        </HStack>

        <Button
          Checkbox
          visibility={isEditing ? 'visible' : 'hidden'}
          w="full"
          bgColor="orange.100"
          color="orange.700"
        >
          Toggle search
        </Button>
      </VStack>
    </Box>
  );
}
