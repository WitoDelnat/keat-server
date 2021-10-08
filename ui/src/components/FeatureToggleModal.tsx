import {
  Badge,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isNumber, isString } from 'lodash';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Feature } from '../../../server/src/admin';
import { trpc } from '../utils/trpc';
import { AudienceSelect } from './AudienceSelect';
import { FeatureSelect } from './FeatureSelect';

type Props = Omit<ModalProps, 'children'> & {
  application: string;
  suggestedAudiences: string[];
  suggestedFeatures: string[];
  feature: Feature | null;
};

const percentages = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100];

type FormData = z.infer<typeof FormSchema>;
const FormSchema = z.object({
  name: z.string(),
  rollout: z.number().optional(),
  groups: z.array(z.string()),
});

export function ToggleModal({
  application,
  suggestedFeatures,
  suggestedAudiences,
  feature,
  isOpen,
  onClose,
}: Props) {
  const variant = useBreakpointValue({ base: 'full', md: 'md' });
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: feature?.name,
      rollout: feature?.audiences.find(isNumber),
      groups: feature?.audiences.filter(isString) ?? [],
    },
    resolver: zodResolver(FormSchema),
  });
  const watchRollout = watch('rollout');
  const toggle = trpc.useMutation('toggleFeature');

  const onSubmit = useCallback(
    async ({ name, rollout, groups }: FormData) => {
      try {
        const audiences = rollout ? [rollout, ...groups] : groups;

        await toggle.mutateAsync({
          application,
          name,
          audiences,
        });
      } catch (err) {
        console.error(err);
      } finally {
        onClose();
      }
    },
    [onClose, toggle],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={variant}>
      <ModalOverlay />
      <ModalContent bgColor="rgb(21, 21, 22)">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Toggle feature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="3">
              <FormLabel
                letterSpacing="tight"
                textTransform="uppercase"
                fontSize="12px"
              >
                Name
              </FormLabel>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <FeatureSelect
                    isDisabled={Boolean(feature)}
                    options={suggestedFeatures}
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl mb="3">
              <FormLabel
                letterSpacing="tight"
                textTransform="uppercase"
                fontSize="12px"
              >
                Groups
              </FormLabel>

              <Controller
                name="groups"
                control={control}
                render={({ field }) => (
                  <AudienceSelect
                    options={suggestedAudiences.map((value) => ({
                      label: value,
                      value,
                    }))}
                    value={field.value.map((value) => ({
                      label: value,
                      value,
                    }))}
                    onChange={(v) => {
                      field.onChange(v.map((option) => option.value));
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl>
              <FormLabel
                letterSpacing="tight"
                textTransform="uppercase"
                fontSize="12px"
              >
                Progressive rollout
              </FormLabel>

              <Checkbox
                mb="2"
                isChecked={watchRollout !== undefined}
                onChange={() =>
                  setValue(
                    'rollout',
                    typeof watchRollout === 'number' ? undefined : 1,
                  )
                }
              >
                Enable
              </Checkbox>

              <Controller
                name="rollout"
                control={control}
                render={({ field }) => (
                  <SimpleGrid
                    py="1"
                    columns={[3, 4]}
                    gap="2"
                    justifyContent="center"
                  >
                    {percentages.map((p) => {
                      const selected = field.value === p;
                      return (
                        <Badge
                          key={p}
                          textAlign="center"
                          p="1"
                          colorScheme={selected ? 'orange' : 'whiteAlpha'}
                          cursor="pointer"
                          onClick={() => field.onChange(p)}
                        >
                          {p}%
                        </Badge>
                      );
                    })}
                  </SimpleGrid>
                )}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              variant="ghost"
              onClick={onClose}
              _hover={{
                backgroundColor: 'rgb(21, 21, 22)',
                color: 'orange.700',
              }}
            >
              Close
            </Button>
            <Button
              type="submit"
              backgroundColor="orange.100"
              color="orange.700"
              _hover={{
                backgroundColor: 'orange.200',
              }}
            >
              Toggle
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
