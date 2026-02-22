import Icon, { IconName } from "../Icon/Icon";
import buttonClass from "../Button/button.module.css";


interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'name'> {
  iconName: IconName;
  className?: string;
  iconClassName?: string;
}

const IconButton: React.FC<Props> = ({
  iconName,
  className,
  iconClassName,
  ...props
}) => {
  return (
    <button className={`${buttonClass.iconButton} ${className || ''}`} {...props}>
      <Icon name={iconName} className={iconClassName} />
    </button>
  );
};

export default IconButton;