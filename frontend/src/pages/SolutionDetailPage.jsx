import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  CheckCircle2,
  ChefHat,
  LampCeiling,
  PaintRoller,
  Sofa,
  Sparkles,
  Star,
  Tv
} from "lucide-react";
import { api } from "../api/client";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Skeleton from "../components/ui/Skeleton";

const cities = ["Hyderabad", "Bengaluru", "Chennai", "Mumbai", "Pune", "Visakhapatnam"];

const solutionData = {
  "modular-kitchen": {
    label: "Modular Kitchen",
    icon: ChefHat,
    tagline: "Cook in style, designed for your lifestyle",
    description:
      "From L-shaped layouts to island kitchens, we design modular kitchens that maximize storage, optimize workflow, and look stunning. Premium finishes, soft-close hardware, and integrated appliances included.",
    heroImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    features: [
      "Custom layouts — L, U, parallel, island",
      "Soft-close drawers & premium hardware",
      "Granite / quartz countertop options",
      "Integrated chimney & appliance planning",
      "Water-resistant & termite-proof cabinets",
      "10-year warranty on core structure"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
    ],
    priceRange: "₹1.5L – ₹8L",
    timeline: "25–40 days",
    searchKey: "kitchen"
  },
  "storage-wardrobe": {
    label: "Storage & Wardrobe",
    icon: BedDouble,
    tagline: "Smart storage that fits your space perfectly",
    description:
      "Sliding, hinged, or walk-in — our wardrobes are designed to maximize every inch. Built-in organizers, mirror panels, and loft storage make your bedroom clutter-free and elegant.",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1600&q=80",
    features: [
      "Sliding, hinged & walk-in options",
      "Built-in drawer organizers & accessories",
      "Full-length mirror integration",
      "Loft storage with hydraulic lift",
      "Laminate, acrylic & lacquer finishes",
      "Customized to room dimensions"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80"
    ],
    priceRange: "₹80K – ₹4L",
    timeline: "15–30 days",
    searchKey: "wardrobe"
  },
  "living-space": {
    label: "Living Space",
    icon: Sofa,
    tagline: "Where comfort meets contemporary design",
    description:
      "Transform your living room into a statement space. Custom TV units, accent walls, false ceilings, and curated furniture layouts that reflect your personality and maximize comfort.",
    heroImage: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1600&q=80",
    features: [
      "Custom TV unit & entertainment wall",
      "False ceiling with cove lighting",
      "Accent wall with texture or wallpaper",
      "Sofa & furniture layout planning",
      "Curtain & soft furnishing coordination",
      "Smart home integration ready"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    ],
    priceRange: "₹2L – ₹10L",
    timeline: "30–50 days",
    searchKey: "living"
  },
  "tv-units": {
    label: "TV Units",
    icon: Tv,
    tagline: "Entertainment walls that steal the show",
    description:
      "Wall-mounted, floor-standing, or full entertainment walls — our TV units combine clean cable management, ambient lighting, and display shelves for a cinematic living room experience.",
    heroImage: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1600&q=80",
    features: [
      "Wall-mounted & floor-standing designs",
      "Concealed cable management",
      "LED backlight integration",
      "Display shelves & closed storage",
      "Multiple finish options",
      "Custom sizing for any wall"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80"
    ],
    priceRange: "₹40K – ₹2.5L",
    timeline: "10–20 days",
    searchKey: "tv"
  },
  lights: {
    label: "Lights",
    icon: LampCeiling,
    tagline: "Set the mood with designer lighting",
    description:
      "From ambient cove lights to statement chandeliers, we plan lighting that transforms spaces. Layer task, accent, and ambient lighting for the perfect atmosphere in every room.",
    heroImage: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1600&q=80",
    features: [
      "Layered lighting design",
      "Cove, track & pendant options",
      "Smart dimmer integration",
      "Energy-efficient LED planning",
      "Accent lighting for art & decor",
      "Outdoor & balcony lighting"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&w=800&q=80"
    ],
    priceRange: "₹30K – ₹2L",
    timeline: "7–15 days",
    searchKey: "lighting"
  },
  "wall-paint": {
    label: "Wall Paint",
    icon: PaintRoller,
    tagline: "Colors that bring your walls to life",
    description:
      "Expert color consultation, texture finishes, and accent walls that define your space. We work with premium paint brands and offer stencil art, ombre effects, and wallpaper integration.",
    heroImage: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=80",
    features: [
      "Professional color consultation",
      "Texture & stencil wall finishes",
      "Accent wall design",
      "Premium brand paints (Asian, Berger, Dulux)",
      "Wallpaper integration",
      "Waterproof & anti-fungal options"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80"
    ],
    priceRange: "₹20K – ₹1.5L",
    timeline: "5–12 days",
    searchKey: "paint"
  },
  bathroom: {
    label: "Bathroom",
    icon: Bath,
    tagline: "Spa-inspired bathrooms for everyday luxury",
    description:
      "Modern vanities, rain showers, designer tiles, and smart storage — we turn bathrooms into personal retreats. Waterproof finishes and anti-slip flooring as standard.",
    heroImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
    features: [
      "Designer vanity & mirror units",
      "Rain shower & mixer installation",
      "Anti-slip tile flooring",
      "Concealed plumbing & cisterns",
      "Waterproof false ceiling",
      "Smart storage niches & shelves"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    ],
    priceRange: "₹1L – ₹5L",
    timeline: "20–35 days",
    searchKey: "bathroom"
  },
  "kids-bedroom": {
    label: "Kids Bedroom",
    icon: Sparkles,
    tagline: "Playful spaces that grow with your child",
    description:
      "Themed bedrooms, bunk beds, study corners, and vibrant color palettes designed for safety and fun. Rounded edges, non-toxic finishes, and clever storage for toys and books.",
    heroImage: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80",
    features: [
      "Theme-based room design",
      "Bunk bed & loft bed options",
      "Integrated study desk & bookshelf",
      "Rounded edges & child-safe hardware",
      "Non-toxic paint & finishes",
      "Toy storage & display solutions"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80"
    ],
    priceRange: "₹1.2L – ₹5L",
    timeline: "20–35 days",
    searchKey: "bedroom"
  }
};

