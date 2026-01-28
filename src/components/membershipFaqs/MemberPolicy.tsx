import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { Check, Pencil, Trash2, X } from "lucide-react";

import { arrayMove } from "@dnd-kit/sortable";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* ================= TYPES ================= */
type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

export type PolicyItem = {
  id: number;
  title: string;
  content: string;
  index: number;
};

type Props = {
  initialData?: any[];
  onChange: (policy: any[]) => void;
};

/* ================= SORTABLE ROW (DESKTOP) ================= */

function SortableRow({
  item,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  item: PolicyItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updated: PolicyItem) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const { setNodeRef, transform, transition } = useSortable({ id: item.id });
const titleInputRef = useRef<HTMLInputElement>(null);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);

  useEffect(() => {
    if (isEditing) {
      setTitle(item.title);
      setContent(item.content);
          // ✅ Auto Focus on Title Input
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0)
    }
  }, [isEditing, item]);

  return (
    <tr ref={setNodeRef} style={style}>
      {/* TITLE */}
      <td className="px-4 py-3 border-y border-border">
        <input
          value={title}
          readOnly={!isEditing}
            ref={titleInputRef} 
          onChange={(e) => setTitle(e.target.value)}
          className="
              h-10 w-[220px]
              rounded-lg
              border border-input
              bg-card
              px-3
              text-sm
              text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring/20
            "
        />
      </td>

      {/* CONTENT */}
      <td className="px-4 py-3 border-y border-border">
        <input
          value={content}
          readOnly={!isEditing}
          onChange={(e) => setContent(e.target.value)}
          className="
              h-10 w-[320px]
              rounded-lg
              border border-input
              bg-card
              px-3
              text-sm
              text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring/20
            "
        />
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-3 border-y border-border text-right">
        {isEditing ? (
          <div className="inline-flex gap-2">
            {/* SAVE */}
            <button
              onClick={() =>
                onSave({
                  ...item,
                  title,
                  content,
                })
              }
              className="border rounded-full p-2 text-primary hover:bg-primary/10"
            >
              <Check size={14} />
            </button>

            {/* CANCEL */}
            <button
              onClick={onCancel}
              className="border rounded-full p-2 hover:bg-muted"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="inline-flex gap-2">
            {/* EDIT */}
            <button
              onClick={onEdit}
              className="border rounded-full p-2 hover:bg-muted"
            >
              <Pencil size={14} />
            </button>

            {/* DELETE */}
            <button
              onClick={onDelete}
              className="border rounded-full p-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

/* ================= MAIN COMPONENT ================= */

const MemberPolicy = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    const [policyList, setPolicyList] = useState<PolicyItem[]>([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [editingRowId, setEditingRowId] = useState<number | null>(null);

    /* ✅ Load Initial Data */
    useEffect(() => {
      if (!initialData) return;

      const mapped = initialData.map((p: any, idx: number) => ({
        id: Date.now() + idx,
        title: p.title,
        content: p.content,
        index: idx + 1,
      }));

      setPolicyList(mapped);
    }, [initialData]);

    /* ✅ Sync Payload */
    const syncPayload = (items: PolicyItem[]) => {
      onChange(
        items.map((p) => ({
          title: p.title,
          content: p.content,
        })),
      );
    };
    useImperativeHandle(ref, () => ({
      async validate(): Promise<ValidationResult> {
        const errors: any[] = [];

        if (policyList.length === 0) {
          errors.push({
            section: "Policy",
            field: "policy",
            message: "At least one policy item is required",
          });
        }

        // Check empty title/content
        policyList.forEach((p, idx) => {
          if (!p.title.trim()) {
            errors.push({
              section: "Policy",
              field: "title",
              message: `Policy #${idx + 1} title is required`,
            });
          }

          if (!p.content.trim()) {
            errors.push({
              section: "Policy",
              field: "content",
              message: `Policy #${idx + 1} content is required`,
            });
          }
        });

        return {
          valid: errors.length === 0,
          errors,
        };
      },
    }));

    /* ✅ Add Policy */
    const handleAdd = () => {
      if (!title || !content) return;

      const newItem: PolicyItem = {
        id: Date.now(),
        title,
        content,
        index: policyList.length + 1,
      };

      const updated = [...policyList, newItem];
      setPolicyList(updated);
      syncPayload(updated);

      setTitle("");
      setContent("");
    };

    /* ✅ Inline Save */
    const handleInlineSave = (updatedItem: PolicyItem) => {
      const updated = policyList.map((i) =>
        i.id === updatedItem.id ? updatedItem : i,
      );

      setPolicyList(updated);
      syncPayload(updated);
      setEditingRowId(null);
    };

    /* ✅ Delete */
    const handleDelete = (id: number) => {
      const updated = policyList.filter((i) => i.id !== id);
      setPolicyList(updated);
      syncPayload(updated);
    };

    /* ✅ Drag Sort */
    const handleDragEnd = (event: any) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = policyList.findIndex((i) => i.id === active.id);
      const newIndex = policyList.findIndex((i) => i.id === over.id);

      const reordered = arrayMove(policyList, oldIndex, newIndex);

      setPolicyList(reordered);
      syncPayload(reordered);
    };

    /* ================= UI ================= */

    return (
      <div className="space-y-10">
        {/* ================= ADD FORM (Pricing Style) ================= */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Add Policy <sup className="text-destructive">*</sup>
          </h2>

          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <div className="w-full rounded-[10px] border border-border bg-card p-5 overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <tbody>
                    <tr
                      className="
                        grid grid-cols-1 sm:grid-cols-2 sm:gap-4
                        xl:table-row xl:grid-cols-none
                      "
                    >
                      {/* TITLE */}
                      <td className=" py-3 border-y border-border">
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Policy Title"
                          className="
              h-10 w-full xl:w-[220px]
              rounded-lg
              border border-input
              bg-card
              px-3
              text-sm
              text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring/20
            "
                        />
                      </td>

                      {/* CONTENT */}
                      <td className="py-3 border-y border-border">
                        <input
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Policy Content"
                          className="
              h-10 w-full xl:w-[320px]
              rounded-lg
              border border-input
              bg-card
              px-3
              text-sm
              text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring/20
            "
                        />
                      </td>

                      {/* ACTION */}
                      <td className="py-3 border-y border-border">
                        <button
                          onClick={handleAdd}
                          className="inline-flex h-10 w-full items-center justify-center
                          rounded-full bg-primary text-white shadow hover:opacity-90"
                        >
                          + Add Policy
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ================= POLICY LIST ================= */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Policy List
          </h2>

          {/* ✅ MOBILE CARD VIEW */}
          <div className="space-y-3 xl:hidden">
            {policyList.map((item) => {
              const isEditing = editingRowId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-card p-4 space-y-3"
                >
                  {/* TITLE */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Title</span>

                    <input
                      value={item.title}
                      readOnly={!isEditing}
                      onChange={(e) => {
                        if (!isEditing) return;
                        setPolicyList((prev) =>
                          prev.map((p) =>
                            p.id === item.id
                              ? { ...p, title: e.target.value }
                              : p,
                          ),
                        );
                      }}
                      className="h-9 w-[150px] rounded-lg border border-input px-2 text-sm"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Content
                    </span>

                    <input
                      value={item.content}
                      readOnly={!isEditing}
                      onChange={(e) => {
                        if (!isEditing) return;
                        setPolicyList((prev) =>
                          prev.map((p) =>
                            p.id === item.id
                              ? { ...p, content: e.target.value }
                              : p,
                          ),
                        );
                      }}
                      className="h-9 w-[150px] rounded-lg border border-input px-2 text-sm"
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-end gap-2 pt-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleInlineSave(item)}
                          className="border rounded-full p-2 text-primary"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          onClick={() => setEditingRowId(null)}
                          className="border rounded-full p-2"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingRowId(item.id)}
                          className="border rounded-full p-2"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="border rounded-full p-2 text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ DESKTOP TABLE VIEW */}
          <div className="hidden xl:block">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={policyList.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <table className="w-full border-separate border-spacing-y-3">
                  <tbody>
                    {policyList.map((item) => (
                      <SortableRow
                        key={item.id}
                        item={item}
                        isEditing={editingRowId === item.id}
                        onEdit={() => setEditingRowId(item.id)}
                        onCancel={() => setEditingRowId(null)}
                        onSave={handleInlineSave}
                        onDelete={() => handleDelete(item.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    );
  },
);

MemberPolicy.displayName = "MemberPolicy";
export default MemberPolicy;
