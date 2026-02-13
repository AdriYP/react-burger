import type { RootState } from '@/services/store';

type TStateOverrides = Partial<RootState>;

//Собирает RootState для unit-тестов селекторов.

export const makeRootState = (overrides: TStateOverrides = {}): RootState => {
  const base = {
    ingredients: {} as RootState['ingredients'],
    constructorItems: {} as RootState['constructorItems'],
    order: {} as RootState['order'],
    auth: {} as RootState['auth'],
    feedOrders: {} as RootState['feedOrders'],
    userOrders: {} as RootState['userOrders'],
  } satisfies RootState;

  return { ...base, ...overrides } as RootState;
};
