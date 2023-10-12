from .website import Product, Website, parse_price
from bs4 import BeautifulSoup, Tag

class EnterMD(Website):
    js_dependent = False
    shop_id = 2

    def get_search_link(self, query, page=1) -> str:
        return f'https://enter.online/search?query={query}&page={page}'
    
    def get_products(self, query: str, page: int) -> list[Product]:
        url = self.get_search_link(query, page)
        raw = super()._fetch_page(url)

        soup = BeautifulSoup(raw, features='html.parser')
        children = soup.select_one('.row_products').select_one('div').find_all('div', recursive=False)

        result = []
        for c in children:
            try:
                p = self.parse_item(c)
                result.append(p)
            except BaseException:
                pass

        return result

    def parse_item(self, item_raw: Tag) -> Product | None:
        name = item_raw.select_one('.product-title').text.strip()
        specs = [s.strip() for s in item_raw.select_one('.product-descr').text.split('/')]
        price = parse_price(item_raw.select_one('.price, .price-new').text[:-4])
        img_url = item_raw.select_one('img').attrs['data-src']
        link = item_raw.select_one('.grid-item a').attrs['href']

        p = Product()
        p.name = name
        p.specs = specs
        p.price = price
        p.image_url = img_url
        p.link = link
        p.shop_id = self.shop_id

        return p