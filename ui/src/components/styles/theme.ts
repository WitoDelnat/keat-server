import { extendTheme } from '@chakra-ui/react';

export type Theme = typeof theme;

export const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'rgb(15,15,16)',
        color: '#E5E5E5',
      },
    },
  },
  components: {
    Heading: {
      variants: {
        uptight: {
          letterSpacing: 'tight',
          textTransform: 'uppercase',
          fontSize: '12px',
        },
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: 'orange',
      },
      baseStyle: {
        control: {
          _checked: {
            bg: `orange.100`,
            borderColor: `orange.100`,
            color: 'orange.700',

            _hover: {
              bg: `orange.200`,
              borderColor: `orange.200`,
            },

            _disabled: {
              borderColor: 'gray.200',
              bg: 'gray.200',
              color: 'gray.500',
            },
          },
        },
      },
    },
  },
});
