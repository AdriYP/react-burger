import { useState } from 'react';

type TFormValues = Record<string, unknown>;

type TUseFormReturn<T extends TFormValues> = {
  values: T;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
};

export function useForm<T extends TFormValues = TFormValues>(
  inputValues: T = {} as T
): TUseFormReturn<T> {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  };

  return { values, handleChange, setValues };
}
