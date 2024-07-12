//For the first visible page
document.getElementById("main").style.display = "none"
const userNameInput = document.getElementById("userNameInput")
const userNameSubmit = document.getElementById("userNameSubmit")
let userName;


//For chat app
const socket = io({autoConnect: false});

const clientsTotal = document.getElementById("clients-total")
const messageContainer = document.getElementById("message-container")
const nameInput = document.getElementById("name-input")
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")

const messageTone = new Audio("msgTone.mp3")

//Taking UserName
userNameSubmit.addEventListener("click", e =>{
    e.preventDefault();
    userName = userNameInput.value
    if(userName === "" || userName === "Name") alert("please give a name")
    else {
        socket.connect();
        document.getElementById("userName").style.display = "none"
        document.getElementById("main").style.display = "block"
        nameInput.value = userName

    } 
})
//Making the user input cleared as soon as i click there
userNameInput.addEventListener("click", e => {
   if(userNameInput.value == "Name") userNameInput.value = "";
   return
})

messageForm.addEventListener("submit", e => {
    e.preventDefault();
    sendMessage();
})

function sendMessage(){
    if(messageInput.value === "") return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        time: new Date()
    }
    socket.emit("message", data);
    addMessageToUI(true, data);
    messageInput.value = "";

}

function addMessageToUI(isOwnMessage, data){
    //clearFeedback();
    const element = `
    <li class="message-${isOwnMessage? "right":"left"}">
        <p class="message">
            ${data.message}
             <span>${data.name} &#x2022; ${moment(data.time).format('llll')}</span>
        </p>
    </li>
    `
    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", e => {
    socket.emit("feedback", {
        feedback: `${nameInput.value} is typing a message...`
    })
})
messageInput.addEventListener("keypress", e => {
    socket.emit("feedback", {
        feedback: `${nameInput.value} is typing a message...`
    })
})
messageInput.addEventListener("blur", e => {
    socket.emit("feedback", {
        feedback: ""
    })
})

function clearFeedback(){
    document.querySelectorAll("li.message-feedback").forEach(el => {
        el.parentNode.removeChild(el);
    })
}

//Socket Function
socket.on("connect", ()=>console.log("Connected to Server"))

socket.on("clients-total", (data) => {
    clientsTotal.innerText = `Online: ${data}`
})
socket.on("chat-message", (data)=>{
    //console.log(data);
    messageTone.play();
    addMessageToUI(false, data);
})
socket.on("feedback", data => {
    clearFeedback();
    const element = `
    <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>
    `
    messageContainer.innerHTML += element;
})

