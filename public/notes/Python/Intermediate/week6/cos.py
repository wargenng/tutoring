import requests
from bs4 import BeautifulSoup

url = requests.get("https://www.cos.com/en_usd/men/view-all.html").text
soup = BeautifulSoup(url, 'html.parser')
mens = soup.find_all('div', class_='column')

#print(len(mens))

total_price = 0
for price in mens:
  produce_price = price.find('div', class_='m-product-price')
  current_price = int(produce_price.find('span').text.strip()[1:])
  total_price += current_price

print(total_price/len(mens), " is the average price at COS")
