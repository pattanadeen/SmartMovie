const axios = require("axios").default;

const host = "https://api.themoviedb.org";
const api_key = "09b17a5dc4161674cfde92fc250de2b9";

const genre_ids = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "science fiction": 878,
  "tv movie": 10770,
  thriller: 53,
  war: 10752,
  western: 37,
};

async function main(params) {
  try {
    let url;
    let request;

    switch (params["question_id"]) {
      case 1:
        url = "https://smart-movie-recommendation.herokuapp.com/predict";

        try {
          const response = await axios.post(url, {
            movie_name: params["movie_name"],
          });

          return { body: response.data };
        } catch (error) {
          throw "Unable to get movie list.";
        }

        break;

      case 2:
        url = host + "/3/discover/movie?" + "api_key=" + api_key;

        request = [
          url,
          format_search_param("sort_by", "popularity.desc"),
          format_search_param("certification_country", "US"),
          format_search_param(
            "with_genres",
            params["movie_genre"]
              ? genre_ids[params["movie_genre"].toLowerCase()]
              : null
          ),
          format_search_param("primary_release_year", params["movie_year"]),
          format_search_param("certification", params["movie_certification"]),
        ]
          .filter(Boolean)
          .join("&");

        break;

      case 3:
        url = host + "/3/discover/movie?" + "api_key=" + api_key;

        let nowDate = new Date();
        let pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 7);

        request = [
          url,
          format_search_param(
            "primary_release_date.gte",
            format_date(pastDate)
          ),
          format_search_param("primary_release_date.lte", format_date(nowDate)),
        ]
          .filter(Boolean)
          .join("&");

        break;

      case 4:
      case 5:
      case 6:
        url = host + "/3/search/movie?" + "api_key=" + api_key;

        request = [
          url,
          format_search_param("language", "en-US"),
          format_search_param("query", params["movie_name"]),
        ]
          .filter(Boolean)
          .join("&");

        break;

      default:
        throw "Question not identified.";
        break;
    }

    console.log(request);

    const movies = await get_movies(request);

    return { body: movies };
  } catch (error) {
    return {
      body: {
        status_message: error.message,
        success: false,
      },
    };
  }
}

function format_search_param(key, value) {
  if (!value) {
    return null;
  }

  return key + "=" + String(value).replace(" ", "%20");
}

function format_date(date) {
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return year + "-" + month + "-" + day;
}

async function get_movies(request) {
  try {
    const response = await axios.get(request);

    return response.data;
  } catch (error) {
    throw "Unable to get movie list.";
  }
}
