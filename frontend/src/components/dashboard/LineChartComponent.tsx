import Chart from 'react-apexcharts';
import { Card, Typography } from '@mui/material';

interface LineChartProps {
  title: string;
  series: Array<{
    name: string;
    data: number[];
  }>;
  categories: string[];
}

export const LineChartComponent = ({ title, series, categories }: LineChartProps) => {
  const options: ApexCharts.ApexOptions = {
    chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories,
      labels: { style: { colors: '#64748b', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' } } },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
    tooltip: { theme: 'light', style: { fontSize: '12px' } },
    colors: ['#6366f1', '#3b82f6'],
    fill: { opacity: 0.12, type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02, stops: [20, 100, 100] } },
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
        {title}
      </Typography>
      <Chart options={options} series={series} type="line" height={320} />
    </Card>
  );
};
