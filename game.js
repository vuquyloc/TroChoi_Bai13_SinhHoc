/* =====================================================
   TRÒ CHƠI SINH HỌC – BÀI 13
   GAME.JS
===================================================== */


const games = {

    1: {
        name: "🧩 GIẢI CỨU SƠ ĐỒ",
        description: "Sắp xếp và kết nối kiến thức"
    },

    2: {
        name: "🔎 BẮT LỖI SINH HỌC",
        description: "Tìm và sửa lỗi kiến thức"
    },

    3: {
        name: "🔐 GIẢI MÃ BÍ MẬT",
        description: "Giải câu hỏi để tìm từ khoá"
    },

    4: {
        name: "🧠 NHIỆM VỤ SINH HỌC",
        description: "Vận dụng kiến thức vào tình huống"
    }

};


/* =====================================================
   TRẠNG THÁI
===================================================== */

let playedGames = {

    1: false,
    2: false,
    3: false,
    4: false

};


let scores = {

    1: 0,
    2: 0,
    3: 0,
    4: 0

};


let groupPlayed = {

    1: false,
    2: false,
    3: false,
    4: false

};


/* Thời gian hoàn thành của từng nhóm */

let groupTimes = {

    1: null,
    2: null,
    3: null,
    4: null

};


let selectedGame = null;

let selectedGroup = null;

let currentQuestion = 0;

let game1Score = 0;

let questionFirstTry = true;

let gameTimer = null;

let timeLeft = 150;

let selectedDragItem = null;

let dragSource = null;

let selectedChoice = null;


/* =====================================================
   ICON
===================================================== */

function getGameIcon(gameNumber) {

    return [
        "",
        "🧩",
        "🔎",
        "🔐",
        "🧠"
    ][gameNumber] || "🎮";

}


/* =====================================================
   ĐỔI GIÂY → PHÚT:GIÂY
===================================================== */

function formatTime(seconds) {

    if (
        seconds === null ||
        seconds === undefined
    ) {

        return "—";

    }


    const minutes =
        Math.floor(seconds / 60);

    const secondsPart =
        seconds % 60;


    return (
        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(secondsPart).padStart(2, "0")
    );

}


/* =====================================================
   THỜI GIAN ĐÃ DÙNG
===================================================== */

function elapsedTime() {

    return 150 -
        Math.max(0, timeLeft);

}


/* =====================================================
   ẨN BẢN ĐỒ
===================================================== */

function hideMap() {

    const elements = [

        ".score-board",

        ".container > h1",

        ".subtitle",

        ".container > h2",

        ".map-description",

        ".game-map",

        "#home-leaderboard"

    ];


    elements.forEach(selector => {

        const element =
            document.querySelector(selector);


        if (element) {

            element.style.display = "none";

        }

    });

}


/* =====================================================
   HIỆN BẢN ĐỒ
===================================================== */

function showMap() {

    const elements = [

        ".score-board",

        ".container > h1",

        ".subtitle",

        ".container > h2",

        ".map-description",

        ".game-map",

        "#home-leaderboard"

    ];


    elements.forEach(selector => {

        const element =
            document.querySelector(selector);


        if (element) {

            element.style.display = "";

        }

    });


    updateScores();

    updateGameMap();

    updateHomeLeaderboard();

}


/* =====================================================
   CHỌN GAME
===================================================== */

function selectGame(gameNumber) {

    if (playedGames[gameNumber]) {

        alert(
            "⚠️ Thử thách này đã được chơi rồi!"
        );

        return;

    }


    selectedGame = gameNumber;


    showGroupPopup(gameNumber);

}


/* =====================================================
   POPUP CHỌN NHÓM
===================================================== */

function showGroupPopup(gameNumber) {

    closeGroupPopup();


    const overlay =
        document.createElement("div");


    overlay.className =
        "group-popup-overlay";


    overlay.id =
        "group-selection-modal";


    const popup =
        document.createElement("div");


    popup.className =
        "group-popup";


    popup.innerHTML = `

        <div class="popup-title">

            ${getGameIcon(gameNumber)}
            CHỌN NHÓM

        </div>


        <p class="popup-subtitle">

            ${games[gameNumber].name}

        </p>


        <div class="popup-group-grid">


            ${[1, 2, 3, 4].map(group => `

                <button

                    type="button"

                    class="
                        popup-group-button
                        group-color-${group}
                    "

                    data-group="${group}"

                    ${groupPlayed[group]
                        ? "disabled"
                        : ""
                    }

                >

                    <span class="popup-group-icon">

                        ${
                            [
                                "🟢",
                                "🔵",
                                "🟠",
                                "🟣"
                            ][group - 1]
                        }

                    </span>


                    <strong>
                        NHÓM ${group}
                    </strong>


                    <small>

                        ${
                            groupPlayed[group]

                                ? `
                                    ĐÃ CHƠI
                                    ·
                                    ${scores[group]}/5
                                    ·
                                    ${formatTime(
                                        groupTimes[group]
                                    )}
                                  `

                                : "SẴN SÀNG"

                        }

                    </small>

                </button>

            `).join("")}


        </div>


        <button
            type="button"
            class="popup-close-button"
        >

            ↩ QUAY LẠI

        </button>

    `;


    overlay.appendChild(popup);


    document.body.appendChild(
        overlay
    );


    document.body.style.overflow =
        "hidden";


    popup
        .querySelectorAll("[data-group]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const group =
                        Number(
                            button.dataset.group
                        );


                    if (
                        groupPlayed[group]
                    ) {

                        return;

                    }


                    closeGroupPopup();

                    chooseGroup(group);

                }
            );

        });


    popup
        .querySelector(
            ".popup-close-button"
        )
        .addEventListener(
            "click",
            () => {

                closeGroupPopup();

                selectedGame = null;

            }
        );

}


