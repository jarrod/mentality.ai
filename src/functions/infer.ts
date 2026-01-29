import { openRounterInference } from '@/lib/open-router';
import { createServerFn } from '@tanstack/react-start';

export const getServerOpenRouterInference = createServerFn({ method: 'GET' }).handler(async () => {
    return await openRounterInference();
})
