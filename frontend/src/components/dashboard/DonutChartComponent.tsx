import Chart from 'react-apexcharts';
import { Card, Typography } from '@mui/material';

interface DonutChartProps {
  title: string;
  series: number[];
  labels: string[];
}

export const DonutChartComponent = ({ title, series, labels }: DonutChartProps) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    labels,
    colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              fontSize: '14px',
              color: '#9ca3af',
            },
            value: {
              fontSize: '14px',
              color: '#e4e2e4',
              fontWeight: 600,
            },
            total: {
              show: true,
              fontSize: '14px',
              color: '#9ca3af',
              label: 'Total',
            },
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#9ca3af',
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: string) => {
        return val + '%';
      },
      style: {
        colors: ['#e4e2e4'],
        fontSize: '12px',
        fontWeight: 600,
      },
    },
  };

  return (
    <Card
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #1c1c21 0%, #202127 100%)',
        border: '1px solid #2b2d31',
        boxShadow: 'none',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#e4e2e4',
          mb: 2,
          fontSize: '1rem',
        }}
      >
        {title}
      </Typography>
      <Chart options={options} series={series} type="donut" height={350} />
    </Card>
  );
};
