import { TextMessage } from "../../../types/Message";
import { InteractiveMessage  } from "../../../types/Message";
import TailIn from "../TailIn";

export default function ReceivedTextMessageUI(props: { textMessage: any ,type:string}) {
    const { textMessage,type } = props
    const message:string = type == "normal" ? (textMessage as TextMessage).text.body : (textMessage as InteractiveMessage).button_reply.title;
    return (
        <>
            
            {message}
        </>
    )
}
