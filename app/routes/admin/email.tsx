import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { sql } from 'drizzle-orm'; 
import { useState, useRef } from 'react';
import { requireAuth } from '~/lib/auth';
import { db } from '~/lib/db';
import { contacts } from '~/lib/db/schema';
import type { Route } from './+types/email';
import { useLoaderData, Form } from 'react-router';

ModuleRegistry.registerModules([AllCommunityModule]);

export async function loader({ request }: Route.LoaderArgs) {
    const authData = await requireAuth(request, "/auth/login?admin=true", ["admin"]);
    if (authData?.user?.role !== "admin") {
        return new Response("Unauthorized", { status: 401 });
    }

    const fetchedContacts = await db
        .select()
        .from(contacts)
        .where(
            sql`NOT EXISTS (
                SELECT 1 FROM json_each(${contacts.tags})
                WHERE value = 'old_robolike:sent'
            )`
        );

    return { contacts: fetchedContacts };
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const selectedEmails = JSON.parse(formData.get('selectedEmails') as string);
    
    for (const email of selectedEmails) {
        const contact = await db
            .select()
            .from(contacts)
            .where(sql`${contacts.email} = ${email}`)
            .get();

        if (contact) {
            const updatedTags = [...contact.tags, 'old_robolike:sent'];
            await db
                .update(contacts)
                .set({ tags: updatedTags })
                .where(sql`${contacts.email} = ${email}`);
        }
    }

    return { success: true };
}

const TagsRenderer = (props: { value: string[] }) => {
    return (
        <div className="flex gap-1 flex-wrap">
            {props.value.map((tag, i) => (
                <span 
                    key={i}
                    className="px-2 py-1 rounded-full text-xs bg-[#07b0ef]/20 text-[#07b0ef] border border-[#07b0ef]/30"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
};

export default function AdminEmail() {
    const { contacts } = useLoaderData<typeof loader>();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const [colDefs] = useState([
        { field: "email", filter: true, checkboxSelection: true },
        { field: "firstName", filter: true },
        { field: "lastName", filter: true },
        { 
            field: "tags",
            cellRenderer: TagsRenderer,
            autoHeight: true,
            width: 400,
            cellStyle: { padding: '8px' },
            filter: true
        }
    ]);

    const handleSendEmails = () => {
        if (selectedRows.length === 0) {
            alert('Please select at least one contact');
            return;
        }

        if (confirm(`Are you sure you want to send emails to ${selectedRows.length} contacts?`)) {
            const form = document.createElement('form');
            form.method = 'POST';
            
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'selectedEmails';
            input.value = JSON.stringify(selectedRows.map(row => row.email));
            
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    };

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <button
                    onClick={handleSendEmails}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Send Emails ({selectedRows.length} selected)
                </button>
            </div>

            <div style={{ height: 800 }}>
                <AgGridReact
                    rowData={contacts}
                    columnDefs={colDefs}
                    defaultColDef={{
                        sortable: true,
                        floatingFilter: true
                    }}
                    rowSelection="multiple"
                    onSelectionChanged={(event) => {
                        setSelectedRows(event.api.getSelectedRows());
                    }}
                />
            </div>
        </div>
    );
}