import { cn } from "@/lib/utils/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200" },
  SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-100 text-amber-700 border-amber-200" },
  REVISION_REQUESTED: { label: "Revision Requested", className: "bg-orange-100 text-orange-700 border-orange-200" },
  ACCEPTED: { label: "Accepted", className: "bg-green-100 text-green-700 border-green-200" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
  PUBLISHED: { label: "Published", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700 border-gray-200" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
