from pymongo import MongoClient
from api.websites import website
import yaml
import time
import random

DATA = yaml.safe_load(open('credentials.yaml'))['mongodb']
CONNECT = DATA['connect']
SEARCH_EXPIRE = DATA['search_expire']

def get_product_hash(p: website.Product):
    p_hash = p.name.lower().replace(' ', '')
    p_hash += f'.{"".join(p.specs)}.{p.shop_id}'
    return p_hash

def hash_array_checksum(p: list[str]) -> str:
    l = len(max(p, key=len))
    sl = [' ' for _ in range(l)]

    for s in p:
        for i in range(len(s)):
            s = s[len(s)//2:] + s[:len(s)//2]
            sl[i] = chr(ord(sl[i]) ^ ord(s[i]))

    return ''.join(sl)

class DB:
    db_client = MongoClient(CONNECT).get_database('market-site')

    def set_product(self, p: website.Product) -> str:
        p_hash = get_product_hash(p)
        p_data = p.to_dict()

        self.db_client.products.update_one({'hash': p_hash}, {'$set': {'hash': p_hash, 'data': p_data}}, upsert=True)

        return p_hash
    
    def del_product(self, p_hash: str):
        self.db_client.products.delete_one({'hash': p_hash})

    def get_product(self, p_hash: str) -> website.Product | None: 
        p = self.db_client.products.find_one({'hash': p_hash})

        if p == None: return None
        return website.Product(p['data'])

    def delete_old_queries(self):
        now = time.time()

        c = self.db_client.queries.find({'timestamp': {'$lt': now}})

        for q in c:
            self.db_client.query_alliases.delete_one({'hash': q['hash']})
            self.db_client.queries.delete_one(q)
        
    def add_query_allias(self, hash: str, name: str): 
        q = self.db_client.query_alliases.find_one({'hash': hash})
        
        if q == None:
            self.db_client.query_alliases.insert_one({'hash': hash, 'alliases': [name]})
        else:
            self.db_client.query_alliases.update_one({'hash': hash}, {'$push': {'alliases': name}})

    def check_allias(self, allias: str) -> str | None:
        a = self.db_client.query_alliases.find_one({'alliases': [allias]})
        if a == None: return None

        self.db_client.queries.update_one({'hash': a['hash']}, {'$inc': {'popularity': 1.0}})
        return a['hash']

    def top_searches(self, count: int) -> list[str]: 
        c = self.db_client.queries.find().sort('popularity', -1).limit(count)
        l = []
        for q in list(c):
            h = q['hash']
            al = self.db_client.query_alliases.find_one({'hash': h})
            s = random.choice(al['alliases'])
            l.append(s)

        return l

    def get_query(self, hash: str) -> list[website.Product] | None:
        query = self.db_client.queries.find_one({'hash': hash})
        
        l = []

        if query == None: return None

        for p in query['products']:
            p = self.get_product(p)
            if p != None:
                l.append(p)

        return l

    def new_query(self, allias: str, products: list[website.Product]):
        product_hashes = []

        for p in products:
            h = self.set_product(p)
            product_hashes.append(h)

        checksum = hash_array_checksum(product_hashes)
        expire = time.time() + SEARCH_EXPIRE

        self.add_query_allias(checksum, allias)

        self.db_client.queries.update_one({'hash': checksum}, {'$set': {'expire': expire, 'products': product_hashes, 'popularity': 1.0, 'hash': checksum}}, upsert=True)