/* =====================================================
   ĐÓNG POPUP
===================================================== */

function closeGroupPopup() {

    const popup =
        document.getElementById(
            "group-selection-modal"
        );


    if (popup) {

        popup.remove();

    }


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CHỌN NHÓM
===================================================== */

function chooseGroup(groupNumber) {

    if (
        !selectedGame ||
        groupPlayed[groupNumber]
    ) {

        return;

    }


    selectedGroup =
        groupNumber;


    hideMap();


    const gameArea =
        document.getElementById(
            "game-area"
        );


    gameArea.style.display =
        "block";


    gameArea.innerHTML = `

        <div class="game-screen">


            <div class="big-game-icon">

                ${getGameIcon(
                    selectedGame
                )}

            </div>


            <h1>

                ${games[selectedGame].name}

            </h1>


            <p class="game-subtitle">

                ${games[selectedGame].description}

            </p>


            <div class="divider"></div>


            <h2>

                👥 NHÓM ${groupNumber}

            </h2>


            <p class="choose-text">

                Nhóm ${groupNumber}
                đã được chọn.

            </p>


            <p class="choose-text">

                Chuẩn bị sẵn sàng
                cho thử thách!

            </p>


            <br>


            <button
                class="start-button"
                onclick="
                    showInstructions(
                        ${selectedGame},
                        ${groupNumber}
                    )
                "
            >

                ▶ XEM HƯỚNG DẪN

            </button>


            <br>


            <button
                class="back-button"
                onclick="backToMap()"
            >

                ↩ QUAY LẠI

            </button>


        </div>

    `;

}


/* =====================================================
   HƯỚNG DẪN
===================================================== */

function showInstructions(
    gameNumber,
    groupNumber
) {

    const instructions = {

        1:
            "Nhóm sẽ thực hiện 5 nhiệm vụ sắp xếp và kết nối kiến thức về chuyển hoá vật chất và năng lượng.",

        2:
            "Nhóm sẽ tìm những lỗi sai trong các phát biểu Sinh học và sửa lại cho chính xác.",

        3:
            "Nhóm sẽ giải các câu hỏi để tìm ra những từ khoá và cuối cùng giải mã từ khoá bí mật.",

        4:
            "Nhóm sẽ vận dụng kiến thức về chuyển hoá vật chất và năng lượng để hoàn thành các nhiệm vụ Sinh học."

    };


    const gameArea =
        document.getElementById(
            "game-area"
        );


    gameArea.innerHTML = `

        <div class="game-screen">


            <div class="big-game-icon">

                ${getGameIcon(
                    gameNumber
                )}

            </div>


            <h1>

                HƯỚNG DẪN

            </h1>


            <p class="game-subtitle">

                ${games[gameNumber].name}
                –
                Nhóm ${groupNumber}

            </p>


            <div class="divider"></div>


            <p
                class="choose-text
                       instruction-text"
            >

                ${instructions[gameNumber]}

            </p>


            <p class="choose-text">

                ⏱️ Thời gian:

                <strong>
                    2 phút 30 giây
                </strong>

            </p>


            <p class="choose-text">

                ⭐ Đúng ngay lần đầu:
                +1 điểm.

            </p>


            <p class="choose-text">

                🔄 Sai vẫn được làm lại
                nhưng không cộng điểm.

            </p>


            <p class="choose-text">

                ⏱️ Nếu bằng điểm,
                nhóm nhanh hơn xếp trên.

            </p>


            <br>


            <button
                class="start-button"
                onclick="
                    startGame(
                        ${gameNumber},
                        ${groupNumber}
                    )
                "
            >

                ▶ BẮT ĐẦU

            </button>


            <br>


            <button
                class="back-button"
                onclick="backToMap()"
            >

                ↩ QUAY LẠI BẢN ĐỒ

            </button>


        </div>

    `;

}


/* =====================================================
   BẮT ĐẦU GAME
===================================================== */

function startGame(
    gameNumber,
    groupNumber
) {

    selectedGame =
        gameNumber;

    selectedGroup =
        groupNumber;


    currentQuestion =
        0;


    game1Score =
        0;


    questionFirstTry =
        true;


    timeLeft =
        150;


    selectedChoice =
        null;


    selectedDragItem =
        null;


    if (gameTimer) {

        clearInterval(
            gameTimer
        );

    }


    if (gameNumber === 1) {

        renderGame1();

        startTimer();

        return;

    }


    document.getElementById(
        "game-area"
    ).innerHTML = `

        <div class="game-screen">

            <div class="big-game-icon">

                ${getGameIcon(
                    gameNumber
                )}

            </div>


            <h1>

                ${games[gameNumber].name}

            </h1>


            <p class="choose-text">

                🚧 Nội dung thử thách
                đang được xây dựng...

            </p>


            <button
                class="back-button"
                onclick="backToMap()"
            >

                ↩ QUAY LẠI BẢN ĐỒ

            </button>

        </div>

    `;

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    updateTimerDisplay();


    gameTimer =
        setInterval(
            () => {

                timeLeft--;


                updateTimerDisplay();


                if (
                    timeLeft <= 0
                ) {

                    clearInterval(
                        gameTimer
                    );


                    gameTimer =
                        null;


                    finishGame1(
                        true
                    );

                }

            },
            1000
        );

}


function updateTimerDisplay() {

    const timer =
        document.getElementById(
            "game-timer"
        );


    if (!timer) {

        return;

    }


    timer.textContent =
        `⏱️ ${formatTime(
            Math.max(
                0,
                timeLeft
            )
        )}`;


    timer.classList.toggle(
        "warning",
        timeLeft <= 30
    );

}


/* =====================================================
   GAME 1
===================================================== */

const game1Questions = [

    {
        type: "order"
    },

    {
        type: "match"
    },

    {
        type: "match3"
    },

    {
        type: "classify"
    },

    {
        type: "choice"
    }

];


/* =====================================================
   RENDER GAME 1
===================================================== */

function renderGame1() {

    selectedChoice =
        null;


    selectedDragItem =
        null;


    dragSource =
        null;


    const question =
        game1Questions[
            currentQuestion
        ];


    const area =
        document.getElementById(
            "game-area"
        );


    area.innerHTML = `

        <div
            class="
                game-screen
                challenge-screen
            "
        >


            <div
                class="challenge-top"
            >

                <div>

                    <strong>

                        🧩
                        ${games[1].name}

                    </strong>

                    ·

                    Nhóm
                    ${selectedGroup}

                </div>


                <div
                    class="timer"
                    id="game-timer"
                >

                    ⏱️ 02:30

                </div>

            </div>


            <div
                class="question-number"
            >

                NHIỆM VỤ
                ${currentQuestion + 1}/5

                ·

                ĐIỂM
                ${game1Score}/5

            </div>


            ${
                question.type === "order"
                    ? renderOrderQuestion()
                    : ""
            }


            ${
                question.type === "match"
                    ? renderMatchQuestion()
                    : ""
            }


            ${
                question.type === "match3"
                    ? renderMatch3Question()
                    : ""
            }


            ${
                question.type === "classify"
                    ? renderClassifyQuestion()
                    : ""
            }


            ${
                question.type === "choice"
                    ? renderChoiceQuestion()
                    : ""
            }


            <div
                id="feedback"
                class="feedback"
                aria-live="polite"
            ></div>


        </div>

    `;


    if (
        question.type === "order"
    ) {

        setupOrderDrag();

    }


    if (
        question.type === "match" ||
        question.type === "match3" ||
        question.type === "classify"
    ) {

        setupMatchDrag();

    }


    updateTimerDisplay();

}


/* =====================================================
   CÂU 1
===================================================== */

function renderOrderQuestion() {

    const words = [

        {
            id: "food",
            text: "THỨC ĂN"
        },

        {
            id: "metabolism",
            text: "CHUYỂN HOÁ"
        },

        {
            id: "atp",
            text: "ATP"
        },

        {
            id: "life",
            text: "HOẠT ĐỘNG SỐNG"
        }

    ].sort(
        () => Math.random() - 0.5
    );


    return `

        <h2
            class="question-title"
        >

            🧩 Sắp xếp sơ đồ

        </h2>


        <p
            class="question-text"
        >

            Kéo các ô vào đúng thứ tự:

        </p>


        <div
            class="order-bank"
            id="order-bank"
        >

            ${
                words.map(
                    word => `

                        <div
                            class="drag-item"
                            draggable="true"
                            data-id="${word.id}"
                        >

                            ${word.text}

                        </div>

                    `
                ).join("")
            }

        </div>


        <div
            class="order-slots"
            id="order-slots"
        >

            ${
                [
                    [
                        "food",
                        "THỨC ĂN"
                    ],

                    [
                        "metabolism",
                        "CHUYỂN HOÁ"
                    ],

                    [
                        "atp",
                        "ATP"
                    ],

                    [
                        "life",
                        "HOẠT ĐỘNG SỐNG"
                    ]

                ]
                .map(
                    (item, index) => `

                        <div
                            class="drop-slot"
                            data-index="${index}"
                            data-expected="${item[0]}"
                        >

                            <span
                                class="slot-number"
                            >

                                ${index + 1}

                            </span>


                            <span
                                class="slot-placeholder"
                            >

                                KÉO VÀO ĐÂY

                            </span>

                        </div>

                    `
                )
                .join("")
            }

        </div>


        <p class="drag-help">

            💡 Có thể bấm đáp án
            rồi bấm vào ô muốn đặt.

        </p>


        <button
            class="check-button"
            onclick="checkOrderAnswer()"
        >

            ✓ KIỂM TRA

        </button>

    `;

}


/* =====================================================
   DRAG CÂU 1
===================================================== */

function setupOrderDrag() {

    const items =
        document.querySelectorAll(
            "#order-bank .drag-item"
        );


    const slots =
        document.querySelectorAll(
            "#order-slots .drop-slot"
        );


    const bank =
        document.getElementById(
            "order-bank"
        );


    items.forEach(
        item =>
            attachDragItem(
                item
            )
    );


    slots.forEach(
        slot => {

            slot.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();

                    slot.classList.add(
                        "drag-over"
                    );

                }
            );


            slot.addEventListener(
                "dragleave",
                () => {

                    slot.classList.remove(
                        "drag-over"
                    );

                }
            );


            slot.addEventListener(
                "drop",
                event => {

                    event.preventDefault();

                    slot.classList.remove(
                        "drag-over"
                    );


                    const id =
                        event.dataTransfer.getData(
                            "text/plain"
                        );


                    const item =
                        dragSource ||
                        document.querySelector(
                            `.drag-item[data-id="${id}"]`
                        );


                    if (item) {

                        placeOrSwap(
                            item,
                            slot,
                            bank
                        );

                    }

                }
            );


            slot.addEventListener(
                "click",
                () => {

                    if (
                        selectedDragItem
                    ) {

                        placeOrSwap(
                            selectedDragItem,
                            slot,
                            bank
                        );

                    }

                }
            );

        }
    );


    /* Kéo từ ô về ngân hàng */

    bank.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            bank.classList.add(
                "drag-over"
            );

        }
    );


    bank.addEventListener(
        "dragleave",
        () => {

            bank.classList.remove(
                "drag-over"
            );

        }
    );


    bank.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            bank.classList.remove(
                "drag-over"
            );


            const id =
                event.dataTransfer.getData(
                    "text/plain"
                );


            const item =
                dragSource ||
                document.querySelector(
                    `#order-slots .drag-item[data-id="${id}"]`
                );


            if (item) {

                returnItemToBank(
                    item,
                    bank
                );

            }

        }
    );

}


