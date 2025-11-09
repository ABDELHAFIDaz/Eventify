// stats variables
let totalEvents = 0;
let totalSeats = 0;
let totalRevenue = 0;

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
