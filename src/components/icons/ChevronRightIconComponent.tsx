import { IconBaseComponent, IconComponentProps } from "@/components/icons/IconBaseComponent";

export function ChevronRightIconComponent({ className }: IconComponentProps) {
  return (
    <IconBaseComponent className={className}>
      <path d="M9 6l6 6-6 6" />
    </IconBaseComponent>
  );
}
