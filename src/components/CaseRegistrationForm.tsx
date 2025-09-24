import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { FileText, User, MapPin, Shield, AlertCircle } from "lucide-react";

interface CaseRegistrationData {
  firNumber: string;
  title: string;
  summary: string;
  petitioner: string;
  accused: string;
  investigatingOfficer: string;
  location: string;
  status: "Open" | "In-Progress" | "Closed";
  visibility: "Public" | "Private";
}

interface CaseRegistrationFormProps {
  onCaseCreated: (caseData: CaseRegistrationData) => void;
  onViewExistingCases: () => void;
}

export function CaseRegistrationForm({
  onCaseCreated,
  onViewExistingCases,
}: CaseRegistrationFormProps) {
  const [formData, setFormData] = useState<CaseRegistrationData>({
    firNumber: "",
    title: "",
    summary: "",
    petitioner: "",
    accused: "",
    investigatingOfficer: "",
    location: "",
    status: "Open",
    visibility: "Private",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firNumber.trim()) {
      newErrors.firNumber = "FIR Number is required";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Case Title is required";
    }
    if (!formData.summary.trim()) {
      newErrors.summary = "Case Summary is required";
    }
    if (!formData.petitioner.trim()) {
      newErrors.petitioner = "Petitioner name is required";
    }
    if (!formData.accused.trim()) {
      newErrors.accused = "Accused name is required";
    }
    if (!formData.investigatingOfficer.trim()) {
      newErrors.investigatingOfficer = "Investigating Officer is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CaseRegistrationData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onCaseCreated(formData);
    } catch (error) {
      console.error("Error creating case:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 max-w-4xl mx-auto space-y-6 flex-1 overflow-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-lg mb-2">Register New Case</h1>
            <Button
              variant="outline"
              onClick={onViewExistingCases}
              className="shrink-0 pb-5"
            >
              View Cases
            </Button>
          </div>
          <p className="text-muted-foreground">
            Enter case details to begin investigation tracking
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Case Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: FIR Number and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firNumber">FIR Number *</Label>
                  <Input
                    id="firNumber"
                    placeholder="e.g., FIR/2024/001234"
                    value={formData.firNumber}
                    onChange={(e) =>
                      handleInputChange("firNumber", e.target.value)
                    }
                    className={errors.firNumber ? "border-destructive" : ""}
                  />
                  {errors.firNumber && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Case Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "Open" | "In-Progress" | "Closed") =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In-Progress">In-Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Case Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief descriptive title of the case"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Row 3: Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary">Case Summary *</Label>
                <Textarea
                  id="summary"
                  placeholder="Detailed description of the case, incident details, and initial findings..."
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  className={`min-h-[100px] ${
                    errors.summary ? "border-destructive" : ""
                  }`}
                />
                {errors.summary && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.summary}
                  </p>
                )}
              </div>

              {/* Row 4: Petitioner and Accused */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="petitioner"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Petitioner *
                  </Label>
                  <Input
                    id="petitioner"
                    placeholder="Full name of the petitioner"
                    value={formData.petitioner}
                    onChange={(e) =>
                      handleInputChange("petitioner", e.target.value)
                    }
                    className={errors.petitioner ? "border-destructive" : ""}
                  />
                  {errors.petitioner && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.petitioner}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accused" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Accused *
                  </Label>
                  <Input
                    id="accused"
                    placeholder="Full name of the accused"
                    value={formData.accused}
                    onChange={(e) =>
                      handleInputChange("accused", e.target.value)
                    }
                    className={errors.accused ? "border-destructive" : ""}
                  />
                  {errors.accused && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.accused}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 5: Investigating Officer and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="investigatingOfficer"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Investigating Officer *
                  </Label>
                  <Input
                    id="investigatingOfficer"
                    placeholder="Full name and rank"
                    value={formData.investigatingOfficer}
                    onChange={(e) =>
                      handleInputChange("investigatingOfficer", e.target.value)
                    }
                    className={
                      errors.investigatingOfficer ? "border-destructive" : ""
                    }
                  />
                  {errors.investigatingOfficer && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.investigatingOfficer}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Incident location or police station"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className={errors.location ? "border-destructive" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 6: Visibility */}
              <div className="space-y-2">
                <Label htmlFor="visibility" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Case Visibility
                </Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: "Public" | "Private") =>
                    handleInputChange("visibility", value)
                  }
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private">
                      Private (Restricted Access)
                    </SelectItem>
                    <SelectItem value="Public">
                      Public (Department Access)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Private cases are only visible to assigned officers
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 md:flex-none md:px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Case..." : "Register Case"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      firNumber: "",
                      title: "",
                      summary: "",
                      petitioner: "",
                      accused: "",
                      investigatingOfficer: "",
                      location: "",
                      status: "Open",
                      visibility: "Private",
                    });
                    setErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
