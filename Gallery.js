setTimeout(() => {
    viewMedia();
}, 100);

let cameraBtn = document.getElementById("camera");
cameraBtn.addEventListener("click", function () {
    location.assign("index.html");
})