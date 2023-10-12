from .website import Product, Website, parse_price
from bs4 import BeautifulSoup, Tag

class MaximumMD(Website):
    js_dependent = False
    shop_id = 4

    def get_search_link(self, query, page=1) -> str:
        return f'https://maximum.md/ro/search/{page}?query={query}'
    
    def get_products(self, query: str, page: int) -> list[Product]:
        result = []
        url = self.get_search_link(query, page)
        raw = super()._fetch_page(url)

        soup = BeautifulSoup(raw, features='html.parser')
        children = soup.select('.wrap_search_page')

        for c in children:
            result.append(self.parse_item(c))
            
        return result

    def parse_item(self, item_raw: Tag) -> Product:
        name = item_raw.select_one('.product__item__title').select_one('a').text.strip()
        # specs = [s for s in item_raw.select_one('.product-item-description').text.split('/')]
        descr = item_raw.select_one('.product-item-description').text.strip()
        price = parse_price(item_raw.select_one('.product__item__price-current').select_one('span').text)
        img_url = item_raw.select_one('img').attrs['data-src']
        link = 'https://maximum.md' + item_raw.select_one('a').attrs['href']

        # t = specs
        # specs = []
        # for s in t:
        #     for a in s.split(';'):
        #         specs.append(a.strip())

        # specs = list(filter(lambda x: x.lower().find('cod produsului') == -1, specs))
        # t = specs
        # specs = []
        # for s in t:
        #     if s.find(',') == -1:
        #         specs.append(s)
        #         continue

        #     s = s[s.find(',')+1:].strip()
        #     specs.append(s)

        p = Product()
        p.name = name
        # p.specs = specs
        p.description = descr
        p.price = price
        p.image_url = img_url
        p.link = link
        p.shop_id = self.shop_id

        return p