item1 = "banana"
item2 = "milk"
item3 = "bread"
item4 = "eggs"

#print(item1)

grocery_list = ["banana", "milk", "bread", "eggs", "cheese"]

print(grocery_list[4])

item = input("enter a new grocery item: ")

grocery_list.append(item)
print(grocery_list)

grocery_list.remove("banana")
print(grocery_list)
