export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StaticPage from "@/components/StaticPage";

export default async function PrivacyPage() {
  const page = await prisma.page.findUnique({ where: { slug: "privacy" } });
  if (!page || !page.published) notFound();
  return <StaticPage page={page} />;
}
