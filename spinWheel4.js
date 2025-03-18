const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const prizeList = document.getElementById("prizeList");
const countdownElem = document.getElementById("countdown");

let spinIndex = 0;

const spinTimes = [
    "15:30:00", "16:10:00", "17:00:00", "18:00:00", "19:00:00"
];

const spins = [
    { category: "🤸🏼 Activity", options: ["Bowling", "Go-carting", "Any other if you want"] },
    { category: "👚 Tops", options: ["One more Top", "Two more Top", "None of both"] },
    { category: "📿 Jewelry", options: ["Anklet", "Necklace", "Any you want(Silver)"] },
    { category: "👖 Outfit", options: ["Pant", "Nothing", "Shop from Zudio (Pant)"] },
    { category: "🛍️ Shopping", options: ["Night Wear", "Bra", "Lower inner"] }
];

function drawWheel(options) {
    const numSlices = options.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const colors = ["#FF5733", "#FFC300", "#DAF7A6"];

    for (let i = 0; i < numSlices; i++) {
        ctx.beginPath();
        ctx.moveTo(175, 175);
        ctx.arc(175, 175, 175, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText(options[i], 130 + Math.cos(i * sliceAngle + sliceAngle / 2) * 100, 
                     160 + Math.sin(i * sliceAngle + sliceAngle / 2) * 100);
    }
}

function updateCountdown() {
    let now = new Date();
    let nextSpinTime = spinTimes[spinIndex];

    let [h, m, s] = nextSpinTime.split(":");
    let targetTime = new Date();
    targetTime.setHours(h, m, s, 0);

    let timeDiff = targetTime - now;
    spinButton.style.display = "none";

    if (timeDiff <= 0) {
        spinButton.disabled = false;
        spinButton.style.display = "block";
        spinButton.innerText = "🎰 Spin Now!";
        return;
    }

    let hours = Math.floor(timeDiff / 3600000); // Convert milliseconds to hours
    let minutes = Math.floor((timeDiff % 3600000) / 60000); // Get remaining minutes
    let seconds = Math.floor((timeDiff % 60000) / 1000); // Get remaining seconds
    
    countdownElem.innerText = 
        `${hours < 10 ? "0" : ""}${hours}:` + 
        `${minutes < 10 ? "0" : ""}${minutes}:` + 
        `${seconds < 10 ? "0" : ""}${seconds}`;
    setTimeout(updateCountdown, 1000);
}

function startCountdown() {
    let countdown = 10;
    countdownElem.innerText = countdown;
    spinButton.style.display = "none";

    const timer = setInterval(() => {
        countdown--;
        countdownElem.innerText = countdown;
        if (countdown <= 0) {
            clearInterval(timer);
            spinButton.style.display = "block";
        }
    }, 1000);
}

function startSpin() {
    if (spinIndex >= spins.length) {
        alert("All spins completed! 🎉");
        return;
    }

    const spin = spins[spinIndex];
    drawWheel(spin.options);

    let rotation = 0;
    const spinSpeed = 6;
    const stopAngle = Math.random() * 360;

    function animateSpin() {
        rotation += spinSpeed;
        if (rotation >= 720 + stopAngle) {
            rotation = stopAngle;
            selectPrize();
        } else {
            requestAnimationFrame(animateSpin);
        }
        canvas.style.transform = `rotate(${rotation}deg)`;
    }

    function selectPrize() {
        const winningIndex = Math.floor((stopAngle / 360) * spin.options.length);
        const winningPrize = spin.options[winningIndex];

        const listItem = document.createElement("li");
        listItem.classList.add("winner");
        listItem.innerText = `${spin.category}: ${winningPrize}`;
        prizeList.appendChild(listItem);

        spinIndex++;
        updateCountdown();
    }

    animateSpin();
}

// Initial Draw
drawWheel(spins[spinIndex].options);
updateCountdown();