/* =====================================================
   GÁN SỰ KIỆN CHO ĐÁP ÁN
===================================================== */

function attachDragItem(item) {

    item.setAttribute(
        "draggable",
        "true"
    );


    item.addEventListener(
        "dragstart",
        event => {

            dragSource =
                item;


            event.dataTransfer.effectAllowed =
                "move";


            event.dataTransfer.setData(
                "text/plain",
                item.dataset.id
            );


            item.classList.add(
                "dragging"
            );

        }
    );


    item.addEventListener(
        "dragend",
        () => {

            item.classList.remove(
                "dragging"
            );


            dragSource =
                null;

        }
    );


    /* Phương án bấm */

    item.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".drag-item, .description-card"
                )
                .forEach(
                    element =>
                        element.classList.remove(
                            "selected"
                        )
                );


            item.classList.add(
                "selected"
            );


            selectedDragItem =
                item;

        }
    );

}


/* =====================================================
   ĐỔI CHỖ 2 ĐÁP ÁN
===================================================== */

function placeOrSwap(
    item,
    targetSlot,
    bank
) {

    const originSlot =
        item.closest(
            ".drop-slot, .match-drop-slot"
        );


    const targetItem =
        targetSlot.querySelector(
            ".drag-item, .description-card"
        );


    /*
       Nếu ô đích đã có đáp án:
       ĐÁP ÁN SẼ ĐỔI CHỖ.
    */

    if (
        targetItem &&
        targetItem !== item
    ) {

        if (originSlot) {

            originSlot.textContent = "";

            restoreSlotPlaceholder(
                originSlot
            );


            originSlot.appendChild(
                targetItem
            );


            markSlotFilled(
                originSlot
            );

        }

        else {

            bank.appendChild(
                targetItem
            );

        }

    }


    targetSlot.textContent = "";


    targetSlot.appendChild(
        item
    );


    markSlotFilled(
        targetSlot
    );


    item.classList.remove(
        "selected"
    );


    selectedDragItem =
        null;


    dragSource =
        null;

}


