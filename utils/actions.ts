"use server";

import prisma from "./db";
import { auth } from "@clerk/nextjs";
import {
  JobType,
  CreateAndEditJobType,
  createAndEditJobSchema,
  GetAllJobsActionTypes,
} from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

const authenticateAndRedirect = (): string => {
  const { userId } = auth();
  if (!userId) redirect("/");
  return userId;
};

export const createJobAction = async (
  values: CreateAndEditJobType
): Promise<JobType | null> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: {
        ...values,
        clerkId: authenticateAndRedirect(),
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllJobsAction = async ({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionTypes): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> => {
  const userId = authenticateAndRedirect();

  try {
    const whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
      ...(search && {
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      }),
      ...(jobStatus && jobStatus !== "all" && { status: jobStatus }),
    };

    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { jobs, count: jobs.length, page, totalPages: jobs.length / limit };
  } catch (error) {
    console.log(error);
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
};

export const deleteJobAction = async (id: string): Promise<JobType | null> => {
  try {
    const job: JobType = await prisma.job.delete({
      where: {
        id,
        clerkId: authenticateAndRedirect(),
      },
    });
    return job;
  } catch (error) {
    return null;
  }
};

export const getSingleJobAction = async (
  id: string
): Promise<JobType | null> => {
  try {
    const job: JobType | null = await prisma.job.findUnique({
      where: {
        id,
        clerkId: authenticateAndRedirect(),
      },
    });

    if (!job) {
      return redirect("/jobs");
    }

    return job;
  } catch (error) {
    return null;
  }
};
