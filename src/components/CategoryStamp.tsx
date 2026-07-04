import { Category } from '../types';
import {
  Landmark,
  UtensilsCrossed,
  Palette,
  Music,
  Leaf,
  Globe,
} from 'lucide-react';

interface Props {
  category: Category | 'all';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const config: Record<string, { Icon: React.ComponentType<any>; bg: string; text: string; border: string }> = {
  heritage: {
    Icon: Landmark,
    bg: 'bg-night-800',
    text: 'text-ivory-200',
    border: 'border-ivory-400',
  },
  food: {
    Icon: UtensilsCrossed,
    bg: 'bg-marigold-600',
    text: 'text-night-900',
    border: 'border-marigold-400',
  },
  art: {
    Icon: Palette,
    bg: 'bg-teal-600',
    text: 'text-ivory-100',
    border: 'border-teal-400',
  },
  nightlife: {
    Icon: Music,
    bg: 'bg-ink-700',
    text: 'text-marigold-300',
    border: 'border-marigold-600',
  },
  nature: {
    Icon: Leaf,
    bg: 'bg-teal-700',
    text: 'text-ivory-100',
    border: 'border-teal-300',
  },
  all: {
    Icon: Globe,
    bg: 'bg-night-700',
    text: 'text-ivory-200',
    border: 'border-ivory-500',
  },
};

const sizes = {
  sm: { container: 'w-10 h-10', icon: 16 },
  md: { container: 'w-14 h-14', icon: 20 },
  lg: { container: 'w-20 h-20', icon: 28 },
};

export default function CategoryStamp({ category, size = 'md', className = '' }: Props) {
  const c = config[category] ?? config.all;
  const s = sizes[size];
  const { Icon } = c;

  return (
    <div
      role="img"
      aria-label={`Category: ${category}`}
      className={`
        ${s.container} rounded-full flex items-center justify-center
        ${c.bg} ${c.text} stamp-border ${c.border}
        ${className}
      `}
    >
      <Icon size={s.icon} aria-hidden="true" />
    </div>
  );
}