/* =====================================================
   KÉO ĐÁP ÁN VỀ NGÂN HÀNG
===================================================== */

function returnItemToBank(
    item,
    bank
) {

    const origin =
        item.closest(
            ".drop-slot, .match-drop-slot"
        );


    if (origin) {

        origin.textContent = "";

        restoreSlotPlaceholder(
            origin
        );

        origin.classList.remove(
            "filled"
        );

    }


    bank.appendChild(
        item
    );


    item.classList.remove(
        "selected"
    );


    selectedDragItem =
        null;


    dragSource =
        null;

}


/* =====================================================
   ĐÁNH DẤU Ô ĐÃ ĐIỀN
===================================================== */

function markSlotFilled(slot) {

    slot.classList.add(
        "filled"
    );


    const placeholder =
        slot.querySelector(
            ".slot-placeholder"
        );


    if (placeholder) {

        placeholder.remove();

    }

}


/* =====================================================
   KHÔI PHỤC Ô TRỐNG
===================================================== */

function restoreSlotPlaceholder(
    slot
) {

    if (
        slot.classList.contains(
            "drop-slot"
        )
    ) {

        slot.innerHTML = `

            <span
                class="slot-number"
            >

                ${
                    Number(
                        slot.dataset.index
                    ) + 1
                }

            </span>


            <span
                class="slot-placeholder"
            >

                KÉO VÀO ĐÂY

            </span>

        `;

    }

    else {

        slot.innerHTML = `

            <span
                class="slot-placeholder"
            >

                KÉO VÀO ĐÂY

            </span>

        `;

    }

}


