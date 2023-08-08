
export type MessageJson = {
    from?: string,
    to?: string,
    id: string,
    timestamp: string,
    type: string,
}

export type InteractionMessageBody = {
    button_reply?: ButtonReplyBody,
    type:string,
}

export type ButtonReplyBody = {
     id: string,
     title: string,
}


export type TextMessageBody = {
    body: string,
}

export type InteractiveMessage = MessageJson & {
    interactive: InteractionMessageBody
}

export type TextMessage = MessageJson & {
    text: TextMessageBody
}

export type ImageMessageBody = {
    mime_type: string,
    sha256: string,
    id: string,
}

export type ImageMessage = MessageJson & {
    image: ImageMessageBody,
}
