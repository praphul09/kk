import { NextRequest, NextResponse } from "next/server";
import { DBTables } from "../../../enums/Tables";
import { createServiceClient } from "../../../lib/supabase/service-client";

async function sendWhatsAppMessageTemplate(to: string, template: string, imagelink:string, city:string, dispname: string) {
    const WHATSAPP_API_URL = `https://graph.facebook.com/v16.0/${process.env.WHATSAPP_API_PHONE_NUMBER_ID}/messages`;
    const payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
            "language": {"code":"en"},
            "name": template,
            "components": [{
                "type": "header",
                "parameters": [
                  {
                    "type": "document",
                    "document": {
                      "link": imagelink
                    }
                  }
                ]
            },
                           {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": dispname
          }]
            }
                          ]
        }
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
    };
    const res = await fetch(WHATSAPP_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const responseStatus = await res.status
        const response = await res.text()
        console.log(to)
        console.log(response)
    } 

    const payload2 = {
        to: to,
        type: "text",
        text: {
            "preview_url": false,
            "body": "template sent " + template
        }
    };

    const msgToPut: any = structuredClone(payload2)

    const response = await res.json()
    console.log(response)
    const wamId = response.messages[0].id;
    msgToPut['id'] = wamId
    const supabase = createServiceClient()
    const supabaseResponse = await supabase
        .from(DBTables.Messages)
        .insert({
            message: msgToPut,
            wam_id: wamId,
            chat_id: Number.parseInt(response.contacts[0].wa_id),
        })
    
    const contacts = response.contacts;
    if (contacts && contacts.length > 0) {
        for (const contact of contacts) {
        let { error } = await supabase
            .from(DBTables.Contacts)
            .upsert({
            wa_id: contact.wa_id,
            profile_name: "",
            last_message_at: new Date().toISOString(),
            CARD: city,
            laststatus:"dispatched_" + template,
            dispname: dispname
            })
        if (error) throw error
        }
    }
}


export async function POST(request: NextRequest) {
    const requestBody = await request.json()
    await sendWhatsAppMessageTemplate(requestBody.to, requestBody.template, requestBody.image, requestBody.city, requestBody.dispname)
    return new NextResponse()
}