/* =====================================================
   KIỂM TRA CÂU 1
===================================================== */

function checkOrderAnswer() {

    const slots =
        [
            ...document.querySelectorAll(
                "#order-slots .drop-slot"
            )
        ];


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (
        slots.some(
            slot =>
                !slot.querySelector(
                    ".drag-item"
                )
        )
    ) {

        feedback.className =
            "feedback warning";


        feedback.innerHTML =
            "⚠️ Hãy điền đủ 4 ô trước khi kiểm tra.";


        return;

    }


    const correct =
        slots.every(
            slot => {

                const item =
                    slot.querySelector(
                        ".drag-item"
                    );


                return (
                    item &&
                    item.dataset.id ===
                    slot.dataset.expected
                );

            }
        );


    handleQuestionResult(
        correct,
        feedback
    );

}


/* =====================================================
   CÂU 2
===================================================== */

function renderMatchQuestion() {

    return renderMatchLayout(

        [

            {
                id: "anabolism",

                text:
                    "Tổng hợp chất phức tạp từ chất đơn giản và thường cần năng lượng."
            },

            {
                id: "catabolism",

                text:
                    "Phân giải chất phức tạp thành chất đơn giản và thường giải phóng năng lượng."
            }

        ],

        [

            [
                "ĐỒNG HOÁ",
                "anabolism"
            ],

            [
                "DỊ HOÁ",
                "catabolism"
            ]

        ],

        "🔗 Ghép đúng khái niệm"

    );

}


/* =====================================================
   CÂU 3
===================================================== */

function renderMatch3Question() {

    return renderMatchLayout(

        [

            {
                id: "atp",

                text:
                    "Cung cấp năng lượng trực tiếp cho nhiều hoạt động sống của tế bào."
            },

            {
                id: "enzyme",

                text:
                    "Chất xúc tác sinh học, làm giảm năng lượng hoạt hoá của phản ứng."
            }

        ],

        [

            [
                "ATP",
                "atp"
            ],

            [
                "ENZYME",
                "enzyme"
            ]

        ],

        "⚙️ Ghép đúng chức năng"

    );

}


/* =====================================================
   CÂU 4
===================================================== */

function renderClassifyQuestion() {

    return renderMatchLayout(

        [

            {
                id: "anabolism",

                text:
                    "TỔNG HỢP PROTEIN từ các amino acid."
            },

            {
                id: "catabolism",

                text:
                    "PHÂN GIẢI GLUCOSE để giải phóng năng lượng."
            }

        ],

        [

            [
                "ĐỒNG HOÁ",
                "anabolism"
            ],

            [
                "DỊ HOÁ",
                "catabolism"
            ]

        ],

        "🧠 Đồng hoá hay dị hoá?"

    );

}


/* =====================================================
   KHUNG GHÉP
===================================================== */

function renderMatchLayout(
    cards,
    targets,
    title
) {

    cards.sort(
        () => Math.random() - 0.5
    );


    return `

        <h2
            class="question-title"
        >

            ${title}

        </h2>


        <p
            class="question-text"
        >

            Kéo từng mô tả
            vào đúng ô.

            Có thể kéo đáp án
            đã đặt về
            <strong>
                ngân hàng đáp án
            </strong>.

        </p>


        <div class="match-area">


            ${
                targets.map(
                    (target, index) => `

                        <div
                            class="match-row"
                        >

                            <div
                                class="match-concept"
                            >

                                ${target[0]}

                            </div>


                            <div
                                class="match-drop-slot"
                                data-expected="${target[1]}"
                                data-index="${index}"
                            >

                                <span
                                    class="slot-placeholder"
                                >

                                    KÉO VÀO ĐÂY

                                </span>

                            </div>

                        </div>

                    `
                ).join("")
            }


        </div>


        <div
            class="description-bank"
            id="description-bank"
        >

            ${
                cards.map(
                    card => `

                        <div
                            class="description-card"
                            draggable="true"
                            data-id="${card.id}"
                        >

                            ${card.text}

                        </div>

                    `
                ).join("")
            }

        </div>


        <p class="drag-help">

            💡 Kéo đáp án đang nằm
            trong ô về khu vực đáp án
            để trả lại.

        </p>


        <button
            class="check-button"
            onclick="checkMatchAnswer()"
        >

            ✓ KIỂM TRA

        </button>

    `;

}


