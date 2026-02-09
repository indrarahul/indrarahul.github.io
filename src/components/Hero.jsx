import { Link } from 'react-router-dom'
import { config } from '../data/config'
import './Hero.css'

const Hero = () => {
    return (
        <section className="hero">
            <div className="container">

                <div className="hero__split">
                    <div className="hero__content">
                        <h1 className="hero__name">{config.name}</h1>
                        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hero__resume-link">View Resume</a>

                        <div className="hero__text">
                            <p>
                                {config.intro.split(config.company.name)[0]}
                                <a href={config.company.url} target="_blank" rel="noopener noreferrer" className="link">
                                    {config.company.name}
                                </a>
                                {config.intro.split(config.company.name)[1]}
                            </p>
                        </div>
                    </div>

                    <div className="hero__image-wrapper">
                        <img
                            src={config.avatar}
                            alt={config.name}
                            className="hero__image"
                            onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'block'
                            }}
                        />
                        <div className="hero__image-placeholder" style={{ display: 'none' }}></div>
                    </div>
                </div>

                <div className="hero__text hero__text--full">
                    {config.bio.map((paragraph, index) => (
                        <p key={index}>
                            {paragraph.segments ? (
                                paragraph.segments.map((seg, i) =>
                                    seg.url ? (
                                        seg.url.startsWith('/') ? (
                                            <Link key={i} to={seg.url} className="link">
                                                {seg.text}
                                            </Link>
                                        ) : (
                                            <a key={i} href={seg.url} target="_blank" rel="noopener noreferrer" className="link">
                                                {seg.text}
                                            </a>
                                        )
                                    ) : (
                                        <span key={i}>{seg.text}</span>
                                    )
                                )
                            ) : (
                                <>
                                    {paragraph.text}
                                    {paragraph.links && paragraph.links.map((link, i) => (
                                        <span key={i}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="link">
                                                {link.text}
                                            </a>
                                            {i < paragraph.links.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                    {paragraph.suffix}
                                </>
                            )}
                        </p>
                    ))}

                    <div className="hero__social">
                        {config.social.map((link, index) => (
                            <span key={link.name}>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hero__social-link"
                                >
                                    {link.name}
                                </a>
                                {index < config.social.length - 1 && <span className="hero__social-sep">·</span>}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Hero
