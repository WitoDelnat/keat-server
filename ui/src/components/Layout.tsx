import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
  Heading,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { capitalize } from 'lodash';
import React, { ReactNode, useState } from 'react';
import type { Application } from '../../../server/src/admin';

const SIDEBAR_SIZE = '220px';

export function Layout({
  title,
  applications,
  children,
}: {
  title: string;
  applications: Application[];
  children: ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const variants = useBreakpointValue<{
    navigation: 'drawer' | 'sidebar';
    navigationButton: boolean;
  }>({
    base: { navigation: 'drawer', navigationButton: true },
    md: { navigation: 'sidebar', navigationButton: false },
  });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      <Sidebar
        variant={variants?.navigation ?? 'drawer'}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      >
        <HStack mt="2" mb="5" alignItems="flex-end">
          <Heading color="orange.100" size="lg">
            Keat
          </Heading>
        </HStack>

        <Heading mt="3" variant="uptight">
          Applications
        </Heading>

        <VStack mt="2" mx="2" alignItems="flex-start">
          {applications.length === 0 ? (
            <Text>No applications found</Text>
          ) : (
            applications.map((application) => {
              return <Text cursor="pointer">{application.name}</Text>;
            })
          )}
        </VStack>
      </Sidebar>

      <Box
        as="main"
        ml={variants?.navigation === 'sidebar' ? SIDEBAR_SIZE : 0}
        backgroundColor="rgb(15,15,16)"
        p="8"
        height="100vh"
        overflow="auto"
      >
        <HStack mb="4">
          {variants?.navigation === 'drawer' && (
            <IconButton
              aria-label="show sidebar"
              icon={<HamburgerIcon w={8} h={8} />}
              colorScheme="#E5E5E5"
              onClick={toggleSidebar}
            />
          )}
          <Heading
            mb="4"
            pb="1.5"
            w="full"
            size="md"
            borderBottomWidth="thin"
            borderBottomColor="#E5E5E5"
          >
            {capitalize(title)}
          </Heading>
        </HStack>
        {children}
      </Box>
    </>
  );
}

type SidebarProps = Omit<DrawerProps, 'variant'> & {
  variant: 'drawer' | 'sidebar';
  children: ReactNode;
};

function Sidebar({ isOpen, variant, onClose, children }: SidebarProps) {
  return variant === 'sidebar' ? (
    <Box
      as="nav"
      position="fixed"
      left={0}
      w={SIDEBAR_SIZE}
      top={0}
      h="100%"
      px="4"
      backgroundColor="rgb(21, 21, 22)"
      borderRightWidth="thin"
      borderRightColor="rgb(38,	38,	40)"
    >
      {children}
    </Box>
  ) : (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent
          backgroundColor="rgb(21, 21, 22)"
          borderRightWidth="thin"
          borderRightColor="rgb(38,	38,	40)"
        >
          <DrawerCloseButton />
          <DrawerBody mt="16">{children}</DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}
