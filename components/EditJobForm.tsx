"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import {
  JobStatus,
  JobMode,
  createAndEditJobSchema,
  CreateAndEditJobType,
} from "@/utils/types";
import { getSingleJobAction, updateJobAction } from "@/utils/actions";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { CustomFormField, CustomFormSelect } from "./FormComponents";

const EditJobForm = ({ jobId }: { jobId: string }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const { data, isFetching } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getSingleJobAction(jobId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditJobType) => {
      return updateJobAction(jobId, values);
    },
    onSuccess: (data) => {
      if (!data) {
        return toast({
          description: "there was an error. job has not updated",
        });
      }
      toast({ description: "job updated" });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      router.push("/jobs");
    },
  });

  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: data?.position || "",
      company: data?.company || "",
      location: data?.location || "",
      status: (data?.status as JobStatus) || JobStatus.Pending,
      mode: (data?.mode as JobMode) || JobMode.FullTime,
    },
  });

  // TODO: bug, where on page reload it doesn't update status and mode with job data
  useEffect(() => {
    if (data) {
      form.reset({
        position: data?.position || "",
        company: data?.company || "",
        location: data?.location || "",
        status: (data?.status as JobStatus) || JobStatus.Pending,
        mode: (data?.mode as JobMode) || JobMode.FullTime,
      });
    }
  }, [data]);

  const onSubmit = (values: CreateAndEditJobType) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">Edit job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* position */}
          <CustomFormField name="position" control={form.control} />
          {/* company */}
          <CustomFormField name="company" control={form.control} />
          {/* location */}
          <CustomFormField name="location" control={form.control} />
          {/* job status */}
          <CustomFormSelect
            name="status"
            control={form.control}
            items={Object.values(JobStatus)}
            labelText="job status"
          />
          {/* job mode */}
          <CustomFormSelect
            name="mode"
            control={form.control}
            items={Object.values(JobMode)}
            labelText="job mode"
          />
          <Button
            type="submit"
            className="self-end capitalize"
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? "updating" : "update job"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditJobForm;
