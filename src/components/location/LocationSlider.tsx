"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import SliderModal from "./SliderModal";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export type SliderItem = {
  title: string;
  image: string;
  btn_text: string;
  btn_link: string;
  index: number;
};

function SortableSliderRow({
  id,
  item,
  index,
  onEdit,
  onDelete,
}: {
  id: string;
  item: SliderItem;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-t hover:bg-muted/40"
    >
      {/* DRAG HANDLE */}
      <td className="px-3 py-3 w-10">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground hover:text-foreground"
        >
          <GripVertical size={16} />
        </span>
      </td>

      <td className="px-4 py-3 w-[18%]">
        {item.image && (
          <img
            src={item.image}
            className="h-12 w-12 rounded-md object-cover border"
          />
        )}
      </td>

      <td className="px-4 py-3 font-medium w-[22%]">{item.title}</td>
      <td className="px-4 py-3  w-[22%]">{item.btn_text}</td>

      <td className="px-4 py-3 flex-1">
        <a
          href={item.btn_link}
          target="_blank"
          className="text-primary underline break-all"
        >
          {item.btn_link}
        </a>
      </td>

      <td className="px-4 py-3">
        <div className="inline-flex gap-2">
          <button onClick={onEdit} className="border rounded-full p-2">
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="border rounded-full p-2 text-destructive"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

const LocationSlider = forwardRef<any>((_, ref) => {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
const SLIDER_GRID =
  "grid-cols-[40px_18%_22%_22%_1fr_160px]";

  /* ---------- expose ---------- */
  useImperativeHandle(ref, () => ({
    validate: () => {
      const errors: { section: string; message: string }[] = [];

      if (sliders.length === 0) {
        errors.push({
          section: "Slider",
          message: "At least one slider is required",
        });
      }

      sliders.forEach((s, i) => {
        if (!s.title)
          errors.push({
            section: "Slider",
            message: `Slider ${i + 1}: Title is required`,
          });

        if (!s.image)
          errors.push({
            section: "Slider",
            message: `Slider ${i + 1}: Image is required`,
          });

        if (!s.btn_text)
          errors.push({
            section: "Slider",
            message: `Slider ${i + 1}: Button text is required`,
          });

        if (!s.btn_link)
          errors.push({
            section: "Slider",
            message: `Slider ${i + 1}: Button link is required`,
          });
      });

      return {
        valid: errors.length === 0,
        errors,
      };
    },

    getData: () =>
  sliders.map((s) => ({
    title: s.title,
    image: s.image,
    btn_text: s.btn_text,
    btn_link: s.btn_link,
    index: s.index, // 🔥 this fixes update
  })),


    setData: (data: any[]) => {
  setSliders(
    (data || [])
      .sort((a, b) => a.index - b.index)
      .map((s) => ({
        title: s.title,
        image: s.image,
        btn_text: s.btn_text,
        btn_link: s.btn_link,
        index: s.index,
      }))
  );
},

  }));

  const handleSave = (data: SliderItem) => {
    if (editIndex !== null) {
      setSliders((prev) => prev.map((s, i) => (i === editIndex ? data : s)));
    } else {
      setSliders((prev) => [...prev, data]);
    }
    setOpenModal(false);
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    setSliders((prev) => prev.filter((_, i) => i !== index));
  };

const handleDragEnd = (event: any) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  setSliders((items) => {
    const moved = arrayMove(
      items,
      Number(active.id),
      Number(over.id)
    );

    // 🔥 IMPORTANT: recompute index
    return moved.map((item, i) => ({
      ...item,
      index: i,
    }));
  });
};


  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          Slider <sup className="text-destructive">*</sup>
        </h3>

        <button
          onClick={() => {
            setEditIndex(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white text-sm"
        >
          <Plus size={16} />
          Add Slider
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden 2xl:block border rounded-xl overflow-hidden">
<div className="sticky top-0 z-[9] bg-card border-b hidden xl:flex items-center h-[52px] text-sm font-medium text-primary ">

  {/* Drag */}
  <div className="w-10" />

  {/* Image */}
  <div className="w-[18%] pl-4 border-l text-left">
    Image
  </div>

  {/* Title */}
  <div className="w-[22%] pl-4 border-l text-left">
    Title
  </div>

  {/* Button Text */}
  <div className="w-[22%] pl-4 border-l text-left">
    Button Text
  </div>

  {/* Button Link */}
  <div className="flex-1 pl-4 border-l text-left">
    Button Link
  </div>

  {/* Actions */}
  <div className="w-[160px] pl-4 border-l text-left">
    Actions
  </div>
</div>
        <table className="w-full text-sm">
         {/* ================= SLIDER HEADER (DESKTOP) ================= */}


                    <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
            items={sliders.map((s) => String(s.index))}
            strategy={verticalListSortingStrategy}
          >
              <tbody>
                {sliders.map((item, index) => (
                  <SortableSliderRow
                    key={item.index}
                    id={String(index)}
                    item={item}
                    index={index}
                    onEdit={() => {
                      setEditIndex(index);
                      setOpenModal(true);
                    }}
                    onDelete={() => handleDelete(index)}
                  />
                ))}

                {sliders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-muted-foreground">
                      No sliders added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </SortableContext>
          </DndContext>

        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="2xl:hidden space-y-4">
        {sliders.map((item, index) => (
          <div key={index} className="border rounded-xl p-4 space-y-3">
            {item.image && (
              <div className=" w-[160px]  rounded-lg">
                <img
                  src={item.image}
                  className=" w-[160px] h-[160px] rounded-lg object-contain "
                />
              </div>
            )}

            <div className="text-sm space-y-1">
              <div className="font-medium text-base">{item.title}</div>

              <div>
                <span className="font-medium">Button Text:</span>{" "}
                {item.btn_text}
              </div>

              <div>
                <span className="font-medium">Button Link:</span>
                <br />
                <a
                  href={item.btn_link}
                  target="_blank"
                  className="text-primary underline break-all"
                >
                  {item.btn_link}
                </a>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setEditIndex(index);
                  setOpenModal(true);
                }}
                className="border rounded-full p-2"
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={() => handleDelete(index)}
                className="border rounded-full p-2 text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {sliders.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            No sliders added yet
          </p>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <SliderModal
          initialData={editIndex !== null ? sliders[editIndex] : undefined}
          onClose={() => {
            setOpenModal(false);
            setEditIndex(null);
          }}
          uploadType="location" 
          onSave={handleSave}
        />
      )}
    </div>
  );
});

LocationSlider.displayName = "LocationSlider";
export default LocationSlider;
