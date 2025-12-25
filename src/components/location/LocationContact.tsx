"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const locationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().min(8, "Enter valid phone number"),
  address_line_1: z.string().min(5, "Address line 1 must be at least 5 characters"),
  address_line_2: z.string().min(3, "Address line 2 must be at least 3 characters"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
});

type FormValues = z.infer<typeof locationSchema>;

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
      formState: { errors },
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
    // useImperativeHandle(ref, () => ({
    //   validate: async () => {
    //     const isValid = await trigger(undefined, { shouldFocus: false });

    //     const fields: (keyof FormValues)[] = [
    //       "phone",
    //       "address_line_1",
    //       "address_line_2",
    //     ];

    //     const errors = fields
    //       .map((field) => {
    //         const state = getFieldState(field);
    //         return state.error
    //           ? {
    //               section: "Contact Details",
    //               message: state.error.message || "Invalid value",
    //             }
    //           : null;
    //       })
    //       .filter(Boolean);

    //     return {
    //       valid: isValid && errors.length === 0,
    //       errors,
    //     };
    //   },

    //   setData: (data: Partial<FormValues>) => {
    //     reset({
    //       phone: data.phone ?? "",
    //       address_line_1: data.address_line_1 ?? "",
    //       address_line_2: data.address_line_2 ?? "",
    //     });
    //   },
    // }));

     useImperativeHandle(ref, () => ({
      validate: async () => {
        const valid = await trigger(undefined, { shouldFocus: false });

        const errorList = Object.values(errors).map((e) => ({
          section: "Contact Details",
          message: e?.message || "Invalid value",
        }));

        return {
          valid,
          errors: errorList,
        };
      },

      setData: (data: Partial<FormValues>) => {
        reset({ ...data });
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
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
                },
              })}
            />

          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">
              Email<sup className="text-destructive">*</sup>
            </label>

            <input
              type="email"
              className="form-input"
              placeholder="e.g. info@example.com"
              {...register("email")}
            />

          </div>

          {/* ADDRESS LINE 2 */}
          <div className="xl:col-span-1">
            <label className="text-sm font-medium text-foreground">
              Address Line 2<sup className="text-destructive">*</sup>
            </label>

            <input
              className="form-input"
              placeholder="Enter address line 2"
              {...register("address_line_2", {
                 required: "Address line 2 is required",
                minLength: {
                  value: 3,
                  message: "Address line 2 must be at least 3 characters",
                },
              })}
            />
          </div>

           {/* PHONE NUMBER */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Phone Number<sup className="text-destructive">*</sup>
            </label>

        <div className="phone-input-wrapper">
  <PhoneInput
    country="gb"
    value={watch("phone")}
    onChange={(value) =>
      setValue("phone", `+${value}`, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
    inputClass="
      !w-full
      !h-[48px]
      !pl-[60px]
      !rounded-lg
      !border
      !text-sm
    "
    containerClass="!w-full"
    buttonClass="!border !rounded-l-lg"
  />
</div>

            {/* hidden input for RHF validation */}
            <input
              type="hidden"
              {...register("phone", {
                required: "Phone number is required",
                minLength: {
                  value: 8,
                  message: "Enter a valid phone number",
                },
              })}
            />
          </div>
          
          {/* City */}
          <div>
            <label className="text-sm font-medium">
              City<sup className="text-destructive">*</sup>
            </label>
            <input className="form-input" placeholder="Enter city" {...register("city")} />
          </div>

           {/* State */}
          <div>
            <label className="text-sm font-medium">
              State<sup className="text-destructive">*</sup>
            </label>
            <input className="form-input" placeholder="Enter state" {...register("state")} />
           
          </div>

             {/* Country */}
          <div>
                      <label className="text-sm font-medium">
                        Country<sup className="text-destructive">*</sup>
                      </label>
                      <Select
                    value={watch("country")}
                    onValueChange={(v) =>
                      setValue("country", v, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
          
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                   
           </div>

          {/* Postcode */}
          <div>
            <label className="text-sm font-medium">
              Postcode<sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter postcode"
              {...register("postcode")}
            />
          
          </div>

        </div>
      </div>
    );
  }
);

LocationContactDetails.displayName = "LocationContactDetails";
export default LocationContactDetails;
