"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import DescriptionEditor from "../treatment/DescriptionEditor";

type FormValues = {
  parking_details: string;
};

type Props = {
  initialData?: Partial<FormValues>;
  onChange?: (data: FormValues) => void;
};

const ParkingDetails = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      reset,
      setValue,
      getFieldState,
      formState: { errors },
    } = useForm<FormValues>({
      mode: "onSubmit",
      criteriaMode: "all",
      defaultValues: {
        parking_details: "",
        ...initialData,
      },
    });

    /* expose validation */
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const isValid = await trigger(undefined, { shouldFocus: false });

        const fields: (keyof FormValues)[] = [
          "parking_details",
        ];

        const validationErrors = fields
          .map((field) => {
            const state = getFieldState(field);
            return state.error
              ? {
                  section: "Business & Parking",
                  message: state.error.message || "Invalid value",
                }
              : null;
          })
          .filter(Boolean);

        return {
          valid: isValid && validationErrors.length === 0,
          errors: validationErrors,
        };
      },

      setData: (data: Partial<FormValues>) => {
        reset({
          parking_details: data.parking_details ?? "",
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

        {/* PARKING DETAILS */}
        <div>
          <label className="text-sm font-medium">
            Parking Details<sup className="text-destructive">*</sup>
          </label>

          <DescriptionEditor
            value={watch("parking_details") || ""}
            onChange={(val) =>
              setValue("parking_details", val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />

          {/* Hidden register for validation */}
          <input
            type="hidden"
            {...register("parking_details", {
              required: "Parking details are required",
            })}
          />

          {errors.parking_details && (
            <p className="text-xs text-destructive mt-1">
              {errors.parking_details.message}
            </p>
          )}
        </div>
      </div>
    );
  }
);

ParkingDetails.displayName = "ParkingDetails";
export default ParkingDetails;
