import { IconBaseComponent, IconComponentProps } from "@/components/icons/IconBaseComponent";

export function StopIconComponent({ className }: IconComponentProps) {
  return (
    <IconBaseComponent className={className} isFilled>
      <rect x="5.5" y="5.5" width="13" height="13" rx="2" />
    </IconBaseComponent>
  );
}
