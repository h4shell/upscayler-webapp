const input = document.querySelector("input[type='file']");
const loader = document.querySelector("#loader");

const upscaler = new Upscaler({
  model: DefaultUpscalerJSModel,
});

function readFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result);
    };
  });
}

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
    } catch (err) {
      alert("The image is too big to be upscaled.");
    }
    input.value = "";
    loader.classList.toggle("d-none");
    document.body.classList.toggle("position-fixed");
  });
});
