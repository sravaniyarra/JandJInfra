import { Building2, Code2, Mail, Phone } from "lucide-react";
import Card from "../components/ui/Card";

const contacts = [
  {
    name: "Taneti Rambabu",
    role: "Founder & CEO",
    icon: Building2,
    description:
      "Leads vision, strategic planning, and customer partnerships for the Infrastructure Platform. Focused on delivering reliable and modern digital solutions for infrastructure showcase and planning."
  },
  {
    name: "Sravani Yarra",
    role: "Website Developer",
    icon: Code2,
    description:
      "Designed and developed this full-stack platform, including responsive frontend experience, secure backend APIs, media workflow, and overall product architecture."
  }
];

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-line bg-gradient-to-br from-surface to-elevated/50 p-6 shadow-lift dark:to-elevated/30">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Leadership & Delivery</p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink">Contact</h2>
        <p className="mt-1 text-sm leading-relaxed text-subtle">
          Meet the core people behind this platform and reach out for collaboration or business inquiries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contacts.map((person) => {
          const Icon = person.icon;
          return (
            <Card key={person.name} className="transition hover:-translate-y-1 hover:shadow-lift">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{person.name}</h3>
                  <p className="mt-1 inline-flex items-center rounded-full border border-line bg-accent-muted px-2.5 py-1 text-xs font-medium text-subtle">
                    {person.role}
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-accent-muted p-2 text-accent">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-subtle">{person.description}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="font-display text-base font-bold text-ink">General Communication</h3>
        <p className="mt-1 text-sm text-subtle">
          For partnerships, implementation support, or technical discussions, connect through your preferred channel.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-elevated/60 px-3 py-2 text-sm text-ink dark:bg-elevated/40">
            <Mail className="h-4 w-4 text-accent" />
            contact@projectplatform.com
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-elevated/60 px-3 py-2 text-sm text-ink dark:bg-elevated/40">
            <Phone className="h-4 w-4 text-accent" />
            +91-XXXXXXXXXX
          </div>
        </div>
      </Card>
    </div>
  );
}
