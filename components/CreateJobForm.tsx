"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJobAction } from "@/utils/actions";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import {
  CustomFormSelect,
  CustomFormField,
  CustomFormTextArea,
} from "./FormComponents";

import type { CreateAndEditJobType } from "@/utils/types";
import { JobStatus, JobMode, createAndEditJobSchema } from "@/utils/types";

function CreateJobForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditJobType) => createJobAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "there was an error",
        });
        return;
      }
      toast({
        description: "job created",
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["charts"],
      });

      router.push("/jobs");
    },
  });

  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: "",
      company: "",
      location: "",
      notes: "",
      status: JobStatus.Pending,
      mode: JobMode.FullTime,
    },
  });

  function onSubmit(values: CreateAndEditJobType) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">Add job</h2>
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
          <div className="md:col-span-2 md:grid md:gap-4 md:grid-cols-2 lg:grid-cols-1">
            <CustomFormTextArea name="notes" control={form.control} />
          </div>
          <Button
            type="submit"
            className="self-end capitalize"
            disabled={!form.formState.isValid || isPending}
          >
            {isPending ? "loading" : "create job"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default CreateJobForm;
