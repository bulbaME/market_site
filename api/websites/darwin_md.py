from .website import Product, Website, parse_price
from bs4 import BeautifulSoup, Tag

class DarwinMD(Website):
    js_dependent = False
    shop_id = 1

    def get_search_link(self, query, page=1) -> str:
        return f'https://darwin.md/search?search={query}&page={page}'
    
    def get_products(self, query: str, page: int) -> list[Product]:
        result = []
        url = self.get_search_link(query, page)
        raw = super()._fetch_page(url)

        soup = BeautifulSoup(raw, features='html.parser')
        children = soup.select('.row div figure')

        for c in children:
            result.append(self.parse_item(c))
            
        return result

    def parse_item(self, item_raw: Tag) -> Product:
        name = item_raw.select('.grid-item a')[1].text.strip()
        specs = [s.strip() for s in item_raw.select_one('.specification').text.split('|')]
        price = parse_price(item_raw.select_one('.price-new b').text)
        img_url = item_raw.select_one('.card-image').attrs['src']
        link = item_raw.select_one('.grid-item a').attrs['href']

        p = Product()
        p.name = name
        p.specs = specs
        p.price = price
        p.image_url = img_url
        p.link = link
        p.shop_id = self.shop_id

        return p