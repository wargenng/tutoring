let hasDataBeenRetrieved = false;
let showSearch = false;
let todos = null;
let users = null;
retrieveData();

async function retrieveData() {
    await getTodos();
    await getUsers();
    hasDataBeenRetrieved = true;
    addTodosToDOM(todos);
}

async function getTodos() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    todos = data;
}

async function getUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    users = data;
}

function toggleSearch() {
    const search = document.getElementById("search");
    if (showSearch) search.style.opacity = 0;
    else search.style.opacity = 1;

    showSearch = !showSearch;
}

function addTodosToDOM(data) {
    const todoContainer = document.getElementById("todo");
    todoContainer.innerHTML = "";

    data.forEach((todo) => {
        const card = document.createElement("div");
        const user = document.createElement("div");
        const title = document.createElement("div");
        const status = document.createElement("div");

        card.className = "card";
        todoContainer.appendChild(card);

        user.innerHTML =
            "user: " + users.filter((user) => user.id === todo.userId)[0].name;
        card.appendChild(user);

        title.innerHTML = "title: " + todo.title;
        card.appendChild(title);

        status.innerHTML = "status: " + todo.completed;
        card.appendChild(status);
    });
}

function allTodos() {
    toggleSearch();
    addTodosToDOM(todos);
}

function findUnfinishedTodos() {
    toggleSearch();
    const filteredData = todos.filter((todo) => !todo.completed);
    addTodosToDOM(filteredData);
}

function findFinishedTodos() {
    toggleSearch();
    const filteredData = todos.filter((todo) => todo.completed);
    addTodosToDOM(filteredData);
}

function searchByUser(userId) {
    toggleSearch();
    const filteredData = todos.filter((todo) => todo.userId === userId);
    addTodosToDOM(filteredData);
}
