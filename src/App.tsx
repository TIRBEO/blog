import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowUpRight, ArrowLeft, Tag, Clock, User } from "lucide-react";
import { getPublishedPosts, getPostBySlug, type BlogPost } from "@/lib/content";
import { ACCOUNTS_URL } from "@/lib/config";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(content: string | null): string {
  if (!content) return "1 min read";
  const words = content.split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
            <img src="/logo.png" alt="" className="h-6 w-6 object-contain brightness-0 invert" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Tirbeo</span>
        </a>
        <div className="flex items-center gap-6 text-sm">
          <a href="/" className="text-ink-soft hover:text-foreground transition-colors">Home</a>
          <a href="/about" className="text-ink-soft hover:text-foreground transition-colors">About</a>
          <a href="/blog" className="text-foreground font-medium">Blog</a>
          <a href={`${ACCOUNTS_URL}/signup`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5">
            Join Tirbeo <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </nav>
  );
}

function BlogCard({ post, index, onSelect }: { post: BlogPost; index: number; onSelect: (slug: string) => void }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onSelect(post.slug)}
      className="group cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:border-foreground/20 hover:shadow-lift hover:-translate-y-1"
    >
      <div className="flex items-center gap-3 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(post.published_at)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {readingTime(post.content)}
        </span>
      </div>
      <h2 className="mt-4 font-display text-xl font-medium leading-snug tracking-tight text-foreground group-hover:text-[var(--clay)] transition-colors">
        {post.title}
      </h2>
      {post.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-2">{post.excerpt}</p>
      )}
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-ink-soft">
          <User className="h-3.5 w-3.5" />
          {post.author_name}
        </span>
        {post.tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-soft">
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function PostDetail({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-10"
    >
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all posts
        </button>

        <div className="flex items-center gap-4 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readingTime(post.content)}
          </span>
        </div>

        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
            {post.author_name.split(" ").map((n) => n[0]).join("")}
          </div>
          <span>{post.author_name}</span>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wider text-ink-soft">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.content && (
          <div className="mt-10 prose prose-invert max-w-none">
            {post.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return <h2 key={i} className="mt-8 mb-3 font-display text-2xl font-medium tracking-tight">{line.slice(3)}</h2>;
              }
              if (line.startsWith("### ")) {
                return <h3 key={i} className="mt-6 mb-2 font-display text-xl font-medium tracking-tight">{line.slice(4)}</h3>;
              }
              if (line.startsWith("> ")) {
                return (
                  <blockquote key={i} className="my-4 border-l-2 border-[var(--clay)] pl-4 italic text-ink-soft">
                    {line.slice(2)}
                  </blockquote>
                );
              }
              if (line.startsWith("- **")) {
                const match = line.match(/- \*\*(.+?)\*\*(.*)/);
                if (match) {
                  return (
                    <p key={i} className="ml-4 text-sm leading-relaxed text-ink-soft">
                      <strong className="text-foreground">{match[1]}</strong>{match[2]}
                    </p>
                  );
                }
              }
              if (line.startsWith("- ")) {
                return <p key={i} className="ml-4 text-sm leading-relaxed text-ink-soft">{line.slice(2)}</p>;
              }
              if (line.trim() === "") {
                return <div key={i} className="h-3" />;
              }
              if (line.startsWith("---")) {
                return <hr key={i} className="my-8 border-border" />;
              }
              return <p key={i} className="text-base leading-relaxed text-ink-soft">{line}</p>;
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      getPostBySlug(selectedSlug).then(setSelectedPost);
    } else {
      setSelectedPost(null);
    }
  }, [selectedSlug]);

  const handleSelect = (slug: string) => {
    setSelectedSlug(slug);
    window.history.pushState({}, "", `/blog/${slug}`);
  };

  const handleBack = () => {
    setSelectedSlug(null);
    setSelectedPost(null);
    window.history.pushState({}, "", "/blog");
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/blog/")) {
      const slug = path.slice(6);
      if (slug) setSelectedSlug(slug);
    }

    const handlePop = () => {
      const p = window.location.pathname;
      if (p.startsWith("/blog/")) {
        setSelectedSlug(p.slice(6));
      } else {
        setSelectedSlug(null);
        setSelectedPost(null);
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <PostDetail post={selectedPost} onBack={handleBack} />
        <footer className="border-t border-border px-6 py-8 text-center text-xs text-ink-soft">
          &copy; 2026 Tirbeo. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <Nav />

      <div className="relative z-10">
        <section className="pt-32 pb-16">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft"
            >
              Tirbeo Blog
            </motion.span>
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl"
            >
              Stories from the
              <br />
              <span className="italic text-ink-soft">community.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-ink-soft max-w-xl mx-auto"
            >
              Product updates, community stories, and deep dives into how we build Tirbeo.
            </motion.p>
          </div>
        </section>

        <section className="pb-28">
          <div className="mx-auto max-w-7xl px-6">
            {loading ? (
              <div className="flex h-60 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-soft border-t-transparent" />
              </div>
            ) : posts.length === 0 ? (
              <div className="flex h-60 items-center justify-center">
                <p className="text-sm text-ink-soft">No posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} onSelect={handleSelect} />
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="border-t border-border px-6 py-8 text-center text-xs text-ink-soft">
          &copy; 2026 Tirbeo. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
