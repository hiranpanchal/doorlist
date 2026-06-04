import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/lib/auth-provider";
import { getSeoSettings } from "@/lib/seo";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getSeoSettings();

  const robotsContent = [
    seo.robots_index === "true" ? "index" : "noindex",
    seo.robots_follow === "true" ? "follow" : "nofollow",
  ].join(", ");

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.schema_org_name || "Doorlist",
    url: seo.site_url || undefined,
    logo: seo.schema_org_logo || undefined,
    telephone: seo.schema_org_phone || undefined,
    email: seo.schema_org_email || undefined,
    ...(seo.schema_org_address
      ? { address: { "@type": "PostalAddress", addressLocality: seo.schema_org_address } }
      : {}),
  };

  return (
    <html
      lang="en"
      className={`${hanken.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        <title>{seo.site_title || "Doorlist"}</title>
        <meta name="description" content={seo.site_description || ""} />
        {seo.site_keywords && <meta name="keywords" content={seo.site_keywords} />}
        <meta name="robots" content={robotsContent} />
        {(seo.canonical_url || seo.site_url) && (
          <link rel="canonical" href={seo.canonical_url || seo.site_url} />
        )}

        {/* Open Graph */}
        <meta property="og:type" content={seo.og_type || "website"} />
        <meta property="og:title" content={seo.og_title || seo.site_title || "Doorlist"} />
        <meta property="og:description" content={seo.og_description || seo.site_description || ""} />
        {seo.og_image && <meta property="og:image" content={seo.og_image} />}
        {seo.site_url && <meta property="og:url" content={seo.site_url} />}
        {seo.fb_app_id && <meta property="fb:app_id" content={seo.fb_app_id} />}

        {/* Twitter */}
        <meta name="twitter:card" content={seo.twitter_card || "summary_large_image"} />
        <meta name="twitter:title" content={seo.twitter_title || seo.og_title || seo.site_title || "Doorlist"} />
        <meta name="twitter:description" content={seo.twitter_description || seo.og_description || ""} />
        {seo.twitter_image && <meta name="twitter:image" content={seo.twitter_image} />}
        {seo.twitter_handle && <meta name="twitter:site" content={seo.twitter_handle} />}

        {/* Verification */}
        {seo.google_verification && (
          <meta name="google-site-verification" content={seo.google_verification} />
        )}
        {seo.bing_verification && (
          <meta name="msvalidate.01" content={seo.bing_verification} />
        )}
        {seo.facebook_domain_verification && (
          <meta name="facebook-domain-verification" content={seo.facebook_domain_verification} />
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />

        {/* Google Analytics */}
        {seo.google_analytics_id && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.google_analytics_id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${seo.google_analytics_id}');`,
              }}
            />
          </>
        )}

        {/* Facebook Pixel */}
        {seo.facebook_pixel_id && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${seo.facebook_pixel_id}');fbq('track','PageView');`,
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
