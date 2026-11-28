import { Button } from "@/components/ui/Button";
import { registerCta } from "@/lib/eventPages";

/** The register button. Until the form's URL is set it reads "Registration opens soon" (just "Opens
    soon" on the narrowest phones, so it never pushes the page sideways) and goes to the timeline. */
export default function RegisterButton({ href }: { href: string }) {
  const cta = registerCta(href);
  const placeholder = cta.href === "#timeline";
  return (
    <Button href={cta.href}>
      {placeholder ? (
        <>
          <span className="min-[380px]:hidden">Opens soon</span>
          <span className="hidden min-[380px]:inline">{cta.label}</span>
        </>
      ) : (
        cta.label
      )}
    </Button>
  );
}
