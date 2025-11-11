// Data storing
let events = [];
let archive = [];

let sections = document.querySelectorAll("section");
let btns = Array.from(document.querySelectorAll("button")); // from node list to an array

// ========== screen switching ==========

function switchScreen(index){
    sections.forEach(section => {
        section.className = "screen";
    })
    btns.forEach(btn => {
        btn.className = "sidebar__btn"
    })
    sections[index].className = "screen is-visible";
    btns[index].className = "sidebar__btn is-active";
}

btns.splice(4,(btns.length - 4)); // i only want the 4 first ones 
// console.log("buttons: ", btns);

for(let i = 0; i < btns.length; i++){
    btns[i].onclick = ((e) => {
        let sectionTitle = document.getElementById("page-title");
        let sectionSubTitle = document.getElementById("page-subtitle");
        switchScreen(i);
        switch(i){
            case 0:
                sectionTitle.innerHTML = "Statistics";
                sectionSubTitle.innerHTML = "Overview of your events";
                renderStats();
                break;
            case 1:
                sectionTitle.innerHTML = "Add event";
                sectionSubTitle.innerHTML = "Add event like you want";
                break;
            case 2:
                sectionTitle.innerHTML = "Events";
                sectionSubTitle.innerHTML = "List of events";
                break;
            case 3:
                sectionTitle.innerHTML = "Archive";
                sectionSubTitle.innerHTML = "List of events you deleted in the past";
                break;
        }
    })
}

// ======= stats ==========

function renderStats(){
    let totalEvents = events.length;
    let totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    let totalRevenue = events.reduce((sum,e) => sum + e.price * e.seats, 0);

    let statEvents = document.getElementById("stat-total-events");
    let statSeats = document.getElementById("stat-total-seats");
    let statPrice = document.getElementById("stat-total-price");
    statEvents.innerHTML = `${totalEvents}`;
    statSeats.innerHTML = `${totalSeats}`;
    statPrice.innerHTML = `$${totalRevenue}`;
}

// ======== add event form =============

function handlFormSubmit(e){
    e.preventDefault();
    
    let isValid = true;
    titleRegex = /[a-zA-Z]{2,20}/;

    // checking title
    if(!(titleRegex.test(document.getElementById('event-title').value.trim()))){
        isValid = false;
        document.getElementById('event-title').classList.add("one-err");
        console.error("the title doesn't respect the regex");
    }
    else{
        console.log("title is correct");
    }

    // to check if all infos are correct
    if(isValid){
        let confirmed = confirm("Are you sure!");
        if(confirmed){
            moveToEvents();
            console.log(confirmed);
            document.getElementById('event-form').reset();
            document.querySelector('#form-errors').className = "alert alert--error is-hidden";
            document.querySelectorAll('.input').forEach(ele => {
            ele.className = "input";
            console.log(events);
            console.log(events.length);
        })
        }
    }
    else{ // if the infos are not valid
        document.querySelector('#form-errors').innerHTML = "Something is wrong!";
        document.querySelector('#form-errors').className = "alert alert--error";
        console.error("you form is undone");
    }
}

document.getElementById('event-form').addEventListener('submit',handlFormSubmit);
console.log("initially: ", events);

// pushing event to the events array

function moveToEvents(){
    events.push({
                title: document.getElementById('event-title').value,
                imageUrl: document.getElementById('event-image').value,
                description: document.getElementById('event-description').value,
                seats: document.getElementById('event-seats').value,
                price: document.getElementById('event-price').value,
            })
}