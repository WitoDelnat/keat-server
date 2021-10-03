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
  Switch,
  useBreakpointValue,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isNumber, isString } from 'lodash';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../utils/trpc';
import type { Feature } from '../utils/types';
import { AudienceSelect } from './AudienceSelect';

type Props = Omit<ModalProps, 'children'> & {
  application: string;
  feature: Feature;
};

const percentages = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100];

type FormData = z.infer<typeof FormSchema>;
const FormSchema = z.object({
  enabled: z.boolean(),
  rollout: z.number().optional(),
  groups: z.array(z.string()),
});

export function ToggleModal({ application, feature, isOpen, onClose }: Props) {
  const variant = useBreakpointValue({ base: 'full', md: 'md' });
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      enabled: !isDisabled(feature),
      rollout: feature.audiences.find(isNumber),
      groups: feature.audiences.filter(isString) ?? [],
    },
    resolver: zodResolver(FormSchema),
  });
  const watchRollout = watch('rollout');
  const toggle = trpc.useMutation('toggleFeature');

  const onSubmit = useCallback(
    async (form: FormData) => {
      try {
        const audiences = determineAudiences(form);

        await toggle.mutateAsync({
          application,
          name: feature.name,
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
            <FormControl display="flex" mb="3">
              <FormLabel
                letterSpacing="tight"
                textTransform="uppercase"
                fontSize="12px"
              >
                Enable
              </FormLabel>
              <Controller
                name="enabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    colorScheme="orange"
                    isChecked={field.value}
                    onChange={() => field.onChange(!field.value)}
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

function isDisabled(feature: Feature): boolean {
  return (
    feature.audiences.length === 0 ||
    feature.audiences.some((a) => a === 'nobody' || false)
  );
}

function determineAudiences({
  enabled,
  rollout,
  groups,
}: FormData): Array<boolean | number | string> {
  if (!enabled) {
    return [false];
  }
  if (!rollout && groups.length === 0) {
    return [true];
  }
  return rollout ? [rollout, ...groups] : groups;
}
