"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import JobCard from "./JobCard";
import { getAllJobsAction } from "@/utils/actions";

const JobsList = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const jobStatus = searchParams.get("jobStatus") || "all";
  const pageNumber = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["jobs", search, jobStatus, pageNumber],
    queryFn: () => {
      return getAllJobsAction({
        search,
        jobStatus,
        page: pageNumber,
        limit: 10,
      });
    },
  });

  const jobs = data?.jobs || [];

  if (isPending) return <h2 className="text-xl">Please wait...</h2>;
  if (jobs.length < 1) return <h2 className="text-xl">No jobs found...</h2>;

  return (
    <>
      {/* cards container  */}
      <div className="grid md:grid-cols-2  gap-8">
        {jobs.map((job) => {
          return <JobCard key={job.id} job={job} />;
        })}
      </div>
    </>
  );
};

export default JobsList;
