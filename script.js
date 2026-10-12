// ==========================================
// HOT OR COLD GAME
// ==========================================


// ==========================================
// MAP
// ==========================================

const map =
    document.getElementById("map");


// ==========================================
// PLAYER
// ==========================================

const player =
    document.getElementById("player");


// ==========================================
// TARGET
// ==========================================

const target =
    document.getElementById("target");


// ==========================================
// UI
// ==========================================

const temperature =
    document.getElementById("temperature");

const message =
    document.getElementById("message");

const guessCount =
    document.getElementById("guessCount");

const viewName =
    document.getElementById("viewName");


// ==========================================
// BUTTONS
// ==========================================

const confirmButton =
    document.getElementById("confirmButton");

const newGameButton =
    document.getElementById("newGameButton");

const viewButton =
    document.getElementById("viewButton");


// ==========================================
// PERSON VIEW
// ==========================================

let personView = false;


// ==========================================
// PLAYER SETTINGS
// ==========================================

const PLAYER_SPEED = 8;


// ==========================================
// PLAYER DIRECTION
//
// 0 = NORTH
// 1 = EAST
// 2 = SOUTH
// 3 = WEST
// ==========================================

let playerDirection = 0;


// ==========================================
// PLAYER POSITION
// ==========================================

let playerX;

let playerY;


// ==========================================
// SECRET LOCATION
// ==========================================

let targetX;

let targetY;


// ==========================================
// GAME DATA
// ==========================================

let guesses = 0;

let gameWon = false;


// ==========================================
// START GAME
// ==========================================

function startGame() {

    // Put player in middle

    playerX =
        map.clientWidth / 2;

    playerY =
        map.clientHeight / 2;


    // Random hidden location

    targetX =
        80 +
        Math.random() *
        (map.clientWidth - 160);


    targetY =
        80 +
        Math.random() *
        (map.clientHeight - 160);


    // Reset

    guesses = 0;

    gameWon = false;

    playerDirection = 0;


    // Hide target

    target.style.display =
        "none";


    // Reset UI

    guessCount.textContent =
        guesses;

    temperature.textContent =
        "❄️ COLD";

    message.textContent =
        "Use the arrow keys to explore.";


    // Return to map

    personView = false;

    map.classList.remove(
        "person-view"
    );


    viewButton.textContent =
        "👤 PERSON VIEW";


    viewName.textContent =
        "MAP";


    // Update player

    updatePlayer();

    updatePersonDirection();

}


// ==========================================
// UPDATE PLAYER
// ==========================================

function updatePlayer() {

    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";

    if (personView) {
        updatePersonScene();
    }

}


// ==========================================
// TURN LEFT
// ==========================================

function turnLeft() {

    playerDirection--;

    if (playerDirection < 0) {

        playerDirection = 3;

    }

    updatePersonDirection();

}


// ==========================================
// TURN RIGHT
// ==========================================

function turnRight() {

    playerDirection++;

    if (playerDirection > 3) {

        playerDirection = 0;

    }

    updatePersonDirection();

}


// ==========================================
// UPDATE DIRECTION DISPLAY
// ==========================================

function updatePersonDirection() {

    const directions = [

        "NORTH",

        "EAST",

        "SOUTH",

        "WEST"

    ];


    const directionElement =
        document.getElementById(
            "personDirection"
        );


    if (directionElement) {

        directionElement.textContent =
            "FACING " +
            directions[playerDirection];

    }


    // Rotate player emoji

    const rotations = [

        "rotate(0deg)",

        "rotate(90deg)",

        "rotate(180deg)",

        "rotate(-90deg)"

    ];


    player.style.transform =
        "translate(-50%, -50%) " +
        rotations[playerDirection];

}


// ==========================================
// MOVE FORWARD
// ==========================================

