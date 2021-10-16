import { Box, Text } from '@chakra-ui/layout';
import Select from 'react-select/creatable';

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: Option[];
  onChange: (value: readonly Option[]) => void;
};

export function AudienceSelect({ options, value, onChange }: Props) {
  return (
    <Box color="black">
      <Select
        isMulti
        value={value}
        onChange={onChange}
        options={options}
        closeMenuOnSelect={false}
        noOptionsMessage={() => <Text>No suggestions found</Text>}
        placeholder="Your awesome audiences"
        components={
          options.length === 0
            ? {
                DropdownIndicator: null,
              }
            : undefined
        }
      />
    </Box>
  );
}
