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

export const updateJobAction = async (
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> => {
  try {
    const job: JobType | null = await prisma.job.update({
      where: {
        id,
        clerkId: authenticateAndRedirect(),
      },
      data: {
        ...values,
      },
    });

    return job;
  } catch (error) {
    return null;
  }
};

export const getStatsAction = async (): Promise<{
  pending: number;
  interview: number;
  declined: number;
}> => {
  try {
    const stats = await prisma.job.groupBy({
      where: {
        clerkId: authenticateAndRedirect(),
      },
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const statsObject = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
    };

    return {
      ...defaultStats,
      ...statsObject,
    };
  } catch (error) {
    redirect("/jobs");
  }
};

export const getChartsDataAction = async (): Promise<
  Array<{ date: string; count: number }>
> => {
  const userId = authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(6, "month").toDate();

  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const applicationsPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format("MMM YY");

      const existingEntry = acc.find((entry) => entry.date === date);

      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    }, [] as Array<{ date: string; count: number }>);

    return applicationsPerMonth;
  } catch (error) {
    redirect("/jobs");
  }
};
