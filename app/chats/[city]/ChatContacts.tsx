'use client'

import { useState } from "react";
import ChatContactsClient from "./ChatContactsClient";
import { useContacts } from "./CurrentContactContext";

export const revalidate = 0

export default function ChatContacts() {
    const contactState = useContacts();
    const [filterRefresh, setFilterRefresh] = useState<string>('');   
    const [filter, setFilter] = useState<string>('');    
    const [name, setName] = useState<string>('');
    const [template, setTemplate] = useState<string>('');
    const [image, setImage] = useState<string>('');



    const onMessageBulkSend = async (name: string, template: string, image: string) => {
        const headers = new Headers();

        headers.append('Content-Type', 'application/json');

         const response = await fetch(`https://4qwmqa32e8.execute-api.ap-south-1.amazonaws.com/default/dbops`, {
           method: 'POST',
            body: JSON.stringify({ type : 'getData', city: contactState?.city }),
            headers: headers
        })
        if (response.status === 200) {

            const data:{data:any[]} = await response.json();

            await Promise.all(data.data.map(async contact => {
                const response = await fetch('/api/sendMessageBulk', {
                    method: 'POST',
                    body: JSON.stringify({ to: contact['PhoneNumber'],  template,  image, city: contactState?.city, dispname: contact['Title']}),
                    headers: headers
                })
                if (response.status === 200) {
                    setName('')
                    setTemplate('')
                    setImage('')
                } else {
                    console.log(response.status)
                }
            }));
           
        } else {
            console.log(response.status)
            throw new Error(`Request failed with status code ${response.status}`);
        }
    }

    if (contactState) {
        return (<>
            <div>
            <form onSubmit={(event) => {
                            event.preventDefault()
                            onMessageBulkSend(name,template,image)
                        }}>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">unique name</label>
                                <input value={name} onChange={e => setName(e.target.value)}  type="text" id="unique" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required/>
                            </div>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">template</label>
                                <input value={template} onChange={e => setTemplate(e.target.value)}  type="text" id="template" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="template" required/>
                            </div>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">image link</label>
                                <input value={image} onChange={e => setImage(e.target.value)}  type="text" id="image" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="image.link" required/>
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Fetch</button>
                        </form>    
            </div>

            <div>
            <form onSubmit={(event) => {
                            event.preventDefault()
                            setFilterRefresh(filter);
                            
                        }}>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Filter Querry</label>
                                <input value={filter} onChange={e => setFilter(e.target.value)}  type="text" id="filter" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required/>
                            </div>

                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Filter</button>
                        </form>    
            </div>

            <div className="flex flex-col">
                <ChatContactsClient contacts={contactState.contacts} city={contactState.city} filter = {filterRefresh} />
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

