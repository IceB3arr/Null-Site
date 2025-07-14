function simulateCall() {
    const input = document.getElementById('phoneNumber').value.trim();
    const callAudio = document.getElementById('callAudio');
    const endCallAudio = document.getElementById('endCallAudio');
    const visualizer = document.getElementById('visualizer');
    const callButton = document.querySelector('button[onclick="simulateCall()"]');

    const allowedNumber = "+49123456789"; // Only this number triggers real call

    // Disable the call button
    callButton.disabled = true;
    callButton.classList.add("disabled");

    if (input === allowedNumber) {
        endCallAudio.pause();
        endCallAudio.currentTime = 0;

        callAudio.currentTime = 0;
        callAudio.play();
        visualizer.style.visibility = 'visible';

        callAudio.onended = () => {
            visualizer.style.visibility = 'hidden';
            callButton.disabled = false;
            callButton.classList.remove("disabled");
        };
    } else {
        callAudio.pause();
        callAudio.currentTime = 0;
        visualizer.style.visibility = 'hidden';

        endCallAudio.currentTime = 0;
        endCallAudio.play();

        endCallAudio.onended = () => {
            callButton.disabled = false;
            callButton.classList.remove("disabled");
        };
    }
}


function denyAccess() {
    document.getElementById("accessOverlay").style.display = "flex";
}

function closeOverlay() {
    document.getElementById("accessOverlay").style.display = "none";
}

function addDigit(char) {
    const input = document.getElementById('phoneNumber');
    input.value += char;
}

function deleteDigit() {
    const input = document.getElementById('phoneNumber');
    input.value = input.value.slice(0, -1);
}

function showSection(tool) {
    const phone = document.getElementById('phoneSection');
    const chat = document.getElementById('chatSection');
    const navLinks = document.querySelectorAll('.nav-link');

    if (tool === 'phone') {
        phone.style.display = 'block';
        chat.style.display = 'none';
    } else if (tool === 'chat') {
        phone.style.display = 'none';
        chat.style.display = 'block';
    }

    // Aktiver Menüpunkt visuell hervorheben
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`.nav-link[onclick="showSection('${tool}')"]`).classList.add('active');
}

const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const PASSWORD = "lemming";  // Beispiel-Passwort, das getriggert wird

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerHTML = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;  // Scroll nach unten
}



function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
  console.log(document.cookie);

}
function messageQueue(messages, startDelay = 500) {
    let totalDelay = startDelay;

    for (const text of messages) {
        messageWithDelay(totalDelay, text);
        totalDelay += 2500 + Math.random() * 1000;
    }

    // Beispiel: Cookie setzen nach allen Nachrichten
    setTimeout(() => {
        setCookie("Ingredient", "chocolate", 5);
    }, totalDelay);
}

let npcState = "lemming"; 

const dialogMap = {
    intro: [
        "Good stuff!",
        "I think you have enough of geography for now...",
        "Let's try website technology next",
        "I have cooked something for you",
        "Try to find the most important ingredient and return it to me."
    ],
    cookie: [
        "Well done, you are doing well.",
        "Maybe we need to increace the difficulty for you?",
        `<a href="assets/video/crazy_video.mkv" download>Click here to download the next riddle</a>`
    ],
    video: [
        "Haha, nice find.",
    ],
    
};

function messageWithDelay(baseTime, text) {
    const delay = baseTime + Math.random() * 1500;
    setTimeout(() => {
        appendMessage(text, 'bot');
    }, delay);
 
}

function sendMessage() {
    const msg = chatInput.value.trim();
    if (msg === "") return;

    appendMessage(msg, 'user');
    chatInput.value = "";

    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes(PASSWORD.toLowerCase()) && npcState === "lemming") {
        messageQueue(dialogMap.intro);
        npcState = "cookie";
        return;
    } else if (lowerMsg.includes("chocolate") || npcState === "cookie") {
        messageQueue(dialogMap.cookie);
        npcState = "video";
        return;
    } else if (lowerMsg.includes("Klaus Otto") || npcState === "video") {
        npcState = "tech";
        messageQueue(dialogMap.cookie);
        return;
    }

    // Standardantwort, wenn nichts passt
    messageWithDelay(500, "Sorry? No, thats not it.");
}


