import { IconBaseComponent, IconComponentProps } from "@/components/icons/IconBaseComponent";

export function PlayIconComponent({ className }: IconComponentProps) {
  return (
    <IconBaseComponent className={className} isFilled>
      <path d="M7.5 4.5L20 12L7.5 19.5z" />
    </IconBaseComponent>
  );
}
