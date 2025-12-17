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

/* ---------------- SCHEMA ---------------- */
const treatmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Treatment slug is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "live", "archived"]),
  indicativePressure: z.enum(["light", "medium", "firm", "strong"]),
  content: z.string().min(1, "Content is required"),
});
type TreatmentFormData = z.infer<typeof treatmentSchema>;

interface TreatmentFormProps {
  initialData?: any;
  onChange: (data: any) => void;
}

export const TreatmentForm = forwardRef<
  { validate: () => Promise<boolean> },
  TreatmentFormProps
>(function TreatmentForm({ initialData, onChange }, ref) {

  const {
    register,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
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
    async validate() {
      return await trigger();
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
   const nameValue = watch("name");
     const [categories, setCategories] = useState<
    { id: number; name: string }[]
  >([]);

  /* ---------------- RESET ON EDIT ---------------- */
useEffect(() => {
  if (!initialData) return;

  lastIdRef.current = initialData.id;
  isInitializing.current = true;

  const pressureReverseMap: Record<string, any> = {
    Low: "Low",
    Medium: "Medium",
    High: "High",
    firm: "firm",
  };

  reset({
    name: initialData.name || "",
    slug: initialData.Slug || "",
    category: initialData.Category || "",
    status: initialData.Status || "draft",
    indicativePressure:
      pressureReverseMap[initialData.indicative_pressure] || "medium",
    content: initialData.Content || "",
  });

  // 🔥 allow slug auto logic AFTER reset
  setTimeout(() => {
    isInitializing.current = false;
  }, 0);
}, [initialData, reset]);

  /* ---------------- LIVE UPDATE TO PARENT ---------------- */
useEffect(() => {
  if (isInitializing.current) return;

  slugEditedRef.current = false;

  if (nameValue) {
    setValue("slug", slugify(nameValue), {
      shouldDirty: true,
      shouldValidate: true,
    });
  } else {
    setValue("slug", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }
}, [nameValue, setValue]);

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

    onChange({
      name: values.name || "",
      Slug: values.slug || "",
      Category: values.category || "",
      Status: values.status || "draft",
      indicative_pressure: values.indicativePressure || "medium",
      Content: values.content || "",
      type: "message",
    });
  });

  return () => subscription.unsubscribe();
}, [watch, onChange, initialData]);

  /* ---------------- UI ---------------- */
  return (
   <div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* NAME */}
    <div>
      <label className="text-sm font-medium text-foreground">
        Name <sup className="text-destructive">*</sup>
      </label>
      <input
        className="form-input"
        {...register("name")}
        placeholder="Enter treatment name"
      />
      {errors.name && (
        <p className="text-sm text-destructive">
          {errors.name.message}
        </p>
      )}
    </div>

    {/* SLUG */}
    <div>
      <label className="text-sm font-medium text-foreground">
        Slug <sup className="text-destructive">*</sup>
      </label>
      <input
        className="form-input"
        {...register("slug")}
        onChange={(e) => {
          slugEditedRef.current = true; // 🔥 stop auto slug
          setValue("slug", e.target.value, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
      {errors.slug && (
        <p className="text-sm text-destructive">
          {errors.slug.message}
        </p>
      )}
    </div>

    {/* STATUS */}
    <div>
      <label className="text-sm font-medium text-foreground">
        Status <sup className="text-destructive">*</sup>
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
      {errors.status && (
        <p className="text-sm text-destructive">
          {errors.status.message}
        </p>
      )}
    </div>

    {/* PRESSURE */}
    <div>
      <label className="text-sm font-medium text-foreground">
        Indicative Pressure <sup className="text-destructive">*</sup>
      </label>
      <Select
        value={indicativePressure}
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
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="firm">Firm</SelectItem>
          <SelectItem value="strong">Deep</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* CATEGORY */}
    <div>
      <label className="text-sm font-medium text-foreground">
        Category <sup className="text-destructive">*</sup>
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
            <SelectItem key={c.id} value={c.name}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.category && (
        <p className="text-sm text-destructive">
          {errors.category.message}
        </p>
      )}
    </div>
  </div>

  {/* CONTENT */}
  <div>
    <label className="text-sm font-medium text-foreground">
      Content <sup className="text-destructive">*</sup>
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
    {errors.content && (
      <p className="text-sm text-destructive">
        {errors.content.message}
      </p>
    )}
  </div>
</div>
  );
})
