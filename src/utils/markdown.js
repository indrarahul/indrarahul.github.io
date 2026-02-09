export const parseFrontmatter = (fileContent) => {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    const match = frontmatterRegex.exec(fileContent)

    if (!match) {
        return {
            metadata: {},
            content: fileContent
        }
    }

    const frontmatterBlock = match[1]
    const content = match[2]
    const metadata = {}

    frontmatterBlock.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length) {
            // Handle simple strings, trim quotes if present
            let value = valueParts.join(':').trim()
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1)
            }
            metadata[key.trim()] = value
        }
    })

    return { metadata, content }
}
