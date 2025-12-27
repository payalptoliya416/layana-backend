"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DescriptionEditor from "@/components/treatment/DescriptionEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= SCHEMA ================= */

const membershipSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "inactive"]),
  content: z.string().optional().or(z.literal("")),
});

export type MembershipGeneralForm = z.infer<typeof membershipSchema>;

type Props = {
  initialData?: Partial<MembershipGeneralForm>;
  onChange?: (data: Partial<MembershipGeneralForm>) => void;
};

/* ================= COMPONENT ================= */

const MembershipGeneral = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const {
      register,
      watch,
      trigger,
      reset,
      getFieldState,
      setValue,
    } = useForm<MembershipGeneralForm>({
      resolver: zodResolver(membershipSchema),
      mode: "onSubmit",
      criteriaMode: "all",
      defaultValues: {
        name: "",
        status: "active",
        content: "",
        ...initialData,
      },
    });
    const isInitializing = useRef(true);
useEffect(() => {
  if (!initialData) return;

  reset({
    name: initialData.name ?? "",
    status: initialData.status ?? "active",
    content: initialData.content ?? "",
  });
}, [initialData, reset]);

    /* ---------- expose validate ---------- */
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const isValid = await trigger(undefined, { shouldFocus: false });

        const fields: (keyof MembershipGeneralForm)[] = [
          "name",
          "status",
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

      setData: (data: Partial<MembershipGeneralForm>) => {
        reset({
          name: data.name ?? "",
          status: data.status ?? "active",
          content: data.content ?? "",
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
              placeholder="Enter membership name"
              {...register("name")}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">
              Status <sup className="text-destructive">*</sup>
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

          {/* Content */}
          <div className="xl:col-span-2">
            <label className="text-sm font-medium">
              Content
            </label>

            <DescriptionEditor
              value={watch("content") || ""}
              onChange={(val) =>
                setValue("content", val, {
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

MembershipGeneral.displayName = "MembershipGeneral";
export default MembershipGeneral;
