const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');

let userMessage;

const API_KEY ="YOUR_OpenAPI_KEY";
const inputInitHeight = chatInput.scrollHeight;
const createChatLi =
(message, classname) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", classname);
    let chatContent = classname === "outgoing" ? `<p></p>` : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message;
    return chatLi;
}

const generateResponse = (incomingChat) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChat.querySelector('p');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            message: [{role: "user", content:userMessage}]
        })
    }
    fetch(API_URL, requestOptions).then (response => response.json()).then(data => {

        messageElement.innerText = data.choices[0].message.content;
    }).catch(error => {
        messageElement.classList.add("error")
        messageElement.textContent = "Oops! Something wrong with you API Key or Network. Please check it again.";
        console.log(error);
    }).finally(() => {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    })
}
const handlerChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = inputInitHeight + "px";
    child = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(child);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() => {
        const incomingChat = createChatLi("I'm thinking...", "incoming");
        chatbox.appendChild(incomingChat);
        generateResponse(incomingChat)
    },600);

}
chatInput.addEventListener('input', (e) => {
    chatInput.style.height = inputInitHeight + "px";
    chatInput.style.height = chatInput.scrollHeight + "px";
});
chatInput.addEventListener('keydown', (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth>800) {
        e.preventDefault();
        handlerChat();
    }
});
sendChatBtn.addEventListener('click', handlerChat);
chatbotToggler.addEventListener('click', () => {
    document.body.classList.toggle('show-chatbot');
});
chatbotCloseBtn.addEventListener('click', () => {
    document.body.classList.remove('show-chatbot');
});
