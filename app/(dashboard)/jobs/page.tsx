import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import SearchForm from "@/components/SearchForm";
import JobsList from "@/components/JobsList";

import { getAllJobsAction } from "@/utils/actions";

const JobsPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["jobs", "", "all"],
    queryFn: () => getAllJobsAction({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchForm />
      <JobsList />
    </HydrationBoundary>
  );
};

export default JobsPage;
