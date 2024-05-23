let score = 0;
let state = "waiting";

function start() {
    if (state === "waiting") {
        setInterval(randomizePosition, 1000);
        state = "playing";
    } else {
        console.log("currently playing");
    }
}

function randomizePosition() {
    const X = Math.floor(Math.random() * 451);
    const Y = Math.floor(Math.random() * 451);

    document.getElementById("circle").style.transform =
        "translate(" + X + "px," + Y + "px)";
}

function clickedCircle() {
    score = score + 1;
    document.getElementById("score").innerHTML = "score: " + score;
}
