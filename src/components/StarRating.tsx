import { Star } from 'lucide-react';

interface Props {
  rating: number;
  onRate?: (r: number) => void;
  size?: number;
}

const StarRating = ({ rating, onRate, size = 16 }: Props) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <button
        key={i}
        onClick={() => onRate?.(i)}
        disabled={!onRate}
        className="disabled:cursor-default"
      >
        <Star
          size={size}
          className={i <= rating ? 'fill-primary text-primary' : 'text-border'}
        />
      </button>
    ))}
  </div>
);

export default StarRating;
