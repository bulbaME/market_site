from bs4 import BeautifulSoup, PageElement
import requests

def parse_darwin():
    URL = "https://darwin.md/laptop"
    res = requests.get(URL)
    raw = res.text

    soup = BeautifulSoup(raw, features='html.parser')
    children = soup.select('.row div figure')
    
    for e in children:
        t = e.select('.grid-item a')[1].text.strip()
        specs = [s.strip() for s in e.select('.specification')[0].text.split('|')]
        price = e.select('.price-new b')[0].text

        print(t)
        print(specs)
        print(price)
        print()