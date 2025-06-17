import { useState, useEffect, useRef } from "react";
import { Calendar, Stethoscope, ChevronLeft, ChevronRight, X } from "lucide-react";
import { CSSTransition } from "react-transition-group";
import { Button } from "@/components/atoms/Button";
import type { MedicalRecord } from "@/features/pets/api/petsApi";

interface HealthRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: MedicalRecord[];
  isLoading?: boolean;
}

export const HealthRecordsModal = ({
  isOpen,
  onClose,
  records,
  isLoading = false,
}: HealthRecordsModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(isOpen);
  const nodeRef = useRef<HTMLDivElement>(null);
  const recordsPerPage = 1;
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const currentRecords = records.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      // Only set to false after animation completes
      const timer = setTimeout(() => setIsMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Don't render anything if not open and not mounted
  if (!isOpen && !isMounted) return null;

  const handleClose = () => {
    setIsMounted(false);
    setTimeout(() => onClose(), 200);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Only render if we should be open or are in the middle of closing
  // Only render if we should be open or are in the middle of closing
  if (!isOpen && !isMounted) return null;

  return (
    <CSSTransition
      in={isOpen}
      timeout={200}
      classNames="fade"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200"
        onClick={handleOverlayClick}
      >
        <CSSTransition
          in={isMounted}
          timeout={200}
          classNames="scale"
          unmountOnExit
          nodeRef={nodeRef}
        >
          <div 
            className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/20 transform transition-all duration-200 origin-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Health Records
                </h3>
                {isLoading && (
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white/80 to-white/50">
              {isLoading || records.length === 0 ? (
                <div className="text-center py-8">
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No health records found</div>
                  )}
                </div>
              ) : (
                currentRecords.map((record) => (
                  <div key={record.id} className="space-y-6">
                    <div className="border-b border-gray-100 pb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {record.chief_complaint || "Health Record"}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>{formatDate(record.record_date)}</span>
                        {record.vet && (
                          <span className="ml-4">
                            Vet: {record.vet.license_number}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">History</h5>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {record.history || "No history recorded"}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">
                            Physical Examination
                          </h5>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {record.physical_examination || "No examination details"}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Diagnosis</h5>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {record.diagnosis || "No diagnosis recorded"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">
                            Treatment Plan
                          </h5>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {record.treatment_plan || "No treatment plan"}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">
                            Medications
                          </h5>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {record.medications || "No medications prescribed"}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Notes</h5>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {record.notes || "No additional notes"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Vital Signs
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-xs text-gray-500">Weight</span>
                          <p className="text-sm font-medium">
                            {record.weight || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Temperature</span>
                          <p className="text-sm font-medium">
                            {record.temperature || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Heart Rate</span>
                          <p className="text-sm font-medium">
                            {record.heart_rate ? `${record.heart_rate} bpm` : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Respiratory Rate</span>
                          <p className="text-sm font-medium">
                            {record.respiratory_rate
                              ? `${record.respiratory_rate} bpm`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {record.follow_up_required && record.follow_up_date && (
                      <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Follow-up Required</p>
                            <p className="text-sm text-blue-600">
                              {formatDate(record.follow_up_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {!isLoading && records.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-xl">
                <div className="text-sm text-gray-500">
                  Record {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="transition-opacity"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="transition-opacity"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  );
};
