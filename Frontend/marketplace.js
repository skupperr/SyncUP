// Extract category slug from URL
let slug = window.location.pathname.split('/').pop();



// Get the current category slug from the URL
let currentSlug = window.location.pathname.split('/').pop().toLowerCase();

if (slug === "") {
    slug = "all"
    currentSlug = "marketplace"
}

// Get all category links
const categoryLinks = document.querySelectorAll('.category-item');

categoryLinks.forEach(link => {
    const href = link.getAttribute('href');


    if (!href) return; // skip if no href set

    // Extract slug from href, make lowercase for case-insensitive comparison
    let linkSlug = href.split('/').pop().toLowerCase();

    if (linkSlug === currentSlug) {
        // Highlight the active category
        link.classList.add('bg-[#e5dcdc]', 'font-bold');
    }

});

// Extract slug and format it nicely
let formattedCategoryName = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word

// Set it as the heading
document.getElementById('category-heading').textContent = formattedCategoryName;


var img = "https://lh3.googleusercontent.com/aida-public/AB6AXuAxE9N-lggCp4uuZXKc6poVuCMvmIJUApbWQtSVysoQG98Wvu9R27-x_3YGj-jx82Mu5vAUdU_VId79yk5ImFk-jcCyPN0ImHQSuQRJ6_XcqQ59Y2tPg5HCAnue76zqMnWqJgCEE63psaL-H-CQY9GB0lHz_QVzPsU5VcNW6XpzfDXcHbieImcCC1WT-7t50-gDJi_Tgm2zNJu4J9YYRXkO5ng3eEGtxuZ6Y0KiYhIupkCXTL_UoJolPshO803feaudq7sZ0KgWYcXe"

fetch(`http://localhost:5000/api/${slug}`)
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('item-grid');
        container.innerHTML = '';

        if (!data.items || data.items.length === 0) {
            container.innerHTML = '<p class="col-span-full text-gray-500">No items found.</p>';
        } else {
            data.items.forEach(async item => {

                var response2 = await fetch('http://localhost:5000/getItemFile/' + item.item_ID);
                var data2 = await response2.json();

                container.innerHTML += `
                <a href="/Marketplace/product_description.html?id=${item.item_ID}" class="flex flex-col gap-3 pb-3 no-underline text-inherit">
                <div class="w-full bg-center bg-no-repeat aspect-square bg-contain rounded-xl"
                    style='background-image: url("${data2.data[0].file_url || img}");'>
                </div>
                <div>
                    <p class="text-[#191011] text-base font-medium leading-normal">${item.Title}</p>
                    <p class="text-[#8b5b5d] text-sm font-normal leading-normal">${item.Price}</p>
                </div>
                </a>
                `;
            });
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById('item-grid').innerHTML = '<p class="text-red-500">Failed to load items.</p>';
    });

// Marketplace search

const searchInput = document.getElementById("marketplace-search");

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission if inside a form
        const query = searchInput.value.trim();
        if (query !== "") {
            handleSearch(query);
        }
    }
});

function handleSearch(query) {

    const container = document.getElementById('item-grid');
    container.innerHTML = '<p class="text-gray-500">Searching...</p>';

    fetch(`http://localhost:5000/searching_product?text=${encodeURIComponent(query)}&category=${slug}`)
        .then(res => res.json())
        .then(async data => {
            container.innerHTML = '';

            if (!data.items || data.items.length === 0) {
                container.innerHTML = '<p class="col-span-full text-gray-500">No items found.</p>';
            } else {
                for (const item of data.items) {
                    const response2 = await fetch('http://localhost:5000/getItemFile/' + item.item_ID);
                    const data2 = await response2.json();

                    container.innerHTML += `
                    <a href="/Marketplace/product_description.html?id=${item.item_ID}" class="flex flex-col gap-3 pb-3 no-underline text-inherit">
                        <div class="w-full bg-center bg-no-repeat aspect-square bg-contain rounded-xl"
                            style='background-image: url("${data2.data[0].file_url || img}");'>
                        </div>
                        <div>
                            <p class="text-[#191011] text-base font-medium leading-normal">${item.Title}</p>
                            <p class="text-[#8b5b5d] text-sm font-normal leading-normal">${item.Price}</p>
                        </div>
                    </a>
                    `;
                }
            }
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p class="text-red-500">Failed to perform search.</p>';
        });
}

