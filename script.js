let recordingState = false;
let videoEle = document.querySelector("video");
let chunks = [];
let recordBtn = document.querySelector("#record");
let mediaRecorder;
let appliedFilter;
const maxZoom = 3;
const minZoom = 1;
let currZoom = 1;
let img = document.querySelector("#capture");
let body = document.querySelector("body");
let filters = document.querySelectorAll(".filter");
let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");
let galleryBtn = document.querySelector("#gallery");

galleryBtn.addEventListener("click", function () {
    location.assign("gallery.html");
});

zoomIn.addEventListener("click", function (e) {
    if (currZoom < maxZoom) {
        currZoom = currZoom + 0.1;
        videoEle.style.transform = `scale(${currZoom})`;
    }
});

zoomOut.addEventListener("click", function (e) {
    if (currZoom > minZoom) {
        currZoom = currZoom - 0.1;
        videoEle.style.transform = `scale(${currZoom})`;
    }
});

for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function (e) {
        appliedFilter = e.currentTarget.style.backgroundColor;
        let div = document.createElement("div");
        removeFilter();
        div.style.backgroundColor = appliedFilter;
        div.classList.add("filter-div");
        body.append(div);
    });
}
function removeFilter() {
    let filterDiv = document.querySelector(".filter-div");
    if (filterDiv) filterDiv.remove();
}
//navigator is a object in browser with many functions.
//mediaDevices is one of them
//getUserMedia is defined in mediaDevces
//it takes arguements like below and you cannot change their names;
//mediaStream is a object that we get as data which is returned if the promise of getUserMedia is resolved
//vedio.scrObj takes that object to play back our video;
//browser js cannot communicate with OS features(mic ,camera etc)so browser is the medium of communication between them.
//search about cache.delete();
//if multiple cameras or mics then userMedia return a array;

img.addEventListener("click", function (e) {
    let innerDiv = img.querySelector("div");
    innerDiv.classList.add("imgCaptureAnimation");
    setTimeout(() => {
        innerDiv.classList.remove("imgCaptureAnimation");
    }, 1200);
    let canvas = document.createElement("canvas");
    canvas.width = videoEle.videoWidth;
    canvas.height = videoEle.videoHeight;
    let tool = canvas.getContext("2d");
    tool.translate(canvas.width / 2, canvas.height / 2);
    tool.scale(currZoom, currZoom);
    tool.translate(-canvas.width / 2, -canvas.height / 2);
    tool.drawImage(videoEle, 0, 0);
    if (appliedFilter) {
        tool.fillStyle = appliedFilter;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }
    let url = canvas.toDataURL();

    addMedia(url, "image");
    alert("saved in galary");

    
});

recordBtn.addEventListener("click", function (e) {
    let innerDiv = recordBtn.querySelector("div");
    currZoom = 1;
    videoEle.style.transform = `scale(${currZoom})`;
    removeFilter();
    appliedFilter = "";
    if (!recordingState) {
        innerDiv.classList.add("recordAnimation");
        recordingState = true;
        mediaRecorder.start();
    } else {
        innerDiv.classList.remove("recordAnimation");
        recordingState = false;
        mediaRecorder.stop();
    }
});

navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
        mediaRecorder = new MediaRecorder(mediaStream);
        videoEle.srcObject = mediaStream;

        mediaRecorder.addEventListener("dataavailable", function (e) {
            chunks.push(e.data);
        });

        mediaRecorder.addEventListener("stop", function (e) {
            let blob = new Blob(chunks, { type: "video/mp4" });
            chunks = [];

            addMedia(blob, "video");
            alert("saved in galary");
        });
    });
