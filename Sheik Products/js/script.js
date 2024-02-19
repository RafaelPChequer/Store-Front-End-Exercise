const categorySelect = document.getElementById('category-select');
const produtosContainer = document.getElementById('produtos-display');
const searchBar = document.querySelector('.search-bar');
function obterValorParametro(nomeParametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nomeParametro);
}
function exibirInformacoesProduto(produto) {
    const nomeElemento = document.getElementById('nome_prod');
    const descontoElemento = document.getElementById('desconto_prod');
    const precoElemento = document.getElementById('preco_prod');
    const descricaoElemento = document.getElementById('desc_prod');
    const imagemElemento = document.getElementById('img_prod');

    nomeElemento.textContent = produto.title;
    descontoElemento.textContent = `$${(produto.price+10).toFixed(0)}`;
    precoElemento.textContent = `$${produto.price}`;
    descricaoElemento.textContent = produto.description;
    imagemElemento.src = produto.image;
}
function criarCardElement(produto) {
    const { title, price, category, image, rating } = produto;
    console.log(rating);

    const colElement = document.createElement('div');
    colElement.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4');
    colElement.style.padding = '20px';

    const cardElement = document.createElement('div');
    cardElement.classList.add('card', 'h-100');
    cardElement.style.borderRadius = '20px';
    cardElement.style.border = '4px solid black';

    const imagemElement = criarImagemElement(image);
    cardElement.appendChild(imagemElement);

    const infoElement = document.createElement('div');
    infoElement.classList.add('card-body', 'text-center');
    infoElement.innerHTML = `
    <h4 class="card-title">${title}</h4>
    <p class="card-text sale">SALE</p>
    <p class="card-text">$ <s>${(price + 10).toFixed(0)}</s></p>
    <p class="card-text price">$ ${price}</p>
    <div class="rating">${criarClassificacaoEstrelas(rating.rate, rating.count)}</div>
    <p class="card-text">Category:</p>
    <p class="card-text">${category}</p>
  `;
    cardElement.appendChild(infoElement);

    const buttonElement = document.createElement('button');
    buttonElement.classList.add('btn');
    buttonElement.textContent = 'More Details';
    buttonElement.setAttribute('data-id', produto.id);
    buttonElement.addEventListener('click', () => {
        window.location.href = 'detalhes.html' + '?id=' + produto.id;
    });

    cardElement.appendChild(buttonElement);

    colElement.appendChild(cardElement);

    return colElement;
}
function criarImagemElement(imagem) {
    const imagemElement = document.createElement('img');
    imagemElement.src = imagem;
    imagemElement.classList.add('card-img-top', 'img-fluid', 'prodCont');
    imagemElement.style.objectFit = 'contain';
    imagemElement.style.height = '300px';
    imagemElement.style.width = '300px';
    imagemElement.style.margin = 'auto';

    return imagemElement;
}
function criarClassificacaoEstrelas(rating, count) {
    const maxRating = 5;
    const fullStar = '<i class="fas fa-star star"></i>';
    const halfStar = '<i class="fas fa-star-half-alt star"></i>';
    const emptyStar = '<i class="far fa-star star"></i>';

    const fullStarsCount = Math.floor(rating);
    const hasHalfStar = Math.round(rating) > fullStarsCount;
    const emptyStarsCount = maxRating - fullStarsCount - (hasHalfStar ? 1 : 0);

    let ratingHTML = '';

    ratingHTML += `<span class="count">(${count})</span>`;

    for (let i = 0; i < fullStarsCount; i++) {
        ratingHTML += fullStar;
    }
    if (hasHalfStar) {
        ratingHTML += halfStar;
    }
    for (let i = 0; i < emptyStarsCount; i++) {
        ratingHTML += emptyStar;
    }

    return ratingHTML;
}
function filtrarProdutos(categoria, produtos) {
    if (categoria) {
        const produtosFiltrados = produtos.filter(
            produto => produto.category.toLowerCase() === categoria.toLowerCase()
        );
        return produtosFiltrados;
    }
    return produtos;
}
function exibirProdutos(produtos) {
    produtosContainer.innerHTML = '';

    for (let i = produtos.length - 1; i >= 0; i--) {
        const produto = produtos[i];
        const colElement = criarCardElement(produto);
        produtosContainer.appendChild(colElement);
    }
}
function buscarProdutos(searchTerm, produtos) {
    const produtosEncontrados = produtos.filter(produto =>
        produto.title.toLowerCase().includes(searchTerm)
    );
    return produtosEncontrados;
}
function atualizarExibicaoProdutos(categoriaSelecionada = '', searchTerm = '', produtos) {
    let produtosFiltrados = filtrarProdutos(categoriaSelecionada, produtos);

    if (searchTerm) {
        produtosFiltrados = buscarProdutos(searchTerm, produtosFiltrados);
    }

    exibirProdutos(produtosFiltrados);
}
function carregarProdutos() {
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            const produtos = data.slice(0, 20);
            atualizarExibicaoProdutos('', '', produtos);

            categorySelect.addEventListener('change', () => {
                const categoriaSelecionada = categorySelect.value;
                atualizarExibicaoProdutos(categoriaSelecionada, searchBar.value, produtos);
            });

            searchBar.addEventListener('input', () => {
                const searchTerm = searchBar.value.toLowerCase();
                atualizarExibicaoProdutos(categorySelect.value, searchTerm, produtos);
            });
        })
        .catch(error => {
            console.error('An error occured:', error);
        });
}
function carregarDetalhesProduto() {
    const idProduto = obterValorParametro('id');
    console.log('ID do Produto:', idProduto);

    fetch(`https://fakestoreapi.com/products/${idProduto}`)
        .then(response => response.json())
        .then(data => exibirInformacoesProduto(data))
        .catch(error => console.log(error));
}
function expandButton() {
    var button = document.getElementsByClassName("button")[0];
    var content = document.getElementById("content");

    if (content.style.display === "none") {
        content.style.display = "block";
        button.innerHTML = "Less Info";
    } else {
        content.style.display = "none";
        button.innerHTML = "More Info";
    }
}

carregarProdutos();
carregarDetalhesProduto();
