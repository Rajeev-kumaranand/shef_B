import styles from './Skeleton.module.css';
import { cn } from '../../utils/cn.js';

export default function Skeleton({ width = '100%', height = '20px', className, style, circle = false }) {
  return (
    <div 
      className={cn(styles.skeleton, className)} 
      style={{ 
        width, 
        height, 
        borderRadius: circle ? '50%' : 'var(--radius-sm)',
        ...style 
      }} 
    />
  );
}
