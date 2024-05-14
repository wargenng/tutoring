import pandas 

data = {
  'Name': ['Alice', 'Bob', 'Charlie'],
  'Age': [21, 32, 43],
  'City': ["Las Vegas",'New York', "Chicago"]
}

df = pandas.DataFrame(data)
print (df)