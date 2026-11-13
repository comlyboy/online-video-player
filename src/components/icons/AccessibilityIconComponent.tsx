import { IconBaseComponent, IconComponentProps } from "@/components/icons/IconBaseComponent";

export function AccessibilityIconComponent({ className }: IconComponentProps) {
  return (
    <IconBaseComponent className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="7.6" r="1.1" fill="currentColor" />
      <path d="M7.5 10.6c3 1 6 1 9 0M12 11.2v3.2M12 14.4l-2.2 4M12 14.4l2.2 4" />
    </IconBaseComponent>
  );
}
