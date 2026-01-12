import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import DescriptionEditor from "../treatment/DescriptionEditor";

interface PackageGeneralFormProps {
  initialData?: any;
  onChange: (data: any) => void;
}

const packageGeneralSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slogan: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "live"]),
});

type PackageGeneralFormData = z.infer<typeof packageGeneralSchema>;
type ValidationError = {
  section: string;
  field: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

export const PackageGeneral = forwardRef<
  { validate: () => Promise<ValidationResult> },
  PackageGeneralFormProps
>(function PackageGeneralForm({ initialData, onChange }, ref) {
const isInitializing = useRef(false);

  const {
    register,
    watch,
    reset,
    getValues,
    setValue,
  } = useForm<PackageGeneralFormData>({
    resolver: zodResolver(packageGeneralSchema),
    defaultValues: {
      name: "",
      slogan: "",
      description: "",
      status: "draft",
    },
  });
const description = watch("description");
useEffect(() => {
  const subscription = watch((values) => {
    if (isInitializing.current) return;

    onChange({
      name: values.name || "",
      slogan: values.slogan || "",
      description: values.description || "",
      status: values.status || "draft",
    });
  });

  return () => subscription.unsubscribe();
}, [watch, onChange]);

  /* ---------------- VALIDATION (PARENT CALL) ---------------- */
  useImperativeHandle(ref, () => ({
    async validate(): Promise<ValidationResult> {
      const values = getValues();
      const errors: ValidationError[] = [];

      const isDraft = values.status === "draft";

      // 🔴 ALWAYS required
      if (!values.name?.trim()) {
        errors.push({
          section: "General",
          field: "name",
          message: "Package name is required",
        });
      }

      // 🟢 ONLY if LIVE
      if (!isDraft) {
        if (!values.slogan?.trim()) {
          errors.push({
            section: "General",
            field: "slogan",
            message: "Slogan is required",
          });
        }

        if (!values.description?.trim()) {
          errors.push({
            section: "General",
            field: "description",
            message: "Description is required",
          });
        }
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    },
  }));

  /* ---------------- LIVE UPDATE ---------------- */
useEffect(() => {
  if (!initialData) return;

  isInitializing.current = true;

  reset({
    name: initialData?.name || "",
    slogan: initialData?.slogan || "",
    description: initialData?.description || "",
    status: initialData?.status || "draft",
  });

  // ❌ DO NOT call onChange here

  isInitializing.current = false;
}, [initialData, reset]);

  const status = watch("status");

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* NAME */}
        <div>
          <label className="text-sm font-medium">
            Name <sup className="text-destructive">*</sup>
          </label>
          <input
            className="form-input"
            {...register("name")}
            placeholder="Enter package name"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="text-sm font-medium">
            Status <sup className="text-destructive">*</sup>
          </label>
          <select
            className="form-input"
            value={status}
            onChange={(e) =>
              setValue("status", e.target.value as any, {
                shouldDirty: true,
              })
            }
          >
            <option value="draft">Draft</option>
            <option value="live">Live</option>
          </select>
        </div>
      </div>

      {/* SLOGAN */}
      <div>
        <label className="text-sm font-medium">
          Slogan {status === "live" && <sup className="text-destructive">*</sup>}
        </label>
        <input
          className="form-input"
          {...register("slogan")}
          placeholder="Enter slogan"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm font-medium">
          Description{" "}
          {status === "live" && <sup className="text-destructive">*</sup>}
        </label>
        <DescriptionEditor
            value={description || ""}
            onChange={(val) =>
              setValue("description", val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
      </div>
    </div>
  );
});
