import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <>
      <div className="p-8 mb-16 grid sm:grid-cols-2 md:grid-cols-3  gap-4 rounded-lg border">
        <Skeleton className="h-10" />
        <Skeleton className="h-10 " />
        <Skeleton className="h-10 " />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="w-[525px] h-[265px]" />
        <Skeleton className="w-[525px] h-[265px]" />
        <Skeleton className="w-[525px] h-[265px]" />
        <Skeleton className="w-[525px] h-[265px]" />
      </div>
    </>
  );
};

export default loading;
