import { useState } from "react";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import { useApplications } from "@/hooks/useApplications";

const AdminApplications = () => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  
  const { 
    applications, 
    isLoading, 
    scheduleInterview, 
    updateStatus 
  } = useApplications();

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Cleaner Applications</h1>
      <ApplicationsTable
        applications={applications || []}
        selectedApplication={selectedApplication}
        onApplicationSelect={setSelectedApplication}
        onScheduleInterview={(applicationId, date) =>
          scheduleInterview.mutate({ applicationId, date })
        }
        onCompleteInterview={(applicationId, status, notes) =>
          updateStatus.mutate({ applicationId, status, notes })
        }
      />
    </div>
  );
};

export default AdminApplications;