
const CaseAccessBadge = ({
  visibility,
}: {
  visibility: "Public" | "Private";
}) => {
  return (
    <div className={`${visibility === "Private" ? "bg-[#ffe2e2] text-[#b4494d]" : "bg-[#f3e9ff] text-[#854cb6]"} p-2 text-sm rounded-md`}>
      {visibility === "Public" ? "Public" : "Private"}
    </div>
  );
};

export default CaseAccessBadge;
