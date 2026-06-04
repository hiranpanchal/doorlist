export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doorlist-lpij.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/payment/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
