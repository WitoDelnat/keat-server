import { extendTheme } from '@chakra-ui/react';

export type Theme = typeof theme;

export const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: 'false',
  styles: {
    global: {
      'html, body': {
        backgroundColor: '#1c1d1f',
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
    Menu: {
      baseStyle: {
        list: {
          bgGradient: 'linear(to-b, #28292c, rgba(39,40,43,0.82) )',
          borderWidth: 1,
        },
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: 'purple',
      },
      baseStyle: {
        control: {
          _checked: {
            bg: `purple.100`,
            borderColor: `purple.100`,
            color: 'purple.700',

            _hover: {
              bg: `purple.200`,
              borderColor: `purple.200`,
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
