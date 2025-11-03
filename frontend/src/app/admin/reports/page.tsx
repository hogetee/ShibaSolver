"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatusContainer from "@/components/report_log/StatusContainer";
import ContentTypeContainer from "@/components/report_log/ContentTypeContainer";
import ReportList from "@/components/report_log/ReportList";

type ReviewStatus = "unreviewed" | "reviewed";
type ReportType = "posts" | "account";

export default function ReportLogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>(
    (searchParams.get("status") as ReviewStatus) || "unreviewed"
  );
  const [reportType, setReportType] = useState<ReportType>(
    (searchParams.get("type") as ReportType) || "posts"
  );

  const updateURL = (status: ReviewStatus, type: ReportType) => {
    const params = new URLSearchParams();
    params.set("status", status);
    params.set("type", type);
    router.push(`/admin/reports?${params.toString()}`, { scroll: false });
  };

  const handleStatusChange = (status: ReviewStatus) => {
    setReviewStatus(status);
    updateURL(status, reportType);
  };

  const handleTypeChange = (type: ReportType) => {
    setReportType(type);
    updateURL(reviewStatus, type);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pt-20 font-display">
      <div className="max-w-6xl mx-auto">
        <div className="my-4">
          <div className="flex gap-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Report Log
            </h1>
            {StatusContainer(reviewStatus, handleStatusChange)}
          </div>
        </div>
        {ContentTypeContainer(reportType, handleTypeChange)}
        {ReportList(reviewStatus, reportType)}
      </div>
    </div>
  );
}
