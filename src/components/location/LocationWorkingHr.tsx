"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  opening_time: string;
  closing_time: string;
  clock_in_threshold: string;
  clock_out_threshold: string;
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
      getFieldState,
      formState,
    } = useForm<FormValues>({
        mode: "onSubmit",
  criteriaMode: "all",
      defaultValues: {
        opening_time: "",
        closing_time: "",
        clock_in_threshold: "",
        clock_out_threshold: "",
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
      "clock_in_threshold",
      "clock_out_threshold",
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

          {/* CLOCK IN THRESHOLD */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Clock-In Threshold (min)<sup className="text-destructive">*</sup>
            </label>
            <input
              type="number"
              min={0}
              className="form-input"
              placeholder="Enter clock-in threshold"
              {...register("clock_in_threshold", {
                required: "Clock-in threshold required",
              })}
            />
            {formState.errors.clock_in_threshold && (
              <p className="text-xs text-destructive mt-1">
                {formState.errors.clock_in_threshold.message}
              </p>
            )}
          </div>

          {/* CLOCK OUT THRESHOLD */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Clock-Out Threshold (min)<sup className="text-destructive">*</sup>
            </label>
            <input
              type="number"
              min={0}
              className="form-input"
              placeholder="Enter clock-out threshold"
              {...register("clock_out_threshold", {
                required: "Clock-out threshold required",
              })}
            />
            {formState.errors.clock_out_threshold && (
              <p className="text-xs text-destructive mt-1">
                {formState.errors.clock_out_threshold.message}
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
