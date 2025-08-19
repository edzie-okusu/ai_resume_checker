import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const getBadgeStyle = (score: number) => {
  if (score > 69) return "bg-badge-green text-green-600";
  if (score > 49) return "bg-badge-yellow text-yellow-600";
  return "bg-badge-red text-red-600";
};

const getBadgeLabel = (score: number) => {
  if (score > 69) return "Strong";
  if (score > 49) return "Good Start";
  return "Needs Work";
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => (
  <div className={`px-3 py-1 rounded-full font-semibold text-sm ${getBadgeStyle(score)}`}>
    <p>{getBadgeLabel(score)}</p>
  </div>
);

export default ScoreBadge;
