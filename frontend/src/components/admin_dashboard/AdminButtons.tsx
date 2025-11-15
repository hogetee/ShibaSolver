import Link from "next/link";
import { ReactNode } from "react";

export default function AdminButtons({
  adminActions,
}: {
  adminActions: {
    title: string;
    description: string;
    href: string;
    color: string;
    iconColor: string;
    icon?: ReactNode;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {adminActions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className={`block p-6 rounded-lg border-2 transition-colors ${action.color}`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color
                .replace("hover:bg-", "bg-")
                .replace("border-", "bg-")}`}
            >
              {action.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 mb-3">{action.description}</p>
              {/* <div className="text-sm font-medium text-gray-500">
                {action.stats}
              </div> */}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
