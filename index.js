const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

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
  <br/>
  <a href="/animals/new">I want to donate a pet!</a>
  `);
});

app.get("/animals/new", (req, res) => {
  const newPetProperties = [
    { name: "Name", placeholder: "What's the name?" },
    { name: "Age", placeholder: "How old is it?" },
    { name: "Breed", placeholder: "What's its type?" },
    { name: "Description", placeholder: "Give us some more information!" },
  ];

  const petTypes = Object.keys(pets);
  let petPropertiesInputs = "";
  let petTypeOptions = "";

  newPetProperties.forEach((prop) => {
    petPropertiesInputs += `
    <label for="${prop.name}">${prop.name}:</label>
    <input id="${prop.name}" type="text" placeholder="${prop.placeholder}" name="${prop.name}" />
    `;
  });

  petTypes.forEach((petType) => {
    petTypeOptions += `<option value="${petType}">${petType.slice(
      0,
      petType.length - 1
    )}</option>`;
  });

  res.send(`
  <div>
  <h2>Propose a pet for adoption</h2>
  <form  method="POST" action="/animals/new">
  <label for="petType">Choose a pet type:</label>
    <select name="petType" id="petType">
    ${petTypeOptions}
    </select>
    ${petPropertiesInputs}
    <input type="submit" />
  </form>
  </div>
  `);
});

app.post("/animals/new", (req, res) => {
  const { petType, ...animalProps } = req.body;

  const newPet = {
    url: `https://robohash.org/${animalProps.Name}.png?size=100x100&set=set1`,
  };

  Object.entries(animalProps).forEach(([key, value]) => {
    newPet[key.toLowerCase()] = value;
  });

  pets[petType].push(newPet);

  res.redirect(`/animals/${petType}`);
});

app.get("/animals/:pet_type/:pet_id", (req, res) => {
  const { pet_type, pet_id } = req.params;
  const pet = pets[pet_type][pet_id];
  const singularPetType = pet_type.slice(0, pet_type.length - 1);
  if (!pet) {
    res.status(404).send(`No such pet here!`);
  } else {
    res.send(`
     <h1>The ${singularPetType} you selected responds to: ${pet.name}</h1>
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
