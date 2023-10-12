from .website import Product, Website, parse_price
from bs4 import BeautifulSoup, Tag

class AccentMD(Website):
    js_dependent = False
    shop_id = 3

    def get_search_link(self, query, page=1) -> str:
        return f'https://accent.md/search/?search={query}&page={page}'
    
    def get_products(self, query: str, page: int) -> list[Product]:
        result = []
        url = self.get_search_link(query, page)
        raw = super()._fetch_page(url)

        soup = BeautifulSoup(raw, features='html.parser')
        children = soup.select('.product-list')

        for c in children:
            try:
                result.append(self.parse_item(c))
            except:
                pass

        return result

    def parse_item(self, item_raw: Tag) -> Product:
        text = item_raw.select_one('.caption').select_one('h4').text.strip()
        t = []
        for s in text.split(','):
            for l in s.split('/'):
                t.append(l.strip())

        name = t[0]
        specs = [s.lower() for s in t[1:]]
        specs = list(filter(lambda x: len(x) < 35 and len(x) > 1, specs))
        price = parse_price(item_raw.select_one('.price-new').select_one('.text-value').text)
        img_url = item_raw.select_one('img').attrs['src']
        link = item_raw.select_one('a').attrs['href']

        p = Product()
        p.name = name
        p.specs = specs
        p.price = price
        p.image_url = img_url
        p.link = link
        p.shop_id = self.shop_id

        return p