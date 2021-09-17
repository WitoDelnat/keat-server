import {
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { isNumber, isString, startCase } from 'lodash';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';
import type { Feature } from '../utils/types';

type Props = Omit<ModalProps, 'children'> & {
  application: string;
  availableAudiences: string[];
  feature: Feature;
};

const percentages = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100];

type FormData = {
  enabled: boolean;
  rollout: number | null;
  custom: string[];
};

export function ToggleModal({
  application,
  availableAudiences,
  feature,
  isOpen,
  onClose,
}: Props) {
  const variant = useBreakpointValue({ base: 'full', md: 'md' });
  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      enabled: !isDisabled(feature),
      rollout: feature.audiences.find(isNumber),
      custom: feature.audiences.filter(isString),
    },
  });
  const watchRollout = watch('rollout');
  const toggle = trpc.useMutation('toggle');

  const onToggleProgressive = useCallback(() => {
    if (watchRollout === null) {
      setValue('rollout', 1);
    } else {
      setValue('rollout', null);
    }
  }, [setValue, watchRollout]);

  const onSubmit = useCallback(
    async ({ rollout, custom }: FormData) => {
      try {
        const audiences = rollout ? [rollout, ...custom] : custom;

        await toggle.mutateAsync({
          application,
          feature: feature.name,
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
            <Heading
              letterSpacing="tight"
              textTransform="uppercase"
              fontSize="12px"
            >
              Enabled
            </Heading>

            <Controller
              name="enabled"
              control={control}
              render={({ field }) => (
                <RadioGroup value={field.value ? 'everyone' : 'nobody'}>
                  <Stack spacing={5} direction="row">
                    <Radio colorScheme="orange" value={'nobody'}>
                      Yes
                    </Radio>
                    <Radio colorScheme="orange" value={'everyone'}>
                      No
                    </Radio>
                  </Stack>
                </RadioGroup>
              )}
            />

            <Heading
              letterSpacing="tight"
              textTransform="uppercase"
              fontSize="12px"
            >
              Progressive rollout
            </Heading>

            <Checkbox
              my="2"
              isChecked={watchRollout !== null}
              onChange={onToggleProgressive}
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

            {availableAudiences.length === 0 ? undefined : (
              <>
                <Heading
                  mt="3"
                  letterSpacing="tight"
                  textTransform="uppercase"
                  fontSize="12px"
                >
                  Audiences
                </Heading>

                <Controller
                  name="custom"
                  control={control}
                  defaultValue={feature.audiences.filter(isString)}
                  render={({ field }) => (
                    <CheckboxGroup
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      <SimpleGrid pt="2" columns={[1, 2]} gap="2" w="full">
                        {availableAudiences.map((audience) => (
                          <Checkbox key={audience} value={audience}>
                            {startCase(audience)}
                          </Checkbox>
                        ))}
                      </SimpleGrid>
                    </CheckboxGroup>
                  )}
                />
              </>
            )}

            <Text
              mt="3"
              letterSpacing="tight"
              fontSize="12px"
              fontWeight="light"
              decoration="underline"
            >
              add custom audience
            </Text>
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
