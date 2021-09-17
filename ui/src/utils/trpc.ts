import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../../../server/src/admin';

export const trpc = createReactQueryHooks<AppRouter>();
