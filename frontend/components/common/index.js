/**
 * Common Components Index
 * Re-export all common components for easy importing
 */

export { default as EmptyState } from './EmptyState';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as Badge } from './Badge';
export { default as Card } from './Card';
export { default as SectionHeader } from './SectionHeader';
export { default as ActionButton } from './ActionButton';
export { default as FilterBar } from './FilterBar';

/**
 * Usage in components:
 * 
 * Instead of:
 *   import EmptyState from '@/components/common/EmptyState';
 *   import Badge from '@/components/common/Badge';
 * 
 * Simply use:
 *   import { EmptyState, Badge } from '@/components/common';
 */
