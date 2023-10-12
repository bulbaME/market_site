from api.websites.website import Product
from api.websites import MaximumMD

s = MaximumMD()
l = s.get_products('laptop', 1)

for x in l:
    print(x.to_dict())