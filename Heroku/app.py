import pandas as pd
from scipy.sparse import csr_matrix
from flask import Response, Flask, request
import joblib
from json import dumps
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "<p>Idiot</p>"


@app.route("/predict", methods=["POST"])
def predict():

    # If a form is submitted
    if request.method == "POST":

        # Unpickle classifier
        knn = joblib.load("knn.pkl")

        # Get values through input bars
        movie_name = request.json.get("movie_name")

        movies = pd.read_csv("./data/movies.csv")
        ratings = pd.read_csv("./data/ratings.csv")
        final_dataset = ratings.pivot(
            index="movieId", columns="userId", values="rating"
        )
        final_dataset.fillna(0, inplace=True)
        no_user_voted = ratings.groupby("movieId")["rating"].agg("count")
        no_movies_voted = ratings.groupby("userId")["rating"].agg("count")
        final_dataset = final_dataset.loc[no_user_voted[no_user_voted > 10].index, :]
        final_dataset = final_dataset.loc[
            :, no_movies_voted[no_movies_voted > 50].index
        ]
        csr_data = csr_matrix(final_dataset.values)
        final_dataset.reset_index(inplace=True)
        movies["title_check"] = movies["title"].str.lower()
        n_movies_to_reccomend = 5
        movie_list = movies[movies["title_check"].str.contains(movie_name.lower())]
        if len(movie_list):
            movie_idx = movie_list.iloc[0]["movieId"]
            if len(final_dataset[final_dataset["movieId"] == movie_idx]) > 0:
                movie_idx = final_dataset[final_dataset["movieId"] == movie_idx].index[
                    0
                ]
                distances, indices = knn.kneighbors(
                    csr_data[movie_idx], n_neighbors=n_movies_to_reccomend + 1
                )
                rec_movie_indices = sorted(
                    list(zip(indices.squeeze().tolist(), distances.squeeze().tolist())),
                    key=lambda x: x[1],
                )[:0:-1]
                recommend_frame = []
                for val in rec_movie_indices:
                    movie_idx = final_dataset.iloc[val[0]]["movieId"]
                    idx = movies[movies["movieId"] == movie_idx].index
                    recommend_frame.append(
                        {
                            "Title": movies.iloc[idx]["title"].values[0],
                            "Distance": val[1],
                        }
                    )
                df = pd.DataFrame(
                    recommend_frame, index=range(1, n_movies_to_reccomend + 1)
                )
                prediction = df["Title"].to_list()
            else:
                prediction = "No movies found. Please check your input"
        else:
            prediction = "No movies found. Please check your input"

    else:
        prediction = ""

    json_data = dumps({"predictions": prediction})

    return Response(json_data, mimetype="application/json"), 200
    # return Response(json_data, mimetype="application/json"), 200
    # return render_template("index.html", prediction_text = prediction)


if __name__ == "__main__":
    app.run(debug=True)
