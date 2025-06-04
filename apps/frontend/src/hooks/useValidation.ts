import { useState } from "react";
import { z } from "zod";

export const useValidation = <T>(schema: z.ZodSchema<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): data is T => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const getError = (field: string): string | undefined => {
    return errors[field];
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    validate,
    errors,
    getError,
    clearErrors,
  };
};
