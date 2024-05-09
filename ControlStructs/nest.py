import sys

age = 18
registered = "yes"

if age >= 18:
    if registered == "yes":
        print("you can vote!") 
    else: 
        print("please register to vote")
else: 
    print("you are not eligible to vote yet")

if age < 18:
    print("you are not eligible to vote yet")
    sys.exit()
if registered == "yes":
    print("you can vote!")
else: 
    print("please register to vote")

print("hello")
