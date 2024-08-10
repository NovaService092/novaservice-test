let timer; // Holds the timeout timer
let timeLeft = 60; // 1 minute timeout duration
const timeoutScreen = document.getElementById('timeout-screen');
const timeoutTimerText = document.getElementById('timeout-timer');
let isInTimeoutSession = false; // Track if in timeout session

// Function to update the timer
function updateTimer() {
    localStorage.setItem('remainingTime', timeLeft); // Store remaining time in local storage
    if (timeLeft <= 0) {
        clearInterval(timer); // Stop the timer
        timeoutScreen.style.display = 'none'; // Hide the timeout screen
        document.querySelector('.box-container').style.display = 'flex'; // Show app container
        localStorage.removeItem('remainingTime'); // Clear timer on completion
        isInTimeoutSession = false; // Reset session status
        return;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeoutTimerText.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format timer display
    timeLeft--; // Decrease time left by one second
}

// Function to start the timeout
function startTimeout() {
    if (isInTimeoutSession) return; // Prevent starting multiple sessions

    isInTimeoutSession = true; // Set session status
    timeLeft = 60; // Reset to 1 minute
    timeoutScreen.style.display = 'flex'; // Show the timeout screen
    document.querySelector('.box-container').style.display = 'none'; // Hide the app container
    timer = setInterval(updateTimer, 1000); // Start updating the timer every second
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timer); // Clear the interval
}

// Check localStorage for remaining time and manage timeout screen
function checkForTimeout() {
    const remainingTime = localStorage.getItem('remainingTime');
    if (remainingTime) {
        timeLeft = parseInt(remainingTime, 10); // Parse remaining time from local storage
        if (timeLeft > 0) {
            timeoutScreen.style.display = 'flex'; // Show the timeout screen
            document.querySelector('.box-container').style.display = 'none'; // Hide app container
            timer = setInterval(updateTimer, 1000); // Start timer with remaining time
            timeoutTimerText.innerText = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
        }
    }
}

// Pause/Resume the timer based on tab visibility
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && isInTimeoutSession) {
        stopTimer(); // Stop the timer if the tab is hidden
    } else if (document.visibilityState === 'visible' && isInTimeoutSession) {
        // Resume the timer if there's remaining time
        timeLeft = parseInt(localStorage.getItem('remainingTime'), 10) || 60; // Get remaining time or default to 60
        timer = setInterval(updateTimer, 1000); // Resume updating the timer every second
    }
});

// Event listener for keypress to trigger timeout session
document.addEventListener('keydown', function (event) {
    // Check if ctrl + shift + I or F12 is pressed
    if ((event.ctrlKey && event.shiftKey && event.key === 'I') || event.key === 'F12') {
        event.preventDefault(); // Prevent default action
        startTimeout(); // Start timeout session
    }
});

// Refresh handling to prevent loss of progress during timeout session
window.addEventListener('beforeunload', function (event) {
    if (isInTimeoutSession) {
        event.preventDefault(); // Prevent the refresh if in timeout session
        event.returnValue = ''; // Show confirmation dialog for refresh
    }
});

// Check for timeout on page load
window.onload = function() {
    checkForTimeout(); // Initialize timeout check
};

// Function to show the context menu
function showContextMenu(event) {
    event.preventDefault(); // Prevent default context menu
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.classList.add('show');
    contextMenu.style.display = 'block'; // Show the context menu
}

// Function to hide the context menu
function hideContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    contextMenu.classList.remove('show');
    contextMenu.style.display = 'none';
}


// Event listener for the Close button
document.getElementById('close-menu').addEventListener('click', hideContextMenu);

// Add event listener for context menu opening
document.addEventListener('contextmenu', showContextMenu);
document.addEventListener('click', hideContextMenu); // Hide menu on clicking elsewhere

// Add event listener for context menu opening
document.addEventListener('contextmenu', showContextMenu);
document.addEventListener('click', hideContextMenu); // Hide menu on clicking anywhere
// Event listener for right-click to show the custom context menu
document.addEventListener('contextmenu', showContextMenu);
document.getElementById('close-menu').addEventListener('click', hideContextMenu);
document.addEventListener('click', hideContextMenu);

document.getElementById('show-register').onclick = function() {
    document.querySelector('.login-screen').style.display = 'none';
    document.querySelector('.create-account-screen').style.display = 'block';
};

document.getElementById('back-to-login').onclick = function() {
    document.querySelector('.create-account-screen').style.display = 'none';
    document.querySelector('.login-screen').style.display = 'block';
};

