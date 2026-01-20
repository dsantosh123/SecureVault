import React from 'react';
import { TrendingUp, TrendingDown, Minus, Users, Shield, FileCheck, AlertCircle, Database, Clock } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  description?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  description,
  onClick,
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    gray: {
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
    },
  };

  const styles = colorStyles[color];

  const TrendIcon = trend?.direction === 'up' 
    ? TrendingUp 
    : trend?.direction === 'down' 
    ? TrendingDown 
    : Minus;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-gray-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <TrendIcon
                className={`w-4 h-4 ${
                  trend.direction === 'up'
                    ? 'text-green-600'
                    : trend.direction === 'down'
                    ? 'text-red-600'
                    : 'text-gray-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  trend.direction === 'up'
                    ? 'text-green-600'
                    : trend.direction === 'down'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {trend.value > 0 ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>

        <div className={`${styles.iconBg} rounded-lg p-3`}>
          <Icon className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const Demo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Stats Cards
          </h1>
          <p className="text-gray-600">
            Reusable stat cards for dashboard overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value="1,247"
            icon={Users}
            color="blue"
            trend={{
              value: 12.5,
              direction: 'up',
              label: 'vs last month',
            }}
            description="Registered accounts"
          />

          <StatsCard
            title="Pending Verifications"
            value="23"
            icon={Clock}
            color="yellow"
            trend={{
              value: -8.2,
              direction: 'down',
              label: 'vs last week',
            }}
            description="Awaiting admin review"
            onClick={() => alert('Navigate to verification queue')}
          />

          <StatsCard
            title="Approved Today"
            value="8"
            icon={FileCheck}
            color="green"
            trend={{
              value: 15.3,
              direction: 'up',
              label: 'vs yesterday',
            }}
            description="Verifications processed"
          />

          <StatsCard
            title="Active Assets"
            value="3,892"
            icon={Database}
            color="purple"
            description="Total encrypted assets (count only)"
          />

          <StatsCard
            title="Inactive Triggers"
            value="47"
            icon={AlertCircle}
            color="red"
            trend={{
              value: 0,
              direction: 'neutral',
              label: 'no change',
            }}
            description="Users past inactivity period"
          />

          <StatsCard
            title="System Health"
            value="99.9%"
            icon={Shield}
            color="green"
            trend={{
              value: 0.1,
              direction: 'up',
              label: 'uptime',
            }}
            description="Last 30 days"
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-100 mb-3">
            Usage Examples
          </h3>
          <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
{`// Basic Usage
<StatsCard
  title="Total Users"
  value="1,247"
  icon={Users}
  color="blue"
/>

// With Trend
<StatsCard
  title="Pending Verifications"
  value="23"
  icon={Clock}
  color="yellow"
  trend={{
    value: -8.2,
    direction: 'down',
    label: 'vs last week'
  }}
/>

// Clickable Card
<StatsCard
  title="Approved Today"
  value="8"
  icon={FileCheck}
  color="green"
  onClick={() => router.push('/admin/verification')}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Demo;