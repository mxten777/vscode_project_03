export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 animate-fade-in">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-[3px] border-primary-100" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary-500 animate-spin" />
      </div>
      <p className="text-sm text-gray-400 font-medium">로딩 중...</p>
    </div>
  );
}
