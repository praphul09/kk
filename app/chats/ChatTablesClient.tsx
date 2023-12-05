'use client'

import {  useState } from "react";
import CityUI from "./CityUI";

export default function ChatTablesClient({ contacts }: { contacts: [] }) {
    const [contactsState, setContacts ] = useState<[]>(contacts)
    
    return (
        <div className="flex flex-col">
            {contactsState && contactsState.map(contact => {
                return <CityUI key={contact} contact={contact} />
            })}
            {!contactsState && <div>No City to show</div>}
        </div>
    )
}
