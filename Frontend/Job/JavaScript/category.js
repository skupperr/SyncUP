
const sort_by = document.getElementById('sort-by');
const caret = document.getElementById('caret-id');

number = 0;
sort_by.addEventListener('click', function(){
    const x = document.getElementById('menu');
    
    if (number == 0) {
        x.style.display = 'block';
        caret.classList.remove('fa-caret-down');
        caret.classList.add('fa-caret-up');
        number = 1;
    }
    else{
        x.style.display = 'none';
        caret.classList.remove('fa-caret-up');
        caret.classList.add('fa-caret-down');
        number = 0;
    }
});

const def = document.getElementById('default');
const low_to_high = document.getElementById('low-to-high');
const high_to_low = document.getElementById('high-to-low');

let title = document.getElementById('title');
def.addEventListener('click', function(){
    const x = document.getElementById('menu');
    title.innerText = 'Default';
    x.style.display = 'none';

    caret.classList.remove('fa-caret-up');
    caret.classList.add('fa-caret-down');
    number = 0;
})

title = document.getElementById('title');
low_to_high.addEventListener('click', function(){
    const x = document.getElementById('menu');
    title.innerText = 'Low > High';
    x.style.display = 'none';

    caret.classList.remove('fa-caret-up');
    caret.classList.add('fa-caret-down');
    number = 0;
})

title = document.getElementById('title');
high_to_low.addEventListener('click', function(){
    const x = document.getElementById('menu');
    title.innerText = 'High > Low';
    x.style.display = 'none';

    caret.classList.remove('fa-caret-up');
    caret.classList.add('fa-caret-down');
    number = 0;
})


let category_button = document.getElementsByClassName('category-button');

for (let i = 0; i < category_button.length; i++) {
    const element = category_button[i];
    element.addEventListener('click', function(){
        document.querySelector('.active')?.classList.remove('active');
        element.classList.add('active');
        
    });
}; 

function coloring_black(){
    let icon_class = document.getElementsByClassName('category-icon-class');
    for (let i = 0; i < icon_class.length; i++) {
        const element = icon_class[i];
        element.style.color = 'black';
    }
}

// category
let vehicle = document.getElementById('nav-button-1');
vehicle.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-1-icon');
    x.style.color = 'white';
    
    x.classList.add('rifat');
})

let clothings = document.getElementById('nav-button-2');
clothings.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-2-icon');
    x.style.color = 'white';
})

let electronics = document.getElementById('nav-button-3');
electronics.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-3-icon');
    x.style.color = 'white';
})

let school_supplies = document.getElementById('nav-button-4');
school_supplies.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-4-icon');
    x.style.color = 'white';
})

let office_supplies = document.getElementById('nav-button-5');
office_supplies.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-5-icon');
    x.style.color = 'white';
})

let medical_supplies = document.getElementById('nav-button-6');
medical_supplies.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-6-icon');
    x.style.color = 'white';
})

let home_kitchen_items = document.getElementById('nav-button-7');
home_kitchen_items.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-7-icon');
    x.style.color = 'white';
})

let toy = document.getElementById('nav-button-8');
toy.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-8-icon');
    x.style.color = 'white';
})

let book = document.getElementById('nav-button-9');
book.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-9-icon');
    x.style.color = 'white';
})

let travel = document.getElementById('nav-button-10');
travel.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-10-icon');
    x.style.color = 'white';
})

let tools = document.getElementById('nav-button-11');
tools.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-11-icon');
    x.style.color = 'white';
})

let other = document.getElementById('nav-button-12');
other.addEventListener('click', function(){
    coloring_black();
    let x = document.getElementById('category-12-icon');
    x.style.color = 'white';
})