document.addEventListener('DOMContentLoaded', function () {
    const gameContainer = document.getElementById('gameContainer');
    const websiteContent = document.getElementById('websiteContent');
    const dialogueBox = document.getElementById('dialogueBox');
    const dialogueText = document.getElementById('dialogueText');
    const pressKeyText = document.createElement('p');
    pressKeyText.textContent = "Press space bar to continue";
    pressKeyText.style.fontSize = "15px";
    pressKeyText.style.color = "#121212";
    pressKeyText.style.marginTop = "10px";
    dialogueBox.appendChild(pressKeyText);

    const dialogues = {
        home: [
            "Welcome to my childhood home in Palo Alto.",
            "I enjoyed time with my brothers, jumping on the trampoline and spending time in nature.",
            "My family taught me the importance of public service and compassion for others."
        ],
        rowing: [
            "I started rowing sophomore year of high school at Norcal Crew.",
            "Not only did it give me the opportunity to continue rowing and studying at Stanford,",
            "but my passion for it transformed my character, discipline, and ability to be on a team."
        ],
        stanford: [
            "Welcome to Stanford, where my curiosity was met with unlimited opportunity.",
            "My studies in computer science and artificial intelligence propelled me into exciting research and job opportunities.",
            "Exploring solutions to problems in national security, early education, and productivity.",
            "Now, I’m finishing my master's degree in computer science.",
            "Thank you for playing, now feel free to explore my personal website!"
        ]
    };

    let currentDialogue = [];
    let currentIndex = 0;
    let charIndex = 0;
    let typing = false;

    function showDialogue(dialogueKey) {
        currentDialogue = dialogues[dialogueKey];
        currentIndex = 0;
        charIndex = 0;
        dialogueBox.style.display = 'block';
        dialogueText.textContent = '';
        pressKeyText.style.display = 'none';
        typeText();
    }

    function typeText() {
        typing = true;
        if (charIndex < currentDialogue[currentIndex].length) {
            dialogueText.textContent += currentDialogue[currentIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 50); // Adjust typing speed here
        } else {
            typing = false;
            pressKeyText.style.display = 'block';
        }
    }

    function nextDialogue() {
        if (typing) return; // Prevent skipping during typing

        if (charIndex < currentDialogue[currentIndex].length) {
            charIndex = currentDialogue[currentIndex].length; // Skip to end of current text
            dialogueText.textContent = currentDialogue[currentIndex];
            pressKeyText.style.display = 'block';
        } else {
            currentIndex++;
            if (currentIndex < currentDialogue.length) {
                charIndex = 0;
                dialogueText.textContent = '';
                pressKeyText.style.display = 'none';
                typeText();
            } else {
                dialogueBox.style.display = 'none';
            }
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            nextDialogue();
        }
    });

    // Make the showDialogue function available globally
    window.showDialogue = showDialogue;
});
