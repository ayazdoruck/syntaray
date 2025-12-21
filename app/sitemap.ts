import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://syntaray.vercel.app'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        // Eğer başka sayfalarınız varsa buraya ekleyebilirsiniz, örneğin blog vs.
        // Şimdilik sadece ana sayfa olduğu için tek URL yeterli.
    ]
}
