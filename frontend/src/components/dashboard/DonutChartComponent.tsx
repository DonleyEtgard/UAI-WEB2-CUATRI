import Chart from 'react-apexcharts';
import { Card, Typography } from '@mui/material';

interface DonutChartProps {
  title: string;
  series: number[];
  labels: string[];
}

export const DonutChartComponent = ({ title, series, labels }: DonutChartProps) => {
  const options: ApexCharts.ApexOptions = {
    chart: { type: 'donut', toolbar: { show: false }, background: 'transparent' },
    labels,
    colors: ['#6366f1', '#818cf8', '#a78bfa', '#c084fc', '#e879f9'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { fontSize: '1rem', color: '#64748b' },
            value: { fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 },
            total: { show: true, fontSize: '1rem', color: '#64748b', label: 'Total' },
          },
        },
      },
    },
    legend: { position: 'bottom', fontSize: '13px', labels: { colors: '#64748b' }, itemMargin: { horizontal: 8 } },
    tooltip: { theme: 'light', style: { fontSize: '12px' } },
    dataLabels: { enabled: true, formatter: (val: string) => `${val}%`, style: { colors: ['#0f172a'], fontSize: '12px', fontWeight: 700 } },
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
      <Chart options={options} series={series} type="donut" height={320} />
    </Card>
  );
};
