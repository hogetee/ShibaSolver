"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatusContainer from "@/components/report_log/StatusContainer";
import ContentTypeContainer from "@/components/report_log/ContentTypeContainer";
import ReportList from "@/components/report_log/ReportList";
import GavelIcon from '@mui/icons-material/Gavel';

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
        <div className="my-4 flex items-center justify-between">
          <div className="flex gap-8">
            <h1 className="text-3xl font-bold text-dark-900">
              Report Log
            </h1>
            {StatusContainer(reviewStatus, handleStatusChange)}
          </div>
          <div className="cursor-pointer bg-accent-200 pt-1 pb-2 pl-2 pr-1 rounded-full text-accent-400  hover:text-accent-600 hover:bg-accent-400/50" onClick={() => router.push('/admin')}>
            <GavelIcon fontSize="small" />
          </div>
        </div>
        {ContentTypeContainer(reportType, handleTypeChange)}
        {ReportList(reviewStatus, reportType)}
      </div>
    </div>
  );
}
