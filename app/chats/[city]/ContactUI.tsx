import Link from "next/link";
import { Contact } from "../../../types/contact";
import { DBTables } from "../../../enums/Tables";
import StatusCircle from "../StatusCircle";
import { UPDATE_CURRENT_CONTACT, useCurrentContactDispatch } from "./CurrentContactContext";
import { createClient } from "../../../utils/supabase-browser";
import { useState } from "react";

const updateToSeen = async (contact:Contact ) => {
    console.log("hello")
    const supabase = createClient()
    let { error } = await supabase
              .from(DBTables.Contacts)
              .upsert({
                wa_id: contact.wa_id,
                profile_name: contact.profile_name,
                CARD: contact.CARD,
                last_message_at: (new Date(Date.now())).toDateString(),
                laststatus:"seen",
                dispname: contact.dispname
              })
    if(error) throw error
}

export default function ContactUI(props: { contact: any, city:string }) {
    const { contact, city } = props;
    const setCurrentContact = useCurrentContactDispatch()
    let fillColor = 'white'
    
    switch (contact.laststatus) {
        case "sent":
            fillColor = 'yellow'
            break;
        case "delivered":
            fillColor = 'orange'
            break;
        case "read":
            fillColor = 'green'
            break;
        case "received":
            fillColor = 'pink'
            break;
        case "automsg":
            fillColor = 'black'
            break;
        case "failed":
            fillColor = 'red'
            break;
        case "seen":
            fillColor = 'blue'
            break;
    }

    return (
        <Link href={`/chats/${city}/${contact.wa_id}`} onClick={() => { 
                setCurrentContact && setCurrentContact({ type: UPDATE_CURRENT_CONTACT, waId: contact.wa_id });
                updateToSeen(contact) 
            }}>
            <div className="flex flex-row p-2 hover:bg-background-default-hover gap-4 cursor-pointer">
                <div>
                    <StatusCircle fill={fillColor} />
                </div>
                <div className="flex items-center">
                    <span>{contact.wa_id} ({contact.dispname})</span>
                    {/* TODO: Add some indication that this row is selected based on condition - contact.is_current */}
                </div>
            </div>
        </Link>
    )
}