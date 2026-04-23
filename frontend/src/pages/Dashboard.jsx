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
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Designed with precision, built with care.",
    subtitle: "Premium materials, curated finishes, delightful outcomes.",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=80"
  }
];

const solutionItems = [
  { label: "Modular Kitchen", icon: ChefHat, to: "/solutions/modular-kitchen" },
  { label: "Storage & Wardrobe", icon: BedDouble, to: "/solutions/storage-wardrobe" },
  { label: "Living Space", icon: Sofa, to: "/solutions/living-space" },
  { label: "TV Units", icon: Tv, to: "/solutions/tv-units" },
  { label: "Lights", icon: LampCeiling, to: "/solutions/lights" },
  { label: "Wall Paint", icon: PaintRoller, to: "/solutions/wall-paint" },
  { label: "Bathroom", icon: Bath, to: "/solutions/bathroom" },
  { label: "Kids Bedroom", icon: Sparkles, to: "/solutions/kids-bedroom" }
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
        <div className="fixed right-3 top-3 z-[60] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-xl border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-ink shadow-lift sm:right-5 sm:top-5">
          <CheckCircle2 className="h-4 w-4" />
          {leadToast}
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-4xl border border-line bg-surface/95 shadow-lift dark:shadow-glow">
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
              <h1 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
                {heroSlides[slideIndex].title}
              </h1>
              <p className="mt-3 text-sm text-[#f7ead8] sm:text-base">
                {heroSlides[slideIndex].subtitle}
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/projects"
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-lg transition hover:scale-[1.02]"
                >
                  Explore Projects
                </Link>
                <Link
                  to="/materials"
                  className="rounded-xl border border-white/70 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
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

          <div
            id="meet-designer"
            className="border-t border-line bg-elevated/70 p-5 backdrop-blur-md lg:border-l lg:border-t-0 lg:p-6 dark:bg-elevated/40"
          >
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">Meet a designer</h3>
            <p className="mt-1 text-sm text-subtle">Share your details and our design expert will call you.</p>
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
              <label className="flex items-center gap-2 pt-1 text-sm text-subtle">
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

      <Card>
        <h3 className="font-display text-xl font-bold text-ink">End-to-end interior solutions</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {solutionItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className="group rounded-2xl border border-line bg-elevated/50 p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-accent/25 hover:bg-surface hover:shadow-soft dark:hover:shadow-glow"
              >
                <div className="mx-auto mb-2 inline-flex rounded-2xl border border-line bg-accent-muted p-2.5 text-accent transition group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-ink">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-ink">City-specific design inspiration</h3>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity(city)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeCity === city
                    ? "border-transparent bg-accent text-accent-fg shadow-soft"
                    : "border-line bg-elevated/80 text-subtle hover:border-accent/30 hover:text-ink"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-subtle">
          Popular for <span className="font-semibold text-ink">{activeCity}</span>: modern wardrobes, compact kitchens, statement
          lighting, and warm living spaces tailored for urban homes.
        </p>
      </Card>

      {token ? (
        <>
      <div className="rounded-4xl border border-line bg-gradient-to-br from-surface via-elevated/40 to-surface p-6 shadow-lift dark:from-surface dark:via-elevated/30 dark:to-surface">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Design Console</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink">Project Overview</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-subtle">
              A curated workspace to review materials, monitor project media, and prepare delightful customer presentations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statConfig.map((item) => {
              const Icon = item.icon;
              return (
            <Card key={item.key} className="transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{item.label}</p>
                      <p className="font-display mt-3 text-3xl font-bold text-ink">{loading ? "-" : stats[item.key]}</p>
                    </div>
                <div className="rounded-2xl border border-line bg-accent-muted p-2.5 text-accent">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : null}

      <Card>
        <h3 className="font-display text-base font-bold text-ink">From Design to Move-In</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-line bg-elevated/40 p-4 dark:bg-elevated/25">
              <p className="text-xs font-semibold uppercase tracking-wide text-subtle">Step {index + 1}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">Recent Projects</h3>
          <Link to="/projects" className="text-sm font-semibold text-accent hover:underline">
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
                className="flex items-center justify-between rounded-2xl border border-line bg-elevated/30 px-4 py-3 transition hover:border-accent/25 hover:bg-accent-muted/40 dark:bg-elevated/20"
              >
                <div>
                  <p className="font-semibold text-ink">{project.name}</p>
                  <p className="text-sm text-subtle">{project.description?.slice(0, 80)}</p>
                </div>
                <span className="text-xs text-subtle">{project.materialsUsed?.length || 0} materials</span>
              </Link>
            ))}
            {!recentProjects.length && <p className="text-sm text-subtle">No projects found yet.</p>}
          </div>
        )}
      </Card>

      <a
        href="#meet-designer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-fg shadow-lift transition hover:brightness-110 active:scale-95 dark:shadow-glow"
      >
        Get Free Estimate
      </a>
    </div>
  );
}
