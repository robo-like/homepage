import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { requireAuth } from '~/lib/auth';
import { db } from '~/lib/db';
import { contacts } from '~/lib/db/schema';
import type { Route } from './+types/contacts';
import { useLoaderData } from 'react-router';

ModuleRegistry.registerModules([AllCommunityModule]);

export async function loader({ request }: Route.LoaderArgs) {
    const authData = await requireAuth(request, "/auth/login?admin=true", ["admin"]);
    if (authData?.user?.role !== "admin") {
        return new Response("Unauthorized", { status: 401 });
    }

    const fetchedContacts = await db.select().from(contacts);

    console.log(fetchedContacts);

    return { contacts: fetchedContacts };
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