import { createIcon, Icon, IconProps } from '@chakra-ui/react';
import React from 'react';

export const DividerIcon = createIcon({
  displayName: 'DividerIcon',
  viewBox: '0 0 24 24',
  path: [
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="currentColor"
      d="M16.88 3.549L7.12 20.451"
    ></path>,
  ],
});

(props: IconProps) => <Icon viewBox="0 0 24 24" fill="white" {...props}></Icon>;
