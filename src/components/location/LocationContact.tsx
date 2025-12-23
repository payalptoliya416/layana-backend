"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type FormValues = {
  phone: string;
  business_type: string;
  business_additional: string;
  parking_details: string;
};

type Props = {
  initialData?: Partial<FormValues>;
  onChange?: (data: FormValues) => void;
};

const LocationContactDetails = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const {
      register,
      setValue,
      watch,
      trigger,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
        phone: "",
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
        if (!valid) {
          return {
            valid: false,
            errors: Object.entries(errors).map(([field, err]) => ({
              section: "Contact Details",
              field,
              message: err?.message || "Invalid value",
            })),
          };
        }
        return { valid: true, errors: [] };
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
          {/* PHONE */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Phone Number<sup className="text-destructive">*</sup>
            </label>

            <PhoneInput
              country={"gb"}
              value={watch("phone")}
              onChange={(value) =>
                setValue("phone", `+${value}`, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              inputClass="!w-full !h-[44px] !pl-[58px] !border !border-input !rounded-lg"
              containerClass="!w-full"
              buttonClass="!border !border-input !rounded-l-lg"
            />

            {errors.phone && (
              <p className="text-xs text-destructive mt-1">
                Phone number is required
              </p>
            )}
          </div>

          {/* BUSINESS TYPE */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Business Type
            </label>
            <input
              className="form-input"
              placeholder="Message"
              {...register("business_type")}
            />
          </div>

          {/* BUSINESS ADDITIONAL */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Additional Business Info
            </label>
            <input
              className="form-input"
              placeholder="Additional business info"
              {...register("business_additional")}
            />
          </div>

          {/* PARKING DETAILS */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Parking Details
            </label>
            <input
              className="form-input"
              placeholder="Free parking available"
              {...register("parking_details")}
            />
          </div>
        </div>
      </div>
    );
  }
);

LocationContactDetails.displayName = "LocationContactDetails";
export default LocationContactDetails;
