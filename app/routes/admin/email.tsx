import { Card } from "~/components/Card";
import { H2 } from "~/components/H1";

export default function AdminEmail() {
    return (
        <div className="space-y-6">
            <Card>
                <H2 className="mb-4">Email Marketing</H2>
                <p className="text-gray-300">
                    A powerful email marketing automation tool designed to scale your outreach efficiently and intelligently.
                </p>

                <div className="mt-6 space-y-6">
                    <div>
                        <h4 className="text-lg font-medium text-[#07b0ef] mb-2">Smart Email Distribution</h4>
                        <ul className="list-disc pl-5 text-gray-300 space-y-2">
                            <li>Upload and manage lists of target email addresses</li>
                            <li>Configurable daily email sending limits (X emails per day)</li>
                            <li>Automatic scaling of email volume based on delivery success and engagement metrics</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-[#07b0ef] mb-2">Advanced Testing & Analytics</h4>
                        <ul className="list-disc pl-5 text-gray-300 space-y-2">
                            <li>A/B testing capabilities for email content and subject lines</li>
                            <li>Comprehensive tracking of key metrics:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Open rates</li>
                                    <li>Link click-through rates</li>
                                    <li>Delivery success rates</li>
                                    <li>Engagement patterns</li>
                                </ul>
                            </li>
                            <li>Performance analytics stored in local SQLite database</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-medium text-[#07b0ef] mb-2">Email Service Provider Integration</h4>
                        <ul className="list-disc pl-5 text-gray-300 space-y-2">
                            <li>Compatible with any Transactional Email Service Provider</li>
                            <li>Direct integration bypassing expensive marketing tiers</li>
                            <li>Optimized for cost-effective, high-volume email campaigns</li>
                        </ul>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#FA8E10]/30 p-4 rounded-lg mt-8">
                        <p className="text-sm text-[#FDB95C] italic">
                            This feature is currently in development. We're building it to help you scale your email marketing efforts
                            while maintaining high deliverability and engagement rates, all at a fraction of the cost of traditional
                            email marketing platforms.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
} 