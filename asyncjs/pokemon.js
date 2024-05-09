// introduced in 2015 with ES6

// fetch("https://pokeapi.co/api/v2/pokemon/ditto")
//     .then((res) => res.json())
//     .then((json) => {
//         console.log(json);
//     });

// introduced in 2017 with ES2017

async function getPokemon() {
    let sumOfWeights = 0;
    const numberOfPokemonGen1 = 151;

    for (let i = 0; i < numberOfPokemonGen1; i++) {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${i + 1}`
        );
        const data = await response.json();
        sumOfWeights += data.weight;
        console.log(`currently processing ${data.name}...`);
    }

    console.log(sumOfWeights / numberOfPokemonGen1);
}

getPokemon();
