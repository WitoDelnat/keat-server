import { Box, Text } from '@chakra-ui/layout';
import Select from 'react-select/creatable';

type Props = {
  isDisabled: boolean;
  options: string[];
  value: string;
  onChange: (value: string | null) => void;
};

export function FeatureSelect({ isDisabled, options, value, onChange }: Props) {
  return (
    <Box color="black">
      <Select
        isDisabled={isDisabled}
        value={value ? { label: value, value } : undefined}
        onChange={(option) => onChange(option?.value ?? null)}
        options={options.map((o) => ({ label: o, value: o }))}
        noOptionsMessage={() => <Text>No suggestions found</Text>}
        placeholder="Select or create feature"
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
