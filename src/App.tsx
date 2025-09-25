import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { CaseRegistrationForm } from "./components/CaseRegistrationForm";
import { InvestigatorDashboard } from "./components/InvestigatorDashboard";
import { CaseDetailsPage } from "./components/CaseDetailsPage";
import { VideoEvidenceProcessing } from "./components/VideoEvidenceProcessing";
import { AudioEvidenceProcessing } from "./components/AudioEvidenceProcessing";
import { AudioComparison } from "./components/AudioComparison";
import { IncidentTimeline } from "./components/IncidentTimeline";

type ViewType =
  | "registration"
  | "dashboard"
  | "case-details"
  | "video-evidence"
  | "audio-evidence"
  | "audio-comparison"
  | "timeline";

interface AppState {
  currentView: ViewType;
  selectedCaseId?: string;
  selectedEvidenceId?: string;
  selectedAudioIds?: string[];
}
export default function App() {
  const [appState, setAppState] = useState({
    currentView: "dashboard",
  } as AppState);

  const navigateTo = (view: ViewType, params?: Partial<AppState>) => {
    setAppState((prev) => ({
      ...prev,
      currentView: view,
      ...params,
    }));
  };

  const handleCaseSelect = (caseId: string) => {
    navigateTo("case-details", { selectedCaseId: caseId });
  };

  const handleViewTimeline = () => {
    navigateTo("timeline");
  };

  const handleViewVideo = (evidenceId: string) => {
    navigateTo("video-evidence", { selectedEvidenceId: evidenceId });
  };

  const handleViewAudio = (evidenceId: string) => {
    navigateTo("audio-evidence", { selectedEvidenceId: evidenceId });
  };

  const handleCompareAudios = (evidenceIds: string[]) => {
    navigateTo("audio-comparison", { selectedAudioIds: evidenceIds });
  };

  const handleViewEvidence = (evidenceId: string, evidenceType: string) => {
    if (evidenceType === "video") {
      handleViewVideo(evidenceId);
    } else if (evidenceType === "audio") {
      handleViewAudio(evidenceId);
    }
  };

  const handleCaseCreated = (caseData: any) => {
    // Generate a new case ID and navigate to case details
    const newCaseId = `case-${Date.now()}`;
    console.log("New case created:", { id: newCaseId, ...caseData });
    navigateTo("case-details", { selectedCaseId: newCaseId });
  };

  const handleViewExistingCases = () => {
    navigateTo("dashboard");
  };

  const handleRegisterCase = () => {
    navigateTo("registration");
  };

  const handleBack = () => {
    // Navigate back based on current view
    switch (appState.currentView) {
      case "dashboard":
        navigateTo("registration");
        break;
      case "case-details":
        navigateTo("dashboard");
        break;
      case "video-evidence":
      case "audio-evidence":
      case "audio-comparison":
      case "timeline":
        navigateTo("case-details");
        break;
      default:
        navigateTo("registration");
    }
  };

  // Render current view
  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      <div className="flex-1 overflow-hidden">
        {(() => {
          switch (appState.currentView) {
            case "registration":
              return (
                <CaseRegistrationForm
                  onCaseCreated={handleCaseCreated}
                  onViewExistingCases={handleViewExistingCases}
                />
              );

            case "dashboard":
              return (
                <InvestigatorDashboard
                  onCaseSelect={handleCaseSelect}
                  onRegisterCase={handleRegisterCase}
                />
              );

            case "case-details":
              if (!appState.selectedCaseId) {
                return <div>No case selected</div>;
              }
              return (
                <CaseDetailsPage
                  caseId={appState.selectedCaseId}
                  onBack={handleBack}
                  onViewTimeline={handleViewTimeline}
                  onViewVideo={handleViewVideo}
                  onViewAudio={handleViewAudio}
                  onCompareAudios={handleCompareAudios}
                />
              );

            case "video-evidence":
              if (!appState.selectedEvidenceId) {
                return <div>No evidence selected</div>;
              }
              return (
                <VideoEvidenceProcessing
                  evidenceId={appState.selectedEvidenceId}
                  onBack={handleBack}
                />
              );

            case "audio-evidence":
              if (!appState.selectedEvidenceId) {
                return <div>No evidence selected</div>;
              }
              return (
                <AudioEvidenceProcessing
                  evidenceId={appState.selectedEvidenceId}
                  onBack={handleBack}
                />
              );

            case "audio-comparison":
              if (
                !appState.selectedAudioIds ||
                appState.selectedAudioIds.length === 0
              ) {
                return <div>No audio files selected for comparison</div>;
              }
              return (
                <AudioComparison
                  evidenceIds={appState.selectedAudioIds}
                  onBack={handleBack}
                  onViewAudio={handleViewAudio}
                />
              );

            case "timeline":
              if (!appState.selectedCaseId) {
                return <div>No case selected</div>;
              }
              return (
                <IncidentTimeline
                  caseId={appState.selectedCaseId}
                  onBack={handleBack}
                  onViewEvidence={handleViewEvidence}
                />
              );

            default:
              return (
                <CaseRegistrationForm
                  onCaseCreated={handleCaseCreated}
                  onViewExistingCases={handleViewExistingCases}
                />
              );
          }
        })()}
      </div>
    </div>
  );
}
