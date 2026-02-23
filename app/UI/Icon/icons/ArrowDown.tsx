import { SVGProps } from "react";

export default function ArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      width={props.width}
      height={props.height}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
