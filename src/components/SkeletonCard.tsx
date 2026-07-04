export default function SkeletonCard() {
  return (
    <div
      role="status"
      aria-label="Loading destination"
      className="bg-white rounded-2xl overflow-hidden postcard-shadow animate-pulse"
    >
      {/* Image placeholder */}
      <div className="h-52 bg-ivory-400" />

      <div className="p-5 space-y-4">
        {/* Location + title */}
        <div className="space-y-2">
          <div className="h-3 bg-ivory-400 rounded-full w-1/3" />
          <div className="h-5 bg-ivory-400 rounded-full w-2/3" />
        </div>

        {/* Headline */}
        <div className="h-4 bg-ivory-300 rounded-full w-4/5" />

        {/* Pills */}
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-ivory-300 rounded-full" />
          <div className="h-6 w-16 bg-ivory-300 rounded-full" />
          <div className="h-6 w-24 bg-ivory-300 rounded-full" />
        </div>

        {/* Story blurb block */}
        <div className="bg-ivory-200 rounded-xl p-4 space-y-2">
          <div className="h-3 bg-ivory-400 rounded-full w-full" />
          <div className="h-3 bg-ivory-400 rounded-full w-5/6" />
          <div className="h-3 bg-ivory-400 rounded-full w-4/6" />
        </div>

        {/* Button */}
        <div className="h-10 bg-ivory-400 rounded-xl" />
      </div>

      <span className="sr-only">Loading destination content...</span>
    </div>
  );
}
