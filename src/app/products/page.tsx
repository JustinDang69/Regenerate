import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import ImageFrame from "@/components/ui/ImageFrame";
import CTABlock from "@/components/sections/CTABlock";
import { cta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Considered home-care products to support your in-clinic results. Information only — available in clinic.",
  alternates: { canonical: "/products" },
};

/* ---------------------------------------------------------------------------
   PRODUCTS — INFORMATION ONLY (per brief: no cart, no checkout, no payments).
   This is intentionally secondary to booking. A lightweight, swappable grid of
   placeholder product info cards. Add real products to the array below.
   TODO(client): supply product names, descriptions, imagery, and availability.
   --------------------------------------------------------------------------- */
const products = [
  { name: "Home-Care Product", category: "Skin", note: "Details coming soon" },
  { name: "Home-Care Product", category: "Skin", note: "Details coming soon" },
  { name: "Home-Care Product", category: "Hair", note: "Details coming soon" },
  { name: "Home-Care Product", category: "Hair", note: "Details coming soon" },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Home care that supports your results"
        lead="A considered selection of products to complement your in-clinic treatments. This page is for information — products are available and recommended in clinic."
        secondary={{ label: cta.book, href: cta.bookHref }}
      />

      <Section tone="base">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={i} delay={(i % 4) * 70} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-5">
                <ImageFrame ratio="square" placeholderLabel="Product image" />
                <div>
                  <span className="eyebrow text-muted">{p.category}</span>
                  <h3 className="mt-1 text-[1.1rem] font-semibold text-primary">{p.name}</h3>
                  <p className="mt-1 text-[0.85rem] text-muted">{p.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-[0.82rem] text-muted">
            {/* NOTE: no ecommerce in phase one. Structure is here to add products later
                without a cart/checkout. Recommendations are personalised in consultation. */}
            Product recommendations are personalised to your skin or hair plan during your
            consultation.
          </p>
        </Container>
      </Section>

      <Section tone="elevated">
        <Container>
          <CTABlock
            title="Ask us which products suit you"
            body="Your practitioner can recommend home care tailored to your treatment plan."
          />
        </Container>
      </Section>
    </>
  );
}
