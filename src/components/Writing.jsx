import { Link } from 'react-router-dom'
import { getAllPosts } from '../data/posts'
import './Writing.css'

const Writing = () => {
    const posts = getAllPosts()

    return (
        <section className="writing section">
            <div className="container">
                <h1 className="section-title-large">Writing</h1>

                <ul className="writing__list">
                    {posts.map((post) => (
                        <li key={post.slug} className="writing__item">
                            <Link to={`/post/${post.slug}`} className="writing__link">
                                <div className="writing__content">
                                    <h3 className="writing__title">{post.title}</h3>
                                    <p className="writing__description">{post.description}</p>
                                </div>
                                <span className="writing__date">{post.date}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default Writing