/* =====================================================
   DRAG CÂU 2/3/4
===================================================== */

function setupMatchDrag() {

    const cards =
        document.querySelectorAll(
            ".description-card"
        );


    const slots =
        document.querySelectorAll(
            ".match-drop-slot"
        );


    const bank =
        document.getElementById(
            "description-bank"
        );


    cards.forEach(
        card =>
            attachDragItem(
                card
            )
    );


    slots.forEach(
        slot => {

            slot.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();

                    slot.classList.add(
                        "drag-over"
                    );

                }
            );


            slot.addEventListener(
                "dragleave",
                () => {

                    slot.classList.remove(
                        "drag-over"
                    );

                }
            );


            slot.addEventListener(
                "drop",
                event => {

                    event.preventDefault();

                    slot.classList.remove(
                        "drag-over"
                    );


                    const id =
                        event.dataTransfer.getData(
                            "text/plain"
                        );


                    const card =
                        dragSource ||
                        document.querySelector(
                            `.description-card[data-id="${id}"]`
                        );


                    if (card) {

                        placeOrSwap(
                            card,
                            slot,
                            bank
                        );

                    }

                }
            );


            slot.addEventListener(
                "click",
                () => {

                    if (
                        selectedDragItem
                    ) {

                        placeOrSwap(
                            selectedDragItem,
                            slot,
                            bank
                        );

                    }

                }
            );

        }
    );


    /* Kéo card về ngân hàng */

    bank.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            bank.classList.add(
                "drag-over"
            );

        }
    );


    bank.addEventListener(
        "dragleave",
        () => {

            bank.classList.remove(
                "drag-over"
            );

        }
    );


    bank.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            bank.classList.remove(
                "drag-over"
            );


            const id =
                event.dataTransfer.getData(
                    "text/plain"
                );


            const card =
                dragSource ||
                document.querySelector(
                    `.match-drop-slot .description-card[data-id="${id}"]`
                );


            if (card) {

                returnItemToBank(
                    card,
                    bank
                );

            }

        }
    );

}


/* =====================================================
   KIỂM TRA CÂU 2/3/4
===================================================== */

function checkMatchAnswer() {

    const slots =
        [
            ...document.querySelectorAll(
                ".match-drop-slot"
            )
        ];


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (
        slots.some(
            slot =>
                !slot.querySelector(
                    ".description-card"
                )
        )
    ) {

        feedback.className =
            "feedback warning";


        feedback.innerHTML =
            "⚠️ Hãy điền đủ các ô trước khi kiểm tra.";


        return;

    }


    const correct =
        slots.every(
            slot => {

                const card =
                    slot.querySelector(
                        ".description-card"
                    );


                return (
                    card &&
                    card.dataset.id ===
                    slot.dataset.expected
                );

            }
        );


    handleQuestionResult(
        correct,
        feedback
    );

}


/* =====================================================
   CÂU 5
===================================================== */

function renderChoiceQuestion() {

    return `

        <h2
            class="question-title"
        >

            ⚡ Năng lượng và đồng hoá

        </h2>


        <p
            class="question-text"
        >

            Phát biểu nào đúng?

        </p>


        <div
            class="answer-options"
        >


            <button
                class="answer-option"
                data-answer="A"
                onclick="selectChoice(this)"
            >

                A.
                Đồng hoá thường cần năng lượng.

            </button>


            <button
                class="answer-option"
                data-answer="B"
                onclick="selectChoice(this)"
            >

                B.
                Đồng hoá luôn giải phóng năng lượng.

            </button>


            <button
                class="answer-option"
                data-answer="C"
                onclick="selectChoice(this)"
            >

                C.
                ATP không liên quan đến năng lượng tế bào.

            </button>


            <button
                class="answer-option"
                data-answer="D"
                onclick="selectChoice(this)"
            >

                D.
                Dị hoá luôn không tạo năng lượng.

            </button>


        </div>


        <button
            class="check-button"
            onclick="checkChoiceAnswer()"
        >

            ✓ KIỂM TRA

        </button>

    `;

}


/* =====================================================
   CHỌN ĐÁP ÁN
===================================================== */

function selectChoice(button) {

    document
        .querySelectorAll(
            ".answer-option"
        )
        .forEach(
            element =>
                element.classList.remove(
                    "selected"
                )
        );


    button.classList.add(
        "selected"
    );


    selectedChoice =
        button.dataset.answer;

}


