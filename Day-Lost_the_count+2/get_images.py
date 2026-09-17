import urllib.request
import re

urls = {
    'psg': 'https://www.soccerbox.com/french-ligue-1/paris-saint-germain-football-shirts',
    'bayern': 'https://www.soccerbox.com/german-bundesliga/bayern-munich-football-shirts',
    'barca': 'https://www.soccerbox.com/spanish-la-liga/barcelona-football-shirts'
}

for team, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'\"(https://www.soccerbox.com/media/catalog/product/cache/[^\"]+home[^\"]+)\"', html)
        if match:
            print(f'{team}: {match.group(1)}')
        else:
            # fallback: find any product image
            match = re.search(r'\"(https://www.soccerbox.com/media/catalog/product/cache/[^\"]+\.jpg)\"', html)
            if match:
                print(f'{team} (fallback): {match.group(1)}')
            else:
                print(f'{team}: not found')
    except Exception as e:
        print(f'{team}: Error {e}')
