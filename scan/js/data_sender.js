async function addNewDrug(pzn) {
    console.log(typeof pzn);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"pzn": "${pzn}"}`
    };
    await fetch('https://drugsathome.cf:3000/add_drugs', requestOptions);
}

