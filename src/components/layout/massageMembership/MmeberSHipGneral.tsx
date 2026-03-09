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
  name: z.string().optional(),
  status: z.enum(["draft", "live"]),
  content: z.string().optional(),
});

export type MembershipGeneralForm = z.infer<typeof membershipSchema>;

type Props = {
  initialData?: Partial<MembershipGeneralForm>;
  onChange?: (data: Partial<MembershipGeneralForm>) => void;
};

/* ================= COMPONENT ================= */

const MembershipGeneral = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const { register, watch, trigger, reset, getFieldState, setValue ,getValues } =
      useForm<MembershipGeneralForm>({
        resolver: zodResolver(membershipSchema),
        mode: "onSubmit",
        criteriaMode: "all",
        defaultValues: {
          name: "",
          status: "draft",
          content: "",
          ...initialData,
        },
      });
    const isInitializing = useRef(true);
    useEffect(() => {
      if (!initialData) return;

      reset({
        name: initialData.name ?? "",
        status: initialData.status ?? "draft",
        content: initialData.content ?? "",
      });
    }, [initialData, reset]);

    /* ---------- expose validate ---------- */
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const values = getValues();
        const errors: any[] = [];

        const isDraft = values.status === "draft";

        // always required
        if (!values.name?.trim()) {
          errors.push({
            section: "General",
            message: "Name is required",
          });
        }

        // live validations
        if (!isDraft) {
          // future validations
        }

        return {
          valid: errors.length === 0,
          errors,
        };
      },

      setData: (data: Partial<MembershipGeneralForm>) => {
        reset({
          name: data.name ?? "",
          status: data.status ?? "draft",
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
                setValue("status", v as "draft" | "live", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="xl:col-span-2">
            <label className="text-sm font-medium">Content</label>

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
  },
);

MembershipGeneral.displayName = "MembershipGeneral";
export default MembershipGeneral;
