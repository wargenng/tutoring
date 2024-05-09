def fahrenheit_to_celsius(f_temp):
  return (f_temp - 32) * 5/9

def check_input_is_int(user_input):
  try:
    int(user_input)
    return True
  except ValueError:
    return False

user_input = input("please enter fahrenheit: ")
temp = check_input_is_int(user_input)

while not temp:
  user_input = input("not valid fahrenheit, please enter again: ")
  temp = check_input_is_int(user_input)

f_temp = int(user_input)
print(fahrenheit_to_celsius(f_temp))