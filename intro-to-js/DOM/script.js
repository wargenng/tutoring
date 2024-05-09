let isDarkMode = false;

function changeHeaderColor() {
    // const header = document.getElementById("header");
    // console.log(header);
    // header.innerHTML = "HELLO CLASS!";
    // header.style.color = "red";

    const body = document.body;

    if (!isDarkMode) {
        body.style.backgroundColor = "black";
        body.style.color = "white";
    } else {
        body.style.backgroundColor = "white";
        body.style.color = "black";
    }

    const courses = document.getElementById("course");
    if (!isDarkMode) {
        courses.style.top = "-10px";
    } else {
        courses.style.top = "20px";
    }

    isDarkMode = !isDarkMode;
}
