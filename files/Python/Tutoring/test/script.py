# for i in range(100,1000,5):
#   print(i)
#   if i%40 == 0:
#     print("hello")

# file_name = input("please gib name")


def testing(x,y,z):
  return x * y * z

w = testing(1,2,3)
print(w)

def area_of_trapezoid(height, side1, side2):
  return height / 2 * (side1 + side2)

print(area_of_trapezoid(20, 10, 30))

import random
number = random.randint(1,50)
print(number)