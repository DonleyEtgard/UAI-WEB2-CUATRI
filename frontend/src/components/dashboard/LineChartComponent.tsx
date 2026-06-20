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
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
        },
      },
    },
    grid: {
      borderColor: '#2b2d31',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
    },
    colors: ['#6366f1', '#3b82f6'],
    fill: {
      opacity: 0.1,
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
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
      <Chart options={options} series={series} type="line" height={350} />
    </Card>
  );
};
