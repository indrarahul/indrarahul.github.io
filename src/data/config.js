export const config = {
    // Personal Info
    name: "Rahul Indra",
    initials: "ri",
    title: "Engineer",
    avatar: "/avatar.jpg", // Place your avatar image in the public directory
    company: {
        name: "Meta",
        url: "https://meta.com"
    },

    intro: "I'm a Production Engineer at Meta based in London, where I focus on building scalable distributed systems and improving infrastructure reliability. I have a strong passion for high-performance computing and developer experience.",

    bio: [
        {
            segments: [
                { text: "Previously, I worked as a Site Reliability Engineer at " },
                { text: "media.net", url: "https://media.net" },
                { text: " and contributed to open source as a " },
                { text: "GSoC participant at CERN", url: "https://summerofcode.withgoogle.com/archive/2020/projects/4827645050617856" },
                { text: ". I graduated from " },
                { text: "IIEST, Shibpur", url: "https://www.iiests.ac.in/" },
                { text: " with a focus on Computer Science." }
            ]
        },
        {
            text: "I'm deeply interested in high-performance systems and the intersection of AI. I also share my engineering journey and insights on my ",
            links: [
                { text: "YouTube channel", url: "https://youtube.com/@srewala5254" }
            ],
            suffix: "."
        },
        {
            segments: [
                { text: "When I'm not optimizing systems, I enjoy contributing to open-source projects, exploring new technologies and " },
                { text: "writing", url: "/writing" },
                { text: "." }
            ]
        }
    ],

    // Social Links
    social: [
        { name: 'Email', url: 'mailto:indrarahul@gmail.com' },
        { name: 'GitHub', url: 'https://github.com/indrarahul' },
        { name: 'Twitter', url: 'https://twitter.com/indrarahul_' },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/indrarahul' },
        { name: 'YouTube', url: 'https://youtube.com/@srewala5254' }
    ],

    // Footer
    copyrightName: "Rahul Indra"
}
