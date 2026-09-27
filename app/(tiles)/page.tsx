import { JsonLd } from "@/components/json-ld";
import { PanelText } from "@/components/tiles/panel-text";
import { contact, index, pages, projects } from "@/content/site";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: { absolute: "Max von Storch — Founding engineer at Dryft" },
  description: pages.index.description,
  path: pages.index.path,
});

// Google takes the site name from WebSite and the person the site is about from ProfilePage.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: "MvS",
      url: `${SITE_URL}/`,
    },
    {
      "@type": "ProfilePage",
      mainEntity: {
        "@type": "Person",
        name: SITE_NAME,
        jobTitle: "Founding Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Dryft",
          url: projects.dryft.href,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Technical University of Munich",
          url: "https://www.tum.de",
        },
        url: `${SITE_URL}/`,
        // The Contact links, so the X profile joins once it is set; no image until there is a real photo (Google rejects placeholders).
        sameAs: contact.links.map(({ href }) => href),
      },
    },
  ],
};

export default function IndexPage() {
  return (
    <>
      <PanelText>{index.body}</PanelText>
      <JsonLd data={jsonLd} />
    </>
  );
}
