import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useState, useRef } from 'react';
import { requireAuth } from '~/lib/auth';
import { db } from '~/lib/db';
import { contacts } from '~/lib/db/schema';
import type { Route } from './+types/contacts';
import { useLoaderData, Form } from 'react-router';
import { eq } from 'drizzle-orm';

ModuleRegistry.registerModules([AllCommunityModule]);

export async function loader({ request }: Route.LoaderArgs) {
    const authData = await requireAuth(request, "/auth/login?admin=true", ["admin"]);
    if (authData?.user?.role !== "admin") {
        return new Response("Unauthorized", { status: 401 });
    }

    const fetchedContacts = await db.select().from(contacts);
    return { contacts: fetchedContacts };
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const csvFile = formData.get('csv') as File;
    
    if (!csvFile) {
        return { error: 'No file uploaded' };
    }

    const text = await csvFile.text();
    const rows = text.split('\n').filter(row => row.trim());
    const headers = rows[0].split(',').map(h => h.trim());
    
    const contactsToUpsert = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        const contact: any = {};
        
        headers.forEach((header, i) => {
            if (header === 'tags') {
                contact[header] = values[i] ? values[i].split(';') : [];
            } else {
                contact[header] = values[i] || null;
            }
        });
        
        return contact;
    });

    for (const contact of contactsToUpsert) {
        const existing = await db
            .select()
            .from(contacts)
            .where(eq(contacts.email, contact.email))
            .get();

        if (existing) {
            await db
                .update(contacts)
                .set(contact)
                .where(eq(contacts.email, contact.email));
        } else {
            await db.insert(contacts).values(contact);
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

export default function Contacts() {
    const { contacts } = useLoaderData<typeof loader>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { field: "email" as const, filter: true },
        { field: "firstName" as const, filter: true },
        { field: "lastName" as const, filter: true },
        { 
            field: "tags" as const,
            cellRenderer: TagsRenderer,
            autoHeight: true,
            width: 400,
            cellStyle: { padding: '8px' },
            filter: true
        }
    ]);

    return (
        <div>
            <div className="mb-4">
                <Form method="post" encType="multipart/form-data">
                    <input 
                        type="file" 
                        name="csv" 
                        accept=".csv"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => e.target.form?.submit()}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Import CSV
                    </button>
                </Form>
            </div>
            <div style={{ height: 800 }}>
                <AgGridReact
                    rowData={contacts}
                    columnDefs={colDefs}
                    defaultColDef={{
                        sortable: true,
                        floatingFilter: true
                    }}
                />
            </div>
        </div>
    );
}