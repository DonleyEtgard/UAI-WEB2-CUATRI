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
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent'],
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
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
    },
    colors: ['#6366f1', '#3b82f6'],
    grid: {
      borderColor: '#2b2d31',
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
      <Chart options={options} series={series} type="bar" height={350} />
    </Card>
  );
};
