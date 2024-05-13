def funSal(num_of_employees):
  total_salary = 0
  for _ in range(num_of_employees):
    total_salary += int(input("please gib salary"))
  return total_salary / num_of_employees

print(funSal(3))