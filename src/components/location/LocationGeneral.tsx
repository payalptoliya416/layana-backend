"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ================= SCHEMA ================= */

const locationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  status: z.string().min(1, "Status is required"),
   slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphen separated"),
     email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"), 
  freeText: z.string().min(1, "Free text is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
});

export type LocationGeneralForm = z.infer<typeof locationSchema>;

type Props = {
  initialData?: Partial<LocationGeneralForm>;
  onChange?: (data: LocationGeneralForm) => void;
};

/* ================= COMPONENT ================= */

const LocationGeneral = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      getFieldState,
      setValue,
      formState,
    } = useForm<LocationGeneralForm>({
      resolver: zodResolver(locationSchema),
       mode: "onSubmit",
  criteriaMode: "all",
      defaultValues: {
        name: "",
        status: "",
        email :"",
        slug: "", 
        freeText: "",
        country: "",
        state: "",
        city: "",
        postcode: "",
        ...initialData,
      },
    });

    const isInitializing = useRef(true);
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

    /* ---------- expose validate ---------- */
  useImperativeHandle(ref, () => ({
  validate: async () => {
    const isValid = await trigger(undefined, { shouldFocus: false });

    const fields: (keyof LocationGeneralForm)[] = [
      "name",
      "status",
      "freeText",
       "slug",
      "email",
      "country",
      "state",
      "city",
      "postcode",
    ];

    const errors = fields
      .map((field) => {
        const state = getFieldState(field);
        return state.error
          ? {
              section: "General",
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

    useEffect(() => {
      isInitializing.current = false;
    }, []);

    useEffect(() => {
      const sub = watch((v) => onChange?.(v as LocationGeneralForm));
      return () => sub.unsubscribe();
    }, [watch, onChange]);

    /* ================= UI ================= */

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Location Name */}
       <div>
  <label className="text-sm font-medium">
    Location Name<sup className="text-destructive">*</sup>
  </label>

  <input
    className="form-input"
    placeholder="Enter location name"
    {...register("name", {
      onChange: (e) => {
        const value = e.target.value;

        setValue("slug", slugify(value), {
          shouldDirty: true,
          shouldValidate: true,
        });
      },
    })}
  />

  {formState.errors.name && (
    <p className="text-xs text-destructive mt-1">
      {formState.errors.name.message}
    </p>
  )}
</div>


        <div>
  <label className="text-sm font-medium">
   Slug<sup className="text-destructive">*</sup>
  </label>

  <input
    className="form-input"
    placeholder="Enter location name"
    {...register("slug", {
      onChange: (e) => {
        const value = e.target.value;

        setValue("slug", slugify(value), {
          shouldDirty: true,
          shouldValidate: true,
        });
      },
    })}
  />

  {formState.errors.name && (
    <p className="text-xs text-destructive mt-1">
      {formState.errors.name.message}
    </p>
  )}
</div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">
              Status<sup className="text-destructive">*</sup>
            </label>
            <select className="form-input" {...register("status")}>
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {formState.errors.status && <p className="text-xs text-destructive mt-1">{formState.errors.status.message}</p>}
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

  {formState.errors.email && (
    <p className="text-xs text-destructive mt-1">
      {formState.errors.email.message}
    </p>
  )}
</div>

          {/* Free Text */}
          <div>
            <label className="text-sm font-medium">
              Free Text<sup className="text-destructive">*</sup>
            </label>
            <select className="form-input" {...register("freeText")}>
              <option value="">Select free text</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {formState.errors.freeText && <p className="text-xs text-destructive mt-1">{formState.errors.freeText.message}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="text-sm font-medium">
              Country<sup className="text-destructive">*</sup>
            </label>
            <select className="form-input" {...register("country")}>
              <option value="">Select country</option>
              <option value="India">India</option>
              <option value="UK">United Kingdom</option>
            </select>
            {formState.errors.country && <p className="text-xs text-destructive mt-1">{formState.errors.country.message}</p>}
          </div>

          {/* State */}
          <div>
            <label className="text-sm font-medium">
              State<sup className="text-destructive">*</sup>
            </label>
            <input className="form-input" placeholder="Enter state" {...register("state")} />
            {formState.errors.state && <p className="text-xs text-destructive mt-1">{formState.errors.state.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium">
              City<sup className="text-destructive">*</sup>
            </label>
            <input className="form-input" placeholder="Enter city" {...register("city")} />
            {formState.errors.city && <p className="text-xs text-destructive mt-1">{formState.errors.city.message}</p>}
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
            {formState.errors.postcode && (
              <p className="text-xs text-destructive mt-1">{formState.errors.postcode.message}</p>
            )}
          </div>

        </div>
      </div>
    );
  }
);

LocationGeneral.displayName = "LocationGeneral";
export default LocationGeneral;
