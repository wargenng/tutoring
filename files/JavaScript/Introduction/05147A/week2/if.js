let age = 16;
let isRegistered = true;

if (age >= 35) {
    console.log("YOU ARE ABLE TO BE PRESIDENT");
} else if (age >= 18) {
    console.log("YOU ARE AT THE AGE OF VOTING");
    if (isRegistered) {
        console.log("YOU ARE ABLE TO VOTE");
    }
} else {
    console.log("YOU ARE NOT AT THE AGE OF VOTING");
}

console.log("hello");
