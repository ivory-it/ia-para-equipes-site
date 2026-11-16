import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Junta classes do Tailwind sem conflito. Padrão do shadcn/ui (AI Elements do Radar IA). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
