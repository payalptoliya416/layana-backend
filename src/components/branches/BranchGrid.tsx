import { cn } from "@/lib/utils";

interface Branch {
  id: number;
  name: string;
}

interface BranchGridProps {
  branches: Branch[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function BranchGrid({
  branches,
  selectedId,
  onSelect,
}: BranchGridProps) {
  return (
    <>
    {
      branches.length !== 0 && 
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {branches.map((branch) => {
        const active = selectedId === branch.id;

        return (
          <button
            key={branch.id}
            type="button"
            onClick={() => onSelect(branch.id)}
            className={cn(
              "w-full rounded-lg border py-5 xl:py-[25px] px-5 text-left text-xl font-medium bg-card text-foreground transition",
              active
                ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary))]"
                : "border-border hover:border-muted-foreground/40"
            )}
          >
            {branch.name}
          </button>
        );
      })}
    </div>
    }
    </>
  );
}
