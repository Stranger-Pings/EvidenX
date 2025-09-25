import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, FileText, User } from "lucide-react";
import { Case } from "../types/case";
import CaseAccessBadge from "./common/CaseAccessBadge";

interface CaseCardProps {
  case_: Case;
  onCaseSelect: (caseId: string) => void;
}

function getStatusColor(status: Case["status"]) {
  switch (status) {
    case "Open":
      return "bg-primary text-white hover:bg-primary/90";
    case "In-Progress":
      return "bg-yellow-500 text-white hover:bg-yellow-600";
    case "Closed":
      return "bg-green-500 text-white hover:bg-green-600";
    default:
      return "bg-gray-500 text-white hover:bg-gray-600";
  }
}

function getVisibilityColor(visibility: Case["visibility"]) {
  switch (visibility) {
    case "Public":
      return "bg-green-500 text-white hover:bg-green-600";
    case "Private":
      return "bg-red-500 text-white hover:bg-red-600";
  }
}

export function CaseCard({ case_, onCaseSelect }: CaseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex gap-2">
            <Badge className={getStatusColor(case_.status)}>
              {case_.status}
            </Badge>
            <CaseAccessBadge visibility={case_.visibility} />
          </div>
        </div>
        <CardTitle className="line-clamp-2">{case_.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-3 w-3" />
          <span>{case_.firNumber}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {case_.summary}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">Petitioner:</span>
              <span className="text-muted-foreground truncate">
                {case_.petitioner}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">Accused:</span>
              <span className="text-muted-foreground truncate">
                {case_.accused}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">IO:</span>
              <span className="text-muted-foreground truncate">
                {case_.investigatingOfficer}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">Registered:</span>
              <span className="text-muted-foreground">
                {new Date(case_.registeredDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onCaseSelect(case_.id)}
          className="w-full mt-auto bg-primary text-white hover:bg-primary/90 cursor-pointer hover:text-white"
          variant="outline"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default CaseCard;
