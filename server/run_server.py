import os
from flask import Flask, request, render_template, send_from_directory, jsonify
from flask_cors import CORS
import PianoDBConnector

app = Flask(__name__, static_folder=None)
CORS(app)

db_connector = PianoDBConnector.PianoDBConnector()

CLIENT_FOLDER = os.path.abspath('../client/public')

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/nextnote', methods=['GET'])
def next_note():
    print()
    print("getting next note")
    index = int(request.args.get('index'))
    temp_result = db_connector.get_note_by_index_and_sheetID(1, index) 
    if temp_result:
        print("    [octave, note]: " + str(temp_result))
        return jsonify({'octave' : temp_result[0], 'note' : temp_result[1], 'isFinished' : False})
    else:
        print("    no more notes")
        return jsonify({'isFinished' : True})

@app.route('/checknote', methods=['POST'])
def check_note():
    notes = request.get_json()
    print(notes)

    db_result = db_connector.get_note_by_index_and_sheetID(notes['sheetID'], notes['index'])
    if notes['octave'] == db_result[0] and ",".join(notes['notes']) == db_result[1]:
        return jsonify({'correct' : True})
    else:
        return jsonify({'correct' : False})

@app.route('/piano/', methods=['GET'])
def serve_app():
    return send_from_directory(CLIENT_FOLDER, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    print(path)
    return send_from_directory(CLIENT_FOLDER, path)
 
if __name__ == "__main__":
    app.debug = True
    app.run()
