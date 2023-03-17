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
    <div className={`${className} flex flex-col items-center rounded-lg p-3 bg-gray-700 w-64`}>
      <div className="text-2xl text-bold text-white">{isLoading ? 'loading' : value}</div>
      <div className="text-lg text-bold text-white">{label}</div>
    </div>
  );
};

export default DashboardStatCell;
