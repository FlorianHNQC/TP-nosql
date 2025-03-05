const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connecte"))
  .catch((err) => console.error("MongoDB connection error: ", err));

const Movie = mongoose.model("Movie", new mongoose.Schema({}, { strict: false }));

app.get("/", (req, res) => {
  res.send("Node.js app connected to MongoDB");
});

// 1.Nombre total de films
app.get("/movies/count", async (req, res) => {
  const count = await Movie.countDocuments({ type: "movie" });
  res.json({ totalMovies: count });
});

// 2.Nombre total de séries
app.get("/series/count", async (req, res) => {
  const count = await Movie.countDocuments({ type: "series" });
  res.json({ totalSeries: count });
});

// 3.Types de contenu présents
app.get("/content/types", async (req, res) => {
  const types = await Movie.distinct("type");
  res.json({ contentTypes: types });
});

// 4.Liste des genres disponibles
app.get("/movies/genres", async (req, res) => {
  const genres = await Movie.distinct("genres");
  res.json({ availableGenres: genres });
});

// 5.Films depuis 2015 classés par ordre décroissant
app.get("/movies/since-2015", async (req, res) => {
  const movies = await Movie.find({ year: { $gte: 2015 } }).sort({ year: -1 });
  res.json(movies);
});

// 6.Nombre de films depuis 2015 ayant au moins 5 récompenses
app.get("/movies/since-2015/awards", async (req, res) => {
  const count = await Movie.countDocuments({
    year: { $gte: 2015 },
    "awards.wins": { $gte: 5 },
  });
  res.json({ totalMoviesWithAwards: count });
});

// 7.Parmi ces films, nombre disponibles en français
app.get("/movies/since-2015/awards/french", async (req, res) => {
  const count = await Movie.countDocuments({
    year: { $gte: 2015 },
    "awards.wins": { $gte: 5 },
    languages: "French",
  });
  res.json({ totalFrenchMovies: count });
});

// 8.Nombre de films Thriller et Drama
app.get("/movies/thriller-drama", async (req, res) => {
  const count = await Movie.countDocuments({ genres: { $all: ["Thriller", "Drama"] } });
  res.json({ totalThrillerDramaMovies: count });
});

// 9.Titres et genres des films Crime ou Thriller
app.get("/movies/crime-thriller", async (req, res) => {
  const movies = await Movie.find(
    { genres: { $in: ["Crime", "Thriller"] } },
    { title: 1, genres: 1, _id: 0 }
  );
  res.json(movies);
});

// 10.Titres et langues des films en français et italien
app.get("/movies/french-italian", async (req, res) => {
  const movies = await Movie.find(
    { languages: { $all: ["French", "Italian"] } },
    { title: 1, languages: 1, _id: 0 }
  );
  res.json(movies);
});

// &1.Titres et genres des films avec note IMDB > 9
app.get("/movies/imdb-9plus", async (req, res) => {
  const movies = await Movie.find(
    { "imdb.rating": { $gt: 9 } },
    { title: 1, genres: 1, _id: 0 }
  );
  res.json(movies);
});

// 12.Nombre de films avec 4 acteurs
app.get("/movies/4-actors", async (req, res) => {
  const count = await Movie.countDocuments({ cast: { $size: 4 } });
  res.json({ totalMoviesWith4Actors: count });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
