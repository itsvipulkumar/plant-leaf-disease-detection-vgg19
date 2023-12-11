from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import numpy as np
import io
import os
import pandas as pd

app = Flask(__name__)

# Load the pre-trained VGG19 model
model_path = os.path.join(os.getcwd(), '../model/vgg19model_v1.h5')
vgg19_model = load_model(model_path)

# Map the predicted index to your class labels
class_labels = ["Potato___Early_Blight", "Potato___Late_Blight", "Potato___healthy"]

# Load fertilizer recommendations from CSV
df = pd.read_csv("./fertilizer_recommendations.csv")  # Update the path accordingly
fertilizer_recommendations = dict(zip(df['disease'], df['recommendation']))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the uploaded image file
    img_file = request.files['image']
    img = Image.open(io.BytesIO(img_file.read()))
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array / 255.0, axis=0)  # Normalize the image

    # Make predictions using the pre-trained model
    predictions = vgg19_model.predict(img_array)

    # Get the predicted class label
    predicted_class_index = np.argmax(predictions[0])
    predicted_class = class_labels[predicted_class_index]

    # Get the recommended fertilizer based on the predicted disease
    recommended_fertilizer = fertilizer_recommendations.get(predicted_class, "No specific recommendation")

    # Prepare the results to send to the frontend
    result = {
        "predicted_disease": predicted_class,
        "recommended_fertilizer": recommended_fertilizer,
        "all_predictions": predictions[0].tolist()
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)


#  Running on http://127.0.0.1:5000
#  Running on http://172.28.0.12:5000