import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { contact, properties } from "@/lib/content";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionIntro } from "@/components/ui/SectionIntro";

/** Contact details beside the enquiry form. Used on the homepage and the Contact page. */
export function ContactPanel({ eyebrow, heading, intro }: { eyebrow?: string; heading?: string; intro?: string }) {
  const { details, form } = contact;
  const rows = [
    { icon: MapPin, content: details.address.join(", "), label: "Address" },
    { icon: Phone, content: details.phone, label: "Telephone" },
    { icon: Mail, content: details.email, label: "Email" },
    { icon: Clock, content: details.hours, label: "Hours" },
  ];
  return (
    <section id="enquire" className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="bg-forest px-5 py-20 text-ivory md:px-10 lg:px-16 lg:py-28">
        <div className="max-w-md lg:ml-auto lg:mr-0">
          <SectionIntro eyebrow={eyebrow ?? "Contact"} heading={heading ?? details.heading} intro={intro} tone="light" />
          <dl className="mt-12 space-y-6">
            {rows.map(({ icon: Icon, content, label }) => (
              <div key={label} className="flex items-start gap-5 border-t border-ivory/15 pt-6">
                <Icon className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.25} aria-hidden />
                <div>
                  <dt className="eyebrow text-sage">{label}</dt>
                  <dd className="mt-2 text-ivory/85">{content}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="bg-paper px-5 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="max-w-2xl">
          <h2 className="display-md text-forest">{form.heading}</h2>
          <p className="mt-3 text-sm text-muted">{form.intro}</p>
          <div className="mt-10">
            <ContactForm form={form} properties={properties.map(({ slug, name }) => ({ slug, name }))} />
          </div>
        </div>
      </div>
    </section>
  );
}
