import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Plus } from "lucide-react";
import { mockCases } from "../data/mockData";
import { CaseCard } from "./CaseCard";
import { Case } from "@/types/case";

interface InvestigatorDashboardProps {
  onCaseSelect: (caseId: string, case_: Case) => void;
  onRegisterCase?: () => void;
  cases: any[];
  isLoading: boolean;
}

export function InvestigatorDashboard({
  onCaseSelect,
  onRegisterCase,
  cases,
  isLoading,
}: InvestigatorDashboardProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

  const filteredCases = useMemo(() => {
    return cases.filter((case_) => {
      const matchesSearch =
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.petitioner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || case_.status === statusFilter;
      const matchesVisibility =
        visibilityFilter === "all" || case_.visibility === visibilityFilter;

      return matchesSearch && matchesStatus && matchesVisibility;
    });
  }, [searchTerm, statusFilter, visibilityFilter]);

  return (
    <div className="h-full overflow-auto px-6 pt-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="mb-1 text-3xl font-semibold tracking-tight">
            Case Management Hub
          </h1>
          <p className="text-muted-foreground">
            Monitor progress, review evidence, and update status
          </p>
        </div>
        {onRegisterCase && (
          <Button
            onClick={onRegisterCase}
            className="shrink-0 h-10 rounded-xl px-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-6 w-6 mr-2 font-bold" />
            Register New Case
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl mt-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-[10px] text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search cases by FIR number, title, or petitioner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-10 rounded-xl"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 !h-10 bg-card rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In-Progress">In-Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-36 !h-10 bg-card rounded-xl">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All Cases</SelectItem>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between py-4 ">
        <p className="text-muted-foreground">
          Showing {filteredCases.length} of {mockCases.length} cases
        </p>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((case_) => (
          <CaseCard key={case_.id} case_={case_} onCaseSelect={onCaseSelect} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No cases found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