// Handle the apply button to check age
document.getElementById('apply-create').onclick = function() {
    const dobInput = document.getElementById('date-of-birth').value;

    // Create Date object from the input
    const dob = new Date(dobInput);
    
    // Check if the date is valid
    if (isNaN(dob)) {
        alert('Please enter a valid date in MM/DD/YYYY format.');
        return;
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    // Adjust age calculation for birthday
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    // Check age requirement
    if (age < 13) {
        document.getElementById('age-error').style.display = 'block';
    } else {
        document.getElementById('age-error').style.display = 'none';
        document.querySelector('.create-account-screen').style.display = 'none';
        document.querySelector('.username-screen').style.display = 'block';
    }
};

// Handle the continue button for username screen
document.getElementById('continue').onclick = function() {
    const username = document.getElementById('username').value;

    // Username validation (example: no banned words)
    const bannedWords = ['Nigger', 'badword2']; // Add your banned words
    const isValidUsername = username.length <= 20 && !bannedWords.some(word => username.includes(word));

    if (!isValidUsername) {
        alert("Invalid username. Ensure it's less than 20 characters and not banned.");
        return;
    }

    document.querySelector('.username-screen').style.display = 'none';
    document.querySelector('.terms-screen').style.display = 'block';
};

// Handle finish button on terms screen
document.getElementById('finish').onclick = function() {
    const isChecked = document.getElementById('terms-checkbox').checked;
    if (!isChecked) {
        alert("You must agree to the Terms and Conditions.");
        return;
    }
    
    // Proceed with account creation logic here
    alert("Account created successfully!");
    // Optionally, redirect or clear the form
};
document.getElementById('continue').onclick = function() {
    const username = document.getElementById('username').value;

    // Validate username logic here...

    document.querySelector('.username-screen').style.display = 'none';
    document.querySelector('.password-screen').style.display = 'block'; // Show password screen
};

document.getElementById('finish-password').onclick = function() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate passwords
    if (password !== confirmPassword) {
        document.getElementById('password-error').style.display = 'block'; // Show error if passwords do not match
        return;
    }

    // Proceed to the terms screen
    document.querySelector('.password-screen').style.display = 'none';
    document.querySelector('.terms-screen').style.display = 'block';
};

document.getElementById('back-to-username').onclick = function() {
    document.querySelector('.password-screen').style.display = 'none';
    document.querySelector('.username-screen').style.display = 'block'; // Go back to username screen
};

document.getElementById('back-to-password').onclick = function() {
    document.querySelector('.terms-screen').style.display ='none';
    document.querySelector('.password-screen').style.display = 'block'; // go back to psswrod screen 
};
// Event listener for the Back button in the username screen
document.getElementById('back-to-create-account').onclick = function() {
    document.querySelector('.username-screen').style.display = 'none'; // Hide username screen
    document.querySelector('.create-account-screen').style.display = 'block'; // Show create account screen
};
// Add event listener for scrolling on terms text
const termsText = document.getElementById('terms-text');
const termsCheckbox = document.getElementById('terms-checkbox');

termsText.addEventListener('scroll', () => {
    // Check if the user has scrolled to the bottom
    const isAtBottom = termsText.scrollHeight - termsText.scrollTop === termsText.clientHeight;
    // Enable checkbox if at bottom, disable if not
    termsCheckbox.disabled = !isAtBottom;
});
document.addEventListener('click', function (event) {
    const ripple = document.createElement('span');
    const size = 10; // Set the size of the ripple (approximately the size of a cursor)
    const x = event.clientX - size / 2; // Calculate x position
    const y = event.clientY - size / 2; // Calculate y position
    const z = event.clientZ - size / 2; // Calculate z position

    ripple.style.width = ripple.style.height = `${size}px`; // Set the size
    ripple.style.left = `${x}px`; // Set the left position
    ripple.style.top = `${y}px`; // Set the top position
    ripple.classList.add('ripple');
    
    document.body.appendChild(ripple); // Append the ripple to body

    // Remove the ripple after the animation ends
    ripple.addEventListener('animationend', function () {
        ripple.remove();
    });
});
let weatherInterval;
let currentWeather = "snow"; // Start with snow as the weather
const timeDisplay = document.getElementById('timeDisplay');

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Format hours
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Format minutes
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Format seconds

    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`; // Update time display
}

function createWeather() {
    const weatherCount = 10; // Number of snowflakes or raindrops per interval
    const weatherContainer = document.body;

    for (let i = 0; i < weatherCount; i++) {
        const weatherDrop = document.createElement('div');
        weatherDrop.classList.add('weather-drop');

        // Randomize the position where each drop starts
        weatherDrop.style.left = Math.random() * 100 + 'vw'; // Full width of the viewport
        weatherDrop.style.top = Math.random() * -100 + 'px'; // Start above the viewport
        weatherDrop.style.animationDuration = Math.random() * 3 + 2 + 's'; // Random fall duration

        // Apply the class based on the current weather
        if (currentWeather === "") {
            weatherDrop.classList.add('snow');
        } else {
            weatherDrop.classList.add('rain');
        }

        weatherContainer.appendChild(weatherDrop);

        // Remove the drop after the animation ends
        weatherDrop.addEventListener('animationend', function () {
            weatherDrop.remove();
        });
    }
}

function startWeather() {
    weatherInterval = setInterval(createWeather, 150);
}

function stopWeather() {
    clearInterval(weatherInterval);
}

function toggleWeather() {
    stopWeather();
    currentWeather = (currentWeather === "rain") ? "rain" : "snow"; // Toggle weather
    startWeather();
}

// Update time every second
setInterval(updateTime, 1000);

// Start the weather and time tracking after a short delay
setTimeout(() => {
    startWeather();
    
    // Toggle weather every 10 seconds
    setInterval(toggleWeather, 10000); // Change weather every 10 seconds
}, 3000); // Wait 3 seconds before starting the weather effect


