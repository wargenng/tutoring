import turtle
import random
 
screen = turtle.Screen()
screen.title("Number Guessing Game")
screen.bgcolor("lightblue")

# Create and setup the pen
pen = turtle.Turtle()
pen.shape("circle")
pen.speed(0)  # Set speed to fastest
pen.penup()  # Lift the pen so it doesn't draw while moving

# Movement functions
def move_up():
    pen.setheading(90)
    pen.forward(10)

def move_down():
    pen.setheading(270)
    pen.forward(10)

def move_left():
    pen.setheading(180)
    pen.forward(10)

def move_right():
    pen.setheading(0)
    pen.forward(10)

# Bind keyboard keys to movement functions
screen.onkey(move_up, "Up")
screen.onkey(move_down, "Down")
screen.onkey(move_left, "Left")
screen.onkey(move_right, "Right")

# Enable keyboard listening
screen.listen()

turtle.done()
