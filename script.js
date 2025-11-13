// Data storing
let events = [];
let archive = [];

let ID = 1;
// =========== 10 events for testing ==================
for (let i = 0; i < 10; i++) {
    events.push({
        id: ID++,
        title: `Event ${i + 1}`,
        imageUrl: `https://example.png`,
        description: `this is the description of event ${i + 1}`,
        seats: i * i + 1,
        price: i * 10 + 1,
        variants: []
    })
    displayEvents(events[i]);
}
renderStats();
// ===================================================

let sections = document.querySelectorAll("section");
let btns = Array.from(document.querySelectorAll("button")); // from node list to an array

// ========== screen switching ==========

function switchScreen(index) {
    sections.forEach(section => {
        section.className = "screen";
    })
    btns.forEach(btn => {
        btn.className = "sidebar__btn"
    })
    sections[index].className = "screen is-visible";
    btns[index].className = "sidebar__btn is-active";
}

btns.splice(4, (btns.length - 4)); // i only want the 4 first ones 
// console.log("buttons: ", btns);

for (let i = 0; i < btns.length; i++) {
    btns[i].onclick = ((e) => {
        let sectionTitle = document.getElementById("page-title");
        let sectionSubTitle = document.getElementById("page-subtitle");
        switchScreen(i);
        switch (i) {
            case 0: // stats
                sectionTitle.innerHTML = "Statistics";
                sectionSubTitle.innerHTML = "Overview of your events";
                renderStats();
                break;
            case 1: // add event
                sectionTitle.innerHTML = "Add event";
                sectionSubTitle.innerHTML = "Add event like you want";
                break;
            case 2: // event list
                sectionTitle.innerHTML = "Events";
                sectionSubTitle.innerHTML = "List of events";
                deleteEvent();
                detailsEvent();
                editEvent();
                break;
            case 3: // archive
                sectionTitle.innerHTML = "Archive";
                sectionSubTitle.innerHTML = "List of events you deleted in the past";
                break;
        }
    })
}

// ======= stats ==========

function renderStats() {
    let totalEvents = events.length;
    let totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    let totalRevenue = events.reduce((sum, e) => sum + e.price * e.seats, 0);

    let statEvents = document.getElementById("stat-total-events");
    let statSeats = document.getElementById("stat-total-seats");
    let statPrice = document.getElementById("stat-total-price");
    statEvents.innerHTML = `${totalEvents}`;
    statSeats.innerHTML = `${totalSeats}`;
    statPrice.innerHTML = `$${totalRevenue}`;
}

// ======== add event form =============

function handlFormSubmit(e) {
    e.preventDefault();
    let isValid = true;

    // regex's
    let titleRegex = /^[a-zA-Z]{2,20}[0-9]*/;
    let urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|photos|bmp|webp|svg)$/i;

    // checking title
    if (!(titleRegex.test(document.getElementById('event-title').value.trim()))) {
        isValid = false;
        document.getElementById('event-title').classList.add("one-err");
        console.error("the title doesn't respect the regex");
    }
    else
        document.getElementById('event-title').classList.remove("one-err");

    // to check the image url
    if (!(urlRegex.test(document.getElementById('event-image').value.trim()))) {
        isValid = false;
        document.getElementById('event-image').classList.add("one-err");
        console.error("the image url doesn't respect the regex");
    }
    else
        document.getElementById('event-image').classList.remove("one-err");

    // to check the variants name
    let variantsNames = document.querySelectorAll(".variant-row__name");

    variantsNames.forEach(ele => {
        if (!titleRegex.test(ele.value.trim())) {
            isValid = false;
            ele.classList.add("one-err");
        }
        else
            ele.classList.remove("one-err");
    })

    console.log("is valid or not: ", isValid);

    // to check if all infos are correct
    if (isValid) {
        document.querySelector('#form-errors').className = "alert alert--error is-hidden"; // to remove the error message
        let confirmed = confirm("Are you sure!");
        if (confirmed) {
            moveToEvents(); // store the event in the events array
            document.getElementById('event-form').reset(); // resets the form
            maxVariant = 0;
            document.getElementById('variants-list').innerHTML = ''; // to remove old variants
        }
    }
    else { // if the infos are not valid
        document.querySelector('#form-errors').innerHTML = "Something is wrong!";
        document.querySelector('#form-errors').className = "alert alert--error";
        console.error("you form is undone");
    }
}

// Clearing everything in the form
document.getElementById("clear-btn").onclick = function (e) {
    e.preventDefault();
    maxVariant = 0;
    document.getElementById('variants-list').innerHTML = ''; // to remove old variants
    document.querySelector('#form-errors').className = "alert alert--error is-hidden"; // to remove the error message
    document.getElementById('event-form').reset();
    document.getElementById('event-title').classList.remove("one-err");
    document.getElementById('event-image').classList.remove("one-err");
    document.querySelectorAll(".variant-row__name").forEach(ele => ele.classList.remove("one-err"));
}

