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
import { Case } from "../types/case";
import { CaseCard } from "./CaseCard";

interface InvestigatorDashboardProps {
  onCaseSelect: (caseId: string) => void;
  onRegisterCase?: () => void;
}

export function InvestigatorDashboard({
  onCaseSelect,
  onRegisterCase,
}: InvestigatorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

  const filteredCases = useMemo(() => {
    return mockCases.filter((case_) => {
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

  const getStatusColor = (status: Case["status"]) => {
    switch (status) {
      case "Open":
        return "bg-primary text-white hover:bg-blue-600";
      case "In-Progress":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "Closed":
        return "bg-green-500 text-white hover:bg-green-600";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const getVisibilityColor = (visibility: Case["visibility"]) => {
    return visibility === "Private"
      ? "bg-red-500 text-white hover:bg-red-600"
      : "bg-purple-500 text-white hover:bg-purple-600";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 max-w-7xl mx-auto space-y-6 flex-1 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Case Management Hub</h1>
            <p className="text-muted-foreground">
              Monitor progress, review evidence, and update status
            </p>
          </div>
          {onRegisterCase && (
            <Button onClick={onRegisterCase} className="shrink-0">
              <Plus className="h-4 w-4 mr-2 font-bold" />
              Register New Case
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search cases by FIR number, title, or petitioner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In-Progress">In-Progress</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={visibilityFilter}
              onValueChange={setVisibilityFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
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
    </div>
  );
}
