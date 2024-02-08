const { PrismaClient } = require("@prisma/client");
const data = require("./mock-data.json");
const prisma = new PrismaClient();

const main = async () => {
  const clerkId = "user_2bzpRqeFsk3H6DcWk88RDc6ngMn";
  const jobs = data.map((job) => {
    return {
      ...job,
      clerkId,
    };
  });
  for (const job of jobs) {
    await prisma.job.create({
      data: job,
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
