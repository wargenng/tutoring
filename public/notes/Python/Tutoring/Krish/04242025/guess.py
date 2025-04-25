import turtle
import random

# Set up the screen
screen = turtle.Screen()
screen.title("Number Guessing Game")
screen.bgcolor("lightblue")

# Create a turtle for displaying messages
pen = turtle.Turtle()
pen.shape("circle")
# pen.hideturtle()
# pen.penup()
# pen.goto(0, 0)

# # Generate a random number between 1 and 10
# number_to_guess = random.randint(1, 10)

# # Prompt the user to guess the number
# guess = screen.numinput("Guess the Number", "Enter a number between 1 and 10:", minval=1, maxval=10)

# # Check the guess and display the result
# pen.clear()
# if guess == number_to_guess:
#     pen.write("Correct! You guessed the number!", align="center", font=("Arial", 16, "normal"))
# else:
#     pen.write(f"Sorry, the correct number was {number_to_guess}.", align="center", font=("Arial", 16, "normal"))

# Keep the window open until clicked
turtle.done()
