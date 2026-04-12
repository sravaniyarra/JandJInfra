import {
  Bath,
  BedDouble,
  BriefcaseBusiness,
  CheckCircle2,
  ChartNoAxesCombined,
  ChefHat,
  FolderOpenDot,
  LampCeiling,
  Layers,
  PaintRoller,
  Sofa,
  Sparkles,
  Tv
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";

const statConfig = [
  { label: "Total Materials", key: "materials", icon: Layers },
  { label: "Active Projects", key: "projects", icon: BriefcaseBusiness },
  { label: "Gallery Assets", key: "assets", icon: FolderOpenDot },
  { label: "Monthly Growth", key: "growth", icon: ChartNoAxesCombined }
];

const cities = ["Hyderabad", "Bengaluru", "Chennai", "Mumbai", "Pune", "Visakhapatnam"];

const heroSlides = [
  {
    title: "Interiors you will truly love.",
    subtitle: "Elegant and functional spaces designed around your lifestyle.",
    image:
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "From concept to move-in, seamlessly.",
    subtitle: "End-to-end execution with transparent budgets and timelines.",
    image:
      "https://images.unsplash.com/photo-1616594039964-3f9f8f0f8f68?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Designed with precision, built with care.",
    subtitle: "Premium materials, curated finishes, delightful outcomes.",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=80"
  }
];

const solutionItems = [
  { label: "Modular Kitchen", icon: ChefHat, to: "/materials?search=kitchen" },
  { label: "Storage & Wardrobe", icon: BedDouble, to: "/materials?search=wardrobe" },
  { label: "Living Space", icon: Sofa, to: "/projects?search=living" },
  { label: "TV Units", icon: Tv, to: "/materials?search=tv" },
  { label: "Lights", icon: LampCeiling, to: "/materials?search=lighting" },
  { label: "Wall Paint", icon: PaintRoller, to: "/materials?search=paint" },
  { label: "Bathroom", icon: Bath, to: "/projects?search=bathroom" },
  { label: "Kids Bedroom", icon: Sparkles, to: "/projects?search=bedroom" }
];

export default function Dashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadToast, setLeadToast] = useState("");
  const [activeCity, setActiveCity] = useState("Hyderabad");
  const [slideIndex, setSlideIndex] = useState(0);
  const [stats, setStats] = useState({ materials: 0, projects: 0, assets: 0, growth: "12%" });
  const [recentProjects, setRecentProjects] = useState([]);
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    city: "Hyderabad",
    whatsappOptIn: true
  });

  useEffect(() => {
    const load = async () => {
      const [materialsRes, projectsRes] = await Promise.all([api.get("/materials"), api.get("/projects")]);
      const materials = materialsRes.data || [];
      const projects = projectsRes.data || [];
      const assets = projects.reduce((sum, p) => sum + (p.images?.length || 0) + (p.videos?.length || 0), 0);
      setStats({ materials: materials.length, projects: projects.length, assets, growth: "12%" });
      setRecentProjects(projects.slice(0, 4));
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const processSteps = useMemo(
    () => [
      "Meet your designer and discuss style preferences.",
      "Get concept visuals and budget-friendly options.",
      "Approve execution plan and schedule delivery.",
      "Move into a beautifully finished space."
    ],
    []
  );

  const submitLead = async (e) => {
    e.preventDefault();
    setSubmittingLead(true);
    await api.post("/leads", leadForm);
    setLeadToast("Designer has been notified. We will contact you soon.");
    setLeadForm({ name: "", phone: "", city: "Hyderabad", whatsappOptIn: true });
    setTimeout(() => setLeadToast(""), 2600);
    setSubmittingLead(false);
  };

  return (
    <div className="space-y-6">
      {leadToast ? (
        <div className="fixed right-3 top-3 z-[60] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 shadow-soft sm:right-5 sm:top-5">
          <CheckCircle2 className="h-4 w-4" />
          {leadToast}
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-3xl border border-sky-100 bg-[#f4faff] shadow-soft">
        <div className="grid items-stretch lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[320px] p-6 sm:p-8 lg:min-h-[430px]">
            <img
              src={heroSlides[slideIndex].image}
              alt="interior hero"
              className="absolute inset-0 h-full w-full object-cover transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a120dcc] via-[#1a120c7a] to-transparent" />
            <div className="relative z-10 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f8e7cf]">Interior Experience</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">{heroSlides[slideIndex].title}</h1>
              <p className="mt-3 text-sm text-[#f7ead8] sm:text-base">
                {heroSlides[slideIndex].subtitle}
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/projects" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900">
                  Explore Projects
                </Link>
                <Link to="/materials" className="rounded-full border border-white/80 px-5 py-2.5 text-sm font-semibold text-white">
                  Design Gallery
                </Link>
              </div>
            </div>
            <div className="absolute bottom-5 right-5 z-10 flex gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`h-2.5 w-2.5 rounded-full ${slideIndex === idx ? "bg-white" : "bg-white/45 hover:bg-white/75"}`}
                />
              ))}
            </div>
          </div>

          <div id="meet-designer" className="border-t border-sky-100 bg-[#f8fdff] p-5 lg:border-l lg:border-t-0 lg:p-6">
            <h3 className="text-2xl font-semibold tracking-tight">Meet a designer</h3>
            <p className="mt-1 text-sm text-slate-500">Share your details and our design expert will call you.</p>
            <form className="mt-5 space-y-3" onSubmit={submitLead}>
              <Input label="Name" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} required />
              <Input label="Mobile Number" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} required />
              <Select label="Property City" value={leadForm.city} onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
              <label className="flex items-center gap-2 pt-1 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={leadForm.whatsappOptIn}
                  onChange={(e) => setLeadForm({ ...leadForm, whatsappOptIn: e.target.checked })}
                />
                Send updates on WhatsApp
              </label>
              <Button type="submit" className="mt-2 w-full" disabled={submittingLead}>
                {submittingLead ? "Submitting..." : "Book 3D Design Session"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Card className="bg-[#f8fdff]">
        <h3 className="text-xl font-semibold">End-to-end interior solutions</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {solutionItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className="group rounded-2xl border border-sky-100 bg-[#f8fdff] p-4 text-center transition hover:-translate-y-0.5 hover:bg-white"
              >
                <div className="mx-auto mb-2 inline-flex rounded-2xl bg-sky-100 p-2.5 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="bg-[#f8fdff]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">City-specific design inspiration</h3>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  activeCity === city
                    ? "border-transparent bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white"
                    : "border-sky-100 bg-[#f1f8ff] text-slate-600"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Popular for <span className="font-semibold">{activeCity}</span>: modern wardrobes, compact kitchens, statement lighting,
          and warm living spaces tailored for urban homes.
        </p>
      </Card>

      {token ? (
        <>
      <div className="rounded-3xl border border-sky-100 bg-[#f4faff] p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Design Console</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Project Overview</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              A curated workspace to review materials, monitor project media, and prepare delightful customer presentations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statConfig.map((item) => {
              const Icon = item.icon;
              return (
            <Card key={item.key} className="bg-[#f8fdff] transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-900">
                        {loading ? "-" : stats[item.key]}
                      </p>
                    </div>
                <div className="rounded-2xl bg-sky-100 p-2.5 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : null}

      <Card className="bg-[#f8fdff]">
        <h3 className="text-base font-semibold">From Design to Move-In</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-sky-100 bg-[#f8fdff] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step {index + 1}</p>
              <p className="mt-2 text-sm text-slate-700">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-[#f8fdff]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Recent Projects</h3>
          <Link to="/projects" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <Link
                to={`/projects/${project._id}`}
                key={project._id}
                className="flex items-center justify-between rounded-2xl border border-sky-100 bg-[#f8fdff] px-4 py-3 transition hover:bg-[#eef6ff]"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-slate-500">{project.description?.slice(0, 80)}</p>
                </div>
                <span className="text-xs text-slate-400">{project.materialsUsed?.length || 0} materials</span>
              </Link>
            ))}
            {!recentProjects.length && <p className="text-sm text-slate-500">No projects found yet.</p>}
          </div>
        )}
      </Card>

      <a
        href="#meet-designer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-95"
      >
        Get Free Estimate
      </a>
    </div>
  );
}
