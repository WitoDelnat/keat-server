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

type Props = Omit<ModalProps, 'children'> & {
  onSuccess: (name: string) => void;
};

export function ApplicationCreateModal({ isOpen, onClose, onSuccess }: Props) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(FormSchema),
  });
  const createApplication = trpc.useMutation('createApplication');

  const onSubmit = useCallback(
    async ({ name }: FormData) => {
      try {
        await createApplication.mutateAsync({ name });
        onSuccess(name);
      } catch (err) {
        console.error(err);
      } finally {
        reset();
      }
    },
    [onClose, createApplication],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="rgb(21, 21, 22)">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create application</ModalHeader>
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
                color: 'purple.700',
              }}
            >
              Close
            </Button>
            <Button
              type="submit"
              backgroundColor="purple.100"
              color="purple.700"
              _hover={{
                backgroundColor: 'purple.200',
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
