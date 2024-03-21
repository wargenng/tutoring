#include <iostream>
#include <string>

using namespace std;


//check if a character is an operator
bool isOperator(char current) {
    return current == '+' || current == '-' || current == '*' || current == '/';
}

//check order of operation
int orderOfOperations(char op) {
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/')
        return 2;
    return 0;
}

//convert infix expression to postfix
string infixToPostfix(string infix) {
    string postfix;
    char stack[100];
    int top = -1;
    bool previousDigit = false;
    bool previousOperator = false;

    for (int i = 0; i < infix.length(); i++) {
        char current = infix[i];
        if (isdigit(current)) {
            if(previousDigit) {
                cout << "MULTIPLE DIGITS IN A ROW" << endl;
                return "ERROR";
            }
            postfix += current;
            previousOperator = false;
            previousDigit = true;
        } else if (current == '(') {
            top++;
            stack[top] = current;
            previousOperator = false;
            previousDigit = false;
        } else if (current == ')') {
            while (top >= 0 && stack[top] != '(') {
                postfix += stack[top];
                top--;
            }
             if (top < 0) {
                cout << "INVALID PARENTHESIS" << endl;
                return "ERROR";
            }
            top--; 
            previousOperator = false;
            previousDigit = false;
        } else if (isOperator(current)) {
            if(previousOperator) {
                cout << "MULTIPLE OPERATORS IN A ROW" << endl;
                return "ERROR";
            }
            while (top >= 0 && orderOfOperations(current) <= orderOfOperations(stack[top])) {
                postfix += stack[top];
                top--;
            }
            top++;
            stack[top] = current;
            previousOperator = true;
            previousDigit = false;
        } else {
            cout << "BAD INPUT" << endl;
            return "ERROR";
        }
    }
    
     if (top >= 0 && stack[top] == '(') {
        cout << "INVALID PARENTHESIS" << endl;
                return "ERROR";
        }

    //pop remaining operators from stack
    while (top >= 0) {
        postfix += stack[top];
        top--;
    }

    return postfix;
}

//evaluate a postfix expression
int calculatePostfix(string postfix) {
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

    if (postfix == "ERROR") return 0;

    cout << "Postfix expression: " << postfix << endl;

    int result = calculatePostfix(postfix);
    cout << "Result: " << result << endl;

    return 0;
}