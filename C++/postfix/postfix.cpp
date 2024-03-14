#include <iostream>
#include <string>
#include <stack>

using namespace std;

// Function to return precedence of operators
int precedence(char op) {
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/')
        return 2;
    return 0;
}

// Function to convert infix expression to postfix
string infixToPostfix(const string& infix) {
    string postfix;
    char* stack = new char[infix.length()];
    int top = -1;

    for (int i = 0; i < infix.length(); i++) {
        char c = infix[i];
        if (isdigit(c)) {
            postfix += c;
        } else if (c == '(') {
            top++;
            stack[top] = c;
        } else if (c == ')') {
            while (top >= 0 && stack[top] != '(') {
                postfix += stack[top];
                top--;
            }
            top--; // Discard the '('
        } else {
            // Operator encountered
            while (top >= 0 && precedence(c) <= precedence(stack[top])) {
                postfix += stack[top];
                top--;
            }
            top++;
            stack[top] = c;
        }
    }

    // Pop remaining operators from stack
    while (top >= 0) {
        postfix += stack[top];
        top--;
    }

    delete[] stack;
    return postfix;
}

// Function to evaluate a postfix expression
int evaluatePostfix(string postfix) {
    int* stack = new int[postfix.length()]; // Dynamic array to act as a stack
    int top = -1; // Index of the top element in the stack

    for (size_t i = 0; i < postfix.length(); i++) {
        char c = postfix[i];
        if (isdigit(c)) {
            top++;
            stack[top] = c - '0'; // Push operand onto the stack
        } else {
            int operand2 = stack[top]; // Pop top operand
            top--;
            int operand1 = stack[top]; // Pop next operand
            top--;

            switch (c) {
                case '+':
                    top++;
                    stack[top] = operand1 + operand2; // Push result onto stack
                    break;
                case '-':
                    top++;
                    stack[top] = operand1 - operand2;
                    break;
                case '*':
                    top++;
                    stack[top] = operand1 * operand2;
                    break;
                case '/':
                    top++;
                    stack[top] = operand1 / operand2;
                    break;
            }
        }
    }

    int result = stack[top]; // Result is at the top of the stack
    delete[] stack; // Free the dynamic array
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