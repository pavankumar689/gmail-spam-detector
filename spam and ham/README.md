# Gmail Spam Detector

A Chrome extension and Flask API that uses machine learning to detect spam emails directly in your Gmail inbox.

## Features
- Chrome extension scans opened Gmail emails and predicts if they are spam or ham (not spam)
- Results are shown in Gmail and in the extension popup
- Backend Flask API serves a trained ML model for spam detection
- Easy to retrain with your own dataset

---

## Project Structure
```
spam and ham/
├── chrome-extension/      # Chrome extension source
│   ├── content.js         # Injected script for Gmail
│   ├── manifest.json      # Extension manifest
│   ├── popup.html         # Extension popup UI
│   └── popup.js           # Popup logic
├── flask-api/             # Flask backend API
│   ├── app.py             # Flask server
│   ├── model.pkl          # Trained ML model
│   └── vectorizer.pkl     # Trained vectorizer
├── spamsms.csv            # Example dataset (SMS spam)
├── Untitled.ipynb         # Example training notebook
```

---

## Setup Instructions

### 1. Backend: Flask API

#### a. Install dependencies
```bash
cd flask-api
pip install flask flask-cors scikit-learn nltk pandas
```

#### b. Download NLTK stopwords (first time only)
```python
import nltk
nltk.download('stopwords')
```

#### c. Start the Flask server
```bash
python app.py
```
- The server runs on `http://localhost:5000`

#### d. (Optional) Retrain the model
- Use `Untitled.ipynb` or your own script to train a new model and vectorizer.
- Replace `model.pkl` and `vectorizer.pkl` in `flask-api/`.

---

### 2. Frontend: Chrome Extension

#### a. Load the extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome-extension` folder

#### b. Usage
- Open Gmail in Chrome
- Open any email
- The extension will show a result box ("Spam" or "Ham") in the top-right for 3 seconds
- Click the extension icon to see the result in the popup or to rescan

---

## Customization & Retraining
- To improve accuracy, retrain the model with a larger, more relevant dataset (e.g., email spam datasets)
- Edit and run the notebook/script to generate new `model.pkl` and `vectorizer.pkl`
- You can increase `max_features` in the vectorizer for better coverage

---

## Troubleshooting
- Make sure the Flask server is running before using the extension
- If you see CORS errors, ensure `from flask_cors import CORS; CORS(app)` is in `app.py`
- If the extension doesn't work, reload it in Chrome and refresh Gmail

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
MIT 