function moveForward(amount) {

    // NORTH

    if (playerDirection === 0) {

        playerY -=
            PLAYER_SPEED * amount;

    }


    // EAST

    else if (playerDirection === 1) {

        playerX +=
            PLAYER_SPEED * amount;

    }


    // SOUTH

    else if (playerDirection === 2) {

        playerY +=
            PLAYER_SPEED * amount;

    }


    // WEST

    else if (playerDirection === 3) {

        playerX -=
            PLAYER_SPEED * amount;

    }

}


// ==========================================
// KEYBOARD MOVEMENT
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (gameWon) {

            return;

        }


        // Don't move when clicking buttons

        if (

            event.target.tagName ===
                "INPUT" ||

            event.target.tagName ===
                "TEXTAREA" ||

            event.target.tagName ===
                "BUTTON"

        ) {

            return;

        }


        let moved = false;


        // ======================================
        // MAP VIEW
        // ======================================

        if (!personView) {


            if (event.key === "ArrowUp") {

                playerY -=
                    PLAYER_SPEED;

                moved = true;

            }


            if (event.key === "ArrowDown") {

                playerY +=
                    PLAYER_SPEED;

                moved = true;

            }


            if (event.key === "ArrowLeft") {

                playerX -=
                    PLAYER_SPEED;

                moved = true;

            }


            if (event.key === "ArrowRight") {

                playerX +=
                    PLAYER_SPEED;

                moved = true;

            }

        }


        // ======================================
        // PERSON VIEW
        // ======================================

        else {


            // TURN LEFT

            if (
                event.key === "ArrowLeft"
            ) {

                turnLeft();

            }


            // TURN RIGHT

            else if (
                event.key === "ArrowRight"
            ) {

                turnRight();

            }


            // MOVE FORWARD

            if (

                event.key === "ArrowUp" ||

                event.key.toLowerCase() ===
                    "w"

            ) {

                moveForward(1);

                moved = true;

            }


            // MOVE BACKWARD

            if (

                event.key === "ArrowDown" ||

                event.key.toLowerCase() ===
                    "s"

            ) {

                moveForward(-1);

                moved = true;

            }

        }


        // ======================================
        // UPDATE AFTER MOVEMENT
        // ======================================

        if (moved) {

            event.preventDefault();

            keepPlayerInsideMap();

            updatePlayer();

            updateTemperaturePreview();

        }

    }
);


// ==========================================
// KEEP PLAYER INSIDE MAP
// ==========================================

function keepPlayerInsideMap() {

    const playerSize = 20;


    if (
        playerX < playerSize
    ) {

        playerX =
            playerSize;

    }


    if (
        playerY < playerSize
    ) {

        playerY =
            playerSize;

    }


    if (
        playerX >
        map.clientWidth -
        playerSize
    ) {

        playerX =
            map.clientWidth -
            playerSize;

    }


    if (
        playerY >
        map.clientHeight -
        playerSize
    ) {

        playerY =
            map.clientHeight -
            playerSize;

    }

}


// ==========================================
// CALCULATE DISTANCE
// ==========================================

