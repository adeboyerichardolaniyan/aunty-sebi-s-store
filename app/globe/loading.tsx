import LoadingState from "@/components/LoadingState";

export default function GlobeLoading() {
  return (
    <div className="relative min-h-screen bg-rich-black">
      <LoadingState isLoading={true} />
    </div>
  );
}
