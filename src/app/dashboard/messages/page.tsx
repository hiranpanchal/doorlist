export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Mail, Inbox, Archive } from "lucide-react";

export default async function DashboardMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) redirect("/login");

  const params = await searchParams;
  const filter = params.filter === "archived" ? "archived" : "inbox";

  const messages = await prisma.message.findMany({
    where: {
      landlordId: userId,
      archived: filter === "archived",
    },
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { title: true } },
    },
  });

  const inboxCount = await prisma.message.count({
    where: { landlordId: userId, archived: false },
  });
  const archivedCount = await prisma.message.count({
    where: { landlordId: userId, archived: true },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-ink"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Messages
          </h1>
          <p className="text-sm text-muted mt-0.5">Enquiries from tenants</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6 w-fit">
        <Link
          href="/dashboard/messages"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "inbox"
              ? "bg-ink text-white"
              : "text-muted hover:bg-surface"
          }`}
        >
          <Inbox className="w-4 h-4" />
          Inbox ({inboxCount})
        </Link>
        <Link
          href="/dashboard/messages?filter=archived"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "archived"
              ? "bg-ink text-white"
              : "text-muted hover:bg-surface"
          }`}
        >
          <Archive className="w-4 h-4" />
          Archived ({archivedCount})
        </Link>
      </div>

      {/* Message list */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <Mail className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <p className="text-lg font-medium text-ink mb-1">
            {filter === "archived" ? "No archived messages" : "No messages yet"}
          </p>
          <p className="text-sm text-muted">
            {filter === "archived"
              ? "Messages you archive will appear here."
              : "When tenants enquire about your properties, their messages will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {messages.map((msg) => (
            <Link
              key={msg.id}
              href={`/dashboard/messages/${msg.id}`}
              className={`flex items-start gap-4 p-4 hover:bg-surface/50 transition-colors ${
                !msg.read ? "bg-accent/[0.03]" : ""
              }`}
            >
              {/* Unread dot */}
              <div className="pt-1.5 flex-shrink-0">
                {!msg.read ? (
                  <span className="block w-2.5 h-2.5 rounded-full bg-accent" />
                ) : (
                  <span className="block w-2.5 h-2.5 rounded-full bg-transparent" />
                )}
              </div>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: "var(--color-ink)" }}
              >
                {msg.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`text-sm truncate ${!msg.read ? "font-semibold text-ink" : "font-medium text-ink-2"}`}>
                    {msg.senderName}
                  </span>
                  <span className="text-xs text-muted flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted mb-1 truncate">
                  Re: {msg.property?.title}
                </p>
                <p className={`text-sm truncate ${!msg.read ? "text-ink-2" : "text-muted"}`}>
                  {msg.body}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
