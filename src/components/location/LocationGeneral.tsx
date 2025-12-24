"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
      reset,
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
        country: "UK",
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

  // ✅ THIS IS THE KEY FIX
  setData: (data: Partial<LocationGeneralForm>) => {
    reset({
      name: data.name ?? "",
      slug: data.slug ?? "",
      status: data.status ?? "",
      email: data.email ?? "",
      freeText: data.freeText ?? "",
      country: data.country ?? "UK",
      state: data.state ?? "",
      city: data.city ?? "",
      postcode: data.postcode ?? "",
    });
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

</div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">
              Status<sup className="text-destructive">*</sup>
            </label>
            <Select
            value={watch("status")}
            onValueChange={(v) =>
              setValue("status", v as "active" | "inactive", {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="form-input">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        
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

          {/* Free Text */}
                  <div>
          <label className="text-sm font-medium">
            Free Text<sup className="text-destructive">*</sup>
          </label>

          <input
            className="form-input"
            placeholder="Enter free text"
            {...register("freeText")}
          />

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

          {/* State */}
          <div>
            <label className="text-sm font-medium">
              State<sup className="text-destructive">*</sup>
            </label>
            <input className="form-input" placeholder="Enter state" {...register("state")} />
           
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium">
              City<sup className="text-destructive">*</sup>
            </label>
            <input className="form-input" placeholder="Enter city" {...register("city")} />
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

LocationGeneral.displayName = "LocationGeneral";
export default LocationGeneral;
