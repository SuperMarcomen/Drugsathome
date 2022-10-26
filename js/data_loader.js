async function getDrugs() {
    return fetch('https://drugsathome.cf:3000/get_drugs')
    .then((response) => response.json())
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error(error);
    });
}

var ownedDrugs = [];

async function displayDrugs() {   
    console.log("Display"); 
    let drugs = await getDrugs();
    const json = JSON.parse(drugs);
    
    for (var i = 0; i < json.length; i++) { 
        const template = document.getElementById('pharma');
        var clone = template.content.cloneNode(true);
        let p = clone.querySelectorAll("p");
        p[0].innerText = json[i]['name'];
        const date = new Date(json[i]['max_use_date']);
        p[1].innerText = date.getMonth() + "/" + date.getFullYear();
        const pharma = clone.querySelectorAll("div")[0];
        pharma.style.backgroundImage = `url(${json[i]['img']})`;

        ownedDrugs.push({ name: json[i]['name'], pzn: json[i]['pzn'], element: pharma})
        document.body.appendChild(clone);
    }
    console.log(drugs);
}



displayDrugs();
