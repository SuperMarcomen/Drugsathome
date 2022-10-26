const searchButton = document.getElementById("search-button");
const searchBar = document.getElementsByClassName("title-bar")[0];
const searchInput = document.getElementById("search-input");
const title = document.getElementById("title");


function print() {
    const value = searchInput.value.toLowerCase();
    ownedDrugs.forEach(drug => {
        drug['element'].style.display = '';
        if (drug['name'].toLowerCase().includes(value) || String(drug['pzn']).includes(value)) return;
        console.log(drug['pzn'] + ": " + value + " = " + String(drug['pzn']).includes(value));
        console.log(drug['element']);
        drug['element'].style.display = 'none';
    })
    console.log(" ");
}

searchButton.addEventListener("click", () => {
    title.style.opacity = '0';
    searchInput.style.display = 'block';
    searchInput.focus();
    searchInput.select();
    window.setTimeout(() => {
        title.style.display = 'none';
        searchBar.style.backgroundColor = '#0074B7';
        searchBar.style.padding = '.5rem';
        console.log("Called")
    }, 150)
})