document.getElementById('event-form').addEventListener('submit', handlFormSubmit);

// for adding variants
let maxVariant = 0;
document.getElementById("btn-add-variant").addEventListener('click', (e) => {
    e.preventDefault();
    if (maxVariant < 3) { // to limit the user at 3 price variants
        document.getElementById('variants-list').innerHTML += `
            <div class="variant-row">
                                                <input type="text" class="input variant-row__name" placeholder="Variant name (e.g., 'Early Bird')" required/>
                                                <input type="number" class="input variant-row__qty" placeholder="Qty" min="1" required/>
                                                <input type="number" class="input variant-row__value" placeholder="Value" step="0.01" required/>
                                                <select class="select variant-row__type">
                                                    <option value="fixed">Fixed Price</option>
                                                    <option value="percentage">Percentage Off</option>
                                                </select>
                                                <button type="button" class="btn btn--danger btn--small variant-row__remove" onclick="removeVariant(this)">Remove</button>
                                            </div>`;
        maxVariant++;
    };
})

// removing the variants
function removeVariant(target) {
    // target.closest(".variant-row").outerHTML = '';
    target.parentElement.outerHTML = '';
    console.log(target.parentElement);
    maxVariant--;
}

// pushing event to the events array
function moveToEvents() {
    events.push({
        id: ID++,
        title: document.getElementById('event-title').value,
        imageUrl: document.getElementById('event-image').value,
        description: document.getElementById('event-description').value,
        seats: document.getElementById('event-seats').value,
        price: document.getElementById('event-price').value,
        variants: []
    })
    // adding the variants in the events array
    for (let i = 0; i < maxVariant; i++) {
        events[events.length - 1].variants.push({
            id: i + 1,
            name: document.querySelectorAll(".variant-row__name")[i].value,
            qty: document.querySelectorAll(".variant-row__qty")[i].value,
            value: document.querySelectorAll(".variant-row__value")[i].value
        })
    }
    // each time we add an event, the event displays in the event list
    displayEvents(events[events.length - 1]);
}

// =========== events list ==========

function displayEvents(event) {
    document.querySelector(".table__body").innerHTML += `
        <tr class="table__row events-h-list" data-event-id="1">
                                    <td>${event.id}</td>
                                    <td>${event.title}</td>
                                    <td>${event.seats}</td>
                                    <td>$${event.price}</td>
                                    <td><span class="badge">${event.variants.length}</span></td>
                                    <td>
                                        <button class="btn btn--small" data-action="details" data-event-id="1">Details</button>
                                        <button class="btn btn--small" data-action="edit" data-event-id="1">Edit</button>
                                        <button class="btn btn--danger btn--small" data-action="archive" data-event-id="1">Delete</button>
                                    </td>
                                </tr>`
}

// ================ Delelte events ===================

function deleteEvent() {
    document.querySelectorAll(".events-h-list").forEach(e => {
        let deleteBtn = e.lastElementChild.lastElementChild;
        deleteBtn.addEventListener('click', () => {
            let idToDelete = e.firstElementChild.innerHTML;
            console.log(idToDelete);
            for (let i = 0; i < events.length; i++) {
                if (idToDelete == events[i].id)
                    archive.push(events.splice(i, 1));
            }
            e.outerHTML = "";
        })
    })
}

// ================== details =======================

function detailsEvent() {
    document.querySelectorAll(".events-h-list").forEach(e => {
        let detailBtn = e.lastElementChild.firstElementChild;
        detailBtn.addEventListener('click', () => {
            let idToFind = e.firstElementChild.innerHTML;
            console.log(idToFind);
            for (let i = 0; i < events.length; i++) {
                if (idToFind == events[i].id) {
                    document.getElementById("event-modal").classList.remove("is-hidden");
                    document.getElementById("modal-body").innerHTML = `
                                    <h3>Title:  ${events[i].title}</h3>
                                    <br>
                                    <p>Id:  ${events[i].id}</p>
                                    <br>
                                    <p style="display: inline-block;">Image:   </p>
                                    <img src="${events[i].imageUrl}" alt="event image" name="event image">
                                    <br>
                                    <br>
                                    <p>Description:  ${events[i].description}</p>
                                    <br>
                                    <p>Seats:   ${events[i].seats}</p>
                                    <br>
                                    <p>Price:   $${events[i].price}</p>
                                    <br>
                                    <p>Variants:    ${events[i].variants.length}</p>`;
                    document.querySelector(".modal__close").addEventListener('click', () => document.getElementById("event-modal").classList.add("is-hidden"));
                }
            }
        })
    })
}

