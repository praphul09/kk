'use client'

import { useEffect, useState } from "react";
import { DBTables } from "../../../enums/Tables";
import { Contact } from "../../../types/contact";
import { createClient } from "../../../utils/supabase-browser";
import ContactUI from "./ContactUI";

export default function ChatContactsClient({ contacts, city, filter }: { contacts: Contact[], city:string, filter:string }) {
    const [supabase] = useState(() => createClient())
    const [contactsState, setContacts ] = useState<Contact[]>(contacts)
    
    const refilter = (filterVar:string) => {
        switch (filterVar) {
            case "sent":
            case "seen":
            case "read":
            case "received":
            case "automsg":
            case "failed":
            case "delivered":
                let newState = contactsState.map ((contact: Contact)=> {
                    if(contact.laststatus != filterVar)
                        contact.hide = true
                    else
                        contact.hide = false

                    return contact
                })

                setContacts(newState)
            break;
            case "all":
            default: 
                let newState2 = contactsState.map ((contact: Contact)=> {
                    
                    contact.hide = false

                    return contact
                })

                setContacts(newState2)
                break;
        }
    }

    useEffect(() => {
        refilter(filter)
      }, [filter]);


    useEffect(() => {
        const channel = supabase
            .channel('any')
            .on<Contact>('postgres_changes', { event: '*', schema: 'public', table: DBTables.Contacts }, payload => {
                switch(payload.eventType) {
                    case "INSERT":
                        contactsState.splice(0, 0, payload.new)
                        setContacts([...contactsState])
                        refilter(filter)
                        break;
                    case "UPDATE":
                        console.log("updated")
                        const indexOfItem = contactsState.findIndex((contact: Contact) => contact.wa_id == payload.old.wa_id)
                        if (indexOfItem !== -1) {
                            contactsState[indexOfItem] = payload.new
                            contactsState.sort((a: Contact, b: Contact) => {
                                if (!a.last_message_at || !b.last_message_at) {
                                    return 0;
                                }
                                const aDate = new Date(a.last_message_at)
                                const bDate =  new Date(b.last_message_at)
                                if (aDate > bDate) {
                                    return -1;
                                } else if (bDate > aDate) {
                                    return 1;
                                }
                                return 0;
                            })
                            setContacts([...contactsState])
                            refilter(filter)
                        } else {
                            console.warn(`Could not find contact to update contact for id: ${payload.old.wa_id}`)
                        }
                        break;
                    case "DELETE":
                        const newContacts = contactsState.filter((item: Contact) => item.wa_id != payload.old.wa_id)
                        setContacts(newContacts)
                        refilter(filter)
                        break;
                }
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    })

    
    return (
        <div className="flex flex-col">
            {contactsState && contactsState.map(contact => {
                return contact.hide != undefined && contact.hide == true ? <></>: <ContactUI key={contact.wa_id} contact={contact} city={city} />
            })}
            {!contactsState && <div>No contacts to show</div>}
        </div>
    )
}
