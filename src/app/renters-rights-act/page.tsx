export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StaticPage from "@/components/StaticPage";

export default async function RentersRightsPage() {
  const page = await prisma.page.findUnique({ where: { slug: "renters-rights-act" } });
  if (!page || !page.published) notFound();
  return <StaticPage page={page} />;
}
