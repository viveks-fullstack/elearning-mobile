export default function RocketIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 16.5C3 14 2.5 9.5 3 8C4 6 8.5 2.5 14 2C14 2 16 3 16 5C16 7 15 8 15 8C19 9 21 11 21 14C21 17 19 19 16 20C13 21 10 20 8 19C6 18 5 17 4.5 16.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 12.5C12.3284 12.5 13 11.8284 13 11C13 10.1716 12.3284 9.5 11.5 9.5C10.6716 9.5 10 10.1716 10 11C10 11.8284 10.6716 12.5 11.5 12.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 18L10 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 20L6 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
