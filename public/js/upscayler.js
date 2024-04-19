const input = document.querySelector("input[type='file']");
const loader = document.querySelector("#loader");

function readFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result);
    };
  });
}

const upscaler = new Upscaler({
  model: DefaultUpscalerJSModel,
});

function createImage(image, visibility = true, container = document.body) {
  const img = document.createElement("img");
  img.src = image;
  container.appendChild(img);
  if (!visibility) {
    img.style.display = "none";
  }
  return img;
}

function saveImage(img) {
  var immagine = img;

  // Crea un canvas temporaneo
  var canvas = document.createElement("canvas");
  canvas.width = immagine.width;
  canvas.height = immagine.height;

  var context = canvas.getContext("2d");

  // Disegna l'immagine sul canvas
  context.drawImage(immagine, 0, 0);

  // Ottieni l'URL dell'immagine dal canvas
  var dataURL = canvas.toDataURL("image/png");

  // Crea un link temporaneo
  var link = document.createElement("a");
  link.download = "image_x2.png";
  link.href = dataURL;
  link.click();
}

input.addEventListener("change", () => {
  loader.classList.toggle("d-none");
  document.body.classList.toggle("position-fixed");

  const file = input.files[0];

  readFile(file).then(async (img) => {
    const upscaler = new Upscaler({
      model: DefaultUpscalerJSModel,
    });

    try {
      await upscaler.upscale(img).then(async (result) => {
        const newImg = await createImage(result, false);
        await saveImage(newImg);
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
    } catch (err) {
      if (
        err.message ===
        "Requested texture size [17590x17590] greater than WebGL maximum on this browser / GPU [16384x16384]."
      ) {
        alert("The image is too big to be upscaled.");
      }
    }
    loader.classList.toggle("d-none");
    document.body.classList.toggle("position-fixed");

    // sleep 4s
  });
});

// const input = document.querySelector("input[type='file']");

// function handleFD(inputFile, callback) {
//   const file = inputFile.files[0];
//   const reader = new FileReader();

//   reader.onload = function (event) {
//     callback(event.target.result);
//   };

//   reader.readAsDataURL(file);
// }

// input.addEventListener("change", () => {
//   handleFiles(input, function (base64) {
//     console.log(base64); // Fai qualcosa con il base64, ad esempio lo invii al server

//     const upscaler = new Upscaler({
//       model: DefaultUpscalerJSModel,
//       content: base64,
//     });

//     upscaler.upscale().then((result) => {
//       console.log(result);
//     });
//   });

//   //   upscaler.upscale().then((result) => {
//   //     console.log(result);
//   //   });

//   //
// });
