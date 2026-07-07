import Chart from 'react-apexcharts';
import { Card, Typography } from '@mui/material';

interface AreaChartProps {
  title: string;
  series: Array<{
    name: string;
    data: number[];
  }>;
  categories: string[];
}

export const AreaChartComponent = ({ title, series, categories }: AreaChartProps) => {
  const options: ApexCharts.ApexOptions = {
    chart: { type: 'area', toolbar: { show: false }, background: 'transparent', zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories,
      labels: { style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 } } },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [20, 100, 100] } },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
    tooltip: { theme: 'light', style: { fontSize: '12px' } },
    colors: ['#6366f1'],
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
      <Chart options={options} series={series} type="area" height={320} />
    </Card>
  );
};
