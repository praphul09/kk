export type WebhookImage = {
    id: string,
    sha256: string,
    mime_type: string,
}

export type WebhookInteraction = {
    button_reply?: ButtonReply,
    type:string,
}
export type ButtonReply = {
     id: string,
     title: string,
}

export type ButtonReply2 = {
     text: string,
     payload: string,
}

export type WebhookMessage = {
    from: string,
    id: string,
    timestamp: string,
    image?: WebhookImage,
    interactive?:WebhookInteraction,
    button?:ButtonReply2,
    type: 'text' | 'reaction' | 'image' | 'interactive' | 'button',
}

export type StatusMessage = {
    recipient_id : string,
    staus: string,
    id: string,
    timestamp: string,
    type: 'text' | 'reaction' | 'image' | 'interactive',
}

export type WebHookRequest = {
    object: "whatsapp_business_account",
    entry: [
        {
            id: string,
            changes: [
                {
                    value: {
                        metadata: {
                            display_phone_number: string,
                            phone_number_id: string,
                        }
                        contacts: Contact[],
                        messages: WebhookMessage[],
                        statuses: StatusMessage[]
                    },
                    field: string
                }
            ]
        }
    ]
}
