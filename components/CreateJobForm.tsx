"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormSelect, { CustomFormField } from "./FormComponents";

import type { CreateAndEditJobType } from "@/utils/types";
import { JobStatus, JobMode, createAndEditJobSchema } from "@/utils/types";

function CreateJobForm() {
  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: "",
      company: "",
      location: "",
      status: JobStatus.Pending,
      mode: JobMode.FullTime,
    },
  });

  function onSubmit(values: CreateAndEditJobType) {
    console.log(values);
  }

  console.log(form);

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
          <Button
            type="submit"
            className="self-end capitalize"
            disabled={!form.formState.isValid}
          >
            create job
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default CreateJobForm;
