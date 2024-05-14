number_of_products = int(input("please gib number of products: "))
while number_of_products < 1 and number_of_products > 100:
  number_of_products = input("please gib number of products: ")

total_cost = 0
for i in range(number_of_products):
  cost = float(input("enter cost of item: "))
  if (cost < 15):
    total_cost += cost

print(total_cost)