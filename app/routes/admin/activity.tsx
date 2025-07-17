import { Card } from "~/components/Card";
import { H2 } from "~/components/H1";
import { db } from "~/lib/db";
import { useLoaderData, useSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useEffect } from "react";
import { eq, desc, and, lte, gte, count } from "drizzle-orm";
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
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    
    const ITEMS_PER_PAGE = 25;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    let conditions = [];
    if (eventType) conditions.push(eq(analytics.eventType, eventType));
    if (startDate) conditions.push(gte(analytics.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(analytics.createdAt, new Date(endDate)));

    // Get total count
    const [{ value: totalCount }] = await db
        .select({ value: count() })
        .from(analytics)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Get paginated events
    const events = await db
        .select()
        .from(analytics)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(ITEMS_PER_PAGE)
        .offset(offset)
        .orderBy(desc(analytics.createdAt));

    // Calculate pagination values
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        events,
        totalCount,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        currentEventType: eventType,
        currentStartDate: startDate,
        currentEndDate: endDate
    };
}

export default function AdminActivity() {
    const { 
        events, 
        totalCount, 
        currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
        currentEventType, 
        currentStartDate, 
        currentEndDate 
    } = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "") {
            searchParams.delete("eventType");
        } else {
            searchParams.set("eventType", value);
        }
        // Reset to page 1 when filter changes
        searchParams.delete("page");
        setSearchParams(searchParams);
    };

    const handleDateChange = (type: 'startDate' | 'endDate', value: string) => {
        if (value === "") {
            searchParams.delete(type);
            // Reset to page 1 when filter changes
            searchParams.delete("page");
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
        // Reset to page 1 when filter changes
        searchParams.delete("page");
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
    
    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
    };
    
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if there are 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);
            
            // Calculate start and end of visible pages
            let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
            
            // Adjust if at the edges
            if (endPage - startPage < maxVisiblePages - 3) {
                startPage = Math.max(2, endPage - (maxVisiblePages - 3));
            }
            
            // Add ellipsis if needed
            if (startPage > 2) {
                pageNumbers.push('...');
            }
            
            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
            
            // Add ellipsis if needed
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }
            
            // Always show last page
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">User Activity</h2>
                        <p className="text-gray-600">
                            {totalCount.toLocaleString()} total events
                        </p>
                    </div>
                    <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            (currentEventType || currentStartDate || currentEndDate) 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                            const filterSection = document.getElementById('filterSection');
                            if (filterSection) {
                                filterSection.classList.toggle('hidden');
                            }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
                        </svg>
                        {(currentEventType || currentStartDate || currentEndDate) ? 'Filters Applied' : 'Filter Events'}
                    </button>
                </div>

                {/* Filter Section */}
                <div id="filterSection" className="bg-gray-50 border border-gray-200 rounded-lg p-4 hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Type
                            </label>
                            <select
                                id="eventType"
                                value={currentEventType || ""}
                                onChange={handleEventTypeChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">All Events</option>
                                {EVENT_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                After Date
                            </label>
                            <input
                                type="datetime-local"
                                id="startDate"
                                value={formatDateForInput(currentStartDate)}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Before Date
                            </label>
                            <input
                                type="datetime-local"
                                id="endDate"
                                value={formatDateForInput(currentEndDate)}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                    {events.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">📊</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-600">
                                No events match the selected criteria. Try adjusting your filters.
                            </p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 mb-2">{event.description}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium text-gray-700">Type:</span> {event.eventType}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Value:</span> {event.eventValue || "—"}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Path:</span> {event.path || "—"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-6 text-right">
                                        <time className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                                            {new Date(event.createdAt).toLocaleString()}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                        {/* First page button */}
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center w-9 h-9 rounded-md border ${
                                currentPage === 1 
                                    ? 'border-[var(--color-primaryOrange)]/20 text-[var(--color-primaryOrange)]/30 cursor-not-allowed' 
                                    : 'border-[var(--color-primaryOrange)]/40 text-[var(--color-primaryOrange)] hover:bg-[var(--color-primaryOrange)]/10 hover:border-[var(--color-primaryOrange)]'
                            } transition-colors`}
                            aria-label="Go to first page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M15.79 14.77a.75.75 0 0 1-1.06.02l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 1 1 1.04 1.08L11.832 10l3.938 3.71a.75.75 0 0 1 .02 1.06Zm-6 0a.75.75 0 0 1-1.06.02l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 1 1 1.04 1.08L5.832 10l3.938 3.71a.75.75 0 0 1 .02 1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {/* Previous button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!hasPrevPage}
                            className={`flex items-center justify-center w-9 h-9 rounded-md border ${
                                !hasPrevPage
                                    ? 'border-[var(--color-primaryOrange)]/20 text-[var(--color-primaryOrange)]/30 cursor-not-allowed' 
                                    : 'border-[var(--color-primaryOrange)]/40 text-[var(--color-primaryOrange)] hover:bg-[var(--color-primaryOrange)]/10 hover:border-[var(--color-primaryOrange)]'
                            } transition-colors`}
                            aria-label="Previous page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {/* Page numbers */}
                        {getPageNumbers().map((pageNum, index) => (
                            typeof pageNum === 'number' ? (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`flex items-center justify-center w-9 h-9 rounded-md ${
                                        currentPage === pageNum
                                            ? 'bg-[var(--color-primaryOrange)] text-black font-bold'
                                            : 'border border-[var(--color-primaryOrange)]/40 text-[var(--color-primaryOrange)] hover:bg-[var(--color-primaryOrange)]/10 hover:border-[var(--color-primaryOrange)]'
                                    } transition-colors`}
                                    aria-label={`Page ${pageNum}`}
                                    aria-current={currentPage === pageNum ? 'page' : undefined}
                                >
                                    {pageNum}
                                </button>
                            ) : (
                                <span key={index} className="w-6 text-center text-[var(--color-primaryOrange)]">
                                    {pageNum}
                                </span>
                            )
                        ))}
                        
                        {/* Next button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasNextPage}
                            className={`flex items-center justify-center w-9 h-9 rounded-md border ${
                                !hasNextPage
                                    ? 'border-[var(--color-primaryOrange)]/20 text-[var(--color-primaryOrange)]/30 cursor-not-allowed' 
                                    : 'border-[var(--color-primaryOrange)]/40 text-[var(--color-primaryOrange)] hover:bg-[var(--color-primaryOrange)]/10 hover:border-[var(--color-primaryOrange)]'
                            } transition-colors`}
                            aria-label="Next page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {/* Last page button */}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center w-9 h-9 rounded-md border ${
                                currentPage === totalPages
                                    ? 'border-[var(--color-primaryOrange)]/20 text-[var(--color-primaryOrange)]/30 cursor-not-allowed' 
                                    : 'border-[var(--color-primaryOrange)]/40 text-[var(--color-primaryOrange)] hover:bg-[var(--color-primaryOrange)]/10 hover:border-[var(--color-primaryOrange)]'
                            } transition-colors`}
                            aria-label="Go to last page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M4.21 5.23a.75.75 0 0 1 1.06-.02l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08L8.168 10 4.23 6.29a.75.75 0 0 1-.02-1.06Zm6 0a.75.75 0 0 1 1.06-.02l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08L14.168 10l-3.938-3.71a.75.75 0 0 1-.02-1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 