import React from "react";
import { Report } from "./ReportType";
import Link from "next/link";

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
            <Link
              href={`/user/${report.reportedBy}`}
              className="font-medium text-accent-400 hover:text-accent-600 hover:underline cursor-pointer"
            >
              {report.reportedBy}
            </Link>
          </span>
        </div>
      </div>

      {/* Reason Tag */}
      <div className="mb-4 flex justify-between">
        <div className="flex items-center space-x-3">
          <div className="inline-block px-3 py-1 rounded-full text-md font-black bg-accent-600 text-white">
            Reason
          </div>
          <span className="text-md font-black text-dark-900">
            {report.reason}
          </span>
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          Reported on: {report.reportedDate}
        </div>
      </div>

      {/* Target Content (for posts) NEED TO CHANGE */}
      {report.targetContent && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Targeted Post created by{" "}
            <Link
              href={`/user/${report.targetContent.author}`}
              className="text-accent-400 hover:text-accent-600 hover:underline cursor-pointer"
            >
              {report.targetContent.author}
            </Link>
          </h4>
          <div className="border rounded-lg p-4 bg-gray-50">
            {/* Post Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {report.targetContent.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    tag === "Unsolved"
                      ? "bg-red-100 text-red-700"
                      : tag === "Math"
                      ? "bg-blue-100 text-blue-700"
                      : tag === "Solved"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Post Content NEED TO FIX TO MATCH POSTS*/}
            <h3 className="font-medium text-gray-900 mb-2">
              {report.targetContent.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {report.targetContent.content}
            </p>

            {/* Post Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👤 {report.targetContent.author}</span>
                <span>👍 {report.targetContent.likes}</span>
                <span>💬 {report.targetContent.comments}</span>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                  Comment
                </button>
                <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded text-sm">
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target User (for account reports) */}
      {report.targetUser && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Reported Account
          </h4>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {report.targetUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  @{report.targetUser.username}
                </p>
                <p className="text-sm text-gray-500">
                  {report.targetUser.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {report.status === "unreviewed" && (
        <div className="flex space-x-3 justify-evenly">
          <button
            onClick={() => onRemove(report.id)}
            className="cursor-pointer px-10 sm:px-12 md:px-15 lg:px-17 py-2 bg-red-500 text-white rounded-lg font-xl font-black hover:bg-red-600 transition-colors"
          >
            {report.type === "posts" ? "Remove Post" : "Ban Account"}
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
