import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://syntaray.vercel.app'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Eğer gizli bir klasörünüz varsa buraya ekleyin
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
