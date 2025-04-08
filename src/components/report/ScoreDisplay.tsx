
import { Progress } from '@/components/ui/progress';

interface ScoreDisplayProps {
  matchScore: number;
}

export const ScoreDisplay = ({ matchScore }: ScoreDisplayProps) => {
  const scoreColor = matchScore >= 80 
    ? 'bg-green-500' 
    : matchScore >= 60 
      ? 'bg-yellow-500' 
      : 'bg-red-500';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Overall Match</span>
        <span className="text-sm font-medium">{matchScore}%</span>
      </div>
      <Progress value={matchScore} className={scoreColor} />
    </div>
  );
};