const allSolutionKeys = Object.keys(solutionData);

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const solution = solutionData[slug];
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [heroImage, setHeroImage] = useState("");
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", city: "Hyderabad", whatsappOptIn: true });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const otherSolutions = useMemo(
    () => allSolutionKeys.filter((k) => k !== slug).slice(0, 4).map((k) => ({ slug: k, ...solutionData[k] })),
    [slug]
  );

  useEffect(() => {
    if (!solution) return;
    setLoading(true);
    setGalleryIndex(0);
    const load = async () => {
      const [matRes, projRes, galleryRes] = await Promise.all([
        api.get("/materials"),
        api.get("/projects"),
        api.get(`/solution-gallery/${slug}`).catch(() => ({ data: [] }))
      ]);
      const key = solution.searchKey.toLowerCase();
      setRelatedMaterials(
        (matRes.data || []).filter((m) => `${m.name} ${m.brand} ${m.category}`.toLowerCase().includes(key)).slice(0, 6)
      );
      setRelatedProjects(
        (projRes.data || []).filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(key)).slice(0, 4)
      );

      const apiImages = galleryRes.data || [];
      if (apiImages.length > 0) {
        const hero = apiImages.find((img) => img.isHero);
        setHeroImage(hero ? hero.imageUrl : apiImages[0].imageUrl);
        setGalleryImages(apiImages.map((img) => ({ url: img.imageUrl, caption: img.caption })));
      } else {
        setHeroImage(solution.heroImage);
        setGalleryImages(solution.gallery.map((url) => ({ url, caption: "" })));
      }

      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [slug, solution]);

  useEffect(() => {
    if (!solution || galleryImages.length <= 1) return;
    const interval = setInterval(() => setGalleryIndex((p) => (p + 1) % galleryImages.length), 4000);
    return () => clearInterval(interval);
  }, [solution, galleryImages]);

  const submitLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/leads", { ...leadForm, source: `solution-${slug}` });
      setToast("Our designer will contact you shortly!");
      setLeadForm({ name: "", phone: "", city: "Hyderabad", whatsappOptIn: true });
      setTimeout(() => setToast(""), 3000);
    } catch {
      setToast("Something went wrong. Please try again.");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (!solution) {
    return (
      <div className="space-y-6">
        <Card className="p-10 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">Solution not found</h2>
          <p className="mt-2 text-sm text-subtle">The category you're looking for doesn't exist.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </Card>
      </div>
    );
  }

  const Icon = solution.icon;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed right-3 top-3 z-[60] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-xl border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-ink shadow-lift sm:right-5 sm:top-5">
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-subtle">
        <Link to="/" className="hover:text-ink transition">Home</Link>
        <span>/</span>
        <span className="text-ink font-medium">{solution.label}</span>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-4xl border border-line shadow-lift">
        <div className="relative min-h-[340px] sm:min-h-[420px]">
          <img
            src={heroImage}
            alt={solution.label}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a120dee] via-[#1a120caa] to-transparent" />
          <div className="relative z-10 flex min-h-[340px] flex-col justify-end p-6 sm:min-h-[420px] sm:p-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
              <Icon className="h-3.5 w-3.5" />
              Interior Solution
            </div>
            <h1 className="font-display mt-3 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {solution.label}
            </h1>
            <p className="mt-2 max-w-xl text-base text-white/80 sm:text-lg">{solution.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#get-quote"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink shadow-lg transition hover:scale-[1.02]"
              >
                Get Free Quote
              </a>
              <a
                href="#gallery"
                className="rounded-xl border border-white/50 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                View Gallery
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Price Range", value: solution.priceRange },
          { label: "Timeline", value: solution.timeline },
          { label: "Warranty", value: "Up to 10 yrs" },
          { label: "Rating", value: "4.8 / 5", icon: Star }
        ].map((stat) => (
          <Card key={stat.label} className="text-center p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{stat.label}</p>
            <p className="font-display mt-1 text-lg font-bold text-ink flex items-center justify-center gap-1">
              {stat.icon && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* About section */}
      <Card>
        <h2 className="font-display text-xl font-bold text-ink">About {solution.label}</h2>
        <p className="mt-3 text-sm leading-relaxed text-subtle">{solution.description}</p>
      </Card>

      {/* Features */}
      <Card>
        <h3 className="font-display text-lg font-bold text-ink">What's included</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {solution.features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 rounded-2xl border border-line bg-elevated/40 p-3.5 dark:bg-elevated/25"
            >
              <div className="mt-0.5 rounded-lg bg-accent-muted p-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" />
              </div>
              <p className="text-sm text-ink">{feature}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Gallery */}
      <section id="gallery">
        <Card className="p-0 overflow-hidden">
          <div className="p-5 pb-0">
            <h3 className="font-display text-lg font-bold text-ink">Design Gallery</h3>
            <p className="mt-1 text-sm text-subtle">Explore our {solution.label.toLowerCase()} designs</p>
          </div>
          <div className="mt-4 relative aspect-[16/9] min-h-[220px] bg-elevated">
            <img
              src={galleryImages[galleryIndex]?.url}
              alt={`${solution.label} design ${galleryIndex + 1}`}
              className="h-full w-full object-cover transition duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur">
                  {galleryIndex + 1} / {galleryImages.length}
                </span>
                <div className="flex gap-1.5">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        galleryIndex === idx ? "bg-white" : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setGalleryIndex(idx)}
                className={`aspect-[4/3] overflow-hidden rounded-xl transition ${
                  galleryIndex === idx ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : "opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt={img.caption || ""} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* Related materials */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : relatedMaterials.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">Related Materials</h3>
            <Link to={`/materials?search=${solution.searchKey}`} className="text-sm font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedMaterials.map((mat) => (
              <div key={mat._id} className="group overflow-hidden rounded-2xl border border-line bg-elevated/40 transition hover:shadow-soft">
                {mat.imageUrl && (
                  <div className="aspect-[16/10] bg-elevated">
                    <img src={mat.imageUrl} alt={mat.name} className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                  </div>
                )}
                <div className="p-3">
                  <p className="font-semibold text-ink text-sm">{mat.name}</p>
                  <p className="text-xs text-subtle">{mat.brand}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {/* Related projects */}
      {!loading && relatedProjects.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">Related Projects</h3>
            <Link to={`/projects?search=${solution.searchKey}`} className="text-sm font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedProjects.map((proj) => (
              <Link
                key={proj._id}
                to={`/projects/${proj._id}`}
                className="group overflow-hidden rounded-2xl border border-line bg-elevated/40 transition hover:shadow-soft"
              >
                {proj.images?.[0] && (
                  <div className="aspect-[4/3] bg-elevated">
                    <img src={proj.images[0]} alt={proj.name} className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-semibold text-ink">{proj.name}</p>
                  <p className="mt-1 text-sm text-subtle">{proj.description?.slice(0, 80)}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    View details <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}

      {/* CTA / Lead form */}
      <section id="get-quote">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="bg-gradient-to-br from-surface via-elevated/40 to-surface dark:from-surface dark:via-elevated/30">
            <h3 className="font-display text-2xl font-bold text-ink">
              Ready to transform your {solution.label.toLowerCase()}?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-subtle">
              Get a free consultation with our design experts. We'll understand your space, style preferences, and budget to create a personalized plan.
            </p>
            <div className="mt-5 space-y-3">
              {["Free 3D design visualization", "Transparent pricing — no hidden costs", "45-day installation guarantee", "10-year warranty on modular work"].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-ink">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-lg font-bold text-ink">Get a free quote</h3>
            <p className="mt-1 text-sm text-subtle">Our designer will call you within 2 hours</p>
            <form className="mt-4 space-y-3" onSubmit={submitLead}>
              <Input label="Name" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} required />
              <Input label="Phone" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} required />
              <Select label="City" value={leadForm.city} onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
              <label className="flex items-center gap-2 text-sm text-subtle">
                <input type="checkbox" checked={leadForm.whatsappOptIn} onChange={(e) => setLeadForm({ ...leadForm, whatsappOptIn: e.target.checked })} />
                Send updates on WhatsApp
              </label>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : `Get ${solution.label} Quote`}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Other solutions */}
      <Card>
        <h3 className="font-display text-lg font-bold text-ink">Explore other solutions</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {otherSolutions.map((item) => {
            const OtherIcon = item.icon;
            return (
              <Link
                key={item.slug}
                to={`/solutions/${item.slug}`}
                className="group rounded-2xl border border-line bg-elevated/50 p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-accent/25 hover:bg-surface hover:shadow-soft"
              >
                <div className="mx-auto mb-2 inline-flex rounded-2xl border border-line bg-accent-muted p-2.5 text-accent transition group-hover:scale-105">
                  <OtherIcon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-ink">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
