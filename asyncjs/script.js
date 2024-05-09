// function hello() {
//     console.log("hello world!");
// }

// console.log("before timeout");
// setTimeout(hello, 1000);

// console.log(1);
// setTimeout(function count() {
//     console.log(2);
//     setTimeout(function count() {
//         console.log(3);
//         setTimeout(function count() {
//             console.log(4);
//             setTimeout(function count() {
//                 console.log(5);
//             }, 1000);
//         }, 1000);
//     }, 1000);
// }, 1000);

function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function countUp() {
    for (let i = 0; i < 5; i++) {
        console.log(i + 1);
        await delay(1000);
    }
}

countUp();
