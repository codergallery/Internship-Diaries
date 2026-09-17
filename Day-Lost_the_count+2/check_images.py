import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}

# Try direct CDN URLs that are known to work for sports jerseys
# These are well-known, stable CDN paths
candidates = [
    # Adidas official CDN for Bayern
    ('bayern', 'https://assets.adidas.com/images/w_600,f_auto,q_auto/69f24f0c9b5143e8894fafbd009e2413_9366/FC_Bayern_24-25_Home_Jersey_Red_IT8511_01_laydown.jpg'),
    ('bayern', 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/69f24f0c9b5143e8894fafbd009e2413_9366/FC_Bayern_Munchen_24-25_Home_Jersey_Red_IT8511_01_laydown.jpg'),
    ('bayern', 'https://assets.adidas.com/images/w_600,f_auto,q_auto/f4ec1b41bae14f42b0deafbd009df969_9366/FC_Bayern_24-25_Home_Jersey_Red_IT8511_HM_1.jpg'),
    # Nike CDN for Barca
    ('barca', 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3ca3a8c8-ff72-48a4-ba14-e21d2a30ed32/fc-barcelona-2024-25-match-home-dri-fit-adv-football-shirt-HsGdhp.png'),
    ('barca', 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d4ab32fb-7ee2-4c87-8c3d-c51acc88f3a3/fc-barcelona-2024-25-stadium-home-dri-fit-football-shirt-TJgkhp.png'),
    # Nike CDN for PSG
    ('psg', 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0a28f5f0-80c3-4455-8b0c-d10f2e2c4012/paris-saint-germain-2024-25-match-home-dri-fit-adv-football-shirt-hhS4q2.png'),
    ('psg', 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9c4e3e3e-0c37-458f-badc-c8be0d2aab80/paris-saint-germain-2024-25-stadium-home-dri-fit-football-shirt-42dGhp.png'),
    # Archive.org cached versions
    ('barca', 'https://web.archive.org/web/2024/https://store.fcbarcelona.com/cdn/shop/files/DN5718-456_A.jpg'),
    # Try Imgur / other hosting
    ('barca', 'https://i.imgur.com/barcelona-2024-home.jpg'),
    # Try raw github / static hosting
    # Fanatics CDN
    ('barca', 'https://images.footballfanatics.com/fc-barcelona/fc-barcelona-nike-2024-25-home-stadium-jersey/t-87654321/image1.jpg'),
    ('bayern', 'https://images.footballfanatics.com/fc-bayern-munich/fc-bayern-munich-adidas-2024-25-home-stadium-jersey/t-87654322/image1.jpg'),
    ('psg', 'https://images.footballfanatics.com/paris-saint-germain/paris-saint-germain-nike-2024-25-home-stadium-jersey/t-87654323/image1.jpg'),
]

for team, url in candidates:
    try:
        req = urllib.request.Request(url, headers=headers)
        data = urllib.request.urlopen(req, timeout=8, context=ctx).read()
        if len(data) > 10000:
            print(f'OK {team}: {len(data)} bytes - {url}')
    except Exception as e:
        pass  # silently skip failures
        # print(f'FAIL {team}: {str(e)[:60]}')

print("\n--- Trying soccerbox with different cache IDs ---")
# The soccerbox cache might have different hash for actual products
cache_ids = [
    '980x980',
    '420x420',
    '640x480',
]

for team, slug in [('barca', 'barcelona-home-shirt-24-25'), ('bayern', 'bayern-munich-home-shirt-24-25'), ('psg', 'psg-home-shirt-24-25')]:
    first_letter = slug[0]
    second_letter = slug[1]
    for cache in ['1c0a3d54c70e7be025ba9fd6e7e26060', 'e5c18d5f608fefb2b3ef83fcb1922b34', 'a54bfed2544f895a20cf9f23d7c80d48']:
        url = f'https://www.soccerbox.com/media/catalog/product/cache/{cache}/{first_letter}/{second_letter}/{slug}.jpg'
        try:
            req = urllib.request.Request(url, headers=headers)
            data = urllib.request.urlopen(req, timeout=5, context=ctx).read()
            if len(data) != 18907 and len(data) > 10000:
                print(f'REAL {team}: {len(data)} bytes - {url}')
        except:
            pass
