import { useEffect, useState, useCallback } from 'react';

interface RealTimeEvent {
  id: string;
  eventType: string;
  eventValue: string | null;
  description: string | null;
  path: string;
  createdAt: Date;
  sessionId: string;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  isNewEvent?: boolean;
  newEventTimestamp?: number;
}

interface SSEMessage {
  type: 'connected' | 'newEvents';
  events?: RealTimeEvent[];
}

export function useRealTimeEvents(enabled: boolean = true) {
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const addNewEvents = useCallback((newEvents: RealTimeEvent[]) => {
    setEvents(prevEvents => {
      // Merge new events with existing ones, avoiding duplicates
      const eventIds = new Set(prevEvents.map(e => e.id));
      const uniqueNewEvents = newEvents.filter(e => !eventIds.has(e.id))
        .map(e => ({
          ...e,
          isNewEvent: true,
          newEventTimestamp: Date.now()
        }));
      
      // Remove expired green highlights and add new events
      const now = Date.now();
      const updatedEvents = prevEvents.map(e => ({
        ...e,
        isNewEvent: e.isNewEvent && e.newEventTimestamp && (now - e.newEventTimestamp) < 5000
      }));
      
      // Add new events to the beginning and limit to 100 total events
      return [...uniqueNewEvents, ...updatedEvents].slice(0, 100);
    });
  }, []);

  // Auto-fade green highlights after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prevEvents => {
        const now = Date.now();
        return prevEvents.map(e => ({
          ...e,
          isNewEvent: e.isNewEvent && e.newEventTimestamp && (now - e.newEventTimestamp) < 5000
        }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const eventSource = new EventSource('/api/admin/activity-stream');

    eventSource.onopen = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEMessage = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          setIsConnected(true);
        } else if (data.type === 'newEvents' && data.events) {
          addNewEvents(data.events);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      setIsConnected(false);
      setConnectionError('Connection lost. Attempting to reconnect...');
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, addNewEvents]);

  return {
    events,
    isConnected,
    connectionError,
    clearEvents: () => setEvents([])
  };
}