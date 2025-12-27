"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SwitchToggle from "../treatment/Toggle";
import DescriptionEditor from "../treatment/DescriptionEditor";

/* ================= SCHEMA ================= */

const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  featured: z.boolean(),
description: z.string().optional().or(z.literal("")),
});

export type TeamGeneralForm = z.infer<typeof teamSchema>;

type Props = {
  initialData?: Partial<TeamGeneralForm>;
  onChange?: (data: Partial<TeamGeneralForm>) => void;
};

/* ================= COMPONENT ================= */

const TeamGeneral = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      reset,
      getFieldState,
      setValue,
    } = useForm<TeamGeneralForm>({
      resolver: zodResolver(teamSchema),
      mode: "onSubmit",
      criteriaMode: "all",
      defaultValues: {
        name: "",
        designation: "",
        featured: false,
        description: "",
        ...initialData,
      },
    });

    const isInitializing = useRef(true);

    /* ---------- expose validate ---------- */
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const isValid = await trigger(undefined, { shouldFocus: false });

        const fields: (keyof TeamGeneralForm)[] = [
          "name",
          "designation",
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

      setData: (data: Partial<TeamGeneralForm>) => {
        reset({
          name: data.name ?? "",
          designation: data.designation ?? "",
          featured: data.featured ?? false,
          description: data.description ?? "",
        });
      },
    }));

    useEffect(() => {
      isInitializing.current = false;
    }, []);

   useEffect(() => {
  const sub = watch((v) => onChange?.(v));
  return () => sub.unsubscribe();
}, [watch, onChange]);

    /* ================= UI ================= */

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="text-sm font-medium">
              Name <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter name"
              {...register("name")}
            />
          </div>

          {/* Designation */}
          <div>
            <label className="text-sm font-medium">
              Designation <sup className="text-destructive">*</sup>
            </label>
            <input
              className="form-input"
              placeholder="Enter designation"
              {...register("designation")}
            />
          </div>

          {/* Featured */}
          <div>
            <label className="text-sm font-medium">Featured</label>
            <div className="mt-2">
              <SwitchToggle
                value={watch("featured")}
                onChange={() =>
                  setValue("featured", !watch("featured"), {
                    shouldDirty: true,
                  })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="xl:col-span-2">
            <label className="text-sm font-medium">
              Description 
            </label>
            <DescriptionEditor
                value={watch("description") || ""}
                onChange={(val) =>
                    setValue("description", val, {
                    shouldDirty: true,
                    shouldValidate: true,
                    })
                }
/>
          </div>

        </div>
      </div>
    );
  }
);

TeamGeneral.displayName = "TeamGeneral";
export default TeamGeneral;
