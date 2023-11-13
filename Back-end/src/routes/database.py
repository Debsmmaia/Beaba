import pandas as pd
import psycopg2

# DB = 'RISCO_HMG'
# DB_VERDE = 'FIMMES' # HMG
# Configurações de conexão PostgreSQL
DB = {
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': 5432,
    'database': 'postgres',
    'db_type': 'postgresql',
}


def insert(table:str, msg_info:dict, db_config:dict):
    try:
        if db_config['db_type'] == 'postgresql':
            connection_params = {
                'user': db_config['user'],
                'password': db_config['password'],
                'host': db_config['host'],
                'port': db_config['port'],
                'database': db_config['database']
            }
            conn = psycopg2.connect(**connection_params)
        else:
            raise ValueError("Tipo de banco de dados não suportado")


        cursor = conn.cursor()

        # Construa a consulta de inserção com base no dicionário de dados da mensagem
        columns = ', '.join([f'"{column}"' for column in msg_info.keys()])
        values = ', '.join([f"%({column})s" for column in msg_info.keys()])
        insert_query = f"""
            INSERT INTO {table} ({columns})
            VALUES ({values})
        """

        cursor.execute(insert_query, msg_info)
        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"ERROR ao inserir mensagem no banco de dados: {e}")

def update(table: str, msg_info: dict, db_config: dict):
    try:
        if db_config['db_type'] == 'postgresql':
            connection_params = {
                'user': db_config['user'],
                'password': db_config['password'],
                'host': db_config['host'],
                'port': db_config['port'],
                'database': db_config['database']
            }
            conn = psycopg2.connect(**connection_params)
        else:
            raise ValueError("Tipo de banco de dados não suportado")

        cursor = conn.cursor()

        # Extrai o dicionário 'set' de msg_info
        set_info = msg_info.get('set', {})
        update_condition = msg_info.get('where', {})

        # Construa a consulta de atualização com base no dicionário 'set' e na condição de atualização
        update_set = ', '.join([f'"{column}" = %({column})s' for column in set_info.keys()])
        update_condition_str = ' AND '.join([f'"{column}" = %({column})s' for column in update_condition.keys()])
        update_query = f"""
            UPDATE {table}
            SET {update_set}
            WHERE {update_condition_str}
        """

        # Combine os dicionários de informações da mensagem 'set' e da condição de atualização
        update_info = {**set_info, **update_condition}

        cursor.execute(update_query, update_info)
        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"ERROR ao atualizar mensagem no banco de dados: {e}")

def execute(sql_query:str, db_config:dict):
    try:
        if db_config['db_type'] == 'postgresql':
            connection_params = {
                'user': db_config['user'],
                'password': db_config['password'],
                'host': db_config['host'],
                'port': db_config['port'],
                'database': db_config['database']
            }
            conn = psycopg2.connect(**connection_params)

        else:
            raise ValueError("Tipo de banco de dados não suportado")

        cursor = conn.cursor()

        # Execute a consulta SQL
        cursor.execute(sql_query)
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"ERROR ao executar a consulta SQL: {e}")
        print(sql_query)
        
def get_df(sql_query:str, db_config:dict):
    try:
        if db_config['db_type'] == 'postgresql':
            connection_params = {
                'user': db_config['user'],
                'password': db_config['password'],
                'host': db_config['host'],
                'port': db_config['port'],
                'database': db_config['database']
            }
            conn = psycopg2.connect(**connection_params)
        else:
            raise ValueError("Tipo de banco de dados não suportado")

        cursor = conn.cursor()

        # Execute a consulta SQL
        cursor.execute(sql_query)
        
        result = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        df = pd.DataFrame(result, columns=columns)
        
        conn.commit()
        cursor.close()
        conn.close()
        return df
    except Exception as e:
        print(f"ERROR ao executar a consulta SQL: {e}")
        print(sql_query)
