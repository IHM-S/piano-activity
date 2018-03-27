import os
from flask import Flask, request, render_template, send_from_directory, jsonify
from flask_cors import CORS
from Crypto.Cipher import AES
import base64
import PianoDBConnector

app = Flask(__name__, static_folder=None)
CORS(app)

secret_key = '1234567890123456' # create new & store somewhere safe
cipher = AES.new(secret_key,AES.MODE_ECB) # never use ECB in strong systems obviously
# msg_text = 'test some plain text here'.rjust(32)
# encoded = base64.b64encode(cipher.encrypt(msg_text))
# decoded = cipher.decrypt(base64.b64decode(encoded))
# print decoded.strip()

db_connector = PianoDBConnector.PianoDBConnector()

CLIENT_FOLDER = os.path.abspath('../client/public')

key_names = {'C#':'C#,Db', 'Db':'C#,Db', 'D#':'D#,Eb', 'Eb':'D#,Eb', 'F#':'F#,Gb', 'Gb':'F#,Gb', 'G#':'G#,Ab', 'Ab':'G#,Ab', 'A#':'A#,Bb', 'Bb':'A#,Bb'}

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/nextnote', methods=['GET'])
def next_note():
    print("nextNote Request: ")
    print("    input: " + str(request.args))
    index = int(request.args.get('index'))
    sheet_name = request.args.get('sheetName')

    try:
        user_name, password = cipher.decrypt(base64.b64decode(request.args.get('session').encode())).decode().strip().split(',')
    except:
        return jsonify({'userExistence' : False})

    if user_name is not None and password is not None and db_connector.user_existence(user_name, password):
        temp_result = db_connector.get_note_by_index_and_sheet_name(sheet_name, index)
        if temp_result:
            return jsonify({'userExistence' : True, 'octave' : temp_result[0], 'note' : temp_result[1], 'isFinished' : False})
        else:
            return jsonify({'userExistence' : True, 'isFinished' : True})
    else:
        return jsonify({'userExistence' : False})


@app.route('/checknote', methods=['POST'])
def check_note():
    notes = request.get_json()
    print("checkNote Request: ")
    print("    input: " + str(notes))

    try:
        user_name, password = cipher.decrypt(base64.b64decode(notes['session'].encode())).decode().strip().split(',')
    except:
        return jsonify({'userExistence' : False})

    if user_name is not None and password is not None and db_connector.user_existence(user_name, password):
        db_result = db_connector.get_note_by_index_and_sheet_name(notes['sheetName'], notes['index'])
        if notes['octave'] == db_result[0] and ",".join(notes['notes']) == db_result[1]:
            return jsonify({'userExistence' : True, 'correct' : True})
        else:
            return jsonify({'userExistence' : True, 'correct' : False})
    else:
        return jsonify({'userExistence' : False})

@app.route('/usersignin', methods=['POST'])
def user_sign_in():
    user_info = request.get_json()
    print("SigninRequest: ")
    print("    user info: " + str(user_info))
    if db_connector.insert_new_user(user_info["userName"], user_info["password"]):  # insert to db successfully
        return jsonify({'succeed' : True})
    else:  # user already exist
        return jsonify({'succeed' : False, 'message' : user_info["userName"] + " user name already exist."})

@app.route('/userlogin', methods=['POST'])
def user_log_in():
    """
    check if user name and login is correct and return session to user
    """
    user_info = request.get_json()
    print("LoginRequest: ")
    print("    user info: " + str(user_info))
    if db_connector.user_existence(user_info["userName"], user_info["password"]):
        return jsonify({'userExistence' : True, 'session' : base64.b64encode(cipher.encrypt((user_info["userName"] + "," + user_info["password"]).rjust(32))).decode(), 'userName' : user_info['userName']})
    else:
        return jsonify({'userExistence' : False})

@app.route('/checksession', methods=['POST'])
def check_session():
    """
    checka if session is correct
    """
    session_info = request.get_json()

    print("SessionCheckRequest: ")
    print("    session_info: " + str(session_info))
    print("    user_name: " + user_name)
    print("    password: " + password)

    try:
        user_name, password = cipher.decrypt(base64.b64decode(session_info['session'].encode())).decode().strip().split(',')
    except:
        return jsonify({'userExistence' : False})

    if user_name is not None and password is not None and db_connector.user_existence(user_name, password):
        return jsonify({'userExistence' : True})
    else:
        return jsonify({'userExistence' : False})

@app.route('/getallsheets', methods=['GET'])
def get_all_sheets():
    """
    get all sheets name from db
    """
    return jsonify({'musicSheetNames': db_connector.get_all_sheets()})

@app.route('/addnewsheet', methods=['POST'])
def add_new_sheet():
    session_info = request.get_json()

    print("AddNewSheetRequest: ")
    print("    session_info: " + str(session_info))

    try:
        user_name, password = cipher.decrypt(base64.b64decode(session_info['session'].encode())).decode().strip().split(',')
    except:
        return jsonify({'userExistence' : False})

    if user_name is not None and password is not None and db_connector.user_existence(user_name, password):
        sheet_name = session_info['sheetName']
        content = session_info['content']
        notes_list = list()
        for each_octave_note in content.split('.'):
            octave, note = each_octave_note.strip('[').strip(']').split(',')
            if len(note) == 2:
                note = key_names[note]
            notes_list.append([octave, note])
        if db_connector.insert_new_sheet_music(sheet_name, notes_list):
            return jsonify({'userExistence' : True, 'succeed' : True})
        else:
            return jsonify({'userExistence' : True, 'succeed' : False})
    else:
        return jsonify({'userExistence' : False})

@app.route('/sendcurrentstatus', methods=['POST'])
def send_current_status():
    """
    send status of a user and store it in db, if fail return false
    """
    try:
        info_dict = request.get_json()
        print(info_dict)
        db_connector.store_status(info_dict)
        return jsonify({'succeed' : True}) 
    except:
        print(sys.exc_info()[0])
        return jsonify({'succeed' : False}) 

@app.route('/getcurrentstatus', methods=['GET'])
def get_current_status():
    """
    get current status of the user_name
    """ 
    result_dict = db_connector.get_status(request.args.get('userName'))
    if result_dict:
        result_dict['succeed'] = True
        print(result_dict)
        return jsonify(result_dict)
    else:
        return jsonify({'succeed' : False}) 



@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    print(path)
    return send_from_directory(CLIENT_FOLDER, path)

if __name__ == "__main__":
    app.debug = True
    app.run()
