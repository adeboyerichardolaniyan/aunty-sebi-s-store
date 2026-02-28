import LoadingState from "@/components/LoadingState";

export default function PieceLoading() {
  return (
    <div className="relative min-h-screen">
      <LoadingState isLoading={true} />
    </div>
  );
}
