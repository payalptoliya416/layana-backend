"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import DescriptionEditor from "../treatment/DescriptionEditor";

type FormValues = {
  business_type: string;
  business_additional: string;
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
      formState: { errors },
    } = useForm<FormValues>({
      mode: "onSubmit",
      defaultValues: {
        business_type: "",
        business_additional: "",
        parking_details: "",
        ...initialData,
      },
    });

    /* expose validation */
   useImperativeHandle(ref, () => ({
  validate: async () => {
    const valid = await trigger();

    const customErrors = [];

    if (!watch("parking_details")) {
      customErrors.push({
        section: "Business & Parking",
        message: "Parking details are required",
      });
    }

    return {
      valid: valid && customErrors.length === 0,
      errors: customErrors,
    };
  },

  // ✅ KEY FIX FOR EDIT MODE
  setData: (data: Partial<FormValues>) => {
    reset({
      business_type: data.business_type ?? "",
      business_additional: data.business_additional ?? "",
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

        {/* BUSINESS FIELDS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              Business Type<sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="e.g. Message"
              {...register("business_type", {
                required: "Business type is required",
              })}
            />
            {errors.business_type && (
              <p className="text-xs text-destructive mt-1">
                {errors.business_type.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Business Additional Info<sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Additional business info"
              {...register("business_additional", {
                required: "Additional business info is required",
              })}
            />
            {errors.business_additional && (
              <p className="text-xs text-destructive mt-1">
                {errors.business_additional.message}
              </p>
            )}
          </div>
        </div>

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
