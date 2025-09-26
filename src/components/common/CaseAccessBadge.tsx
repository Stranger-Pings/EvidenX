const CaseAccessBadge = ({
  visibility,
}: {
  visibility: "Public" | "Private";
}) => {
  return (
    <div
      className={`px-3 py-1 h-fit font-bold ${
        visibility === "Private"
          ? "bg-[#ffe2e2] text-[#b4494d]"
          : "bg-[#f3e9ff] text-[#854cb6]"
      } text-sm rounded-full`}
    >
      {visibility === "Public" ? "Public" : "Private"}
    </div>
  );
};

export default CaseAccessBadge;
