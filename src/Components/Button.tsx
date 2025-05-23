interface ButtonProps {
  onClick?: () => void;
  styles?: string;
  type?: 'button' | 'submit' | 'reset';
  title: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {

    const defaultStyles = "px-4 py-2 font-light rounded rounded-md text-white font-light bg-blue-600";

    return (
        <button
        onClick={props.onClick}
        className={defaultStyles + props.styles}
        type={props.type}
        title={props.title}
        disabled={props.disabled}
        >
        {props.title}
        </button>
    );
};

export default Button;