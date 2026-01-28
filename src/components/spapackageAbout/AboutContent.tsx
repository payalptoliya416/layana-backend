import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, useController } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TermsDescriptionEditor from "../terms&condition/TermsDescriptionEditor";

/* ================= SCHEMA ================= */

const aboutContentSchema = z.object({
  description: z.string().min(1, "Content is required"),
});

export type AboutContentForm = z.infer<typeof aboutContentSchema>;

/* ================= PROPS ================= */

type Props = {
  initialData?: string;
  onChange?: (description: string) => void;
};

/* ================= COMPONENT ================= */

const AboutContent = forwardRef<any, Props>(
  ({ onChange, initialData }, ref) => {
    const { watch, trigger, reset, getFieldState, control } =
      useForm<AboutContentForm>({
        resolver: zodResolver(aboutContentSchema),
        mode: "onSubmit",
        defaultValues: {
          description: initialData || "",
        },
      });

    /* Controller */
    const { field: contentField } = useController({
      name: "description",
      control,
    });

    /* Update initialData */
    useEffect(() => {
      reset({ description: initialData || "" });
    }, [initialData, reset]);

    /* Expose Methods */
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const isValid = await trigger();
        const state = getFieldState("description");

        return {
          valid: isValid,
          errors: state.error
            ? [
                {
                  section: "Content",
                  message: state.error.message,
                },
              ]
            : [],
        };
      },

      getData: () => ({
        description: contentField.value,
      }),
    }));

    /* Live Sync */
    useEffect(() => {
      if (!onChange) return;

      const sub = watch((v) => {
        onChange(v.description || "");
      });

      return () => sub.unsubscribe();
    }, [watch, onChange]);

    return (
     <div className="h-full flex flex-col">
        <label className="text-sm font-medium">
          Description <sup className="text-destructive">*</sup>
        </label>
 <div className="flex-1">
        <TermsDescriptionEditor
          value={contentField.value || ""}
          onChange={contentField.onChange}
          fullHeight
        />
 </div>
      </div>
    );
  }
);

AboutContent.displayName = "AboutContent";
export default AboutContent;
