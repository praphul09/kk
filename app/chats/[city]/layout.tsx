import { DBTables } from "../../../enums/Tables";
import { createClient } from "../../../utils/supabase-server";
import ChatContacts from "./ChatContacts";

import { ContactContextProvider } from "./CurrentContactContext";
import { Contact } from "../../../types/contact";

export default async function ChatsLayout({ params, children }: {
    params:   any
    children: React.ReactNode,

}) {

    const city = params.city

    const supabase = createClient();
    
    const { data: contacts , error } = await supabase
    .from(DBTables.Contacts)
    .select('*')
    .eq('CARD', city)
    .order('last_message_at', { ascending: false })
    
    if (error) throw error
    
    return (
        <ContactContextProvider contacts={contacts}  city = {city}>
            <>
                <div className="flex-17 overflow-y-auto ">
                    <ChatContacts />
                </div>
                <div className="flex-17">
                    {children}
                </div>

            </>
        </ContactContextProvider>
    )
}
