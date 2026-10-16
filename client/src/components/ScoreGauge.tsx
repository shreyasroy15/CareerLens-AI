import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showGrade?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 'md',
  label = 'Compatibility Score',
  showGrade = true,
}) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  // SVG Gauge calculations
  const radius = size === 'lg' ? 60 : size === 'md' ? 44 : 28;
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let grade = 'Strong Match';
  if (normalizedScore < 45) {
    colorClass = 'text-rose-500';
    grade = 'Low Match';
  } else if (normalizedScore < 65) {
    colorClass = 'text-amber-500';
    grade = 'Moderate Match';
  } else if (normalizedScore < 80) {
    colorClass = 'text-brand-500';
    grade = 'Good Match';
  }

  const dimension = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={dimension} height={dimension} className="transform -rotate-90">
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${
            size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'
          }`}>
            {normalizedScore}%
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      )}
      {showGrade && (
        <span className={`text-xs font-medium mt-0.5 ${colorClass}`}>
          {grade}
        </span>
      )}
    </div>
  );
};
