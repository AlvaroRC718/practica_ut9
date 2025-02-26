$(document).ready(function () {
    localStorage.removeItem('game');//Borro el juego del localstorage para que no puedan acceder sin pagar monedas

    /////////////////////////////////////////////////Tema oscuro y claro///////////////////////////////////////////////
    let currentTheme = localStorage.getItem("currentTheme") || "theme-light";
    let currentImage = localStorage.getItem("currentImage") || "resources/img/SolLightTheme.png";

    localStorage.setItem("currentTheme", currentTheme);
    localStorage.setItem("currentImage", currentImage);

    $('body, header, footer, .card, #search-games').addClass(currentTheme);
    $('.news-card').addClass(currentTheme);
    $('.modal-content').addClass(currentTheme);
    $('.imageThemes').attr("src", currentImage);

    // Cambiar a tema oscuro o claro al hacer clic en el botón
    $('#theme-toggle').click(function () {
        currentTheme = currentTheme === "theme-light" ? "theme-dark" : "theme-light";

        $('body, header, footer, .card, #search-games').toggleClass('theme-light theme-dark');
        $('.news-card').attr("class", `news-card ${currentTheme}`);
        $('.modal-content').attr("class", `modal-content ${currentTheme}`);

        // Cambiar la imagen según el tema
        currentImage = currentTheme === "theme-light"
            ? "resources/img/SolLightTheme.png"
            : "resources/img/lunaDarkTheme.png";
        $('.imageThemes').attr("src", currentImage);

        // Guardar el tema y la imagen actual en localStorage
        localStorage.setItem("currentTheme", currentTheme);
        localStorage.setItem("currentImage", currentImage);
    });

    ///////////////////////////////////////////////Obtener juegos de la API y mostrar///////////////////////////////////////////////
    const gameNames = [];// Autocompletar busqueda
    async function obtenerJuegos() {
        try {
            const response = await fetch('http://localhost:3000/api/games', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const fetchedGames = await response.json();
                renderGames(fetchedGames);
                return fetchedGames;
            } else {
                const error = await response.json();
                console.error('Error al obtener juegos:', error.message);
                alert(error.message);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema al obtener los juegos.');
        }
    }

    /////////////////////////////////////////////////Generacion tarjetas de juegos///////////////////////////////////////////////
    function renderGames(filteredGames) {
        const $gamesContainer = $(".news");
        $gamesContainer.empty();

        if (filteredGames.length === 0) {
            $(".news").html("<div class='no-games-message'>No se encontraron juegos.</div>");
            return;
        }

        filteredGames.forEach(game => {
            const stars = "★".repeat(Math.floor(game.rating)) + "☆".repeat(5 - Math.floor(game.rating));
            $gamesContainer.append(`
            <div class="news-card ${currentTheme}" tabindex="0">
                <a href="#${game.id}" class="ver-mas" data-event="${game.id}">
                    <img class="img_news" id="game${game.id}" src="${game.img}" alt="Imagen del juego ${game.name}" />
                </a>
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="buttons">
                    <a class="playButton" data-event="${game.id}">Play</a>
                    <a class="btn ver-mas" data-event="${game.id}">Ver más</a>
                </div>
                <div class="rating" aria-valuenow="${game.rating}" aria-valuemax="5">${stars}</div>
            </div>`);
        });
    }

    ///////////////////////////////////////////////Mostrar el modal cuando se hace clic en "Ver más"///////////////////////////////////////////////
    $(".news").on("click", ".ver-mas", function (e) {
        e.preventDefault();

        const eventId = $(this).data("event"); // Obtener el id del juego del botón
        const evento = games.find((e) => e.id === eventId); // Buscar los datos del juego 

        if (evento) {
            // Rellenar el contenido del modal
            $("#modal-title").text(evento.name);
            $("#modal-description").text(evento.description);
            $("#modal-event-image").attr("src", evento.gif);
            $("#modal-event-date").text(evento.date);
            // Mostrar el modal
            $(".modal-overlay").fadeIn();
            $(".modal-content").fadeIn();
        }
    });

    $(".close, .modal-overlay").click(function () {
        $(".modal-overlay").fadeOut();
        $(".modal-content").fadeOut();
    });


    ///////////////////////////////////////////////Evento de play button///////////////////////////////////////////////
    $(document).on('click', '.playButton', function () {
        const gameId = $(this).data('event');
        const game = games.find(g => g.id === gameId);
        localStorage.setItem('game', JSON.stringify(game));
        window.electron.send("navigate-to-play");
    });

    ///////////////////////////////////////////////Ordenar y filtrar juegos///////////////////////////////////////////////
    obtenerJuegos().then(fetchedGames => {//una vez pillo los juegos de la API
        if (fetchedGames) {
            games = fetchedGames;//para la reutilizacion de jquery
        }
        //Busqueda con auto completado en la barra de input para buscar juegos
        for (let i = 0; i < fetchedGames.length; i++) {
            gameNames.push(fetchedGames[i].name);
        }

        $('#search-bar').autocomplete({
            source: gameNames,
            minLength: 2
        });
    });

    function sortGames(criterion) {
        return [...games].sort((a, b) => {
            switch (criterion) {
                case "rating-desc":
                    return b.rating - a.rating;
                case "rating-asc":
                    return a.rating - b.rating;
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
    }

    $("#search-bar").on("input", function () {
        const query = $(this).val().toLowerCase();
        const filteredGames = games.filter(game => game.name.toLowerCase().includes(query));
        renderGames(filteredGames);
    });

    $("#sort").on("change", function () {
        renderGames(sortGames($(this).val()));
        $("#filter-rating").val("all");
    });

    $("#filter-rating").on("change", function () {
        const minRating = parseFloat($(this).val());
        const filteredGames = isNaN(minRating) ? games : games.filter(game => game.rating === minRating);
        renderGames(filteredGames);
    });

});