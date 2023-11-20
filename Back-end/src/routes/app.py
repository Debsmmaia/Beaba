from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import pandas as pd
import database as dt
import io
from io import BytesIO
import psycopg2
import openpyxl
from openpyxl.utils.dataframe import dataframe_to_rows


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500", "http://127.0.0.1:5000"]}}, supports_credentials=True)

DB = {
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': 5432,
    'database': 'postgres',
    'db_type': 'postgresql',
}

def validarDataFrame(df, resultado):
    erros = []

    # Verifica se as colunas no DataFrame df correspondem às do DataFrame resultado
    if set(df.columns) != set(resultado['nome_campo']):
        erros.append("Colunas diferentes encontradas:")
        erros.append("Colunas no DataFrame df: " + ', '.join(df.columns))
        erros.append("Colunas no DataFrame resultado: " + ', '.join(resultado['nome_campo']))

    # Itera sobre cada coluna e tipo esperado no mapeamento
    for _, row in resultado.iterrows():
        col_name = row['nome_campo']
        expected_type = row['tipo_dado']
        is_nullable = row['nulo']

        # Verifica se a coluna está presente no DataFrame df
        if col_name not in df.columns:
            erros.append(f"Coluna '{col_name}' não está presente no DataFrame df.")

        # Verifica se todos os valores na coluna são do tipo esperado
        for value in df[col_name]:
            if pd.isnull(value) and not is_nullable:
                erros.append(f"Valor nulo encontrado na coluna '{col_name}', que não permite valores nulos.")
            if not pd.isnull(value):
                if expected_type == 'Palavra' and not isinstance(value, str):
                    erros.append(f"Valor '{value}' na coluna '{col_name}' não é do tipo esperado '{expected_type}'.")
                elif expected_type == 'Numero inteiro' and not isinstance(value, int):
                    erros.append(f"Valor '{value}' na coluna '{col_name}' não é do tipo esperado '{expected_type}'.")
                elif expected_type == 'Numero real' and not isinstance(value, (int,float)):
                    erros.append(f"Valor '{value}' na coluna '{col_name}' não é do tipo esperado '{expected_type}'.")    
    # Verificação passou, os DataFrames têm as mesmas colunas e tipos de dados
    return erros

def permissao(file_id):
    drive_service = build_drive_service()

    drive_service.permissions().create(
        fileId=file_id,
        body={
            'type': 'anyone',
            'role': 'reader',
        },
    ).execute()

credentials = Credentials.from_service_account_file('credenciais.json')

def build_drive_service():
    return build('drive', 'v3', credentials=credentials)

@app.route('/uploadRep1/<int:idtemplate>', methods=['POST'])
def upload_file1(idtemplate):
    try:
        file = request.files['file']     

        file_stream = io.BytesIO(file.read())

        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file_stream)
    
            consulta_sql = 'SELECT * FROM projeto."Campos" WHERE template_pertencente = {}'.format(idtemplate)
            resultado = dt.get_df(consulta_sql, DB)  

            erros = validarDataFrame(df, resultado)
            if not erros:
                media = MediaIoBaseUpload(file_stream, mimetype=file.content_type)
                drive_service = build_drive_service()
                file_metadata = {'name': file.filename, 'parents': ['1p4F8jSLHAh9Gf9XlwyQgEru0YajWPLwv']}
                response = drive_service.files().create(body=file_metadata, media_body=media).execute()

                file_id = response.get('id')
                permissao(file_id)
                view_link = f"https://drive.google.com/file/d/{file_id}/view"
                print(view_link)

                return jsonify({'message': 'Arquivo enviado com sucesso para o Google Drive', 'download_link': view_link})
                    
            else:
                print("Erros:", erros)
                return jsonify({"Erro": "Tipos de dados incorretos nos campos do arquivo", "Detalhes": erros}), 400  

        elif file.filename.endswith('.csv'):
            df = pd.read_csv(file_stream)
                
            consulta_sql = 'SELECT * FROM projeto."Campos" WHERE template_pertencente = {}'.format(idtemplate)
            resultado = dt.get_df(consulta_sql, DB)  

            erros = validarDataFrame(df, resultado)
            if not erros:
                media = MediaIoBaseUpload(file_stream, mimetype=file.content_type)
                drive_service = build_drive_service()
                file_metadata = {'name': file.filename, 'parents': ['1p4F8jSLHAh9Gf9XlwyQgEru0YajWPLwv']}
                response = drive_service.files().create(body=file_metadata, media_body=media).execute()

                file_id = response.get('id')
                permissao(file_id)
                view_link = f"https://drive.google.com/file/d/{file_id}/view"
                print(view_link)

                return jsonify({'message': 'Arquivo enviado com sucesso para o Google Drive', 'download_link': view_link})
                    
            else:
                print("Erros:", erros)
                return jsonify({"Erro": "Tipos de dados incorretos nos campos do arquivo", "Detalhes": erros}), 400 
    except Exception as e:
        print("Erro durante o processamento:", str(e))
        return jsonify({"Erro": "Ocorreu um erro durante o processamento"}), 500 





