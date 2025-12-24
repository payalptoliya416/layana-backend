"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type FormValues = {
  phone: string;
  address_line_1: string;
  address_line_2: string;
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
      reset,
      trigger,
      getFieldState,
      formState,
    } = useForm<FormValues>({
        mode: "onSubmit",
  criteriaMode: "all",
      defaultValues: {
        phone: "",
        address_line_1: "",
        address_line_2: "",
        ...initialData,
      },
    });

    /* expose validation */
 useImperativeHandle(ref, () => ({
  validate: async () => {
    const isValid = await trigger(undefined, { shouldFocus: false });

    const fields: (keyof FormValues)[] = [
      "phone",
      "address_line_1",
    ];

    const errors = fields
      .map((field) => {
        const state = getFieldState(field);
        return state.error
          ? {
              section: "Contact Details",
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
      phone: data.phone ?? "",
      address_line_1: data.address_line_1 ?? "",
      address_line_2: data.address_line_2 ?? "",
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

          {/* PHONE NUMBER */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>

            <PhoneInput
              country="gb"
              value={watch("phone")}
              onChange={(value) =>
                setValue("phone", `+${value}`, {
                  shouldDirty: true,
                //   shouldValidate: true,
                })
              }
              inputClass="
                !w-full
                !h-[48px]
                !pl-[60px]
                !rounded-lg
                !border
                !border-input
                !text-sm
              "
              containerClass="!w-full"
              buttonClass="
                !border
                !border-input
                !rounded-l-lg
              "
            />

            {formState.errors.phone && (
              <p className="text-xs text-destructive mt-1">
                Phone number is required
              </p>
            )}
          </div>

          {/* ADDRESS LINE 1 */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Address Line 1<sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter address line 1"
              {...register("address_line_1", {
                required: "Address line 1 is required",
              })}
            />
            {formState.errors.address_line_1 && (
              <p className="text-xs text-destructive mt-1">
                {formState.errors.address_line_1.message}
              </p>
            )}
          </div>

          {/* ADDRESS LINE 2 */}
          <div className="xl:col-span-1">
            <label className="text-sm font-medium text-foreground">
              Address Line 2
            </label>
            <input
              className="form-input"
              placeholder="Enter address line 2"
              {...register("address_line_2")}
            />
          </div>

        </div>
      </div>
    );
  }
);

LocationContactDetails.displayName = "LocationContactDetails";
export default LocationContactDetails;
