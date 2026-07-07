import Chart from 'react-apexcharts';
import { Card, Typography } from '@mui/material';

interface BarChartProps {
  title: string;
  series: Array<{
    name: string;
    data: number[];
  }>;
  categories: string[];
}

export const BarChartComponent = ({ title, series, categories }: BarChartProps) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 6,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 0, colors: ['transparent'] },
    xaxis: {
      categories: categories.map(c => c.length > 15 ? `${c.substring(0, 15)}...` : c),
      labels: { style: { colors: '#64748b', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' } } },
    fill: { opacity: 1 },
    tooltip: { theme: 'light', style: { fontSize: '12px' } },
    colors: ['#6366f1', '#818cf8'],
    grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
        {title}
      </Typography>
      <Chart options={options} series={series} type="bar" height={320} />
    </Card>
  );
};
