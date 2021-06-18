const express = require("express");
const data = require("./data");

const app = express();

const capitalizeFirstLetter = (string) => {
  try {
    const capitalizedFirstLetter = string[0].toUpperCase();
    const slicedWord = string.slice(1, -1);
    return `${capitalizedFirstLetter}${slicedWord}`;
  } catch (e) {
    return string;
  }
};

app.get("/", (req, res) => {
  let animalTypes = "";

  // With for Each
  Object.keys(data).forEach((type) => {
    animalTypes += `<li><a href="/animals/${type}">${capitalizeFirstLetter(
      type
    )}</a></li>`;
  });

  // With Reduce (put directly in the res.send)
  // ${Object.keys(data).reduce((a, c) => {
  //   return `${a}<li><a href="/animals/${c}">${capitalizeFirstLetter(
  //     c
  //   )}</a></li>`;
  // }, "")}

  res.send(`
  <h1>Adopt a Pet!</h1>
  <p>Browse through the links below to find your new furry friend:</p>
  <ul>
  ${animalTypes}
  </ul>
  `);
});

app.get("/animals/:pet_type/:pet_id", (req, res) => {
  let { pet_type, pet_id } = req.params;
  const animals = data[pet_type];
  let animal;
  if (animals) {
    // Hint: Preprending the -- operator converts a string into a number
    // along with decreasing the value by 1
    animal = animals[--pet_id];
  }
  if (!animal) {
    res.send(`
        <h1>Pet Description</h1>
        <p>Oh noes! We don't seem to find that animal! Maybe it ran away?</p>
        `);
  } else {
    res.send(`
    <h1>Pet Description</h1>
    <h2>Name: <strong>${animal.name}</strong></h2>
    <ul>
        <li>Age: ${animal.age}</li>
        <li>Breed: ${animal.breed}</li>
        <li>Description: ${animal.description}</li>
    </ul>
    <img src=${animal.url} alt=${animal.breed} />
    `);
  }
});

app.get("/animals/:pet_type", (req, res) => {
  const { pet_type } = req.params;
  const animals = data[pet_type];
  // console.log(animals);
  if (!animals) {
    res.send(`
    <h1>List of ${capitalizeFirstLetter(pet_type)}s</h1>
    <p>Oh noes! There are no animals of that type available</p>
    `);
  } else {
    // Option 1: using reduce
    // res.send(`
    // <h1>List of ${capitalizeFirstLetter(pet_type)}s</h1>
    // <ul>
    // ${animals.reduce((a, c, i) => {
    //   return `
    //   ${a}
    //   <li>Name:
    //     <a href="/animals/${pet_type}/${i + 1}">
    //         <strong>${c.name}</strong>
    //     </a>. Breed: ${c.breed}
    //   </li>
    //   <br />
    //         `;
    // }, "")}
    // </ul>
    // `);

    // Option 2: using a forEach loop
    let listElements = "";
    animals.forEach((animal, index) => {
      listElements += `
             <li>Name: <a href="/animals/${pet_type}/${index + 1}"><strong>${
        animal.name
      }</strong></a>. Breed: ${animal.breed}</li>
             <br />
        `;
    });
    res.send(`
    <h1>List of ${capitalizeFirstLetter(pet_type)}s</h1>
    <ul>
        ${listElements}
    </ul>
    `);
  }
});

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
