from .websites import EnterMD, DarwinMD, AccentMD, MaximumMD, website
from . import db

from multiprocessing import Pool
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
import yaml, json, os

PORT = yaml.safe_load(open('credentials.yaml'))['server']['port']

SITES: list[website.Website] = [
    EnterMD(),
    DarwinMD(),
    AccentMD(),
    MaximumMD()
]

DB = db.DB()

def top_searches() -> list[str]:
    return DB.top_searches(10)

def get_products(site: website.Website, q):
    try:
        return site.get_products_pages(q, 2)
    except:
        return []

def query(q) -> list[website.Product]:
    h = DB.check_allias(q)
    products: list[website.Product] = []

    if h == None:
        # with Pool(os.cpu_count()) as pool:
        #     pool.apply_async(SITES[0].get_products, (q, ), callback=lambda x: products.extend(x))
        #     # pool.apply_async(SITES[1].get_products, (q, ), callback=lambda x: products.extend(x))
            
        #     pool.close()
        #     pool.join()

        for s in SITES:
            products.extend(get_products(s, q))

        if len(products) == 0: return []

        DB.new_query(q, products)
    else:
        products = DB.get_query(h)

    return products

class Server(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path)

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        res = ''
        
        if url.path == '/query':
            t = url.query.split('=')
            q = None
            if len(t) == 2 and t[0] == 'q':
                q = t[1]

            l = query(q)
            l = [p.to_dict() for p in l]
            res = json.dumps(l)
        elif url.path == 'search_top':
            res = json.dumps(top_searches())

        self.wfile.write(bytes(res, 'utf-8'))

def start():
    server = HTTPServer(('localhost', PORT), Server)
    print(f'Server started on port {PORT}')

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

    server.server_close()
    del website.DRIVERS