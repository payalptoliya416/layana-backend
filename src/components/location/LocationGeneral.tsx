import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

/* ================= SCHEMA ================= */

// const locationSchema = z.object({
//   name: z.string().min(1, "Location name is required"),
//   status: z.enum(["draft", "live"]),
//   slug: z
//     .string()
//     .min(1, "Slug is required")
//     .regex(
//       /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
//       "Slug must be lowercase and hyphen separated",
//     ),
//   freeText: z.string().min(1, "Free text is required"),
// });
const locationSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["draft", "live"]),
  slug: z.string().optional(),
  freeText: z.string().optional(),
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
        status: "draft",
        slug: "",
        freeText: "",
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
  const values = watch();
  const errors: any[] = [];

  const isDraft = values.status === "draft";

  // always required
  if (!values.name?.trim()) {
    errors.push({
      section: "General",
      message: "Location name is required",
    });
  }

  // live validations
  if (!isDraft) {
    if (!values.slug?.trim()) {
      errors.push({
        section: "General",
        message: "Slug is required",
      });
    }

    if (!values.freeText?.trim()) {
      errors.push({
        section: "General",
        message: "Free text is required",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
},
      // ✅ THIS IS THE KEY FIX
      setData: (data: Partial<LocationGeneralForm>) => {
        reset({
          name: data.name ?? "",
          slug: data.slug ?? "",
          status: data.status ?? "draft",
          freeText: data.freeText ?? "",
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
              Location Name <sup className="text-destructive">*</sup>
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
              Slug <sup className="text-destructive">*</sup>
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

          {/* Free Text */}
          <div>
            <label className="text-sm font-medium">
              Free Text <sup className="text-destructive">*</sup>
            </label>

            <input
              className="form-input"
              placeholder="Enter free text"
              {...register("freeText")}
            />
          </div>
        </div>
      </div>
    );
  },
);

LocationGeneral.displayName = "LocationGeneral";
export default LocationGeneral;
