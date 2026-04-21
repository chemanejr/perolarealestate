// Script to extract image URLs from property pages
const urls = [
  'https://imobiliariaduma-mz.com/property/moradia-t41-na-sommerschield-2/',
  'https://imobiliariaduma-mz.com/property/moradia-t5-na-sommerschield-1/',
  'https://imobiliariaduma-mz.com/property/apartamento-penthouse-t4-triplex-no-triunfo/',
  'https://imobiliariaduma-mz.com/property/moradia-t5-na-sommerschield-2-6/',
  'http://sawa-sawa-imobiliaria.com/?tm-property=%F0%9F%AA%A7arrenda-se-duplex-t4-%F0%9F%93%8Davenida-julius-nyerere',
  'http://sawa-sawa-imobiliaria.com/?tm-property=%F0%9F%AA%A7arrenda-se-moradia-t5-%F0%9F%93%8Davenida-do-zimbabwe'
]

for (const url of urls) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const html = await response.text()
    
    // Extract og:image
    const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/)
    if (ogMatch) console.log(`OG_IMAGE[${url}]: ${ogMatch[1]}`)
    
    // Extract wp-content images
    const wpImages = [...html.matchAll(/https:\/\/[^"'\s]+wp-content\/uploads[^"'\s]+\.(jpg|jpeg|png|webp)/gi)]
    wpImages.slice(0, 3).forEach(m => console.log(`IMG[${url}]: ${m[0]}`))
    
  } catch (e) {
    console.log(`ERROR[${url}]: ${e.message}`)
  }
}
