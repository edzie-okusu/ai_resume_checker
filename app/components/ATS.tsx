import React from "react";

type Suggestion = {
  type: "good" | "improve";
  tip: string;
};

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const getGradient = (score: number) => {
  if (score > 70) return "from-green-100 to-white";
  if (score > 49) return "from-yellow-100 to-white";
  return "from-red-100 to-white";
};

const getIcon = (score: number) => {
  if (score > 70) return "/icons/ats-good.svg";
  if (score > 49) return "/icons/ats-warning.svg";
  return "/icons/ats-bad.svg";
};

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  return (
    <div
      className={`rounded-2xl shadow-lg p-8 bg-gradient-to-br ${getGradient(
        score
      )} w-full max-w-xl mx-auto`}
    >
      {/* Top Section */}
      <div className="flex items-center gap-4 mb-6">
        <img src={getIcon(score)} alt="ATS Icon" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold">ATS Score - {score}/100</h2>
          <p className="text-gray-500">
            Automated Tracking System (ATS) evaluates your resume for job
            compatibility.
          </p>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
        <ul className="space-y-2">
          {suggestions.map((s, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <img
                src={
                  s.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                alt={s.type === "good" ? "Good" : "Improve"}
                className="w-5 h-5"
              />
              <span className="text-gray-700">{s.tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Closing Line */}
      <div className="mt-6 text-center text-gray-600">
        Keep improving your resume for a higher ATS score and better job
        matches!
      </div>
    </div>
  );
};

export default ATS;





