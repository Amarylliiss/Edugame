const emotions = ["Radosc", "Zlosc", "Zaskoczenie", "Smutek", "Obrzydzenie", "Strach"];

const imageCategories = {
    "Radosc": ["glowa_radosc.jpg", "cialo_radosc.jpg", "nogi_radosc.jpg"],
    "Zlosc": ["glowa_zlosc.jpg", "cialo_zlosc.jpg", "nogi_zlosc.jpg"],
    "Zaskoczenie": ["glowa_zaskoczenie.jpg", "cialo_zaskoczenie.jpg", "nogi_zaskoczenie.jpg"],
    "Smutek": ["glowa_smutek.jpg", "cialo_smutek.jpg", "nogi_smutek.jpg"],
    "Obrzydzenie": ["glowa_obrzydzenie.jpg", "cialo_obrzydzenie.jpg", "nogi_obrzydzenie.jpg"],
    "Strach": ["glowa_strach.jpg", "cialo_strach.jpg", "nogi_strach.jpg"]
};

function getRandomEmotion() {
    return emotions[Math.floor(Math.random() * emotions.length)];
}

function getAllImages() {
    const allImages = [];

    emotions.forEach(emotion => {
        const categoryImages = imageCategories[emotion];
        allImages.push(...categoryImages);
    });

    return shuffle(allImages);
}
function setupPuzzle() {
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = "";

    const dropContainer = document.getElementById("drop-container");
    dropContainer.innerHTML = "";

    removeDropAreas();

    const allImages = getAllImages();

    allImages.forEach(image => {
        const imgElement = document.createElement("img");
        imgElement.src = "/images/" + image;
        imgElement.alt = image.replace(/_/g, ' ').replace(/\..*/, '');
        imgElement.draggable = true;
        imgElement.ondragstart = drag;
        imageContainer.appendChild(imgElement);
    });

    const randomEmotion = getRandomEmotion();
    document.getElementById("emotion-title").textContent = `Ułóż postać: ${randomEmotion}`;

    const currentPuzzle = {
        randomEmotion: randomEmotion,
        isCorrect: Math.random() < 0.33,
    };

    // Przypisz wynik funkcji do globalnej zmiennej currentPuzzle
    window.currentPuzzle = currentPuzzle;

    return currentPuzzle;
}

let currentPuzzle = setupPuzzle();

function checkPuzzle() {
    const dropContainer = document.getElementById("drop-container");
    const draggedElements = dropContainer.children;
    let isCorrect = true;

    const emotionName = currentPuzzle.randomEmotion.toLowerCase();

    for (let i = 0; i < draggedElements.length; i++) {
        const imageName = draggedElements[i].alt.toLowerCase();

        if (!imageName.includes(emotionName)) {
            isCorrect = false;
            break;
        }
    }

    const messageElement = document.getElementById("message");

    if (isCorrect) {
        Swal.fire({
            icon: 'success',
            title: 'Gratulacje!',
            text: 'Puzzle ułożone poprawnie!'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Błąd!',
            text: 'Niepoprawna układanka. Spróbuj ponownie.'
        });
    }

    // Przygotuj nowy zestaw po sprawdzeniu
    setTimeout(() => {
        messageElement.style.display = "none";
        currentPuzzle = setupPuzzle(); // Aktualizacja zmiennej currentPuzzle
    }, 2000);
}

// Wywołanie funkcji setupPuzzle() przy starcie aplikacji
setupPuzzle();

function removeDropAreas() {
    const dropAreas = document.querySelectorAll(".drop-area");
    dropAreas.forEach(area => area.remove());
}




function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    const data = event.target.src;
    const imgElement = document.createElement("img");
    imgElement.src = data;
    imgElement.alt = data.replace(/.*\//, '').replace(/_/g, ' ').replace(/\..*/, '');
    imgElement.draggable = true;
    imgElement.ondragstart = drag;
    imgElement.classList.add("draggable");
    event.target.appendChild(imgElement);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const imgElement = document.createElement("img");
    imgElement.src = data;
    imgElement.alt = data.replace(/.*\//, '').replace(/_/g, ' ').replace(/\..*/, '');
    imgElement.draggable = true;
    imgElement.ondragstart = drag;
    imgElement.classList.add("draggable");
    event.target.appendChild(imgElement);

    // Dodaj obsługę cofania ruchu
    imgElement.onclick = function() {
        event.target.removeChild(imgElement);
    };

    // Ogranicz liczbę obrazków do trzech
    const draggableElements = event.target.getElementsByClassName("draggable");
    if (draggableElements.length > 3) {
        event.target.removeChild(draggableElements[0]);
    }

    // Wyśrodkuj elementy w polu układanki
    centerPuzzleItems(event.target, imgElement);
}
function centerPuzzleItems(container, element) {
    // Sprawdź, czy istnieją elementy do wyśrodkowania
    if (element) {
        // Ustaw styl dla flexbox
        container.style.display = "flex";
        container.style.flexDirection = "column"; // Dodaj tę linię, aby elementy układały się pionowo
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
    }
}

function undoMove() {
    const containers = ["drop-container", "image-container"];

    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        const draggableElements = container.getElementsByClassName("draggable");

        if (draggableElements.length > 0) {
            container.removeChild(draggableElements[draggableElements.length - 1]);
        }
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

