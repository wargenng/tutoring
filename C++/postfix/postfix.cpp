#include <iostream>
#include <string>

using namespace std;

// Function to return order of operation
int orderOfOperations(char op) {
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/')
        return 2;
    return 0;
}

// Function to convert infix expression to postfix
string infixToPostfix(string infix) {
    string postfix;
    char stack[100];
    int top = -1;

    for (int i = 0; i < infix.length(); i++) {
        char current = infix[i];
        if (isdigit(current)) {
            postfix += current;
        } else if (current == '(') {
            top++;
            stack[top] = current;
        } else if (current == ')') {
            while (stack[top] != '(') {
                postfix += stack[top];
                top--;
            }
            top--; // Discard the '('
        } else {
            // Operator encountered
            while (top >= 0 && orderOfOperations(current) <= orderOfOperations(stack[top])) {
                postfix += stack[top];
                top--;
            }
            top++;
            stack[top] = current;
        }
    }

    // Pop remaining operators from stack
    while (top >= 0) {
        postfix += stack[top];
        top--;
    }

    return postfix;
}

// Function to evaluate a postfix expression
int evaluatePostfix(string postfix) {
    int stack[100];
    int top = -1; // Index of the top element in the stack

    for (int i = 0; i < postfix.length(); i++) {
        char current = postfix[i];
        if (isdigit(current)) {
            top++;
            stack[top] = current - '0'; // Push operand onto the stack
        } else {
            int b = stack[top]; // Pop top operand
            top--;
            int a = stack[top]; // Pop next operand
            top--;

            if (current == '+') {
                top++;
                stack[top] = a + b;
            } else if (current == '-') {
                top++;
                stack[top] = a - b;
            }else if (current == '*') {
                top++;
                stack[top] = a * b;
            } else {
                top++;
                stack[top] = a / b;
            }
        }
    }

    int result = stack[top]; // Result is at the top of the stack
    return result;
}

int main() {
    string infix;
    cout << "Enter the infix expression: ";
    cin >> infix;

    string postfix = infixToPostfix(infix);
    cout << "Postfix expression: " << postfix << endl;

    int result = evaluatePostfix(postfix);
    cout << "Result: " << result << endl;

    return 0;
}