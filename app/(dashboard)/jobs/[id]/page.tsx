import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import EditJobForm from "@/components/EditJobForm";
import { getSingleJobAction } from "@/utils/actions";

const SingleJobPage = async ({ params }: { params: { id: string } }) => {
  const queryClient = new QueryClient();
  const id = params.id;

  await queryClient.prefetchQuery({
    queryKey: ["jobs", id],
    queryFn: () => getSingleJobAction(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditJobForm jobId={id} />
    </HydrationBoundary>
  );
};

export default SingleJobPage;
