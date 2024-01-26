// Посилання на навчальне api бази даних
const apiPart = 'https://65abe20cfcd1c9dcffc7353b.mockapi.io/';

// Запам'ятовуємо категорію, щоб потім при кліку на ту саму категорію повторно показувати всі книги з кнопкою "Показати більше"
let categoryRemember = 0;

// Виводимо категорії до списку
function viewBooksCategories() {
	fetch(`${apiPart}category`, {
		method: 'GET',
		headers: { 'content-type': 'application/json' },
	}).then(res => {
		if (res.ok) {
			return res.json();
		}
	}).then(categories => {

		// Дістаємо списки в які будемо виводити категорії
		const categoryPopular = document.getElementById('categories-popular');
		const categoryMain = document.getElementById('categories-main');

		// Якщо елемент існує на сторінці тоді виводимо
		if (categoryPopular) {

			// Виводимо категорії до списків
			categories.forEach((category, num) => {

				// Наповнюємо масив категорій
				categories.push(category.title);

				// Якщо відмічена як популярна тоді в список популярних категорій
				if (category.popular == 'yes') {
					categoryPopular.insertAdjacentHTML('beforeend', `<li class="box-categories__li"><a href="${category.id}" data-category="${category.id}" class="box-categories__link category-for-js" data-id="${category.id}">${category.title}</a></li>`);
				} else {
					categoryMain.insertAdjacentHTML('beforeend', `<li class="box-categories__li"><a href="${category.id}" data-category="${category.id}" class="box-categories__link category-for-js" data-id="${category.id}">${category.title}</a></li>`);
				}

			});

		}


	});
}

// При першому заході користувача виводимо категорії
viewBooksCategories();


// Потрібно виводити книги по різних подіях, тому виділяємо для виводу окрему функцію
function displayBooksInhtml(books, page = 1, displayBlock = 'book-list') {

	// Формуємо блок в якому будемо виводити книги
	const bookList = document.getElementById(displayBlock);

	// Якщо існує блок, тоді виводити книги
	if (bookList) {

		// Перебираємо додані книжки і виводимо користувачу
		if (books.length > 0) {

			// Очищуємо перед виводом, якщо це перша сторінка
			if (page == 1)
				bookList.innerHTML = '';

			// Якщо результатів менше ніж треба, ховаємо кнопку "Показати більше"
			if (books.length < 8)
				document.querySelector('.btn-more').style.display = 'none';

			// Якщо існують книги виводимо їх
			books.forEach((book, numInArray) => {

				bookList.insertAdjacentHTML('beforeend', `<div class="card" id="card-book-${book.id}">
															<div class="card-img-hold">
																<img src="img/books/${book.img}" class="card-img" alt="">
																<span class="badge badge-detail">${book.author}</span>
																<div class="card-img-actions d-flex-center">
																	<a href="#" class="btn btn-light btn-round favorite-for-js" data-id="${book.id}" >
																		<svg class='icon icon-heart favorite-for-js' data-id="${book.id}" ><use class="favorite-for-js" data-id="${book.id}"  xlink:href='#icon-heart'></use></svg>
																	</a>
																</div>
															</div>
															<div class="card-body">
																<div class="card-body-text">
																	<a href="" class="card-title">${book.title}</a>
																	<p class="card-meta">
																		<svg class='icon icon-pages'><use xlink:href='#icon-pages'></use></svg>
																		${book.pages} сторінки
																	</p>
																</div>
																<div class="card-body-price">
																	<span class="badge badge-price">$${book.price}</span>
																</div>
															</div>
														</div>`);
			});

		} else {

			// Якщо немає книг виводимо простий текст
			if (page == 1)
				bookList.innerHTML = '<h2 class="books-not-found">Книги не знайдені</h2>';

			// Ховаємо кнопку "Показати більше"
			document.querySelector('.btn-more').style.display = 'none';
		}
	}
}


