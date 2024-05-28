let isLightMode = false;

function toggleTheme() {
    if (!isLightMode) {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "rgba(18, 18, 19)";
        document.getElementById("nightmode").innerHTML = "toggle night!";

        isLightMode = true;
    } else {
        document.body.style.backgroundColor = "rgba(18, 18, 19)";
        document.body.style.color = "white";
        document.getElementById("nightmode").innerHTML = "toggle day!";

        isLightMode = false;
    }
}
