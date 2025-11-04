import React from "react";
import { Report } from "./ReportType";

interface AccountReportCardProps {
  report: Report;
  onRemove: (reportId: string) => void;
  onReject: (reportId: string) => void;
}

export default function AccountReportCard({
  report,
  onRemove,
  onReject,
}: AccountReportCardProps) {
  // Only render if it's an account report
  if (report.type !== "account" || !report.targetUser) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Report Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-900">
            Report #{report.reportNumber}
          </span>
          <span className="text-sm text-gray-600">
            Reported by: {report.reportedBy}
          </span>
        </div>
      </div>

      {/* Reason Tag */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-black bg-accent-600 text-white whitespace-nowrap">
            Reason
          </div>
          <div className="break-words text-sm font-bold text-dark-900 flex-1 overflow-wrap-anywhere min-w-0">
            {report.reason}
          </div>
        </div>
        <div className="text-sm text-gray-500 flex whitespace-nowrap shrink-0">
          Reported on: {report.reportedDate}
        </div>
      </div>

      {/* Target User */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Reported Account
        </h4>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              {report.targetUser.profilePicture ? (
                <img
                  src={report.targetUser.profilePicture}
                  alt={`${report.targetUser.username} profile`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {report.targetUser.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-lg">
                @{report.targetUser.username}
              </p>
              <p className="text-sm text-gray-500">
                User ID: {report.targetUser.id}
              </p>
              {report.targetUser.email && (
                <p className="text-sm text-gray-500">
                  {report.targetUser.email}
                </p>
              )}
            </div>
          </div>

          {/* Additional Account Actions */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account Actions:</span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors">
                  View Profile
                </button>
                <button className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded text-sm hover:bg-yellow-200 transition-colors">
                  View Posts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {report.status === "unreviewed" && (
        <div className="flex space-x-3 justify-evenly">
          <button
            onClick={() => onRemove(report.id)}
            className="cursor-pointer px-10 sm:px-12 md:px-15 lg:px-17 py-2 bg-red-500 text-white rounded-lg font-xl font-black hover:bg-red-600 transition-colors"
          >
            Ban Account
          </button>
          <button
            onClick={() => onReject(report.id)}
            className="cursor-pointer px-10 sm:px-12 md:px-15 lg:px-17 bg-green-500 text-white rounded-lg font-xl font-black hover:bg-green-600 transition-colors"
          >
            Reject Report
          </button>
        </div>
      )}
    </div>
  );
}
