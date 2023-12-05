'use client'

import ChatTablesClient from "./ChatTablesClient";
import { useCities } from "./CurrentCityContext";

export const revalidate = 0

export default function     ChatTables() {
    const contactState = useCities();
    if (contactState) {
        return (
            <>
            <div className="flex flex-col">
                <ChatTablesClient contacts={contactState.tables} />
                
            </div>
            
            </>
        )
    } else {
        return (
            <div>
                Unable to fetch contacts
            </div>
        )
    }
}
