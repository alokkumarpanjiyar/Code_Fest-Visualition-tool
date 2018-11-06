from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://heroku_7mkztpqw:l4laif8c8nn2i758tdrmicmg83@ds129024.mlab.com:29024/heroku_7mkztpqw')
DBS_NAME = os.environ.get('MONGO_DB_NAME','heroku_7mkztpqw')
COLLECTION_NAME = os.environ.get('MONGO_COLLECTION_NAME','project')

# Modify the following for your fields
FIELDS = {'age': True, 'category': True, 'citizenship': True, 'company_name': True,
          'company_type': True, 'country_code': True, 'founded': True, 'from_emerging': True, 'gdp': True,
          'gender': True, 'industry': True, 'inherited': True, 'name': True, 'rank': True, 'region': True,
           'relationship': True, 'sector': True, 'was_founder': True, 'was_political': True,
           'wealth_type': True, 'worth': True, 'year': True, '_id': False}
          
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/data")
def get_data():
    with MongoClient(MONGODB_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        projects = collection.find(projection=FIELDS)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))


if __name__ == "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))