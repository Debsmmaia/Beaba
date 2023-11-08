from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500", "http://127.0.0.1:5000"]}}, supports_credentials=True)

# Inicializa a variável
totalAprovados = 0
totalReprovados = 0
# total = 0

#Aprovados

@app.route('/incrementarAprovados', methods=['POST'])
def incrementarAprovados():
    global totalAprovados
    totalAprovados += 1
    return jsonify(totalAprovados=totalAprovados)

@app.route('/mostrarAprovados', methods=['GET'])
def mostrarAprovados():
    global totalAprovados
    return jsonify(totalAprovados=totalAprovados)

#Reprovados

@app.route('/incrementarReprovados', methods=['POST'])
def incrementarReprovados():
    global totalReprovados
    totalReprovados += 1
    return jsonify(totalReprovados=totalReprovados)

@app.route('/mostrarReprovados', methods=['GET'])
def mostrarReprovados():
    global totalReprovados
    return jsonify(totalReprovados=totalReprovados)

#Total
# @app.route('/total', methods=['POST'])  # Modificado para GET
# def total():
#     global total
#     total = totalAprovados + totalReprovados
#     return jsonify(total=total)

# @app.route('/mostrarTotal', methods=['GET'])  # Modificado para GET
# def mostrartotal():
#     global total
#     return jsonify(total=total)


if __name__ == '__main__':
    app.run(debug=True)
