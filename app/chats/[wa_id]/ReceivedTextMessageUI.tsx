import { TextMessage } from "../../../types/Message";
import { InteractiveMessage  } from "../../../types/Message";
import { ButtonMessage  } from "../../../types/Message";
import TailIn from "../TailIn";

export default function ReceivedTextMessageUI(props: { textMessage: any ,type:string}) {
    const { textMessage,type } = props
    const message:string|undefined = type == "normal" ? (textMessage as TextMessage).text.body : type == "interactive" ? (textMessage as InteractiveMessage).interactive.button_reply?.title : type =="button" ? (textMessage as ButtonMessage).button.text: textMessage.type;
    return (
        <>
            
            {message}
        </>
    )
}
