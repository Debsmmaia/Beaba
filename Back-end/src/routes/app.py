from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500", "http://127.0.0.1:5000"]}}, supports_credentials=True)

# Carregue suas credenciais do arquivo json
credentials = Credentials.from_service_account_file('credenciais.json')

def build_drive_service():
    return build('drive', 'v3', credentials=credentials)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']

    # Crie um objeto MediaIoBaseUpload
    media = MediaIoBaseUpload(io.BytesIO(file.read()), mimetype=file.content_type)

    # Autenticação com o Google Drive
    drive_service = build_drive_service()
    file_metadata = {'name': file.filename}
    drive_service.files().create(body=file_metadata, media_body=media).execute()

    #pega o link de download do arquivo 
    file_metadata = {'name': file.filename}
    response = drive_service.files().create(body=file_metadata, media_body=media).execute()
    file_id = response.get('id')
    download_link = f"https://drive.google.com/uc?export=download&id={file_id}"



    return jsonify({'message': 'Arquivo enviado com sucesso para o Google Drive', 'download_link': download_link})

if __name__ == '__main__':
    app.run(debug=True)
