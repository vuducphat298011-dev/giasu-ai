const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Dán API Key của bạn vào trong cặp dấu ngoặc kép bên dưới
const API_KEY = "https://cdn.jsdelivr.net/npm/marked/marked.min.js"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash :generateContent?key=${API_KEY}`;

async function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user-message');
    userInput.value = '';

    const loadingId = appendMessage("Đang suy nghĩ...", 'ai-message loading');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Bạn là một gia sư AI học tập thông minh và thân thiện. Hãy giúp học sinh giải đáp thắc mắc này một cách dễ hiểu, có ví dụ minh họa: ${text}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, mình chưa hiểu câu hỏi này. Bạn hãy hỏi lại nhé!";

        document.getElementById(loadingId).remove();
        appendMessage(marked.parse(aiReply), 'ai-message');

    } catch (error) {
        document.getElementById(loadingId).remove();
        appendMessage("Đã xảy ra lỗi kết nối, vui lòng thử lại sau.", 'ai-message');
    }
}

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    const messageId = 'msg-' + Date.now();
    messageDiv.id = messageId;
    
    if (className.includes('loading') || className.includes('user-message')) {
        messageDiv.innerText = text;
    } else {
        messageDiv.innerHTML = text;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageId;
}

sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});