// Виводимо книжки до html
function viewCatalogBooks(page = 1) {
	fetch(`${apiPart}books/?page=${page}&limit=8`, {
		method: 'GET',
		headers: { 'content-type': 'application/json' },
	}).then(res => {
		if (res.ok) {
			return res.json();
		}
	}).then(books => {

		// Виводимо книги в html
		displayBooksInhtml(books, page);

	})
}


// Виводимо книги коли користувач тільки зайшов на сайт
viewCatalogBooks();


// Програмуємо кнопку "Показати більше"
const buttonLoadMore = document.querySelector('.btn-more');
if (buttonLoadMore) {
	document.querySelector('.btn-more').addEventListener('click', (event) => {

		// Забороняємо стандартний функціоанл html
		event.preventDefault();

		// Кнопка по якій був клік
		const btn = event.target;

		// Добавляємо до сторінки + 1
		btn.dataset.page++;

		// Змінюємо цифру, яка є в href + 1
		const page = btn.dataset.page;

		// Виводимо додаткову кількість книжок
		viewCatalogBooks(page);

	});
}

// Видаляємо категорії у всіх категоріях
function removeActiveInCategoryList() {

	// Відбираємо всі категорії
	const category = document.querySelectorAll('.category-for-js');

	// Перебираємо і видаляємо клас активності
	category.forEach(function (el) {

		// Видаляємо клас активності
		el.classList.remove('active');
	})
}

