import requests
from bs4 import BeautifulSoup

url = "http://books.toscrape.com/"
response = requests.get(url)
content = response.text
# print(response.text)

soup = BeautifulSoup(content, 'html.parser')

books = soup.find_all('article', class_='product_pod')

total_cost = 0
for book in books:
  price = float(book.find('p', class_='price_color').text[2:])
  total_cost += price
  print(price)

print(total_cost)
print("Average Book Price = ", total_cost/len(books))