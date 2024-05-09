import requests

url = 'https://jsonplaceholder.typicode.com/todos'

response = requests.get(url)

if response.status_code == 200:
  todos = response.json()
  total_todos_completed = 0
  for todo in todos: 
    if todo["userId"] == 1 and todo["completed"]:
      print(todo)
      total_todos_completed += 1

  print(total_todos_completed)
      