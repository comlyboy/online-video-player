import { Suspense } from "react";

import { WatchAppComponent } from "@/components/WatchAppComponent";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <WatchAppComponent />
    </Suspense>
  );
}
