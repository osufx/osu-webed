import json
from flask import Flask, render_template, url_for

app = Flask(__name__)

with open("config.json", "r") as f:
	config = json.load(f)

@app.route("/")
def index():
	return render_template("index.html")

# -------------------------------------------------------------------------
# Preven caching (DEBUG)
import os

@app.context_processor
def override_url_for():
    """
    Generate a new token on every request to prevent the browser from
    caching static files.
    """
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)

# -------------------------------------------------------------------------

if __name__ == "__main__":
	app.run(**config["web"])