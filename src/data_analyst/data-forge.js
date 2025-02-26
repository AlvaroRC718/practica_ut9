const fetch = require("node-fetch");
const { DataFrame } = require("data-forge");
const fs = require("fs"); 

async function fetchAndAnalyzeGames() {
    try {
        //obtener datos de la API
        const response = await fetch("http://localhost:3000/api/games");
        const games = await response.json();

        //convertir datos en DataFrame y parsear las columnas para que sean números
        const df = new DataFrame(games).generateSeries({
            rating: row => Number(row.rating),
            tokens: row => Number(row.tokens),
            date: row => Number(row.date)
        });

        //Arrays para cada campo
        const ratings = df.getSeries("rating").toArray();
        const tokens = df.getSeries("tokens").toArray();
        const dates = df.getSeries("date").toArray();

        //calcular estadísticas
        const averageRating = ratings.reduce((sum, val) => sum + val, 0) / ratings.length;
        const averageTokens = (tokens.reduce((sum, val) => sum + val, 0) / tokens.length) * -1; //Para sacar el valor medio de los tokens en positivo
        const minYear = Math.min(...dates);
        const averageYear= parseInt(dates.reduce((sum, val) => sum + val, 0) / dates.length);
        const maxYear = Math.max(...dates);

        console.log("\n📊 Estadísticas Generales:");
        const generalStats ={
            averageRating,
            averageTokens,
            minYear,
            averageYear,
            maxYear
        };
        console.log(generalStats);

        //agrupar juegos por plataforma y contar cuántos hay en cada grupo
        const numGamesPlatform = {};
        
        df.groupBy(row => row.platform).forEach(group => {
            const platform = group.first().platform;
            numGamesPlatform[platform] = (numGamesPlatform[platform] || 0) + group.count();
        });

        console.log("\n🕹️ Número de juegos por plataforma:");
        console.log(numGamesPlatform);

        const output = {
            generalStats,
            numGamesPlatform
        };

        fs.writeFileSync("gameStats.json", JSON.stringify(output, null, 2), "utf8");

    } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
    }
}

fetchAndAnalyzeGames();
