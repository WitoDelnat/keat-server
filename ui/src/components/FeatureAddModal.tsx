import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../utils/trpc';

type FormData = z.infer<typeof FormSchema>;
const FormSchema = z.object({
  name: z.string().min(1),
});

type Props = Omit<ModalProps, 'children'> & { application: string };

export function FeatureAddModal({ application, isOpen, onClose }: Props) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(FormSchema),
  });
  const addFeature = trpc.useMutation('addFeature');

  const onSubmit = useCallback(
    async ({ name }: FormData) => {
      try {
        await addFeature.mutateAsync({ application, name, audiences: [] });
      } catch (err) {
        console.error(err);
      } finally {
        onClose();
        reset();
      }
    },
    [onClose, addFeature],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="rgb(21, 21, 22)">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add feature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input placeholder="name" {...register('name')} />
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
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
