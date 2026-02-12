import type { TIngredient } from '@/types/ingredient';

export const ingredients: TIngredient[] = [
  {
    _id: '60666c42cc7b410027a1a9b1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0,
  },
  {
    _id: '60666c42cc7b410027a1a9b5',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
    __v: 0,
  },
  {
    _id: '60666c42cc7b410027a1a9b7',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    __v: 0,
  },
];

// Важно: byType в формате редьюсера ингредиентов — массивы id
export const byTypeFixture = {
  bun: ['60666c42cc7b410027a1a9b1'],
  sauce: ['60666c42cc7b410027a1a9b7'],
  main: ['60666c42cc7b410027a1a9b5'],
};

// Payload для конструктора (TIngredient + constructorId)
export const ingredient1Fixture = {
  ...ingredients[2], // sauce
  constructorId: 'cid-1',
};

export const ingredient2Fixture = {
  ...ingredients[1], // main
  constructorId: 'cid-2',
};

export const bunFixture = ingredients[0];
