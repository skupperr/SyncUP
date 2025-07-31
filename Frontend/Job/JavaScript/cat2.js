export function rifat(){
    let category_button = document.getElementsByClassName('category-button');

    for (let i = 0; i < category_button.length; i++) {
        const element = category_button[i];
        element.addEventListener('click', function(){
            document.querySelector('.active')?.classList.remove('active');
            element.classList.add('active');
            
        });
    }; 
}