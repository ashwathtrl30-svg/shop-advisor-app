import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { ShopData, getLast7Days, calculateDailyTotals, formatCurrency } from '../models/data';

interface WeeklyChartProps {
  data: ShopData;
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const { lang } = useTranslation();
  const last7Days = getLast7Days();
  const dailyTotals = calculateDailyTotals(data);

  // Get data for each day
  const chartData = last7Days.map(date => {
    const dayData = dailyTotals.find(d => d.date === date);
    return {
      date,
      sales: dayData?.totalSales || 0,
      expenses: dayData?.totalExpenses || 0,
      profit: (dayData?.totalSales || 0) - (dayData?.totalExpenses || 0),
    };
  });

  // Calculate max value for scaling
  const maxSales = Math.max(...chartData.map(d => d.sales), 1);

  // Calculate week comparison
  const thisWeek = chartData.slice(0, 4).reduce((sum, d) => sum + d.sales, 0);
  const lastWeek = chartData.slice(4).reduce((sum, d) => sum + d.sales, 0);
  const difference = thisWeek - lastWeek;

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayNames = lang === 'hi' 
      ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[date.getDay()];
  };

  const getComparisonText = () => {
    if (lastWeek === 0 && thisWeek === 0) {
      return lang === 'hi' ? 'इस हफ्ते डेटा डालें' : 'Add data this week';
    }
    if (lastWeek === 0) {
      return lang === 'hi' ? 'पिछले हफ्ते का डेटा नहीं है' : 'No data from last week';
    }
    if (difference > 0) {
      return lang === 'hi' 
        ? `इस हफ्ते ${formatCurrency(difference)} ज़्यादा कमाया`
        : `Earned ${formatCurrency(difference)} more this week`;
    } else if (difference < 0) {
      return lang === 'hi'
        ? `पिछले हफ्ते ${formatCurrency(Math.abs(difference))} ज़्यादा था`
        : `Last week was ${formatCurrency(Math.abs(difference))} better`;
    }
    return lang === 'hi' ? 'दोनों हफ्ते बराबर' : 'Both weeks are equal';
  };

  return (
    <div className="card" style={{ padding: 'var(--space-lg)' }}>
      <h3 className="text-heading-3" style={{ margin: '0 0 var(--space-md) 0' }}>
        {lang === 'hi' ? 'पिछले 7 दिन' : 'Last 7 Days'}
      </h3>

      {/* Chart */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '120px',
        gap: 'var(--space-xs)',
        marginBottom: 'var(--space-md)',
      }}>
        {chartData.map((day, index) => {
          const height = (day.sales / maxSales) * 100;
          const isToday = index === chartData.length - 1;
          
          return (
            <div
              key={day.date}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '40px',
                  height: `${Math.max(height, 4)}%`,
                  backgroundColor: isToday ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  transition: 'height 0.3s ease',
                  minHeight: '4px',
                }}
              />
              {/* Day label */}
              <span style={{
                fontSize: '12px',
                color: isToday ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: isToday ? 600 : 400,
              }}>
                {getDayLabel(day.date)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary text */}
      <p className="text-body-md" style={{
        margin: 0,
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
      }}>
        {getComparisonText()}
      </p>
    </div>
  );
}
