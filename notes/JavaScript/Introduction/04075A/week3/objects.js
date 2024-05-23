let firstnames = ["John", "Sally"];
let lastnames = ["Doe", "Mae"];
let ages = [30, 20];

// for (let i = 0; i < 2; i++) {
//     console.log(firstnames[i] + " " + lastnames[i] + " " + ages[i]);
// }

let user = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
};

let users = [
    {
        firstName: "John",
        lastName: "Doe",
        age: 30,
    },
    {
        firstName: "Sally",
        lastName: "Mae",
        age: 20,
    },
];

for (let i = 0; i < users.length; i++) {
    console.log(
        users[i].firstName + " " + users[i].lastName + " " + users[i].age
    );
}
