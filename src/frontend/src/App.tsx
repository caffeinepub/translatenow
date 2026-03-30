import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ArrowLeftRight,
  Copy,
  Globe,
  Heart,
  History,
  Languages,
  Loader2,
  Share2,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useGetRecentTranslations,
  useGetSupportedLanguages,
  useGetVisitCount,
  useTrackVisit,
  useTranslate,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

const FALLBACK_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ko", name: "Korean" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
];

const SKELETON_IDS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
];
const HIST_SKELETON_IDS = ["ha", "hb", "hc"];

const FEATURES = [
  {
    icon: <Languages className="w-7 h-7" />,
    title: "100+ Languages",
    desc: "Translate between over 100 languages with high accuracy, from English to Swahili.",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Instant Translation",
    desc: "Get lightning-fast results powered by advanced neural translation models.",
  },
  {
    icon: <Copy className="w-7 h-7" />,
    title: "Copy & Share",
    desc: "Instantly copy translated text to clipboard or share it with one click.",
  },
  {
    icon: <History className="w-7 h-7" />,
    title: "Translation History",
    desc: "Review your recent translations and pick up right where you left off.",
  },
];

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

function TranslateApp() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [translatedText, setTranslatedText] = useState("");

  const { data: languages, isLoading: langsLoading } =
    useGetSupportedLanguages();
  const { data: recentTranslations, isLoading: histLoading } =
    useGetRecentTranslations();
  const translateMutation = useTranslate();
  const { data: visitCount } = useGetVisitCount();
  const trackVisitMutation = useTrackVisit();

  useEffect(() => {
    if (!sessionStorage.getItem("visited")) {
      trackVisitMutation.mutate(undefined, {
        onSuccess: () => {
          sessionStorage.setItem("visited", "1");
          queryClient.invalidateQueries({ queryKey: ["visitCount"] });
        },
      });
    }
  }, [trackVisitMutation]);

  const langs =
    languages && languages.length > 0 ? languages : FALLBACK_LANGUAGES;

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter some text to translate.");
      return;
    }
    try {
      const result = await translateMutation.mutateAsync({
        text: sourceText,
        fromLang: sourceLang,
        toLang: targetLang,
      });
      setTranslatedText(result);
    } catch {
      toast.error("Translation failed. Please try again.");
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    toast.success("Copied to clipboard!");
  };

  const handleListen = () => {
    if (!translatedText) return;
    const utter = new SpeechSynthesisUtterance(translatedText);
    utter.lang = targetLang;
    window.speechSynthesis.speak(utter);
  };

  const scrollToWidget = () => {
    widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-nav text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">
              TranslateNow
            </span>
          </div>
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            <a
              href="#features"
              className="text-sm text-white/80 hover:text-white transition-colors"
              data-ocid="nav.features.link"
            >
              Features
            </a>
            <a
              href="#languages"
              className="text-sm text-white/80 hover:text-white transition-colors"
              data-ocid="nav.languages.link"
            >
              Languages
            </a>
            <a
              href="#history"
              className="text-sm text-white/80 hover:text-white transition-colors"
              data-ocid="nav.history.link"
            >
              History
            </a>
            <a
              href="#support"
              className="text-sm text-white/80 hover:text-white transition-colors"
              data-ocid="nav.support.link"
            >
              Support
            </a>
          </nav>
          <Button
            className="bg-primary hover:bg-teal-hover text-white font-semibold text-sm px-5"
            onClick={scrollToWidget}
            data-ocid="nav.get_started.button"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section
          className="relative overflow-hidden bg-nav text-white py-20 px-4"
          style={{
            backgroundImage:
              "url('/assets/generated/translate-hero-bg.dim_1400x500.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-nav/85" />
          <motion.div
            className="relative z-10 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
              <Globe className="w-4 h-4" />
              <span>Powered by Neural Translation</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 leading-tight">
              Translation Hub
            </h1>
            <p className="text-lg text-white/75 max-w-xl mx-auto mb-8">
              Break language barriers instantly. Translate text across 100+
              languages with professional accuracy, for free.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-teal-hover text-white font-semibold px-8 py-3 text-base shadow-lg"
              onClick={scrollToWidget}
              data-ocid="hero.start_translating.button"
            >
              Start Translating
            </Button>
          </motion.div>
        </section>

        {/* TRANSLATION WIDGET */}
        <section className="py-16 px-4" ref={widgetRef} id="widget">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center text-foreground mb-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              Translate Anything
            </motion.h2>
            <p className="text-center text-muted-foreground mb-10">
              Type or paste your text and get an instant translation
            </p>

            <div className="flex flex-col md:flex-row gap-4 items-stretch relative">
              {/* SOURCE CARD */}
              <div
                className="flex-1 bg-card rounded-2xl shadow-card p-5 flex flex-col gap-3"
                data-ocid="translator.panel"
              >
                <div className="flex items-center gap-3">
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger
                      className="w-44 bg-background border-border"
                      data-ocid="translator.source_lang.select"
                    >
                      <SelectValue placeholder="Source language" />
                    </SelectTrigger>
                    <SelectContent>
                      {langsLoading ? (
                        <SelectItem value="en">Loading...</SelectItem>
                      ) : (
                        langs.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            {l.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">Source</span>
                </div>
                <Textarea
                  className="flex-1 min-h-[180px] resize-none border-border text-base"
                  placeholder="Type or paste text here..."
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  maxLength={5000}
                  data-ocid="translator.source.textarea"
                />
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground text-xs h-7"
                    onClick={() => {
                      setSourceText("");
                      setTranslatedText("");
                    }}
                    data-ocid="translator.clear.button"
                  >
                    Clear
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {sourceText.length}/5000
                  </span>
                </div>
              </div>

              {/* SWAP BUTTON */}
              <div className="flex items-center justify-center md:flex-col md:pt-12">
                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Swap languages"
                  className="w-12 h-12 rounded-full bg-nav text-white flex items-center justify-center shadow-card hover:bg-nav/80 transition-all active:scale-95"
                  data-ocid="translator.swap.button"
                >
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
                <span className="hidden md:block text-xs text-muted-foreground mt-2 text-center">
                  Swap
                </span>
              </div>

              {/* TARGET CARD */}
              <div className="flex-1 bg-card rounded-2xl shadow-card p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger
                      className="w-44 bg-background border-border"
                      data-ocid="translator.target_lang.select"
                    >
                      <SelectValue placeholder="Target language" />
                    </SelectTrigger>
                    <SelectContent>
                      {langsLoading ? (
                        <SelectItem value="es">Loading...</SelectItem>
                      ) : (
                        langs.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            {l.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    className="bg-primary hover:bg-teal-hover text-white font-semibold px-5 transition-all"
                    onClick={handleTranslate}
                    disabled={translateMutation.isPending || !sourceText.trim()}
                    data-ocid="translator.translate.button"
                  >
                    {translateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      "Translate"
                    )}
                  </Button>
                </div>

                <div
                  className="flex-1 min-h-[180px] bg-background rounded-xl p-4 border border-border overflow-auto"
                  data-ocid="translator.output.panel"
                >
                  <AnimatePresence mode="wait">
                    {translateMutation.isPending ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        data-ocid="translator.loading_state"
                      >
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </motion.div>
                    ) : translateMutation.isError ? (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-destructive text-sm"
                        data-ocid="translator.error_state"
                      >
                        Translation failed. Please try again.
                      </motion.p>
                    ) : translatedText ? (
                      <motion.p
                        key="result"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-foreground text-base leading-relaxed"
                        data-ocid="translator.success_state"
                      >
                        {translatedText}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-muted-foreground text-sm italic"
                      >
                        Translation will appear here...
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs border-border"
                    onClick={handleCopy}
                    disabled={!translatedText}
                    data-ocid="translator.copy.button"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs border-border"
                    onClick={handleListen}
                    disabled={!translatedText}
                    data-ocid="translator.listen.button"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORTED LANGUAGES */}
        <section className="py-14 px-4 bg-card" id="languages">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              Supported Languages
            </motion.h2>
            <p className="text-muted-foreground mb-8">
              From major world languages to regional dialects — we&apos;ve got
              you covered.
            </p>
            <div
              className="flex flex-wrap justify-center gap-2"
              data-ocid="languages.list"
            >
              {langsLoading
                ? SKELETON_IDS.map((id) => (
                    <Skeleton key={id} className="h-7 w-20 rounded-full" />
                  ))
                : langs.map((l, i) => (
                    <Badge
                      key={l.code}
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium bg-background border border-border hover:border-primary hover:text-primary transition-colors cursor-default"
                      data-ocid={`languages.item.${i + 1}`}
                    >
                      {l.name}
                    </Badge>
                  ))}
            </div>
          </div>
        </section>

        {/* KEY FEATURES */}
        <section className="py-16 px-4" id="features">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center text-foreground mb-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              Key Features
            </motion.h2>
            <p className="text-center text-muted-foreground mb-10">
              Everything you need to communicate across languages
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-3 hover:shadow-card-hover transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* RECENT TRANSLATIONS */}
        <section className="py-14 px-4 bg-card" id="history">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              Recent Translations
            </motion.h2>
            <p className="text-muted-foreground mb-8">
              Your latest translation activity
            </p>

            {histLoading ? (
              <div className="space-y-3" data-ocid="history.loading_state">
                {HIST_SKELETON_IDS.map((id) => (
                  <Skeleton key={id} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : !recentTranslations || recentTranslations.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground bg-background rounded-2xl border border-border"
                data-ocid="history.empty_state"
              >
                <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No translations yet</p>
                <p className="text-sm mt-1">
                  Your translation history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="history.list">
                {recentTranslations.slice(0, 6).map((t, i) => (
                  <motion.div
                    key={`${t.text}-${t.timestamp}`}
                    className="bg-background rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-start gap-3"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    data-ocid={`history.item.${i + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {t.text}
                      </p>
                      <p className="text-sm text-primary mt-1 truncate">
                        {t.translatedText}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {t.fromLang} → {t.toLang}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(t.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-nav text-white/70" id="support">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-white font-bold text-lg">
                  TranslateNow
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Professional translation for everyone. Break language barriers
                with AI-powered accuracy.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                Features
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#widget"
                    className="hover:text-white transition-colors"
                    data-ocid="footer.features.link"
                  >
                    Text Translation
                  </a>
                </li>
                <li>
                  <a
                    href="#widget"
                    className="hover:text-white transition-colors"
                  >
                    Language Detection
                  </a>
                </li>
                <li>
                  <a
                    href="#history"
                    className="hover:text-white transition-colors"
                  >
                    Translation History
                  </a>
                </li>
                <li>
                  <a
                    href="#widget"
                    className="hover:text-white transition-colors"
                  >
                    Copy &amp; Share
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#support"
                    className="hover:text-white transition-colors"
                    data-ocid="footer.support.link"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#support"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#support"
                    className="hover:text-white transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#support"
                    className="hover:text-white transition-colors"
                    data-ocid="footer.legal.link"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#support"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#support"
                    className="hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#support"
                    className="hover:text-white transition-colors"
                  >
                    Licenses
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="flex items-center gap-1.5">
              © {currentYear}. Built with{" "}
              <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="text-primary hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-xs bg-white/10 text-white/70 border-white/20"
              >
                <Share2 className="w-3 h-3 mr-1" /> 100+ Languages
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs bg-white/10 text-white/70 border-white/20"
                data-ocid="footer.visitors.panel"
              >
                <Users className="w-3 h-3 mr-1" />
                {visitCount !== undefined ? visitCount.toString() : "..."}{" "}
                visitors
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslateApp />
    </QueryClientProvider>
  );
}
