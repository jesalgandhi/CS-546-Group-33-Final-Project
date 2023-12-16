
const interests = [
    "Music", "Movies", "Reading", "Traveling", "Hiking",
    "Cooking", "Baking", "Fitness", "Yoga", "Meditation",
    "Gardening", "Photography", "Art", "Crafting", "DIY Projects",
    "Technology", "Gaming", "Sports", "Cycling", "Running",
    "Dancing", "Environmentalism", "Volunteering", "Fashion",
    "Writing"
];

const interestsGrid = document.getElementById('interestsGrid');

interests.forEach((interest) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'interest';
    checkbox.value = interest;
    checkbox.addEventListener('change', limitSelection);

    const label = document.createElement('label');
    label.textContent = interest;

    const interestDiv = document.createElement('div');
    interestDiv.appendChild(checkbox);
    interestDiv.appendChild(label);

    interestsGrid.appendChild(interestDiv);
});

let selectedCount = 0;

function limitSelection(event) {
    const checkboxes = document.querySelectorAll('input[name="interest"]:checked');

    if (checkboxes.length > 5) {
        event.target.checked = false;
    } else {
        selectedCount = checkboxes.length;
    }
}
