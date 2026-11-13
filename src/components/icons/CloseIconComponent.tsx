import { IconBaseComponent, IconComponentProps } from "@/components/icons/IconBaseComponent";

export function CloseIconComponent({ className }: IconComponentProps) {
  return (
    <IconBaseComponent className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </IconBaseComponent>
  );
}
