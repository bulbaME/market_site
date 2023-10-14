from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
import asyncio
import time

import requests
from bs4 import Tag
from abc import ABC, abstractmethod

import yaml

LOAD_TIMEOUT = yaml.safe_load(open('credentials.yaml'))['website']['load_timeout']

def init_driver() -> webdriver.Firefox:
    driver_opt = Options()
    driver_service = Service()
    driver_opt.headless = True
    driver_opt.add_argument("--headless")
    driver_opt.add_argument("--window-size=800,800")
    driver_opt.page_load_strategy = 'eager'

    return webdriver.Firefox(options=driver_opt, service=driver_service)

DRIVER_COUNT = 0

def parse_price(price: str) -> float:
    price = price.replace(' ', '').replace('.', '').replace(',', '.')
    return float(price)

class _Drivers:
    drivers: list[webdriver.Firefox] = []
    drivers_busy: list[bool] = []

    def __init__(self):
        self.drivers = [init_driver() for _ in range(DRIVER_COUNT)]
        self.drivers_busy = [False for _ in range(DRIVER_COUNT)]

    def __del__(self):
        for d in self.drivers:
            d.quit()

    async def get_free_driver(self) -> (webdriver.Firefox, int):
        driver = None
        i_d = None

        while driver == None:
            for i in range(DRIVER_COUNT):
                if not self.drivers_busy[i]:
                    self.drivers_busy[i] = True
                    driver = self.drivers[i]
                    i_d = i
                    
        return (driver, i_d)

    def return_driver(self, i: int):
        self.drivers_busy[i] = False

DRIVERS = _Drivers()

class Product:
    name: str = ''
    link: str = ''
    specs: list[str] = []
    price: float = 0.0
    image_url: str = ''
    description: str = ''
    shop_id: int = -1

    def __init__(self, p_data: dict={}):
        for (k, v) in p_data.items():
            match k:
                case 'name':
                    self.name = v
                case 'link': 
                    self.link = v
                case 'specs':
                    self.specs = v
                case 'price':
                    self.price = v
                case 'image_url':
                    self.image_url = v
                case 'description':
                    self.description = v
                case 'shop_id':
                    self.shop_id = v

    def to_dict(self) -> dict:
        d = {}
        d['name'] = self.name
        d['link'] = self.link
        d['specs'] = self.specs
        d['price'] = self.price
        d['image_url'] = self.image_url
        d['description'] = self.description
        d['shop_id'] = self.shop_id

        return d


class Website(ABC):
    # if website needs js to show search results
    js_dependent: bool

    @abstractmethod
    def get_search_link(self, query) -> str: pass

    def _fetch_page_js(self, url, wait_for_selector='img') -> str: 
        global DRIVERS
        (driver, d_index) = asyncio.run(DRIVERS.get_free_driver())
        driver: webdriver.Firefox

        raw_html = None

        driver.get(url)
        try:
            WebDriverWait(driver, LOAD_TIMEOUT).until(
                expected_conditions.visibility_of_any_elements_located((By.CSS_SELECTOR, wait_for_selector))
            )

            raw_html = driver.find_element(by=By.TAG_NAME, value='body').get_attribute('innerHTML')
        except BaseException:
            pass

        DRIVERS.return_driver(d_index)

        return raw_html
    
    def _fetch_page_nojs(self, url) -> str:
        res = requests.get(url, timeout=LOAD_TIMEOUT)

        return res.text
    
    def _fetch_page(self, url):
        if self.js_dependent:
            return self._fetch_page_js(url)
        else:
            return self._fetch_page_nojs(url)
        
    def _return_table_raw(self):
        pass

    def get_products_pages(self, q: str, pages: int) -> list[Product]: 
        l = []
        for i in range(pages):
            try:
                l.extend(self.get_products(q, page=i+1))
            except BaseException:
                pass

        return l

    @abstractmethod
    def get_products(self, query: str, page=1) -> list[Product]: pass

    @abstractmethod
    def parse_item(self, raw_item: Tag) -> Product: pass