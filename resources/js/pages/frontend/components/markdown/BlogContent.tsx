import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

type CodeProps = {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
};

function CodeBlock({ inline, className, children, ...props }: CodeProps) {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children ?? "").replace(/\n$/, "");

    // Inline code: simple <code> style
    if (inline || !match) {
        return (
            <code className="rounded bg-muted px-1 py-0.5 text-sm" {...props}>
                {children}
            </code>
        );
    }

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {}
    };

    return (
        <div className="relative group not-prose">
            {/* Copy button */}
            <button
                type="button"
                onClick={onCopy}
                className="absolute right-2 top-2 z-10 rounded-md border px-2 py-1 text-xs
                   bg-white/90 backdrop-blur hover:bg-white transition
                   opacity-0 group-hover:opacity-100"
                aria-label="Copy code to clipboard"
            >
        <span className="inline-flex items-center gap-1">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
        </span>
            </button>

            {/* Highlighted code */}
            <SyntaxHighlighter
                language={match[1]}
                // Switch theme with Tailwind dark mode if you use it:
                style={typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? oneDark : oneLight}
                PreTag="div"
                className="rounded-xl overflow-hidden text-sm"
                showLineNumbers
                wrapLines
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

export default function BlogContent({ content }: { content: string }) {
    return (
        <div className="prose prose-lg max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]} // remove if you don't allow raw HTML in markdown
                components={{
                    // Avoid an extra <pre> wrapper around our SyntaxHighlighter
                    pre: ({ children }) => <div className="my-4">{children}</div>,
                    code: CodeBlock,
                    // Optional: make images responsive
                    img: (props) => <img {...props} className="rounded-lg" loading="lazy" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
