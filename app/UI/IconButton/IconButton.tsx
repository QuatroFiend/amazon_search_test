import Icon, { IconName } from "../Icon/Icon";
import buttonClass from "../Button/button.module.css";
import Typography from "../Typography/Typography";


interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'name'> {
  iconName: IconName;
  className?: string;
  iconClassName?: string;
  iconWidth?: number;
  iconHeight?: number;
  textContent?:string
}

const IconButton: React.FC<Props> = ({
  iconName,
  className,
  iconClassName,
  iconWidth,
  iconHeight,
  textContent,
  ...props
}) => {
  return (
    <button className={`${buttonClass.iconButton} ${className || ''}`} {...props}>
      <Typography variant="info">{textContent}</Typography>
      <Icon width={iconWidth} height={iconHeight} name={iconName} className={iconClassName} {...props}/>
    </button>
  );
};

export default IconButton;