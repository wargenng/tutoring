let darkMode = false;

function greet() {
    let body = document.body;
    let button = document.getElementById("button");
    if (!darkMode) {
        body.style.background = "black";
        body.style.color = "white";
        button.innerHTML = "turn light on!";
        darkMode = true;
    } else {
        body.style.background = "white";
        body.style.color = "black";
        button.innerHTML = "turn light off!";
        darkMode = false;
    }
}
