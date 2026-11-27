import { SpaceApproachSection } from "@/components/sections/SpaceApproachSection";
import { FaqSection } from "@/components/sections/FaqSection";
import type { Metadata } from "next";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { DreamSpaceSection } from "@/components/sections/DreamSpaceSection";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ImageCarouselSection } from "@/components/sections/ImageCarouselSection";
import { MaterialInspirationSection } from "@/components/sections/MaterialInspirationSection";
import { ClientTestimonialSection } from "@/components/sections/ClientTestimonialSection";
import { SpaceIntroSection } from "@/components/sections/SpaceIntroSection";
import { StatsBarServer } from "@/components/sections/StatsBarServer";
import { SignatureProjectsSection } from "@/components/sections/SignatureProjectsSection";
import { FadeUp } from "@/components/ui/animate";
import { getDreamSpaceConfig } from "@/app/config/home.config";
import { getProjectDetailCms } from "@/lib/cms/project-detail-page";
import { getTranslations } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getText,
  isVisible,
  toProjectHref,
  mapProjectGallery,
  mapProjectMaterials,
  mapProjectTestimonials,
  mapProjectRelatedProjects,
} from "@/app/config/projects.config";

interface Props {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const cms = await getProjectDetailCms(slug, locale);
  const seo = cms?.seo;
  return {
    ...(seo?.metaTitle && { title: seo.metaTitle }),
    ...(seo?.metaDescription && { description: seo.metaDescription }),
    alternates: { canonical: seo?.canonicalUrl ?? `${locale === "ar" ? "/ar" : ""}/projects/${slug}` },
    ...(seo?.ogImage?.url && {
      openGraph: { images: [{ url: seo.ogImage.url }] },
      twitter: { images: [seo.ogImage.url] },
    }),
    ...(seo?.noIndex || seo?.noFollow
      ? { robots: { index: !seo.noIndex, follow: !seo.noFollow } }
      : {}),
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug, locale } = await params;

  const [project, tBeforeAfter, tCarousel, tTestimonials, tDreamSpace] =
    await Promise.all([
      getProjectDetailCms(slug, locale),
      getTranslations({ locale, namespace: "BeforeAfter" }),
      getTranslations({ locale, namespace: "SpacesCarousel" }),
      getTranslations({ locale, namespace: "Testimonials" }),
      getTranslations({ locale, namespace: "DreamSpace" }),
    ]);

  if (!project) {
    const aliases: Record<string, string> = {
      "farm-grove": "farm-grove-the-valley-dubai",
      "rose-hills": "rose-hills-dubai-hills-estate",
    };
    const replacement = aliases[slug] ? await getProjectDetailCms(aliases[slug], locale) : null;
    if (replacement?.status === "published") {
      permanentRedirect(`${locale === "ar" ? "/ar" : ""}/projects/${replacement.slug}`);
    }
  }
  if (!project) {
    notFound();
  }

  const sections = project.sections;
  const hero = sections?.hero;
  const approach = sections?.approach;
  const faq = sections?.faq;
  const consultation = sections?.consultation;
  const faqItems = faq?.faqs?.filter(item => item.isVisible !== false).map(item => ({ question: getText(item.question, locale), answer: getText(item.answer, locale) })).filter(item => item.question && item.answer) ?? [];
  const overview = sections?.overview;
  const beforeAfter = sections?.beforeAfter;
  const gallery = sections?.gallery;
  const materials = sections?.materials;
  const testimonial = sections?.testimonial;
  const relatedProjects = sections?.relatedProjects;

  const fallbackName =
    project.pageName || getText(project.projectName, locale) || "";

  const gallerySlides = gallery ? mapProjectGallery(gallery, locale, fallbackName) : [];
  const materialItems = materials ? mapProjectMaterials(materials, locale, fallbackName) : [];
  const testimonials = testimonial ? mapProjectTestimonials(testimonial, locale) : [];

