import { useState, useCallback } from 'react';

export function useFormState(action: any, initialState: any) {
  const [state, setState] = useState(initialState);

  const formAction = useCallback(async (formData: FormData) => {
    const result = await action(state, formData);
    setState(result);
    return result;
  }, [action, state]);

  return [state, formAction] as const;
}
