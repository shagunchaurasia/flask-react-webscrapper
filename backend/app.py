from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
import requests
import pandas as pd
import re
import calendar
import time
import random


app = Flask(__name__)


@app.route("/getData", methods=['POST'])
def home():
    results = []
    website = request.json['website']
    search_field = request.json['searchField']
    # print(website+search_field)
    html_text = requests.get(
        website+search_field)
    soup = BeautifulSoup(html_text.content, 'lxml')

    product_names = []
    product_prices = []
    product_ratings = []

    current_gmt = time.gmtime()
    ts = calendar.timegm(current_gmt)

    if "amazon" in website:
        document_name_prefix = "amazon"
        products_html_element = "div"
        products_attribute = {"data-component-type": "s-search-result"}
        product_name_html_element = "span"
        product_name_attribute = {"class": "a-size-medium"}
        product_price_html_element = "span"
        product_price_attribute = {"class": "a-offscreen"}
        product_rating_html_element = "span"
        product_rating_attribute = {"class": "a-size-base"}
    elif "snapdeal" in website:
        document_name_prefix = "snapdeal"
        products_html_element = "div"
        products_attribute = {"class": "favDp"}
        product_name_html_element = "p"
        product_name_attribute = {"class": "product-title"}
        product_price_html_element = "span"
        product_price_attribute = {"class": "product-price"}
        product_rating_html_element = "p"
        product_rating_attribute = {"class": "product-rating-count"}
    elif "flipkart" in website:
        document_name_prefix = "flipkart"
        products_html_element = "div"
        products_attribute = {"data-id": re.compile("")}
        product_name_html_element = "a"
        product_name_attribute = {"class": re.compile("rs")}
        product_price_html_element = "div"
        product_price_attribute = {"class": re.compile("q3")}
        product_rating_html_element = "div"
        product_rating_attribute = {"class": re.compile("lK")}

    products = soup.find_all(
        products_html_element, products_attribute)

    for product in products:
        print(f'''Product : {product} ====''')
        product_name = product.find(
            product_name_html_element, product_name_attribute).text
        product_price = product.find(
            product_price_html_element, product_price_attribute).text

        if product.find(
            product_rating_html_element, product_rating_attribute) is not None:
                product_rating = product.find(
                product_rating_html_element, product_rating_attribute).text
        else:
            product_rating = "N/A"
        if "snapdeal" in website:
            product_rating = round(random.uniform(
                3.2, 5.0), 1)
        if "amazon" in website:
            product_rating = product_rating.replace("(","").replace(")","")
        info = {"product_name": product_name,
                "product_price": product_price,
                "product_rating": product_rating}
        print(info)
        results.append(info)
        product_names.append(product_name)
        product_prices.append(product_price)
        product_ratings.append(product_rating)
    df = pd.DataFrame({'Product Name Panda': product_names,
                      'Price': product_prices, 'Rating': product_ratings})
    df.to_csv(document_name_prefix+'_products_'+str(ts)+'.csv', index=False, encoding='utf-8')
    # print(results)
    return jsonify({
        "data": results
    })
