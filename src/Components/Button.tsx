import type { ButtonInterface } from "../Interfaces/ButtonInterface";

const defaultStyles = "px-2 py-2 rounded-md font-light bg-blue-600";

const hoverStyle = "cursor-pointer hover:bg-blue-200";

export function Button(props: ButtonInterface){
    return <button onClick={props.onClick} className={` ${defaultStyles} ${hoverStyle}`}>
        <div className="flex justify-center">
        {props.text}
        </div>
    </button>
}