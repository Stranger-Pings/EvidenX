import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, FileText, User } from "lucide-react";
import { Case } from "../types/case";
import CaseAccessBadge from "./common/CaseAccessBadge";
import CaseProgressBadge from "./common/CaseProgressBadge";

interface CaseCardProps {
  case_: Case;
  onCaseSelect: (caseId: string, case_: Case) => void;
}

export function CaseCard({ case_, onCaseSelect }: CaseCardProps) {
  return (
    <Card className="hover-lift transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2">
            <CaseProgressBadge progress={case_.status} />
            <CaseAccessBadge visibility={case_.visibility} />
          </div>
        </div>
        <CardTitle className="text-xl font-semibold leading-snug">
          {case_.title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-blue-700/80">
          <FileText className="h-4 w-4" />
          <span className="font-medium">{case_.firNumber}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col mb-12">
        <p className="text-[15px] leading-6 text-muted-foreground">
          {case_.summary}
        </p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">Petitioner:</span>
            <span className="text-muted-foreground truncate">
              {case_.petitioner}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">Accused:</span>
            <span className="text-muted-foreground truncate">
              {case_.accused}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">IO:</span>
            <span className="text-muted-foreground truncate">
              {case_.investigatingOfficer}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">Registered:</span>
            <span className="text-muted-foreground">
              {new Date(case_.registeredDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-accent/20 py-4">
        <Button
          variant="secondary"
          className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200"
          onClick={() => onCaseSelect(case_.id, case_)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CaseCard;
