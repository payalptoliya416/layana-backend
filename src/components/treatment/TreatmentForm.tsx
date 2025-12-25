import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DescriptionEditor from "./DescriptionEditor";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getTreatmentCategories } from "@/services/treatmentCategoryService";

type ValidationError = {
  section: string;
  field: string;
  message: string;
};

/* ---------------- SCHEMA ---------------- */
const treatmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Treatment slug is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "live", "archived"]),
  indicativePressure: z
    .enum(["light", "medium", "firm", "deep","none"])
    .nullable()
    .optional(),
  content: z.string().min(1, "Content is required"),
});
type TreatmentFormData = z.infer<typeof treatmentSchema>;

interface TreatmentFormProps {
  initialData?: any;
  onChange: (data: any) => void;
}
export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

export const TreatmentForm =forwardRef<{ validate: () => Promise<ValidationResult> }, TreatmentFormProps>(function TreatmentForm({ initialData, onChange  }, ref) {

  const {
    register,
    setValue,
    watch,
    reset,
    getValues,
  } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      status: "draft",
      indicativePressure: "medium",
      content: "",
    },
  });

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
        message: "Treatment name is required",
      });
    }

    // 🟢 EXTRA validations ONLY if LIVE
    if (!isDraft) {
      if (!values.slug?.trim()) {
        errors.push({
          section: "General",
          field: "slug",
          message: "Slug is required",
        });
      }

     if (!isDraft && !isFacial) {
       if (!values.indicativePressure || values.indicativePressure === "none") {
          errors.push({
            section: "General",
            field: "indicativePressure",
            message: "Indicative pressure is required for Facial treatment",
          });
        }
      }

      if (!values.content?.trim()) {
        errors.push({
          section: "General",
          field: "content",
          message: "Content is required",
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
}));

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const slugEditedRef = useRef(false);

  /* ---------------- INIT GUARD ---------------- */
  const isInitializing = useRef(true);
  const lastIdRef = useRef<number | null>(null);
  const content = watch("content");
  const status = watch("status");
  const indicativePressure = watch("indicativePressure");
  const category = watch("category");
  const isFacial = category === "Facial";
  const [categories, setCategories] = useState<{ id: number; name: string ; status : string }[]>([]);
  /* ---------------- RESET ON EDIT ---------------- */
useEffect(() => {
  if (!initialData) return;
  lastIdRef.current = initialData.id;
  isInitializing.current = true;

  reset({
    name: initialData.name || "",
    slug: initialData.Slug || "",
    category: initialData.Category || "",
    status: initialData.Status || "draft",
   indicativePressure:
      initialData.indicative_pressure === null
        ? "none"
        : initialData.indicative_pressure || "medium",
    content: initialData.Content || "",
  });

  // 🔥 allow slug auto logic AFTER reset
  setTimeout(() => {
    isInitializing.current = false;
  }, 0);
}, [initialData, reset]);

  /* ---------------- LIVE UPDATE TO PARENT ---------------- */
 
 useEffect(() => {
  getTreatmentCategories()
    .then((data) => {
      setCategories(data);

      const currentCategory = watch("category");
      if (!currentCategory && data.length > 0) {
        setValue("category", data[0].name, {
          shouldDirty: false,
          shouldValidate: true,
        });
      }
    })
    .catch(() => setCategories([]));
}, [setValue, watch]);

useEffect(() => {
  const subscription = watch((values) => {
    if (isInitializing.current && initialData) return;
const pressureValue =
      values.indicativePressure === "none"
        ? null
        : values.indicativePressure ?? "medium";
        
    onChange({
      name: values.name || "",
      Slug: values.slug || "",
      Category: values.category || "",
      Status: values.status || "draft",
      indicative_pressure: pressureValue,
      Content: values.content || "",
      type: "message",
    });
  });

  return () => subscription.unsubscribe();
}, [watch, onChange, initialData]);

  /* ---------------- UI ---------------- */
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
  {...register("name", {
    onBlur: (e) => {
      // 🔒 edit mode / manual slug edit ma auto na karo
      if (isInitializing.current || slugEditedRef.current) return;

      const value = e.target.value;
      if (!value) return;

      setValue("slug", slugify(value), {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  })}
  placeholder="Enter treatment name"
/>
    </div>

    {/* SLUG */}
    <div>
      <label className="text-sm font-medium text-foreground">
        Slug<sup className="text-destructive">*</sup>
      </label>
      <input
        className="form-input"
        placeholder="Enter Slug"
        {...register("slug")}
        onChange={(e) => {
          slugEditedRef.current = true; // 🔥 stop auto slug
          setValue("slug", e.target.value, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </div>

    {/* STATUS */}
    <div>
      <label className="text-sm font-medium text-foreground">
        Status<sup className="text-destructive">*</sup>
      </label>
      <Select
        value={status}
        onValueChange={(v) =>
          setValue("status", v as any, {
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

    {/* PRESSURE */}
  <div>
  <label className="text-sm font-medium text-foreground">
    Indicative Pressure
    {category !== "Facial" && <sup className="text-destructive">*</sup>}
  </label>

  <Select
value={indicativePressure ?? undefined}
     onValueChange={(v) =>
      setValue("indicativePressure", v as any, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  >
    <SelectTrigger className="form-input">
      <SelectValue placeholder="Select pressure level" />
    </SelectTrigger>

    <SelectContent>
                    {isFacial && (
                <SelectItem value="none">None</SelectItem>
              )}
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="firm">Firm</SelectItem>
      <SelectItem value="deep">Deep</SelectItem>
    </SelectContent>
  </Select>
</div>

    {/* CATEGORY */}
    <div>
      <label className="text-sm font-medium text-foreground">
        Category<sup className="text-destructive">*</sup>
      </label>
      <Select
        value={category}
        onValueChange={(v) =>
          setValue("category", v, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger className="form-input">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.name}  disabled={c.status === "Draft"}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

  {/* CONTENT */}
  <div>
    <label className="text-sm font-medium text-foreground">
      Content<sup className="text-destructive">*</sup>
    </label>
    <DescriptionEditor
      value={content || ""}
      onChange={(val) =>
        setValue("content", val, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    />
  </div>
</div>
  );
})
