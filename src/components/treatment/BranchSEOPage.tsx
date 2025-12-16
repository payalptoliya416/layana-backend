import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BranchSelector } from "./BranchSelector";
import { BranchSEO } from "./BranchSEO";

interface BranchSEOPageProps {
  branches: { id: number; name: string }[];
  selectedBranchId: number | null;
  initialData?: any[];          // ✅ ADD
  onSelectBranch: (id: number | null) => void;
  onChange: (seo: any[]) => void;
}

const BranchSEOPage = forwardRef<
  { validate: () => boolean },
  BranchSEOPageProps
>(function BranchSEOPage(
  {
    branches,
    selectedBranchId,
    initialData,
    onSelectBranch,
    onChange,
  },
  ref
) {
  const [errors, setErrors] = useState<string | null>(null);

   const isInitializingRef = useRef(true);
  // 🔹 branchId -> seo data
  const [seoMap, setSeoMap] = useState<Record<number, any>>({});
// useImperativeHandle(ref, () => ({
//   validate() {
//     const branchIds = Object.keys(seoMap);

//     if (branchIds.length === 0) {
//       setErrors("Please add SEO details for at least one branch");
//       return false;
//     }

//     for (const branchId of branchIds) {
//       const seo = seoMap[Number(branchId)];

//       if (!seo?.seo_title?.trim()) {
//         setErrors("SEO Title is required for all branches");
//         return false;
//       }

//       if (!seo?.meta_description?.trim()) {
//         setErrors("Meta Description is required for all branches");
//         return false;
//       }

//     if (!seo?.seo_keyword || seo.seo_keyword.length === 0) {
//   setErrors("SEO Keywords are required for all branches");
//   return false;
// }
//     }

//     setErrors(null);
//     return true;
//   },
// }));

  // 🔹 API → seoMap
  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      isInitializingRef.current = false;
      return;
    }
    isInitializingRef.current = true;

    const map: Record<number, any> = {};

    initialData.forEach((item: any) => {
      map[item.location.id] = {
        analitycs: item.location.analitycs || "",
        seo_title: item.location.seo_title || "",
        meta_description: item.location.meta_description || "",
         seo_keyword: Array.isArray(item.location.seo_keyword)
        ? item.location.seo_keyword.map((k: any) =>
            typeof k === "string" ? k : k?.name
          )
        : [],
      };
    });

    setSeoMap(map);

    setTimeout(() => {
      isInitializingRef.current = false;
    }, 0);
  }, [initialData]);

   return (
    <div className="space-y-6">
      {/* {errors && (
  <p className="text-sm text-red-500">{errors}</p>
)} */}
      {/* STEP 1: Branch select */}
      {selectedBranchId === null && (
        <BranchSelector
          branches={branches}
          selectedId={selectedBranchId}
          onSelect={onSelectBranch}
        />
      )}

      {/* STEP 2: SEO FORM */}
      {selectedBranchId !== null && (
        <BranchSEO
          branchId={selectedBranchId}
          value={seoMap[selectedBranchId]}
          onChange={(data) => {
            setSeoMap((prev) => {
              const updated = {
                ...prev,
                [selectedBranchId]: data,
              };

              // ⛔ skip initial load
              if (isInitializingRef.current) return updated;

              const apiPayload = Object.entries(updated).map(
                ([branchId, seo]) => ({
                  location: {
                    id: Number(branchId),
                    ...seo,
                  },
                })
              );

              onChange(apiPayload);
              return updated;
            });
          }}
        />
      )}
    </div>
  );
})
export default BranchSEOPage;