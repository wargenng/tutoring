# i = 0
# while i < 4:
#   print(i)
#   i += 1

grocery_list = []

item = input("enter grocery list item: ")
grocery_list.append(item)
while not item == "end":
  item = input("enter grocery list item: ")
  grocery_list.append(item)

grocery_list.remove("end")
grocery_list.sort()
print(grocery_list)