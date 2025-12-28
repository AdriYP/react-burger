export const DND_TYPES = {
  INGREDIENT: 'INGREDIENT',
  CONSTRUCTOR_INGREDIENT: 'CONSTRUCTOR_INGREDIENT',
} as const;

export type TDndType = (typeof DND_TYPES)[keyof typeof DND_TYPES];
