import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Safely clean up existing records
  await prisma.message.deleteMany();
  await prisma.order.deleteMany();
  await prisma.event.deleteMany();

  // Seed sample event
  const createdEvent = await prisma.event.create({
    data: {
      title: "Sunrisers Hyderabad Fan Meetup & Screening",
      description:
        "Join fellow SRH fans for live screening, discussions, and merchandise giveaways at Gachibowli!",
      price: "499",
      location: "Gachibowli, Hyderabad",
      date: "May 20, 2026",
      availableTickets: 50,
      organizerName: "SRH Fan Club",
      organizerHandle: "@srh_fans",
      organizerAvatar:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100",
      banner:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200",
      imageUrl:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500",
      category: "Sports",
    },
  });

  console.log(`✅ Seeded event: ${createdEvent.title}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
  