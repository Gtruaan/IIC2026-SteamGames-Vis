import json
import pandas as pd

# Cargar el archivo JSON
with open('./dataset.json') as file:
    data = json.load(file)

# Tu conjunto de datos en formato de diccionario

# Crear un DataFrame a partir del conjunto de datos
df = pd.DataFrame.from_dict(data, orient='index')

# Reemplazar los valores NaN por 0
df_filled = df.fillna(0)

# Guardar el DataFrame en un nuevo archivo JSON
df_filled.to_json('nuevo_dataset.json', orient='index')




# Otro metodo guardado para vis1
#const maxAvgPlayers = d3.max(Object.values(dataset), d => d.history[57]?.avg_players);