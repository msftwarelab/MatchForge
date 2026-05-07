import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function titleCase(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function scoreTone(score: number) {
  if (score >= 85) {
    return 'text-emerald-300';
  }
  if (score >= 75) {
    return 'text-sky-300';
  }
  return 'text-amber-300';
}
