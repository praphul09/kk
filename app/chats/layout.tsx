import ChatTables from "./ChatTables";
import { CityContextProvider } from "./CurrentCityContext";
import { Contact } from "../../types/contact";


export default async function ChatsLayout({ children }: {
    children: React.ReactNode;
}) {


    
    const contacts:Contact[] = [];
    /*
    const supabase = createClient();
    const { data: contacts , error } = await supabase
    .from(DBTables.Contacts)
    .select('*')
    .order('last_message_at', { ascending: false })
    if (error) throw error
    */

    const res =  await fetch(`http://ec2-65-1-92-28.ap-south-1.compute.amazonaws.com//getTable`, { cache: 'no-store' });
    const data = await res.json();
    const tables = data.tables
    return (
        <CityContextProvider tables={tables}>
            <div className="flex items-center justify-center h-screen after:fixed after:h-[127px] after:top-0 after:z-10 after:w-full">
                <div className="shadow-lg max-w-screen-3xl w-[calc(95%)] h-[calc(100%-4rem)] flex bg-white z-20">
                    <div className="flex-17 overflow-y-auto">
                        <ChatTables />                        
                    </div>
                    <>
                        {children}
                    </>
                </div>
            </div>
        </CityContextProvider>
    )
}


