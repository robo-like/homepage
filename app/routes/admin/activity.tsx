import { Card } from "~/components/Card";
import { H2 } from "~/components/H1";
import { analyticsQueries, db } from "~/lib/db";
import { useLoaderData, useSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { eq, desc, asc, and, lte, gte, gt, isNull } from "drizzle-orm";
import { analytics } from "~/lib/db/schema";

// Define available event types
const EVENT_TYPES = [
    "pageView",
    "signup",
    "loginSuccess",
    "loginFailed",
    "download",
    "subscriptionStarted",
    "subscriptionCanceled",
    "subscriptionUpdated",
    "subscriptionUpdatedInApp",
    "subscriptionAbandoned",
    "subscriptionCheckoutError",
    "userCreated",
    "productEvent",
] as const;

type EventType = typeof EVENT_TYPES[number];

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const eventType = url.searchParams.get("eventType") as EventType | null;
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let query = db.select().from(analytics);

    if (eventType) {
        query = query.where(eq(analytics.eventType, eventType));
    }

    // Get events with optional filters
    const events = await analyticsQueries.queryEvents({
        eventType: eventType || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: 15,
    });

    return {
        events,
        currentEventType: eventType,
        currentStartDate: startDate,
        currentEndDate: endDate
    };
}

export default function AdminActivity() {
    const { events, currentEventType, currentStartDate, currentEndDate } = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "") {
            searchParams.delete("eventType");
        } else {
            searchParams.set("eventType", value);
        }
        setSearchParams(searchParams);
    };

    const handleDateChange = (type: 'startDate' | 'endDate', value: string) => {
        if (value === "") {
            searchParams.delete(type);
            setSearchParams(searchParams);
            return;
        }

        // Convert to ISO string for URL compatibility
        const newDate = new Date(value).toISOString();

        // Validate date range
        if (type === 'startDate' && searchParams.get('endDate')) {
            const endDate = new Date(searchParams.get('endDate')!);
            if (new Date(value) > endDate) {
                return; // Don't update if start date is after end date
            }
        }
        if (type === 'endDate' && searchParams.get('startDate')) {
            const startDate = new Date(searchParams.get('startDate')!);
            if (new Date(value) < startDate) {
                return; // Don't update if end date is before start date
            }
        }

        searchParams.set(type, newDate);
        setSearchParams(searchParams);
    };

    // Convert ISO dates to local datetime-local format
    const formatDateForInput = (isoDate: string | null) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    };

    return (
        <Card>
            <div className="flex flex-col space-y-4 mb-4">
                <div className="flex justify-between items-center">
                    <H2 className="text-[#07b0ef]">User Activity</H2>
                    <select
                        value={currentEventType || ""}
                        onChange={handleEventTypeChange}
                        className="bg-[#0A0A0A] border border-[#07b0ef]/30 rounded px-3 py-2 text-sm text-[#FDB95C] focus:border-[#07b0ef] focus:outline-none"
                    >
                        <option value="">All Events</option>
                        {EVENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="startDate" className="text-sm text-[#ed1e79]">
                            After:
                        </label>
                        <input
                            type="datetime-local"
                            id="startDate"
                            value={formatDateForInput(currentStartDate)}
                            onChange={(e) => handleDateChange('startDate', e.target.value)}
                            className="bg-[#0A0A0A] border border-[#07b0ef]/30 rounded px-3 py-2 text-sm text-[#FDB95C] focus:border-[#07b0ef] focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="endDate" className="text-sm text-[#ed1e79]">
                            Before:
                        </label>
                        <input
                            type="datetime-local"
                            id="endDate"
                            value={formatDateForInput(currentEndDate)}
                            onChange={(e) => handleDateChange('endDate', e.target.value)}
                            className="bg-[#0A0A0A] border border-[#07b0ef]/30 rounded px-3 py-2 text-sm text-[#FDB95C] focus:border-[#07b0ef] focus:outline-none"
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                {events.length === 0 ? (
                    <p className="text-[#FA8E10] italic">No events found for the selected criteria</p>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className="flex justify-between items-center py-3 px-3 border-b border-[#07b0ef]/20 last:border-0 hover:bg-[rgba(7,176,239,0.05)] rounded-lg transition-colors"
                        >
                            <div>
                                <p className="text-white font-semibold mb-1">{event.description}</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <p className="text-sm text-[#9633ac]">
                                        <span className="text-[#ed1e79]">Type:</span> {event.eventType}
                                    </p>
                                    <p className="text-sm text-[#9633ac]">
                                        <span className="text-[#ed1e79]">Value:</span> {event.eventValue || "—"}
                                    </p>
                                    <p className="text-sm text-[#9633ac]">
                                        <span className="text-[#ed1e79]">Path:</span> {event.path || "—"}
                                    </p>
                                </div>
                            </div>
                            <time className="text-sm text-[#FA8E10] bg-[rgba(250,142,16,0.1)] px-2 py-1 rounded whitespace-nowrap">
                                {new Date(event.createdAt).toLocaleString()}
                            </time>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
} 