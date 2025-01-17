let activities = JSON.parse(localStorage.getItem('activities')) || [];

let texts = [
    "Every day is a new opportunity to build the habits that will shape your future.",
    "Streaks may break, but your commitment to change is what truly counts.",
    "Consistency is key; even small steps can lead to big changes over time.",
    "Celebrate every day you stick to your habits; each one is a victory!",
    "Don't focus on perfection; focus on progress, and the streaks will follow.",
    "Your journey to better habits starts today—let's count those streaks!",
    "Remember, it's not about how many days you’ve completed; it’s about the direction you're headed.",
    "Each successful day is a building block for a stronger you—keep stacking them!",
    "A single day of progress is worth more than a perfect week of failure.",
    "Your future self will thank you for the habits you cultivate today."
];

const pageContent = document.getElementById('pageContent');
let currentTextIndex = 0;



        const textParagraph = document.createElement('p');
        textParagraph.className = 'text-paragraph';
        pageContent.appendChild(textParagraph); // A
        function setText() {
            textParagraph.innerHTML = texts[currentTextIndex]; 
        }

        setText();

        
        const interval = setInterval(() => {
            currentTextIndex = (currentTextIndex + 1) % texts.length; 
            setText();
        }, 8000);

const startDateInput = document.getElementById('startDate');
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
startDateInput.max = formattedDate;

function calculateStreak(startDate) {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const messageDiv = document.getElementById('message');
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

const activitiesGrid = document.getElementById('activitiesGrid');

const noActivities = document.getElementById('noActivities');
function updateActivitiesDisplay() {
    if (activities.length === 0) {
        noActivities.style.display = 'block';
        activitiesGrid.style.display = 'none';
    } else {
        noActivities.style.display = 'none';
        activitiesGrid.style.display = 'grid';
        
        activitiesGrid.innerHTML = activities.map((activity, index) => `
            <div class="activity-card">
                <img src="${activity.imageUrl}" alt="${activity.name}" onerror="this.src='/api/placeholder/300/200'">
                <h3>${activity.name}</h3>
                <p>Current Streak: ${calculateStreak(activity.startDate)} days</p>
                <div class="card-actions">
                    <button class="btn view-btn" onclick="viewStreak(${index})">View</button>
                    <button class="btn delete-btn" onclick="deleteActivity(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    localStorage.setItem('activities', JSON.stringify(activities));
}

const streakForm = document.getElementById('streakForm');
streakForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const startDate = document.getElementById('startDate').value;

    const selectedDate = new Date(startDate);
    const currentDate = new Date();
    
    if (selectedDate > currentDate) {
        showMessage('Start date cannot be in the future!', 'error');
        return;
    }

    activities.push({ name, imageUrl, startDate });
    updateActivitiesDisplay();
    showMessage('Activity added successfully!', 'success');
    streakForm.reset();
});


const modal = document.getElementById('modal');
function viewStreak(index) {
    const activity = activities[index];
    const streak = calculateStreak(activity.startDate);
    
    document.getElementById('modalContent').innerHTML = `  
       
        <h2>${activity.name}</h2>
        <p>Start Date: ${new Date(activity.startDate).toLocaleDateString()}</p>
        <p>Current Streak: ${streak} days</p>
    `;
    
    modal.style.display = 'block';
}


function deleteActivity(index) {
    activities.splice(index, 1);
    updateActivitiesDisplay();
    showMessage('Activity deleted successfully!', 'success');
}

const closeBtn = document.querySelector('.close');
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}


updateActivitiesDisplay();
