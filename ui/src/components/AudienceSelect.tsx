import { Box } from '@chakra-ui/layout';
import Select from 'react-select/creatable';

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: Option[];
  onChange: (value: readonly Option[]) => void;
};

export function AudienceSelect({ value, onChange }: Props) {
  return (
    <Box color="black">
      <Select
        isMulti
        value={value}
        onChange={onChange}
        placeholder="Select or create a group"
        components={{
          DropdownIndicator: null,
        }}
      />
    </Box>
  );
}
