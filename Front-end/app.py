from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import psycopg2
import database as dt
import pandas as pd
import openpyxl
from openpyxl.utils.dataframe import dataframe_to_rows
from io import BytesIO

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500", "http://127.0.0.1:5000"]}}, supports_credentials=True)

# Configuração do banco de dados (DB) - substitua com suas credenciais reais

DB = {
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': 5432,
    'database': 'postgres',
    'db_type': 'postgresql',
}

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
