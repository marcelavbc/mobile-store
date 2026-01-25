interface CloseIconProps {
  className?: string;
}

export function CloseIcon({ className }: CloseIconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9.22887 9.36147L6 12.4289L6.62613 13.0237L9.855 9.95629L13.0839 13.0237L13.71 12.4289L10.4811 9.36147L13.71 6.29404L13.0839 5.69922L9.855 8.76664L6.62613 5.69922L6 6.29404L9.22887 9.36147Z"
        fill="black"
      />
    </svg>
  );
}
