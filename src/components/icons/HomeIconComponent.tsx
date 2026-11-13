import { IconBaseComponent, IconComponentProps } from "@/components/icons/IconBaseComponent";

export function HomeIconComponent({ className }: IconComponentProps) {
  return (
    <IconBaseComponent className={className}>
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5.5 10v9.5h4.5V14h4v5.5h4.5V10" />
    </IconBaseComponent>
  );
}
