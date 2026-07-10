document.addEventListener('DOMContentLoaded', () => {
    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
        <div class="chat-header">
            <h3>Chat with AI</h3>
            <button class="minimize-btn">−</button>
        </div>
        <div class="chat-messages" id="chatMessages">
            <div class="message bot-message">Hello! How can I help you today?</div>
        </div>
        <div class="chat-input-container">
            <input type="text" id="userInput" placeholder="Type your message...">
            <button id="sendButton">Send</button>
        </div>
    `;
    
    // Add chat toggle button
    const chatToggle = document.createElement('button');
    chatToggle.className = 'chat-toggle';
    chatToggle.innerHTML = '<i class="fas fa-comments"></i>';
    
    document.body.appendChild(chatToggle);
    document.body.appendChild(chatContainer);
    
    // Chat elements
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const minimizeBtn = chatContainer.querySelector('.minimize-btn');
    let isMinimized = false;
    let isChatOpen = false;

    // Toggle chat window
    function toggleChat() {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatContainer.style.display = 'flex';
            userInput.focus();
        } else {
            chatContainer.style.display = 'none';
        }
    }

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message to server
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addMessage(`You: ${message}`, true);
        userInput.value = '';
        
        try {
            const response = await fetch('/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                addMessage(`AI: ${data.response}`, false);
            } else {
                throw new Error(data.error || 'Error processing message');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, there was an error processing your message.', false);
        }
    }

    // Event listeners
    chatToggle.addEventListener('click', toggleChat);
    
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    minimizeBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        const messages = chatContainer.querySelector('.chat-messages');
        const input = chatContainer.querySelector('.chat-input-container');
        
        if (isMinimized) {
            messages.style.display = 'none';
            input.style.display = 'none';
            minimizeBtn.textContent = '+';
            chatContainer.style.height = '40px';
        } else {
            messages.style.display = 'block';
            input.style.display = 'flex';
            minimizeBtn.textContent = '−';
            chatContainer.style.height = '400px';
        }
    });
});