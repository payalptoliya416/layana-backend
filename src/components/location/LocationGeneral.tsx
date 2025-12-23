"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ================= SCHEMA ================= */

const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
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
      setValue,
      watch,
      formState: { errors },
      trigger,
      getValues,
    } = useForm<LocationGeneralForm>({
      resolver: zodResolver(locationSchema),
      defaultValues: {
        name: "",
        slug: "",
        email: "",
        ...initialData,
      },
    });

    /* ---------- refs for slug control ---------- */
    const slugEditedRef = useRef(false);
    const isInitializing = useRef(true);

    /* ---------- expose validate() to parent ---------- */
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const valid = await trigger();
        if (!valid) {
          return {
            valid: false,
            errors: Object.entries(errors).map(([field, err]) => ({
              section: "General",
              field,
              message: err?.message || "Invalid value",
            })),
          };
        }
        return { valid: true, errors: [] };
      },
    }));

    /* ---------- mark init done ---------- */
    useEffect(() => {
      isInitializing.current = false;
    }, []);

    /* ---------- watch & propagate ---------- */
    useEffect(() => {
      const subscription = watch((value) => {
        onChange?.(value as LocationGeneralForm);
      });
      return () => subscription.unsubscribe();
    }, [watch, onChange]);

    /* ================= UI ================= */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Name<sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter location name"
              {...register("name", {
                onBlur: (e) => {
                  if (isInitializing.current || slugEditedRef.current) return;
                  const value = e.target.value;
                  if (!value) return;

                  setValue("slug", slugify(value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Slug<sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter slug"
              {...register("slug", {
                onChange: () => {
                  slugEditedRef.current = true;
                },
              })}
            />
            {errors.slug && (
              <p className="text-xs text-destructive mt-1">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

LocationGeneral.displayName = "LocationGeneral";

export default LocationGeneral;
