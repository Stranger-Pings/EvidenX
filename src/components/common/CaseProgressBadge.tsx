import { Case } from "@/types/case";

function getProgressClasses(status: Case["status"]) {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-800";
    case "In-Progress":
      return "bg-[#fff8c8] text-[#a9714a]";
    case "Closed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

const CaseProgressBadge = ({
  progress,
}: {
  progress: "Open" | "In-Progress" | "Closed";
}) => {
  return (
    <div
      className={`${getProgressClasses(
        progress
      )} px-3 py-1 h-fit text-sm font-bold rounded-full`}
    >
      {progress}
    </div>
  );
};

export default CaseProgressBadge;
