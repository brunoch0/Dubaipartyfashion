import ReactMarkdown from 'react-markdown';

/** Renders locale-resolved markdown body. External links open in a new tab. */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-brand text-[0.95rem] text-ink">
      <ReactMarkdown
        components={{
          a: ({ href, children: linkChildren }) => {
            const external = /^https?:\/\//.test(href ?? '');
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {linkChildren}
              </a>
            );
          },
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} loading="lazy" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