// Виводимо книжки при кліку на категорію
function selectProductsByCategory(event) {

	// Кнопка категорії
	const category = event.target.dataset.category;

	// Очищуємо активні категорії
	removeActiveInCategoryList();

	// Якщо клік був по тій самій категорії, тоді виводимо всі книги
	if (categoryRemember == category) {

		// Виводимо книги
		viewCatalogBooks();

	} else {

		// Активовуємо і деактивовуємо кнопку
		event.target.classList.toggle('active');

		// Виводимо книги по категорії
		fetch(`${apiPart}books/?categoryid=${category}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' },
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(books => {

			// Виводимо книги в html
			displayBooksInhtml(books);

			// Ховаємо кнопку "Показати більше"
			document.querySelector('.btn-more').style.display = 'none';

			// Запам'ятовуємо категорію
			categoryRemember = category;

		})
	}
}

// Витягуємо дані з localstorage
let localBooks = localStorage.getItem('books');

// Масив для збережених книжок
let savedBooks;

if (localBooks == null || localBooks == '') {
	savedBooks = [];
} else {
	savedBooks = localBooks.split(',');
}

// Потрібно в декілької місцях викликати цей підрахунок тому функція
function displayNumFavoriteBooks() {
	// Елемент для виводу кількості збережних книжок
	const spanSavedNum = document.querySelector('.saved-num');

	// Виводимо кількість добавлених книжок в html
	spanSavedNum.innerHTML = savedBooks.length;

	// Якщо немає доданих книжок тоді ховаємо число доданих книжок
	if (savedBooks.length == 0) {
		spanSavedNum.style.display = 'none';
	} else {
		spanSavedNum.style.display = 'block';
	}
}

// Викликаємо функцію підрахунку збережених книжок
displayNumFavoriteBooks();

// Для зручності робимо функцію видалення карточки книги зі сторінки
function deleteCardSaveBook(id) {

	// Якщо це сторінка збережених книжок видаляємо карточку
	if (document.getElementById('book-saved-list') != null) {

		// Видаляємо з html потрібну карточку
		document.querySelector('#card-book-' + id).remove();

		// Якщо немає збережених книжок виводимо повідомлення
		if (savedBooks.length == 0) {

			// Виводимо повідомлення
			document.getElementById('book-saved-list').innerHTML = '<h2 class="books-not-found">Ви не зберегели жодну книгу!</h2>';
		}
	}

}


// Зберігаємо книгу до списку
function saveBook(event) {

	// Зберігаємо id книги
	const id = event.target.dataset.id;

	// Якщо в масиві не існує книги, добавляємо до масиву
	if (savedBooks.includes(id) == false) {

		// Зберігаємо до книгу до масиву
		savedBooks.push(id);

	} else {

		// Видаляємо книгу з масиву доданих книжок
		const keyInArray = savedBooks.indexOf(id);

		// Видаляємо з масива збережену книгу
		savedBooks.splice(keyInArray, 1);
	}

	// Виводимо кількість добавлених книжок в html
	displayNumFavoriteBooks();

	// Зберігаємо масив в localstorage
	localStorage.setItem('books', savedBooks);

	// Якщо це сторінка збережних книжок додатково видаляємо карточки зі сторінки
	deleteCardSaveBook(id);
}


// Виводимо збережені книги до сторінки
function displaySavedBooks() {

	// Чи це сторінка збережних товарів скаже нам новий блок виводу книжок, якщо його немає значить це сторінка збережних книжок
	if (document.querySelector('#book-saved-list') != null) {

		// Якщо немає збережених книжок виводимо повідомлення
		if (savedBooks.length == 0) {

			// Виводимо повідомлення
			document.getElementById('book-saved-list').innerHTML = '<h2 class="books-not-found">Ви не зберегели жодну книгу!</h2>';

		} else {

			// Виводимо збережні книги
			fetch(`${apiPart}books/`, {
				method: 'GET',
				headers: { 'content-type': 'application/json' },
			}).then(res => {
				if (res.ok) {
					return res.json();
				}
			}).then(books => {

				// Новий масив зі збережими книжками
				let savedBooksArray = [];

				// Сортуємо масив і видаляємо книги, які не є збереженими
				books.forEach(function (book) {

					// Якщо книга не в масиві збережених книжок видаляємо з масива
					if (savedBooks.includes(book.id) == true) {
						savedBooksArray.push(book);
					}
				})

				// Виводимо книги в html
				displayBooksInhtml(savedBooksArray, 1, 'book-saved-list');

			})
		}
	}
}
displaySavedBooks();


// Цей код потрібний декілька разів, тому виділяємо окрему функцію
function search() {

	// На всякий випадок очищуємо активні категорії
	removeActiveInCategoryList();

	// Пошукова фраза
	const searchValue = document.querySelector('#search-value').value;

	// Якщо пошукова фраза пуста, виводимо книги
	if (searchValue.length == 0) {

		// Виводимо книги
		viewCatalogBooks();

		// Ховаємо кнопку "Показати більше"
		document.querySelector('.btn-more').style.display = 'inline-flex';

	} else {

		// Виводимо книги по пошуковій фразі
		fetch(`${apiPart}books/?search=${searchValue}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' },
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(books => {

			// Виводимо книги в html
			displayBooksInhtml(books);

		})
	}
}

// Слідкуємо за кліком по кнопці пошуку
const searchBtn = document.querySelector('#search-btn');
if (searchBtn) {
	searchBtn.addEventListener('click', (event) => {

		// Шукаємо книгу
		search();
	});
}

// Слідкуємо за вводом в поле пошуку
const searchValue = document.querySelector('#search-value');
if (searchValue) {
	searchValue.addEventListener('input', (event) => {

		// Якщо поле пошуку пусте також запускаємо пошук, щоб вивелися книги
		if (event.target.value == '') {
			search();
		}
	});
}

const searchForm = document.querySelector('#search-form');
if (searchForm) {
	searchForm.addEventListener('submit', (event) => {
		event.preventDefault()
		search();
	});
}


// Обробник подій для кліку на нових елементах, які з'являються в html
document.addEventListener('click', function (event) {

	// Слідкуємо за категоріями
	if (event.target.classList.contains('category-for-js')) {
		event.preventDefault();

		// Запускаємо функцію виводу книжок по категорії
		selectProductsByCategory(event);
	}

	// Слідкуємо за добавленням в улюблене
	if (event.target.classList.contains('favorite-for-js')) {
		event.preventDefault();

		// Запускаємо функцію збежерення книжок
		saveBook(event);
	}

	// Слідкуємо за детальнішим переглядом
	if (event.target.classList.contains('detail-for-js')) {
		event.preventDefault();

		// Запускаємо функцію перегляду книжок
		console.log('detail!');

	}
});