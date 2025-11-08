import React from "react";
import { Report } from "./ReportType";
import ReportPostDisplay from "./ReportPostDisplay";
import ReportCommentDisplay from "./ReportCommentDisplay";

interface ReportCardProps {
  report: Report;
  onRemove: (reportId: string) => void;
  onReject: (reportId: string) => void;
}

export default function ReportCard({
  report,
  onRemove,
  onReject,
}: ReportCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Report Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-900">
            Report #{report.reportNumber}
          </span>
          <span className="text-sm text-gray-600">
            Reported by:{" "}
              {report.reportedBy}
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

      {/* Target Content (for posts) NEED TO CHANGE */}
      {report.type === "posts" && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Reported post preview
          </h4>
          <ReportPostDisplay
            postId={report.targetContent?.id}
            fallbackData={
              report.targetContent
                ? {
                    id: report.targetContent.id,
                    title: report.targetContent.title,
                    description: report.targetContent.content,
                    is_solved: report.targetContent.solved,
                    tags: report.targetContent.tags,
                    stats: {
                      likes: report.targetContent.likes,
                      dislikes: 0,
                    },
                    author: {
                      user_id: "",
                      display_name: report.targetContent.author,
                      username: report.targetContent.username,
                      profile_picture: undefined,
                    },
                    created_at: new Date().toISOString(),
                  }
                : null
            }
          />
        </div>
      )}

      {report.type === "comments" && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Reported comment preview
          </h4>
          <ReportCommentDisplay
            commentId={report.targetContent?.id}
            fallbackData={
              report.targetContent
                ? {
                    id: report.targetContent.id,
                    text: report.targetContent.content,
                    is_solution: report.targetContent.solved,
                    stats: {
                      likes: report.targetContent.likes ?? 0,
                      dislikes: 0,
                    },
                    author: {
                      user_id: "",
                      display_name: report.targetContent.author,
                      username: report.targetContent.username,
                      profile_picture: undefined,
                    },
                    created_at: new Date().toISOString(),
                  }
                : null
            }
          />
        </div>
      )}



      {/* Action Buttons */}
      {report.status === "unreviewed" && (
        <div className="flex space-x-3 justify-evenly">
          <button
            onClick={() => onRemove(report.id)}
            className="cursor-pointer px-10 sm:px-12 md:px-15 lg:px-17 py-2 bg-red-500 text-white rounded-lg font-xl font-black hover:bg-red-600 transition-colors"
          >
            {report.type === "posts" ? "Remove Post" : "Remove Comment"}
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
