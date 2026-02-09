import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../data/posts'
import './Post.css'

// Parse inline elements: **bold**, *italic*, `code`, [links](url)
const parseInline = (text) => {
    if (!text) return text

    const parts = []
    let remaining = text
    let key = 0

    while (remaining) {
        // YouTube embed: ![youtube](VIDEO_ID)
        const youtubeMatch = remaining.match(/!\[youtube\]\(([^)]+)\)/)
        if (youtubeMatch && remaining.indexOf(youtubeMatch[0]) === 0) {
            parts.push(
                <div key={key++} className="post__youtube">
                    <iframe
                        src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )
            remaining = remaining.slice(youtubeMatch[0].length)
            continue
        }

        // Profile image: ![profile:Name — Info](url)
        const profileMatch = remaining.match(/!\[profile:([^\]]*)\]\(([^)]+)\)/)
        if (profileMatch && remaining.indexOf(profileMatch[0]) === 0) {
            parts.push(
                <div key={key++} className="post__profile-card">
                    <img src={profileMatch[2]} alt={profileMatch[1]} className="post__profile-img" />
                    <span className="post__profile-name">{profileMatch[1]}</span>
                </div>
            )
            remaining = remaining.slice(profileMatch[0].length)
            continue
        }

        // Image: ![alt](url)
        const imgMatch = remaining.match(/!\[([^\]]*)\]\(([^)]+)\)/)
        if (imgMatch && remaining.indexOf(imgMatch[0]) === 0) {
            parts.push(
                <figure key={key++} className="post__figure">
                    <img src={imgMatch[2]} alt={imgMatch[1]} className="post__image" />
                    {imgMatch[1] && <figcaption className="post__caption">{imgMatch[1]}</figcaption>}
                </figure>
            )
            remaining = remaining.slice(imgMatch[0].length)
            continue
        }

        // Link: [text](url)
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch && remaining.indexOf(linkMatch[0]) === 0) {
            parts.push(
                <a key={key++} href={linkMatch[2]} className="post__link" target="_blank" rel="noopener noreferrer">
                    {linkMatch[1]}
                </a>
            )
            remaining = remaining.slice(linkMatch[0].length)
            continue
        }

        // Bold: **text**
        const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
        if (boldMatch && remaining.indexOf(boldMatch[0]) === 0) {
            parts.push(<strong key={key++}>{boldMatch[1]}</strong>)
            remaining = remaining.slice(boldMatch[0].length)
            continue
        }

        // Italic: *text*
        const italicMatch = remaining.match(/\*([^*]+)\*/)
        if (italicMatch && remaining.indexOf(italicMatch[0]) === 0) {
            parts.push(<em key={key++}>{italicMatch[1]}</em>)
            remaining = remaining.slice(italicMatch[0].length)
            continue
        }

        // Inline code: `code`
        const codeMatch = remaining.match(/`([^`]+)`/)
        if (codeMatch && remaining.indexOf(codeMatch[0]) === 0) {
            parts.push(<code key={key++} className="post__inline-code">{codeMatch[1]}</code>)
            remaining = remaining.slice(codeMatch[0].length)
            continue
        }

        // Regular text - find next special character or end
        const nextSpecial = remaining.search(/(\*\*|\*|`|!\[|\[)/)
        if (nextSpecial === -1) {
            parts.push(remaining)
            break
        } else if (nextSpecial === 0) {
            // No match at start, just take one character
            parts.push(remaining[0])
            remaining = remaining.slice(1)
        } else {
            parts.push(remaining.slice(0, nextSpecial))
            remaining = remaining.slice(nextSpecial)
        }
    }

    return parts
}

const Post = () => {
    const { slug } = useParams()
    const post = getPostBySlug(slug)

    if (!post) {
        return (
            <div className="post">
                <div className="container">
                    <Link to="/" className="post__back">← Back</Link>
                    <h1>Post not found</h1>
                    <p>The post you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    const renderContent = (content) => {
        const lines = content.trim().split('\n')
        const elements = []
        let inCodeBlock = false
        let codeContent = []
        let key = 0

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            // Code blocks
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    elements.push(
                        <pre key={key++} className="post__code">
                            <code>{codeContent.join('\n')}</code>
                        </pre>
                    )
                    codeContent = []
                    inCodeBlock = false
                } else {
                    inCodeBlock = true
                }
                continue
            }

            if (inCodeBlock) {
                codeContent.push(line)
                continue
            }

            // YouTube on its own line
            if (line.trim().match(/^!\[youtube\]\([^)]+\)$/)) {
                elements.push(<div key={key++}>{parseInline(line.trim())}</div>)
                continue
            }

            // Profile image or regular image on its own line
            if (line.trim().match(/^!\[[^\]]*\]\([^)]+\)$/)) {
                elements.push(<div key={key++}>{parseInline(line.trim())}</div>)
                continue
            }

            // Headers
            if (line.startsWith('## ')) {
                elements.push(<h2 key={key++} className="post__h2">{parseInline(line.slice(3))}</h2>)
                continue
            }
            if (line.startsWith('### ')) {
                elements.push(<h3 key={key++} className="post__h3">{parseInline(line.slice(4))}</h3>)
                continue
            }

            // Empty lines
            if (line.trim() === '') {
                continue
            }

            // Blockquote
            if (line.startsWith('> ')) {
                elements.push(<blockquote key={key++} className="post__quote">{parseInline(line.slice(2))}</blockquote>)
                continue
            }

            // Lists
            if (line.startsWith('- ')) {
                elements.push(<li key={key++} className="post__li">{parseInline(line.slice(2))}</li>)
                continue
            }
            if (line.match(/^\d+\. /)) {
                elements.push(<li key={key++} className="post__li">{parseInline(line.replace(/^\d+\. /, ''))}</li>)
                continue
            }

            // Paragraphs
            elements.push(<p key={key++} className="post__p">{parseInline(line)}</p>)
        }

        return elements
    }

    return (
        <article className="post">
            <div className="container">
                <Link to="/writing" className="post__back">← Back</Link>

                <header className="post__header">
                    <h1 className="post__title">{post.title}</h1>
                    <p className="post__meta">{post.date}</p>
                </header>

                <div className="post__content">
                    {renderContent(post.content)}
                </div>

                {/* Spacer to ensure footer doesn't overlap content */}
                <div className="post__spacer"></div>
            </div>
        </article>
    )
}

export default Post
