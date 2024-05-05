// index.js

function createButtons() {
    // Get the container where you want to append the divs
    const container = document.getElementById("container");
    const txts = ["Food Pantry","Soup Kitchen", "Education", "Medical Care", "Workforce Training for adults"];
    // Define the number of divs you want to create
    const length = txts.length;

    // Loop to create and append div elements
    for (let i = 0; i < length; i++) {
        // Create a new div element
        const button = document.createElement("button");
        button.className = "search"
        // Set attributes or styles for the div if needed
        button.textContent = `${txts[i]} Near me`;
        button.classList.add("created-div"); // Add a CSS class if needed

        // Append the div to the container
        container.appendChild(button);
    }
}

// Call the function to create divs
createButtons();
