"""
Understanding Functions in Python

A function is like a recipe - it's a set of instructions that we can reuse whenever we need them.
Functions help us organize our code and avoid repeating the same code over and over.
"""

# Example 1: A simple function that says hello
def say_hello():
    """
    This is a function that prints a greeting.
    Notice how we define a function using 'def' followed by the function name and parentheses.
    """
    print("Hello! Welcome to learning about functions!")

# Example 2: A function that takes input (parameters)
def greet_person(name):
    """
    This function takes one parameter called 'name'
    Parameters are like ingredients in a recipe - they're the information we give to our function
    """
    print(f"Hello, {name}! Nice to meet you!")

# Example 3: A function that returns a value
def add_numbers(a, b):
    """
    This function takes two parameters and returns their sum
    The 'return' statement sends back a value that we can use later
    """
    return a + b

# Example 4: A function with multiple parameters and a default value
def create_sentence(subject, verb, object="Python"):
    """
    This function shows how we can have multiple parameters
    The last parameter has a default value of "Python"
    """
    return f"{subject} {verb} {object}"

# Let's try out our functions!
print("Example 1: Simple function")
say_hello()
print("\nExample 2: Function with parameters")
greet_person("Student")
print("\nExample 3: Function that returns a value")
result = add_numbers(5, 3)
print(f"5 + 3 = {result}")
print("\nExample 4: Function with multiple parameters")
sentence1 = create_sentence("I", "love")
print(sentence1)  # Uses default value for object
sentence2 = create_sentence("We", "are learning", "functions")
print(sentence2)  # Uses provided value for object

"""
Key Points to Remember:
1. Functions are defined using the 'def' keyword
2. Functions can take parameters (inputs)
3. Functions can return values
4. Functions help us organize and reuse code
5. Functions can have default values for parameters
"""
