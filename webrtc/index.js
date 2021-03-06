const video = document.querySelector("#video");
const canvas = document.querySelector("#canvas");
const photo = document.querySelector("#photo");
const startButton = document.querySelector("#startButton");

let width = 500;
let height = 0;
let streaming = false;

const startVideo = async () => {
  const stream = await navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .catch((error) => {
      console.log("An error occurred: " + error);
    });
  video.srcObject = stream;
  video.play();
};

const clearPhoto = () => {
  const context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
};

const initPhoto = () => {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth / width);

    // Firefox currently has a bug where the height can't be read from
    // the video, so we will make assumptions if this happens.
    if (isNaN(height)) {
      height = width / (4 / 3);
    }

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    streaming = true;
  }

  clearPhoto();
};

const takePicture = () => {
  if (width && height) {
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }
};

const main = () => {
  startVideo();

  video.addEventListener("canplay", initPhoto);
  startButton.addEventListener("click", takePicture);
};

main();