/* =====================================================
   KIỂM TRA CÂU 5
===================================================== */

function checkChoiceAnswer() {

    const feedback =
        document.getElementById(
            "feedback"
        );


    if (!selectedChoice) {

        feedback.className =
            "feedback warning";


        feedback.textContent =
            "⚠️ Hãy chọn một đáp án.";


        return;

    }


    handleQuestionResult(

        selectedChoice === "A",

        feedback

    );

}


/* =====================================================
   XỬ LÝ ĐÚNG / SAI
===================================================== */

function handleQuestionResult(
    correct,
    feedback
) {

    document
        .querySelectorAll(
            ".check-button"
        )
        .forEach(
            button =>
                button.disabled = true
        );


    if (correct) {


        /*
           Chỉ cộng điểm nếu
           đúng ngay lần đầu.
        */

        if (
            questionFirstTry
        ) {

            game1Score++;

        }


        feedback.className =
            "feedback correct";


        feedback.innerHTML =
            questionFirstTry

                ? "🎉 Chính xác! <strong>+1 điểm</strong>"

                : "✅ Chính xác! Nhiệm vụ hoàn thành nhưng không cộng thêm điểm.";


        const next =
            document.createElement(
                "button"
            );


        next.className =
            "next-button";


        next.textContent =
            currentQuestion === 4

                ? "🏁 XEM KẾT QUẢ"

                : "➡ CÂU TIẾP THEO";


        next.onclick =
            nextQuestion;


        feedback.appendChild(
            document.createElement(
                "br"
            )
        );


        feedback.appendChild(
            next
        );


    }

    else {


        questionFirstTry =
            false;


        feedback.className =
            "feedback wrong";


        feedback.innerHTML =
            `
                ❌ Chưa chính xác!

                <br>

                Nhiệm vụ này
                không được cộng điểm.

                Hãy thử lại.
            `;


        const retry =
            document.createElement(
                "button"
            );


        retry.className =
            "retry-button";


        retry.textContent =
            "🔄 THỬ LẠI";


        retry.onclick =
            () => {

                renderGame1();

            };


        feedback.appendChild(
            document.createElement(
                "br"
            )
        );


        feedback.appendChild(
            retry
        );

    }

}


/* =====================================================
   CÂU TIẾP THEO
===================================================== */

function nextQuestion() {

    currentQuestion++;


    if (
        currentQuestion >= 5
    ) {

        finishGame1(
            false
        );

        return;

    }


    questionFirstTry =
        true;


    renderGame1();

}


/* =====================================================
   KẾT THÚC GAME 1
===================================================== */

function finishGame1(
    timeOut
) {

    if (gameTimer) {

        clearInterval(
            gameTimer
        );

        gameTimer =
            null;

    }


    scores[selectedGroup] =
        game1Score;


    groupPlayed[selectedGroup] =
        true;


    /*
       Lưu thời gian nhóm đã dùng.
    */

    groupTimes[selectedGroup] =
        elapsedTime();


    /*
       Game 1 đã được chơi.
    */

    playedGames[1] =
        true;


    updateScores();

    updateGameMap();

    updateHomeLeaderboard();


    document.getElementById(
        "game-area"
    ).innerHTML = `

        <div
            class="
                game-screen
                game-complete
            "
        >


            <div
                class="big-game-icon"
            >

                ${
                    timeOut
                        ? "⏰"
                        : "🎉"
                }

            </div>


            <h1>

                ${
                    timeOut
                        ? "HẾT GIỜ!"
                        : "HOÀN THÀNH!"
                }

            </h1>


            <p
                class="question-text"
            >

                NHÓM
                ${selectedGroup}

            </p>


            <div class="final-score">

                ${game1Score}/5

            </div>


            <p
                class="question-text"
            >

                ⏱️ Thời gian:

                <strong>

                    ${formatTime(
                        groupTimes[
                            selectedGroup
                        ]
                    )}

                </strong>

            </p>


            <div
                class="feedback correct"
            >

                ${getScoreMessage(
                    game1Score
                )}

            </div>


            <button
                class="start-button"
                onclick="showLeaderboard()"
            >

                🏆 XEM BẢNG ĐIỂM

            </button>


            <br>


            <button
                class="back-button"
                onclick="backToMap()"
            >

                ↩ VỀ BẢN ĐỒ

            </button>


        </div>

    `;

}


/* =====================================================
   NHẬN XÉT
===================================================== */

function getScoreMessage(
    score
) {

    if (score === 5) {

        return "🏆 Xuất sắc!";

    }

    if (score === 4) {

        return "🌟 Rất tốt!";

    }

    if (score === 3) {

        return "👍 Khá tốt!";

    }

    if (score === 2) {

        return "💪 Cố gắng thêm nhé!";

    }

    return "📚 Hãy ôn lại kiến thức Bài 13 nhé!";

}


/* =====================================================
   XẾP HẠNG
   1. ĐIỂM CAO HƠN
   2. NẾU BẰNG ĐIỂM → NHANH HƠN
===================================================== */

