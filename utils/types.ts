import * as z from "zod";

export type JobType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  position: string;
  company: string;
  location: string;
  notes: string;
  status: string;
  mode: string;
};

export enum JobStatus {
  Pending = "pending",
  Interview = "interview",
  Declined = "declined",
  Discussing = "discussing",
}

export enum JobMode {
  Permanent = "permanent",
  Contract = "contract",
}

export const createAndEditJobSchema = z.object({
  position: z.string().min(2, {
    message: "position must be 2 characters",
  }),
  company: z.string().min(2, {
    message: "company must be 2 characters",
  }),
  location: z.string().min(2, {
    message: "location must be 2 characters",
  }),
  notes: z.string(),
  status: z.nativeEnum(JobStatus),
  mode: z.nativeEnum(JobMode),
});

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;

export type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};
