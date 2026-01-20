import React from 'react';
import { LogIn, FileUp, Settings, UserPlus, Shield, Clock } from 'lucide-react';

interface ActivityEvent {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  type: 'login' | 'asset' | 'settings' | 'nominee' | 'security' | 'system';
}

interface UserActivityTimelineProps {
  userId: string;
  events: ActivityEvent[];
  showHeader?: boolean;
}

const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({
  userId,
  events,
  showHeader = true,
}) => {
  const activityConfig = {
    login: {
      icon: LogIn,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-200',
    },
    asset: {
      icon: FileUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-200',
    },
    settings: {
      icon: Settings,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      border: 'border-purple-200',
    },
    nominee: {
      icon: UserPlus,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      border: 'border-yellow-200',
    },
    security: {
      icon: Shield,
      color: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-200',
    },
    system: {
      icon: Clock,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      border: 'border-gray-200',
    },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            User Activity Timeline
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            User ID: {userId}
          </p>
        </div>
      )}

      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No activity recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => {
              const config = activityConfig[event.type];
              const Icon = config.icon;
              const isLast = index === events.length - 1;

              return (
                <div key={event.id} className="flex gap-4">
                  {/* Timeline Icon */}
                  <div className="relative flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center z-10`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.action}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Demo Component
const Demo = () => {
  const sampleEvents: ActivityEvent[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      action: 'User Login',
      description: 'Successfully logged in from Chrome on Windows',
      type: 'login',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      action: 'Asset Updated',
      description: 'Modified asset "Last Will & Testament"',
      type: 'asset',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      action: 'Inactivity Period Changed',
      description: 'Updated inactivity period from 90 to 180 days',
      type: 'settings',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      action: 'Nominee Added',
      description: 'Added new nominee: raj.sharma@example.com',
      type: 'nominee',
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      action: 'Password Changed',
      description: 'User changed their password',
      type: 'security',
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      action: 'Account Created',
      description: 'User registered with FREE plan',
      type: 'system',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Activity Timeline
          </h1>
          <p className="text-gray-600">
            Track user actions and system events chronologically
          </p>
        </div>

        <UserActivityTimeline
          userId="U-123456"
          events={sampleEvents}
          showHeader={true}
        />

        {/* Usage Example */}
        <div className="mt-6 bg-gray-900 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-100 mb-3">
            Usage Example
          </h3>
          <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
{`const events = [
  {
    id: '1',
    timestamp: '2024-01-15T14:30:00Z',
    action: 'User Login',
    description: 'Logged in from Chrome',
    type: 'login'
  }
];

<UserActivityTimeline
  userId="U-123456"
  events={events}
  showHeader={true}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Demo;