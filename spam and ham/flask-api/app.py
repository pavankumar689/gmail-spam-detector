from flask import Flask, request, jsonify
import pickle
import re
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

stopwords = set(stopwords.words('english'))  # Use NLTK's English stopwords
ps = PorterStemmer()

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    tokens = text.split()
    tokens = [ps.stem(word) for word in tokens if word not in stopwords]
    return " ".join(tokens)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    message = data['message']
    cleaned = clean_text(message)
    vec = vectorizer.transform([cleaned]).toarray()
    pred = model.predict(vec)[0]
    return jsonify({'result': 'spam' if pred == 1 else 'ham'})

if __name__ == '__main__':
    app.run(port=5000)