// ================ Edit event ===================

function editEvent() {
    document.querySelectorAll(".events-h-list").forEach(e => {
        let editBtn = e.lastElementChild.children[1];
        editBtn.addEventListener('click', () => {
            let idToFind = e.firstElementChild.innerHTML;
            console.log(idToFind);
            for (let i = 0; i < events.length; i++) {
                if (idToFind == events[i].id) {
                    document.getElementById("form--2").classList.remove("is-hidden");
                    document.getElementById("form--2").innerHTML = `
                    <h2>Edit</h2>
                    <form id="edit-form" class="modall">
                            <!-- Error messages area -->
                            <div class="alert alert--error is-hidden" id="form-errors2"></div>

                            <!-- Title -->
                            <div class="form__group">
                                <label class="form__label" for="event-title">Event Title</label>
                                <input 
                                    type="text" 
                                    id="event-title2" 
                                    class="input"
                                    value="${events[i].title}" 
                                    required
                                >
                            </div>

                            <!-- Image URL -->
                            <div class="form__group">
                                <label class="form__label" for="event-image">Image URL</label>
                                <input 
                                    type="url" 
                                    id="event-image2" 
                                    class="input" 
                                    value="${events[i].imageUrl}"
                                >
                            </div>

                            <!-- Description -->
                            <div class="form__group">
                                <label class="form__label" for="event-description">Description</label>
                                <textarea 
                                    id="event-description2" 
                                    class="input" 
                                    value="${events[i].description}"
                                    rows="4"
                                ></textarea>
                            </div>

                            <!-- Seats -->
                            <div class="form__group">
                                <label class="form__label" for="event-seats">Number of Seats</label>
                                <input 
                                    type="number" 
                                    id="event-seats2" 
                                    class="input" 
                                    value="${events[i].seats}"
                                    min="1"
                                    required
                                >
                            </div>

                            <!-- Base Price -->
                            <div class="form__group">
                                <label class="form__label" for="event-price">Base Price ($)</label>
                                <input 
                                    type="number" 
                                    id="event-price2" 
                                    class="input" 
                                    value="${events[i].price}"
                                    min="0"
                                    step="0.01"
                                    required
                                >
                            </div>
                            <div class="form__actions" style="display: flex;justify-content: center">
                                <button type="submit" class="btn btn--primary">Save</button>
                                <button type="reset" class="btn btn--ghost" id="close-btn">Close</button>
                            </div>
                        </form>`;
                    document.getElementById("edit-form").addEventListener('submit', (e) => {
                        e.preventDefault();
                        let isValid = true;

                        // regex's
                        let titleRegex = /^[a-zA-Z]{2,20}[0-9]*/;
                        let urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|photos|bmp|webp|svg)$/i;

                        // checking title
                        if (!(titleRegex.test(document.getElementById('event-title2').value.trim()))) {
                            isValid = false;
                            document.getElementById('event-title2').classList.add("one-err");
                            console.error("the title doesn't respect the regex");
                        }
                        else
                            document.getElementById('event-title2').classList.remove("one-err");

                        // to check the image url
                        if (!(urlRegex.test(document.getElementById('event-image2').value.trim()))) {
                            isValid = false;
                            document.getElementById('event-image2').classList.add("one-err");
                            console.error("the image url doesn't respect the regex");
                        }
                        else
                            document.getElementById('event-image2').classList.remove("one-err");

                        // to check if all infos are correct
                        if (isValid) {
                            // document.querySelector('#form-errors2').className = "alert alert--error is-hidden"; // to remove the error message
                            // let confirmed = confirm("Are you sure!");
                            if (1) {
                                e.preventDefault();
                                document.getElementById("form--2").classList.add("is-hidden");
                                // ============================================================== update old information
                                events[i].title = document.getElementById('event-title2').value;
                                events[i].imageUrl = document.getElementById('event-image2').value;
                                events[i].description = document.getElementById('event-description2').value;
                                events[i].seats = document.getElementById('event-seats2').value;
                                events[i].price = document.getElementById('event-price2').value;
                                console.log(events);
                                document.querySelector(".table__body").innerHTML = "";
                                events.forEach(evnt => displayEvents(evnt));
                                editEvent();
                                deleteEvent();
                                detailsEvent();
                                // ===================================================================
                            }
                        }
                        else { // if the infos are not valid
                            console.error("you edit form is undone");
                        }
                    })
                    document.getElementById("close-btn").onclick = () => {
                        document.getElementById("form--2").classList.add("is-hidden");
                    }
                }
            }
            console.log("end of the edit function");
        })
    })
}