function getRanking() {

    return [
        1,
        2,
        3,
        4
    ].sort(
        (a, b) => {


            if (
                scores[b] !==
                scores[a]
            ) {

                return (
                    scores[b] -
                    scores[a]
                );

            }


            const timeA =
                groupTimes[a] === null

                    ? Infinity

                    : groupTimes[a];


            const timeB =
                groupTimes[b] === null

                    ? Infinity

                    : groupTimes[b];


            return (
                timeA -
                timeB
            );

        }
    );

}


/* =====================================================
   CÁC DÒNG XẾP HẠNG
===================================================== */

function rankingRows(
    compact = false
) {

    return getRanking()
        .map(
            (group, index) => `

                <div
                    class="
                        ${
                            compact
                                ? "mini-ranking-row"
                                : "ranking-row"
                        }
                    "
                >

                    <span
                        class="ranking-place"
                    >

                        ${index + 1}

                    </span>


                    <span
                        class="ranking-group"
                    >

                        ${
                            [
                                "🟢",
                                "🔵",
                                "🟠",
                                "🟣"
                            ][group - 1]
                        }

                        NHÓM ${group}

                    </span>


                    <span
                        class="ranking-score"
                    >

                        ${scores[group]}/5

                    </span>


                    <span
                        class="ranking-time"
                    >

                        ${formatTime(
                            groupTimes[group]
                        )}

                    </span>


                </div>

            `
        )
        .join("");

}


/* =====================================================
   BẢNG ĐIỂM LỚN
===================================================== */

function showLeaderboard() {

    const result =
        document.getElementById(
            "result-area"
        );


    if (!result) {

        return;

    }


    result.innerHTML = `

        <div
            class="leaderboard-panel"
        >


            <h2>

                🏆 BẢNG XẾP HẠNG

            </h2>


            <div
                class="ranking-head"
            >

                <span>
                    Hạng
                </span>

                <span>
                    Nhóm
                </span>

                <span>
                    Điểm
                </span>

                <span>
                    Thời gian
                </span>

            </div>


            ${rankingRows(false)}


            <p
                class="ranking-note"
            >

                Xếp hạng theo
                <strong>
                    điểm cao hơn
                </strong>.

                Nếu bằng điểm,
                <strong>
                    thời gian ngắn hơn
                </strong>
                xếp trên.

            </p>


        </div>

    `;


    result.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


/* =====================================================
   BẢNG XẾP HẠNG NHỎ Ở TRANG CHÍNH
===================================================== */

function updateHomeLeaderboard() {

    const panel =
        document.getElementById(
            "home-leaderboard"
        );


    if (!panel) {

        return;

    }


    panel.innerHTML = `

        <div
            class="mini-ranking-title"
        >

            🏆 XẾP HẠNG

        </div>


        <div
            class="mini-ranking-head"
        >

            <span>
                Hạng
            </span>

            <span>
                Nhóm
            </span>

            <span>
                Điểm
            </span>

            <span>
                ⏱
            </span>

        </div>


        ${rankingRows(true)}

    `;

}


/* =====================================================
   CẬP NHẬT ĐIỂM
===================================================== */

function updateScores() {

    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const element =
            document.getElementById(
                `score${i}`
            );


        if (element) {

            element.textContent =
                scores[i];

        }

    }

}


/* =====================================================
   CẬP NHẬT BẢN ĐỒ
===================================================== */

function updateGameMap() {

    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const card =
            document.getElementById(
                `game-card-${i}`
            );


        const status =
            document.getElementById(
                `status-${i}`
            );


        if (
            !card ||
            !status
        ) {

            continue;

        }


        if (
            playedGames[i]
        ) {

            card.classList.add(
                "locked"
            );


            status.textContent =
                "ĐÃ CHƠI";

        }

        else {

            card.classList.remove(
                "locked"
            );


            status.textContent =
                "CHƯA CHƠI";

        }

    }

}


/* =====================================================
   VỀ BẢN ĐỒ
===================================================== */

function backToMap() {

    if (gameTimer) {

        clearInterval(
            gameTimer
        );

        gameTimer =
            null;

    }


    closeGroupPopup();


    selectedGame =
        null;


    selectedGroup =
        null;


    currentQuestion =
        0;


    game1Score =
        0;


    questionFirstTry =
        true;


    selectedChoice =
        null;


    selectedDragItem =
        null;


    dragSource =
        null;


    const result =
        document.getElementById(
            "result-area"
        );


    if (result) {

        result.innerHTML =
            "";

    }


    const gameArea =
        document.getElementById(
            "game-area"
        );


    if (gameArea) {

        gameArea.innerHTML = `

            <p>

                👆 Hãy chọn một
                thử thách để bắt đầu!

            </p>

        `;

    }


    showMap();

}


/* =====================================================
   KHỞI TẠO
===================================================== */

updateScores();

updateGameMap();

updateHomeLeaderboard();