@app.route('/uploadRep2/<int:idtemplate>', methods=['POST'])
def upload_file2(idtemplate):
    try:
        file = request.files['file']     

        file_stream = io.BytesIO(file.read())

        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file_stream)
                
            consulta_sql = 'SELECT * FROM projeto."Campos" WHERE template_pertencente = {}'.format(idtemplate)
            resultado = dt.get_df(consulta_sql, DB)  

            erros = validarDataFrame(df, resultado)
            if not erros:
                media = MediaIoBaseUpload(file_stream, mimetype=file.content_type)
                drive_service = build_drive_service()
                file_metadata = {'name': file.filename, 'parents': ['1p4F8jSLHAh9Gf9XlwyQgEru0YajWPLwv']}
                response = drive_service.files().create(body=file_metadata, media_body=media).execute()

                file_id = response.get('id')
                permissao(file_id)
                view_link = f"https://drive.google.com/file/d/{file_id}/view"
                print(view_link)

                return jsonify({'message': 'Arquivo enviado com sucesso para o Google Drive', 'download_link': view_link})
                    
            else:
                print("Erros:", erros)
                return jsonify({"Erro": "Tipos de dados incorretos nos campos do arquivo", "Detalhes": erros}), 400  

        elif file.filename.endswith('.csv'):
            df = pd.read_csv(file_stream)
                
            consulta_sql = 'SELECT * FROM projeto."Campos" WHERE template_pertencente = {}'.format(idtemplate)
            resultado = dt.get_df(consulta_sql, DB)  

            erros = validarDataFrame(df, resultado)
            if not erros:
                media = MediaIoBaseUpload(file_stream, mimetype=file.content_type)
                drive_service = build_drive_service()
                file_metadata = {'name': file.filename, 'parents': ['1p4F8jSLHAh9Gf9XlwyQgEru0YajWPLwv']}
                response = drive_service.files().create(body=file_metadata, media_body=media).execute()

                file_id = response.get('id')
                permissao(file_id)
                view_link = f"https://drive.google.com/file/d/{file_id}/view"
                print(view_link)

                return jsonify({'message': 'Arquivo enviado com sucesso para o Google Drive', 'download_link': view_link})
                    
            else:
                print("Erros:", erros)
                return jsonify({"Erro": "Tipos de dados incorretos nos campos do arquivo", "Detalhes": erros}), 400 
    except Exception as e:
        print("Erro durante o processamento:", str(e))
        return jsonify({"Erro": "Ocorreu um erro durante o processamento"}), 500 





