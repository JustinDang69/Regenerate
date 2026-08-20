import Link from "next/link";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Motif from "@/components/brand/Motif";
import { cta } from "@/lib/site";

export default function NotFound() {
  return (
    <Section tone="base" className="min-h-[70vh] pt-40">
      <Container size="narrow" className="flex flex-col items-center gap-6 text-center">
        <Motif className="h-16 text-accent/60" />
        <span className="eyebrow">Page not found</span>
        <h1 className="text-h1">This path has drifted off</h1>
        <p className="text-lead text-secondary">
          The page you&apos;re looking for isn&apos;t here. Let&apos;s guide you back.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Button href="/">Return home</Button>
          <Button href={cta.bookHref} variant="secondary">{cta.book}</Button>
        </div>
        <Link href="/skin" className="mt-2 text-[0.85rem] text-muted underline underline-offset-2">
          Or explore treatments
        </Link>
      </Container>
    </Section>
  );
}
