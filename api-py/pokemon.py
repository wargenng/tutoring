import requests

url = "https://pokeapi.co/api/v2/pokemon/"

# first loop will get average weight
total_weight = 0
for i in range(151):
  response = requests.get(url + str(i+1))
  data = response.json()
  total_weight += data["weight"]
  print("getting weight for: " + data["name"])

average_weight = total_weight / 151
print(average_weight)

above_average_weight = 0
for i in range(151):
  response = requests.get(url + str(i+1))
  data = response.json()
  if (data["weight"] > average_weight):
    print(data["name"] + " is over the average weight!")
    above_average_weight += 1

print(above_average_weight)