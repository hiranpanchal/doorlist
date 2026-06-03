export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Mail, Phone, Home, Clock } from "lucide-react";
import MessageActions from "@/components/MessageActions";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) redirect("/login");

  const { id } = await params;
  const message = await prisma.message.findUnique({
    where: { id },
    include: { property: { select: { id: true, title: true, address: true, city: true } } },
  });

  if (!message || message.landlordId !== userId) notFound();

  // Mark as read
  if (!message.read) {
    await prisma.message.update({
      where: { id },
      data: { read: true },
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/messages"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to messages
      </Link>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                style={{ background: "var(--color-ink)" }}
              >
                {message.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <h1 className="text-lg font-bold text-ink">{message.senderName}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {message.senderEmail}
                  </span>
                  {message.senderPhone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {message.senderPhone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <MessageActions messageId={message.id} archived={message.archived} />
          </div>

          {/* Property ref */}
          {message.property && (
            <Link
              href={`/properties/${message.property.id}`}
              className="flex items-center gap-2 mt-4 p-3 bg-surface rounded-xl text-sm hover:bg-surface-2 transition-colors"
            >
              <Home className="w-4 h-4 text-muted" strokeWidth={1.7} />
              <span className="font-medium text-ink">{message.property.title}</span>
              <span className="text-muted">— {message.property.address}, {message.property.city}</span>
            </Link>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 text-xs text-muted">
            <Clock className="w-3.5 h-3.5" />
            {new Date(message.createdAt).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
            {message.body}
          </div>
        </div>

        {/* Reply */}
        <div className="p-6 border-t border-border bg-surface/50">
          <a
            href={`mailto:${message.senderEmail}?subject=Re: ${message.property?.title || "Your enquiry"}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
            style={{ background: "var(--color-ink)" }}
          >
            <Mail className="w-4 h-4" />
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
}
