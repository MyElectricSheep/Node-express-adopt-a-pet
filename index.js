const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

const pets = require("./data.js");

app.get("/", (req, res) => {
  let listOfPets = "";
  let petTypes = Object.keys(pets);

  petTypes.forEach((type) => {
    listOfPets += `<li><a href="/animals/${type}"> ${type}</a></li>`;
  });

  res.send(`
  <h1>Adopt a Pet 🐕 🐈 🐇 🦄!</h1>
  <p>Browse through the links below to find your new furry friend:</p>
  <ul>
   ${listOfPets}
  </ul>
  `);
});

app.get("/animals/:pet_type/:pet_id", (req, res) => {
  const { pet_type, pet_id } = req.params;
  const pet = pets[pet_type][pet_id];
  if (!pet) {
    res.status(404).send(`No such pet here!`);
  } else {
    res.send(`
     <h1>The chosen ${pet_type} responds to ${pet.name}</h1>
     <ul>
        <li>age: ${pet.age}</li>
        <li>breed: ${pet.breed}</li>
        <li>description: ${pet.description}</li>
     </ul>
     <img src=${pet.url} alt=${pet.breed} />
     `);
  }
});

app.get("/animals/:pet_type", (req, res) => {
  const { pet_type } = req.params;
  const targetPets = pets[pet_type];
  if (!targetPets) {
    return res
      .status(404)
      .send("<h1>Sorry no animal matching your request</h1>");
  } else {
    let html = "";
    targetPets.forEach((pet, index) => {
      html += `<li><a href="/animals/${pet_type}/${index}">${pet.name}</a></li>`;
    });
    res.send(`
    <h1>List of ${pet_type}</h1>
    <ul>
    ${html}
    </ul>
    `);
  }
});

app.listen(port, () => {
  console.log(`App is listening to Port: ${port}`);
});