@app.route('/uploadRep3/<int:idtemplate>', methods=['POST'])
def upload_file3(idtemplate):
    try:
        file = request.files['file']     

        file_stream = io.BytesIO(file.read())

        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file_stream)
                
            consulta_sql = 'SELECT * FROM projeto."Campos" WHERE template_pertencente = {}'.format(idtemplate)
            resultado = dt.get_df(consulta_sql, DB)  

            erros = validarDataFrame(df, resultado)
            if not erros:
                media = MediaIoBaseUpload(file_stream, mimetype=file.content_type)
                drive_service = build_drive_service()
                file_metadata = {'name': file.filename, 'parents': ['1p4F8jSLHAh9Gf9XlwyQgEru0YajWPLwv']}
                response = drive_service.files().create(body=file_metadata, media_body=media).execute()

                file_id = response.get('id')
                permissao(file_id)
                view_link = f"https://drive.google.com/file/d/{file_id}/view"
                print(view_link)

                return jsonify({'message': 'Arquivo enviado com sucesso para o Google Drive', 'download_link': view_link})
                    
            else:
                print("Erros:", erros)
                return jsonify({"Erro": "Tipos de dados incorretos nos campos do arquivo", "Detalhes": erros}), 400  

        elif file.filename.endswith('.csv'):
            df = pd.read_csv(file_stream)
                
            consulta_sql = 'SELECT * FROM projeto."Campos" WHERE template_pertencente = {}'.format(idtemplate)
            resultado = dt.get_df(consulta_sql, DB)  

            erros = validarDataFrame(df, resultado)
            if not erros:
                media = MediaIoBaseUpload(file_stream, mimetype=file.content_type)
                drive_service = build_drive_service()
                file_metadata = {'name': file.filename, 'parents': ['1p4F8jSLHAh9Gf9XlwyQgEru0YajWPLwv']}
                response = drive_service.files().create(body=file_metadata, media_body=media).execute()

                file_id = response.get('id')
                permissao(file_id)
                view_link = f"https://drive.google.com/file/d/{file_id}/view"
                print(view_link)

                return jsonify({'message': 'Arquivo enviado com sucesso para o Google Drive', 'download_link': view_link})
                    
            else:
                print("Erros:", erros)
                return jsonify({"Erro": "Tipos de dados incorretos nos campos do arquivo", "Detalhes": erros}), 400 
    except Exception as e:
        print("Erro durante o processamento:", str(e))
        return jsonify({"Erro": "Ocorreu um erro durante o processamento"}), 500  











# Rota para contar os templates

@app.route('/count_idtemplates', methods=['GET'])
def count_idtemplates():
    try:
        resultado = dt.get_df('SELECT COUNT(idtemplate) as count_idtemplates FROM projeto."Templates"', DB)

        if resultado is not None and not resultado.empty:
            count_value = resultado['count_idtemplates'].iloc[0]  # Acessando o valor da contagem na primeira linha
            return jsonify({ 'total': int(count_value) })  # Convertendo o valor para int e retornando como JSON
        else:
            return jsonify({ 'error': 'Nenhum resultado retornado' })

    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({ 'error': 'Ocorreu um erro ao processar a solicitação' })

@app.route('/count_status', methods=['GET'])
def count_status():
    try:
        resultado = dt.get_df('SELECT COUNT(idtemplate) as count_status FROM projeto."Templates"  WHERE status = \'Ativo\'', DB)

        if resultado is not None and not resultado.empty:
            count_value = resultado['count_status'].iloc[0]  # Acessando o valor da contagem na primeira linha
            return jsonify({ 'total': int(count_value) })  # Convertendo o valor para int e retornando como JSON
        else:
            return jsonify({ 'error': 'Nenhum resultado retornado' })

    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({ 'error': 'Ocorreu um erro ao processar a solicitação' })

@app.route('/count_statusDesativo', methods=['GET'])
def count_statusDesativo():
    try:
        resultado = dt.get_df('SELECT COUNT(idtemplate) as count_statusDesativo FROM projeto."Templates" WHERE status = \'Desativo\'', DB)
        print(resultado)

        if resultado is not None and not resultado.empty:
            count_value = resultado['count_statusdesativo'].iloc[0]  # Corrigido para 'count_statusdesativo'
            print(count_value)
            return jsonify({ 'total': int(count_value) })  # Convertendo o valor para int e retornando como JSON
        else:
            return jsonify({ 'error': 'Nenhum resultado retornado ou status incorreto' })

    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({ 'error': 'Ocorreu um erro ao processar a solicitação' })


if __name__ == '__main__':
    app.run(debug=True)


if __name__ == '__main__':
    app.run(debug=True)