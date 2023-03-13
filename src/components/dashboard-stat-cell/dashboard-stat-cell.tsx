import styles from './dashboard-stat-cell.module.css';

interface DashboardStatCellProps {
  isLoading?: boolean;
  value: number;
  label: string;
  className?: string;
}

const DashboardStatCell = ({
  isLoading,
  value,
  label,
  className,
}: DashboardStatCellProps) => {
  return (
    <div className={`${className} ${styles.cell}`}>
      <p>{isLoading ? 'loading' : value}</p>
      <p>{label}</p>
    </div>
  );
};

export default DashboardStatCell;
