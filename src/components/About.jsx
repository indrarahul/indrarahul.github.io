import './About.css'

const About = () => {
    return (
        <section id="about" className="about section">
            <div className="container">
                <h2 className="section-title">About</h2>

                <div className="about__content">
                    <p>
                        I'm a software engineer with over 5 years of experience building web applications.
                        I currently work at <a href="#" className="link">Company Name</a>, where I focus on
                        building scalable frontend systems and improving developer experience.
                    </p>

                    <p>
                        Before that, I worked at <a href="#" className="link">Previous Company</a> building
                        real-time collaboration tools, and at <a href="#" className="link">Another Company</a>
                        where I got my start in the industry. I studied Computer Science at University.
                    </p>

                    <p>
                        When I'm not coding, I enjoy writing about software development, exploring new
                        technologies, and contributing to open source projects. I believe in building
                        software that's both functional and delightful to use.
                    </p>

                    <p>
                        Feel free to reach out at{' '}
                        <a href="mailto:hello@johndoe.com" className="link">hello@johndoe.com</a> —
                        I'm always happy to chat about projects, opportunities, or just technology in general.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default About
