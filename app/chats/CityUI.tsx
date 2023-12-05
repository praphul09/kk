import Link from "next/link";
import BlankUser from "./BlankUser";
import { UPDATE_CURRENT_CITY, useCurrentCitiesDispatch } from "./CurrentCityContext";



export default function CityUI(props: { contact: any }) {
    const { contact } = props;
    const setCurrentContact = useCurrentCitiesDispatch()
    return (
        <Link href={`/chats/${contact}`}  onClick={() => { 
            setCurrentContact && setCurrentContact({ type: UPDATE_CURRENT_CITY, waId: contact});
         }}>
            <div className="flex flex-row p-2 hover:bg-background-default-hover gap-4 cursor-pointer">
                <div>
                    <BlankUser className="w-12 h-12" />
                </div>
                <div className="flex items-center">
                    <span>{contact}</span>
                    {/* TODO: Add some indication that this row is selected based on condition - contact.is_current */}
                </div>
            </div>
        </Link>
    )
}