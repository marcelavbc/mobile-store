interface CartIconProps {
  filled?: boolean;
  className?: string;
}

export function CartIcon({ filled = false, className }: CartIconProps) {
  if (filled) {
    return (
      <svg
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.4706 4H9.76471V7.76471H6V20H18.2353V7.76471H14.4706V4ZM13.5294 7.76471V11.0588H14.4706V7.76471H13.5294ZM10.7059 7.76471V11.0588H9.76471V7.76471H10.7059ZM10.7059 7.76471H13.5294V4.94118H10.7059V7.76471Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.4706 4.32031H9.76471V8.08502H6V20.3203H18.2353V8.08502H14.4706V4.32031ZM13.5294 9.0262V11.3791H14.4706V9.0262H17.2941V19.3791H6.94118V9.0262H9.76471V11.3791H10.7059V9.0262H13.5294ZM13.5294 8.08502V5.26149H10.7059V8.08502H13.5294Z"
        fill="currentColor"
      />
    </svg>
  );
}
