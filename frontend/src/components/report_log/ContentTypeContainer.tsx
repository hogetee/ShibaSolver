export default function ContentTypeContainer(
  reportType: string,
  handleTypeChange: (type: "posts" | "comments" | "account") => void
) {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={() => handleTypeChange("posts")}
        className={`pb-2 font-medium transition-colors cursor-pointer ${
          reportType === "posts"
            ? "text-dark-900 border-b-2 border-accent-400"
            : "text-dark-900/50 hover:text-gray-700"
        }`}
      >
        Posts
      </button>
      <button
        onClick={() => handleTypeChange("comments")}
        className={`pb-2 font-medium transition-colors cursor-pointer ${
          reportType === "comments"
            ? "text-dark-900 border-b-2 border-accent-400"
            : "text-dark-900/50 hover:text-gray-700"
        }`}
      >
        Comments
      </button>
      <button
        onClick={() => handleTypeChange("account")}
        className={`pb-2 font-medium transition-colors cursor-pointer ${
          reportType === "account"
            ? "text-dark-900 border-b-2 border-accent-400"
            : "text-dark-900/50 hover:text-gray-700"
        }`}
      >
        Account
      </button>
    </div>
  );
}
