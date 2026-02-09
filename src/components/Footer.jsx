import { config } from '../data/config'
import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__content">
                    <span className="footer__copyright">© {currentYear} {config.copyrightName}</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