  const beforeAfterItem =
    beforeAfter?.items?.find((item) => item?.isVisible !== false) ??
    beforeAfter?.items?.[0];
  return (
    <main>
      {isVisible(hero) && (
        <HeroBanner
          badge={getText(hero.eyebrow, locale)}
          heading={getText(hero.heading, locale)}
          description={getText(hero.description, locale)}
          breadcrumbs={
            hero.breadcrumbs?.map((b) => ({
              label: getText(b.label, locale),
              href: b.href ? toProjectHref(b.href) : undefined,
            })) || []
          }
          imageSrc={hero.backgroundImage?.url || ""}
          imageAlt={getText(hero.backgroundImage?.alt, locale)}
        />
      )}

      {isVisible(hero) && hero.stats?.length > 0 && (
        <FadeUp>
          <StatsBarServer
            items={hero.stats
              .filter((stat) => Boolean(stat?.value?.trim()))
              .map((stat) => ({
                value: stat.value,
                label: getText(stat.label, locale),
              }))}
            sectionLabel={locale === "ar" ? "إحصائيات المشروع" : "Project Statistics"}
          />
        </FadeUp>
      )}

      {isVisible(overview) && (
        <SpaceIntroSection
          label={getText(overview.eyebrow, locale)}
          heading={getText(overview.heading, locale)}
          description={getText(overview.description, locale)}
          challengeDescription={getText(overview.challenge, locale)}
          image={overview.image?.url || ""}
          imageAlt={
            getText(overview.image?.alt, locale) || fallbackName || "Project"
          }
          imagePosition={overview.imagePosition === "left" ? "left" : "right"}
        />
      )}

      {approach && isVisible(approach) && getText(approach.description, locale) && (
        <SpaceApproachSection
          label={getText(approach.eyebrow, locale)}
          heading={getText(approach.heading, locale)}
          items={getText(approach.description, locale).split("\n\n").filter(Boolean)}
          image={approach.image?.url || overview.image?.url || ""}
          imageAlt={getText(approach.image?.alt, locale) || getText(overview.image?.alt, locale)}
        />
      )}

      {isVisible(gallery) && gallerySlides.length > 0 && (
        <ImageCarouselSection
          slides={gallerySlides}
          aria-label={getText(gallery.heading, locale) || tCarousel("ariaLabel")}
          prevLabel={tCarousel("prevLabel")}
          nextLabel={tCarousel("nextLabel")}
        />
      )}

      {/* =====================================================
          BEFORE / AFTER
      ===================================================== */}

      {project.slug === "nadia-saeed-bespoke-kitchen-renovation" &&
        isVisible(beforeAfter) &&
        beforeAfterItem &&
        beforeAfterItem.beforeImage?.url &&
        beforeAfterItem.afterImage?.url && (
          <BeforeAfterSection
            heading={getText(beforeAfter.heading, locale) || tBeforeAfter("heading")}
            beforeLabel={locale === "ar" ? "قبل" : tBeforeAfter("beforeLabel")}
            afterLabel={locale === "ar" ? "بعد" : tBeforeAfter("afterLabel")}
            handleLabel={tBeforeAfter("handleLabel")}
            beforeImage={{
              src: beforeAfterItem.beforeImage.url,
              alt:
                getText(beforeAfterItem.beforeImage.alt, locale) ||
                tBeforeAfter("beforeLabel"),
            }}
            afterImage={{
              src: beforeAfterItem.afterImage.url,
              alt:
                getText(beforeAfterItem.afterImage.alt, locale) ||
                tBeforeAfter("afterLabel"),
            }}
          />
        )}

      {isVisible(materials) && materialItems.length > 0 && (
        <MaterialInspirationSection
          heading={getText(materials.heading, locale)}
          items={materialItems}
          description={getText(materials.description, locale)}
        />
      )}

      {isVisible(testimonial) && testimonials.length > 0 && (
        <ClientTestimonialSection
          label={getText(testimonial.eyebrow, locale) || tTestimonials("label")}
          heading={getText(testimonial.heading, locale) || tTestimonials("heading")}
          variant="card"
          testimonials={testimonials}
        />
      )}

      {isVisible(relatedProjects) && relatedProjects.projects?.length > 0 && (
        <SignatureProjectsSection
          heading={
            getText(relatedProjects.heading, locale) ||
            (locale === "ar" ? "مشاريع ذات صلة" : "Related Projects")
          }
          viewAllLabel={
            getText(relatedProjects.button?.label, locale) ||
            (locale === "ar" ? "عرض الكل" : "View all projects")
          }
          viewAllHref={relatedProjects.button?.href || "/projects"}
          projects={mapProjectRelatedProjects(relatedProjects, locale)}
        />
      )}

      {faq && isVisible(faq) && faqItems.length > 0 && <>
        <FaqSection label="" heading={getText(faq.heading, locale)} items={faqItems} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faqItems.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
        }).replace(/</g, "\\u003c") }} />
      </>}
      {(!consultation || isVisible(consultation)) && <DreamSpaceSection
        {...getDreamSpaceConfig(tDreamSpace)}
        {...(getText(consultation?.heading, locale) && { heading: getText(consultation?.heading, locale) })}
        description={getText(consultation?.description, locale)}
        {...(getText(consultation?.submitButtonLabel, locale) && { submitLabel: getText(consultation?.submitButtonLabel, locale) })}
        {...(consultation?.image?.url && { imageSrc: consultation.image.url, imageAlt: getText(consultation.image.alt, locale) })}
      />}
      <JsonLdSchema globalSeo={project?.globalSeo} pageSeo={project?.seo} />
    </main>
  );
}
