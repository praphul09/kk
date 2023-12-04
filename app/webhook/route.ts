import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhook } from '../../lib/verify';
import { WebHookRequest } from '../../types/webhook';
import { createServiceClient } from '../../lib/supabase/service-client';
import { DBTables } from '../../enums/Tables';
import { downloadMedia } from './media';

export const revalidate = 0

export async function GET(request: Request) {
  const urlDecoded = new URL(request.url)
  const urlParams = urlDecoded.searchParams
  let mode = urlParams.get('hub.mode');
  let token = urlParams.get('hub.verify_token');
  let challenge = urlParams.get('hub.challenge');
  if (mode && token && challenge && mode == 'subscribe') {
    const isValid = token == process.env.WEBHOOK_VERIFY_TOKEN
    if (isValid) {
      return new NextResponse(challenge)
    } else {
      return new NextResponse(null, { status: 403 })
    }
  } else {
    return new NextResponse(null, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  const headersList = headers();
  const xHubSigrature256 = headersList.get('x-hub-signature-256');
  const rawRequestBody = await request.text()
  if (!xHubSigrature256 || !verifyWebhook(rawRequestBody, xHubSigrature256)) {
    console.warn(`Invalid signature : ${xHubSigrature256}`)
    return new NextResponse(null, { status: 401 })
  }
  const webhookBody = JSON.parse(rawRequestBody) as WebHookRequest;
  if (webhookBody.entry.length > 0) {
    const supabase = createServiceClient()
    let { error } = await supabase
      .from(DBTables.Webhook)
      .insert(webhookBody.entry.map((entry) => {
        return { payload: entry }
      }))
    if (error) throw error

    const changes = webhookBody.entry[0].changes;

    if (changes.length > 0) {
      if (changes[0].field === "messages") {

        const changeValue = changes[0].value;
        const contacts = changeValue.contacts;
        const messages = changeValue.messages;
        const statuses = changeValue.statuses;
        let statusmsg:any = {};
        let timestamp:any = {};
        let msgdata:any = {};

        if (statuses) {
          statuses.map(status => {
            if(!timestamp.hasOwnProperty(status.recipient_id) ) {
              timestamp[status.recipient_id] = status.timestamp
              statusmsg[status.recipient_id] = status.status
            } else if(timestamp[status.recipient_id] < Number(status.timestamp)){
              timestamp[status.recipient_id] = Number(status.timestamp)
              statusmsg[status.recipient_id] = status.status
            }
          })

          for (const [key, value] of Object.entries(timestamp)) {
            let { error } = await supabase
            .from(DBTables.Contacts)
            .upsert({
              wa_id: key,
              last_message_at: new Date(timestamp[key] * 1000),
              laststatus:statusmsg[key]
            })
            if (error) throw error
          }
        }



        if (messages) {
        
          let { error } = await supabase
            .from(DBTables.Messages)
            .insert(messages.map(message => {

              
              if(!timestamp.hasOwnProperty(message.from) ) {
                timestamp[message.from] = Number(message.timestamp)
                statusmsg[message.from] = "received"
                msgdata[message.from] = message
              } else if(timestamp[message.from] < Number(message.timestamp)){
                timestamp[message.from] = Number(message.timestamp)
                statusmsg[message.from] = "received"
                msgdata[message.from] = message
              }
              

              return {
                chat_id: message.from,
                message: message,
                wam_id: message.id,
                created_at: new Date(Number.parseInt(message.timestamp) * 1000)
              }
            }))
          if (error) throw error
          
          for (const message of messages) {
            if (message.type === 'image') {
              await downloadMedia(message)
            }
          }
        }

        if (contacts && contacts.length > 0) {
          
          for (const contact of contacts) {
            if (statusmsg[contact.wa_id] == "received") {
              const { data: data , error } = await supabase
              .from(DBTables.Contacts)
              .select('laststatus,last_message_at')
              .eq('wa_id', contact.wa_id)
              .order('last_message_at', { ascending: false })
              if (error) {
                statusmsg[contact.wa_id] == "received"
              }  else {
                   console.log(data[data.length - 1]['laststatus']) 
                  if (data[data.length - 1]['laststatus'] == "delivered" ||  data[data.length - 1]['laststatus'] == "sent") {

                    let newtime:string = timestamp[contact.wa_id] == undefined || timestamp[contact.wa_id] == 0 ? (new Date()).toString() : (Number(timestamp[contact.wa_id]) * 1000).toString()
                    console.log(toTimestamp(newtime)) 
                    console.log( toTimestamp( data[data.length - 1]['last_message_at']) ) 
                    if(toTimestamp(newtime) - toTimestamp( data[data.length - 1]['last_message_at']) < 8){
                      if (msgdata[contact.wa_id].type == "text" && msgdata[contact.wa_id].body.length > 60){
                        statusmsg[contact.wa_id] = "automsg";
                      }
                    }
                  }
              }
            }
            let { error } = await supabase
              .from(DBTables.Contacts)
              .upsert({
                wa_id: contact.wa_id,
                profile_name: contact.profile.name,
                last_message_at: timestamp[contact.wa_id] == undefined || timestamp[contact.wa_id] == 0 ? new Date(): new Date(timestamp[contact.wa_id] * 1000),
                laststatus:statusmsg[contact.wa_id]
              })
            if (error) throw error
          }
        }
      }
    }
  }
  return new NextResponse()
}

function toTimestamp(strDate:string){
  var datum = Date.parse(strDate);
  return datum/1000;
}
