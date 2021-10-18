import { TriangleDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react';
import { DarkMode } from '@chakra-ui/system';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { trpc } from '../utils/trpc';
import { ApplicationCreateModal } from './ApplicationCreateModal';
import { DividerIcon } from './icons/DividerIcon';

export function AppMenu() {
  const { application } = useParams();
  const navigate = useNavigate();
  const {
    isLoading,
    data: names,
    refetch,
  } = trpc.useQuery(['getApplicationNames']);

  const currentApplication = useMemo(() => {
    return names?.find((n) => n.toLowerCase() === application);
  }, [names, application]);

  const newAppDisclosure = useDisclosure();

  if (isLoading || !names || !currentApplication) {
    return (
      <HStack>
        <Heading cursor="pointer" py="3" onClick={() => navigate('/')}>
          Keat
        </Heading>
      </HStack>
    );
  }

  return (
    <>
      <HStack as="nav">
        <Heading cursor="nw-resizecursor" py="3" onClick={() => navigate('/')}>
          Keat
        </Heading>
        <DividerIcon w="8" h="8" color="white" />

        <DarkMode>
          <Menu gutter={2}>
            <MenuButton>
              <HStack>
                <Heading py="3">{currentApplication}</Heading>
                <TriangleDownIcon pt="2" />
              </HStack>
            </MenuButton>
            <MenuList>
              {names.map((appName) => (
                <MenuItem
                  key={appName}
                  onClick={() => navigate(`/${appName.toLowerCase()}`)}
                >
                  {appName}
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

      <ApplicationCreateModal
        isOpen={newAppDisclosure.isOpen}
        onClose={newAppDisclosure.onClose}
        onSuccess={async (name) => {
          await refetch();
          newAppDisclosure.onClose();
          navigate(`/${name.toLowerCase()}`);
        }}
      />
    </>
  );
}
