const mongoose = require('mongoose');
const Movie = require('./models/movie.js');
const Comment = require('./models/comment');

const data = [
  //   name: String,
  //   image: String,
  //   description: String,
  {
    name: 'Alien: Covenant',
    image:
      'https://vignette4.wikia.nocookie.net/avp/images/7/74/Alien_Covenant_international_poster_01.jpg/revision/latest?cb=20170512062931',
    description:
      'Bound for a remote planet on the far side of the galaxy, members (Katherine Waterston, Billy Crudup) of the colony ship Covenant discover what they think to be an uncharted paradise. While there, they meet David (Michael Fassbender), the synthetic survivor of the doomed Prometheus expedition. The mysterious world soon turns dark and dangerous when a hostile alien life-form forces the crew into a deadly fight for survival.',
  },
  {
    name: "Singin' in the Rain",
    image: 'https://images-na.ssl-images-amazon.com/images/I/71ezA8BPTzL._SY717_.jpg',
    description:
      "A spoof of the turmoil that afflicted the movie industry in the late 1920s when movies went from silent to sound. When two silent movie stars', Don Lockwood and Lina Lamont, latest movie is made into a musical a chorus girl is brought in to dub Lina's speaking and singing. Don is on top of the world until Lina finds out.",
  },
  {
    name: 'Scarface',
    image: 'http://imgc.allpostersimages.com/img/posters/scarface-movie-one-sheet_u-L-F4TCB30.jpg',
    description:
      'After getting a green card in exchange for assassinating a Cuban government official, Tony Montana (Al Pacino) stakes a claim on the drug trade in Miami. Viciously murdering anyone who stands in his way, Tony eventually becomes the biggest drug lord in the state, controlling nearly all the cocaine that comes through Miami. But increased pressure from the police, wars with Colombian drug cartels and his own drug-fueled paranoia serve to fuel the flames of his eventual downfall.',
  },
];

function seedDB() {
  // remove all movies
  Movie.remove({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('removed campgrounds!');
      data.forEach((seed) => {
        // add movie
        Movie.create(seed, (addingErr, addedMovie) => {
          if (err) {
            console.log(addingErr);
          } else {
            console.log('new movie added');
            // create comment
            Comment.create(
              {
                text: 'Love this movie',
                author: 'Jack',
              },
              (commentErr, comment) => {
                if (commentErr) {
                  console.log(err);
                } else {
                  addedMovie.comments.push(comment);
                  addedMovie.save();
                  console.log('comment saved');
                }
              },
            );
          }
        });
      });
    }
  });
}

module.exports = seedDB;
