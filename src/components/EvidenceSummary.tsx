import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Headphones, Image as ImageIcon, FileText, Video } from "lucide-react";
import { Evidence } from "@/types/case";

interface EvidenceSummaryProps {
  evidence: Evidence[];
}

function Tile({
  color,
  icon,
  count,
  label,
}: {
  color: "blue" | "green" | "orange" | "purple";
  icon: React.ReactNode;
  count: number;
  label: string;
}) {
  const bgMap = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    orange: "bg-red-50",
    purple: "bg-purple-50",
  } as const;

  const bubbleMap = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    orange: "bg-red-100",
    purple: "bg-purple-100",
  } as const;

  return (
    <div className={`rounded-2xl p-6 text-center ${bgMap[color]}`}>
      <div
        className={`mx-auto mb-4 size-12 rounded-full flex items-center justify-center ${bubbleMap[color]}`}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold tracking-tight">{count}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function EvidenceSummary({ evidence }: EvidenceSummaryProps) {
  const videoCount = evidence.filter((e) => e.type === "video").length;
  const audioCount = evidence.filter((e) => e.type === "audio").length;
  const documentCount = evidence.filter((e) => e.type === "document").length;
  const imageCount = evidence.filter((e) => e.type === "image").length;

  return (
    <Card className="shadow-sm bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Evidence Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-5">
          <Tile
            color="blue"
            icon={<Video className="h-6 w-6 text-blue-600" />}
            count={videoCount}
            label="Videos"
          />
          <Tile
            color="green"
            icon={<Headphones className="h-6 w-6 text-green-600" />}
            count={audioCount}
            label="Audio Files"
          />
          <Tile
            color="orange"
            icon={<FileText className="h-6 w-6 text-red-500" />}
            count={documentCount}
            label="Documents"
          />
          <Tile
            color="purple"
            icon={<ImageIcon className="h-6 w-6 text-purple-600" />}
            count={imageCount}
            label="Images"
          />
        </div>
      </CardContent>
    </Card>
  );
}
