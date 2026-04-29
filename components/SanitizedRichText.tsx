import sanitizeHtml from 'sanitize-html'

const SANITIZE_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: ['p','br','strong','em','b','i','u','a','ul','ol','li','h2','h3','h4','blockquote','div','span'],
  allowedAttributes: { a: ['href','target','rel'] },
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }, true),
  },
}

interface Props {
  html: string
  className?: string
}

export default function SanitizedRichText({ html, className }: Props) {
  const clean = sanitizeHtml(html, SANITIZE_CONFIG)
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
