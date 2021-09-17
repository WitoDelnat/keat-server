import { createIcon, Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

export const FlagIcon = createIcon({
  displayName: 'FlagIcon',
  viewBox: '0 0 24 24',
  path: [
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>,
  ],
});

(props: IconProps) => <Icon viewBox="0 0 24 24" fill="white" {...props}></Icon>;
