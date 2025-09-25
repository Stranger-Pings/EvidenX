import { ChevronLeft } from "lucide-react";

const BackButton = ({
  onBack,
  location,
}: {
  onBack: () => void;
  location: string;
}) => {
  return (
    <div
      onClick={onBack}
      className="flex w-fit -ml-2 items-center text-muted-foreground gap-3 mb-4 cursor-pointer"
    >
      <ChevronLeft className="h-7 w-7" color="var(--muted-foreground)" />
      <div className="text-lg">Back to {location}</div>
    </div>
  );
};

export default BackButton;
