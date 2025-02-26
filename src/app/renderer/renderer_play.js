$(document).ready(function () {
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


    // Redirigir a index.html al hacer clic en los logos
    $('.container_logos a').on('click', function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        window.electron.send("navigate-to-index"); // Enviar el evento para redirigir
    });
});

/////////////////////////////////////////EMULADOR/////////////////////////////////////////
const game = localStorage.getItem('game');
            if (game) {
                const gameObject = JSON.parse(game);
                
                EJS_player = '#game';

                //consola
                EJS_core = gameObject.platform;

                //rom del juego
                EJS_gameUrl = gameObject.rom;

                //bios
                EJS_biosUrl = gameObject.bios;//no todos los emuladores necesitan bios pero psx si

                //archivos de datos del emulador
                EJS_pathtodata = 'data/';

                //arranca automaticamente
                EJS_startOnLoaded = true;

            } else {
                console.log('No se encontró el juego en localStorage.');
                window.location.href = "games";
            }
