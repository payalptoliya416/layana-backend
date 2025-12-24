"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  opening_time: string;
  closing_time: string;
};

type Props = {
  initialData?: Partial<FormValues>;
  onChange?: (data: FormValues) => void;
};

const LocationWorkingHr = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      reset,
      getFieldState,
      formState,
    } = useForm<FormValues>({
        mode: "onSubmit",
       criteriaMode: "all",
      defaultValues: {
        opening_time: "",
        closing_time: "",
        ...initialData,
      },
    });

    /* expose validation */
useImperativeHandle(ref, () => ({
  validate: async () => {
    const isValid = await trigger(undefined, { shouldFocus: false });

    const fields: (keyof FormValues)[] = [
      "opening_time",
      "closing_time",
    ];

    const errors = fields
      .map((field) => {
        const state = getFieldState(field);
        return state.error
          ? {
              section: "Working Hours",
              message: state.error.message || "Invalid value",
            }
          : null;
      })
      .filter(Boolean);

    return {
      valid: isValid && errors.length === 0,
      errors,
    };
  },

  // ✅ KEY FIX FOR EDIT MODE
  setData: (data: Partial<FormValues>) => {
    reset({
      opening_time: data.opening_time ?? "",
      closing_time: data.closing_time ?? "",
    });
  },
}));

    /* propagate changes */
    useEffect(() => {
      const sub = watch((v) => onChange?.(v as FormValues));
      return () => sub.unsubscribe();
    }, [watch, onChange]);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* OPENING HOURS */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Opening Hours<sup className="text-destructive">*</sup>
            </label>
            <input
              type="time"
              className="form-input"
              {...register("opening_time", {
                required: "Opening hours required",
              })}
            />
            {formState.errors.opening_time && (
              <p className="text-xs text-destructive mt-1">
                {formState.errors.opening_time.message}
              </p>
            )}
          </div>

          {/* CLOSING HOURS */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Closing Hours<sup className="text-destructive">*</sup>
            </label>
            <input
              type="time"
              className="form-input"
              {...register("closing_time", {
                required: "Closing hours required",
              })}
            />
            {formState.errors.closing_time && (
              <p className="text-xs text-destructive mt-1">
                {formState.errors.closing_time.message}
              </p>
            )}
          </div>

        </div>
      </div>
    );
  }
);

LocationWorkingHr.displayName = "LocationWorkingHr";
export default LocationWorkingHr;
