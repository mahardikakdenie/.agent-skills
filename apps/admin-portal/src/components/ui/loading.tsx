import { Spinner } from "@repo/ui";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black bg-opacity-50">
      <Spinner
        size="lg"
        className="[&_[data-slot=spinner-icon]]:text-primary"
      />
    </div>
  );
}
