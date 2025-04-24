async function init(release) {
    const data = await fetch(`https://api.discogs.com/releases/${release}`);
    const response = await data.json();
    console.log(response.title);
    console.log(response.artists[0].name);
}

const releases = [15488630, 28580086];

releases.forEach((release) => {
    init(release);
});
