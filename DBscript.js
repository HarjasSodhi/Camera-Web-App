let gallery = indexedDB.open("Camera", 1);
let db;
gallery.addEventListener("success", function (e) {
    db = gallery.result;
});
gallery.addEventListener("upgradeneeded", function (e) {
    let accessToDB = gallery.result;
    accessToDB.createObjectStore("gallery", { keyPath: "mId" });
});
gallery.addEventListener("error", function (e) {
    console.log("error");
});

function addMedia(media, type) {
    if (!db) return;
    let obj = {
        mId: Date.now(),
        media,
        type
    }
    let tx = db.transaction("gallery", "readwrite");
    let accessToGallery = tx.objectStore("gallery");
    accessToGallery.add(obj);
}

let bodyele = document.querySelector("body");

function viewMedia() {
    if (!db) return;
    let tx = db.transaction("gallery", "readonly");
    let accessToGallery = tx.objectStore("gallery");
    let AccessToCursor = accessToGallery.openCursor();
    AccessToCursor.addEventListener("success", function () {
        let mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");
        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete"
        deleteBtn.addEventListener("click", function (e) {
            e.currentTarget.parentElement.remove();
            //we get a string from the getAttribute function and therefore typecasting is required.
            removeMedia(Number(e.currentTarget.getAttribute("data-id")));
        })
        let downloadBtn = document.createElement("button");
        downloadBtn.innerHTML = "Download"
        let mo = document.createElement("div");
        mo.classList.add("media");
        let cursor = AccessToCursor.result;
        if (cursor) {
            if (cursor.value.type == "video") {
                let ve = document.createElement("video");
                ve.controls = "true";
                let url = window.URL.createObjectURL(cursor.value.media);
                ve.src = url;
                ve.autoplay = "true";
                ve.muted = "true";
                ve.loop = 'true';
                mo.append(ve)
                downloadBtn.addEventListener("click", function (e) {
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = "video.mp4";
                    a.click();
                    a.remove();
                })
                mediaContainer.append()
            }
            else {
                let img = document.createElement("img");
                img.src = cursor.value.media;
                mo.append(img);
                downloadBtn.addEventListener("click", function (e) {
                    let url = cursor.value.media;
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = "img.jpg";
                    a.click();
                    a.remove();
                })
                mediaContainer.append()
            }
            mediaContainer.append(mo);
            mediaContainer.append(deleteBtn)
            mediaContainer.append(downloadBtn)
            bodyele.append(mediaContainer);
            deleteBtn.setAttribute("data-id",cursor.value.mId);
            cursor.continue();
        }
    })
}

function removeMedia(id) {
    if (!db) return;
    let tx = db.transaction("gallery", "readwrite");
    let accessToGallery = tx.objectStore("gallery");

    accessToGallery.delete(id);
}