function getDistance() {

    const dx =
        playerX -
        targetX;

    const dy =
        playerY -
        targetY;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


// ==========================================
// HOT / COLD PREVIEW
// ==========================================

function updateTemperaturePreview() {

    const distance =
        getDistance();


    if (distance < 45) {

        temperature.textContent =
            "🔥 VERY HOT";

    }


    else if (distance < 100) {

        temperature.textContent =
            "🔥 HOT";

    }


    else if (distance < 180) {

        temperature.textContent =
            "🌡️ WARM";

    }


    else {

        temperature.textContent =
            "❄️ COLD";

    }

}


// ==========================================
// CONFIRM GUESS
// ==========================================

confirmButton.addEventListener(
    "click",
    function() {


        if (gameWon) {

            return;

        }


        // Count guess

        guesses++;

        guessCount.textContent =
            guesses;


        // Distance

        const distance =
            getDistance();


        // ======================================
        // FOUND
        // ======================================

        if (distance < 35) {

            gameWon = true;


            temperature.textContent =
                "🎯 YOU FOUND IT!";


            message.textContent =

                "Amazing! You found the hidden location in " +

                guesses +

                " guess" +

                (
                    guesses === 1
                        ? ""
                        : "es"
                ) +

                "!";


            // Show target

            target.style.left =
                targetX + "px";

            target.style.top =
                targetY + "px";

            target.style.display =
                "flex";


            return;

        }


        // ======================================
        // VERY HOT
        // ======================================

        if (distance < 70) {

            temperature.textContent =
                "🔥 VERY HOT";

            message.textContent =
                "You're extremely close.";

        }


        // ======================================
        // HOT
        // ======================================

        else if (distance < 130) {

            temperature.textContent =
                "🔥 HOT";

            message.textContent =
                "You're close! Keep searching around here.";

        }


        // ======================================
        // WARM
        // ======================================

        else if (distance < 220) {

            temperature.textContent =
                "🌡️ WARM";

            message.textContent =
                "You're getting closer.";

        }


        // ======================================
        // COLD
        // ======================================

        else {

            temperature.textContent =
                "❄️ COLD";

            message.textContent =
                "You're far away. Keep exploring.";

        }

    }
);


// ==========================================
// SWITCH MAP / PERSON VIEW
// ==========================================

viewButton.addEventListener(
    "click",
    function() {


        personView =
            !personView;


        // ======================================
        // PERSON VIEW
        // ======================================

        if (personView) {

            map.classList.add(
                "person-view"
            );


            viewButton.textContent =
                "🗺️ MAP VIEW";


            viewName.textContent =
                "PERSON";


            message.textContent =

                "PERSON VIEW: " +

                "⬆️ Forward • " +

                "⬇️ Backward • " +

                "⬅️ Turn Left • " +

                "➡️ Turn Right";


        }


        // ======================================
        // MAP VIEW
        // ======================================

        else {

            map.classList.remove(
                "person-view"
            );


            viewButton.textContent =
                "👤 PERSON VIEW";


            viewName.textContent =
                "MAP";


            message.textContent =
                "Use the arrow keys to explore.";

        }


        updatePlayer();

        updatePersonDirection();

    }
);


// ==========================================
// NEW GAME
// ==========================================

newGameButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);

// ==========================================
// PERSON VIEW SCENE
// ==========================================

function updatePersonScene() {

    const objects =
        document.querySelectorAll(
            ".building, .tree"
        );

    const mapRect =
        map.getBoundingClientRect();

    objects.forEach(function(object) {

        if (!object.dataset.sceneX) {

    const rect =
        object.getBoundingClientRect();

    object.dataset.sceneX =
        rect.left -
        mapRect.left +
        rect.width / 2;

    object.dataset.sceneY =
        rect.top -
        mapRect.top +
        rect.height / 2;

    object.style.willChange =
        "transform, left, top";
}

        const objectX =
            parseFloat(
                object.dataset.sceneX
            );

        const objectY =
            parseFloat(
                object.dataset.sceneY
            );

        let dx =
            objectX - playerX;

        let dy =
            objectY - playerY;

        let distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance < 1) {
            distance = 1;
        }

        let angle =
            Math.atan2(dx, -dy);

        const facing =
            playerDirection *
            Math.PI / 2;

        angle -= facing;

        while (angle > Math.PI) {
            angle -= Math.PI * 2;
        }

        while (angle < -Math.PI) {
            angle += Math.PI * 2;
        }

        if (
            Math.abs(angle) >
            Math.PI / 2
        ) {

            object.style.visibility =
                "hidden";

            return;
        }

        object.style.visibility =
            "visible";

        const screenX =
            50 +
            (angle /
            (Math.PI / 2)) *
            45;

        const scale =
            Math.max(
                0.35,
                Math.min(
                    3,
                    180 / distance
                )
            );

        object.style.left =
            screenX + "%";

      object.style.top =
    (
        45 +
        Math.min(
            42,
            900 / distance
        )
    ) + "%";

        object.style.transform =
            "translate(-50%, -50%) " +
            "scale(" +
            scale +
            ")";
    });
}

// ==========================================
// START
// ==========================================

startGame();