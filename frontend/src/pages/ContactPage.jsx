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
      <div className="rounded-3xl border border-sky-100 bg-[#f4faff] p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Leadership & Delivery</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Contact</h2>
        <p className="mt-1 text-sm text-slate-600">
          Meet the core people behind this platform and reach out for collaboration or business inquiries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contacts.map((person) => {
          const Icon = person.icon;
          return (
            <Card key={person.name} className="border-sky-100 bg-[#f8fdff] transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{person.name}</h3>
                  <p className="mt-1 inline-flex items-center rounded-full border border-sky-100 bg-[#eef6ff] px-2.5 py-1 text-xs text-slate-600">
                    {person.role}
                  </p>
                </div>
                <div className="rounded-2xl bg-sky-100 p-2 text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{person.description}</p>
            </Card>
          );
        })}
      </div>

      <Card className="bg-[#f8fdff]">
        <h3 className="text-base font-semibold">General Communication</h3>
        <p className="mt-1 text-sm text-slate-500">
          For partnerships, implementation support, or technical discussions, connect through your preferred channel.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-[#eef6ff] px-3 py-2 text-sm text-slate-700">
            <Mail className="h-4 w-4 text-slate-500" />
            contact@projectplatform.com
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-[#eef6ff] px-3 py-2 text-sm text-slate-700">
            <Phone className="h-4 w-4 text-slate-500" />
            +91-XXXXXXXXXX
          </div>
        </div>
      </Card>
    </div>
  );
}
