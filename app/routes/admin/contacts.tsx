import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);

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
    const [rowData, setRowData] = useState([
        { email: "test@example.com", firstName: "Test", lastName: "User", tags: [] },
        { email: "john.doe@example.com", firstName: "John", lastName: "Doe", tags: ["old_robolike"] },
        { email: "jane.smith@example.com", firstName: "Jane", lastName: "Smith", tags: ["old_robolike", "old_robolike:sent"] },
        { email: "bob.wilson@example.com", firstName: "Bob", lastName: "Wilson", tags: ["old_robolike", "old_robolike:sent", "old_robolike:viewed"] },
        { email: "alice.johnson@example.com", firstName: "Alice", lastName: "Johnson", tags: ["old_robolike", "old_robolike:sent", "old_robolike:viewed", "old_robolike:clicked"] }
    ]);

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
                    rowData={rowData}
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