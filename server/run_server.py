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

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/nextnote', methods=['GET'])
def next_note():
    print("nextNote Request: ")
    print("    input: " + str(request.args))
    index = int(request.args.get('index'))
    sheet_name = request.args.get('sheetName')
    user_name, password = cipher.decrypt(base64.b64decode(request.args.get('session').encode())).decode().strip().split(',')
    if user_name is not None and password is not None and db_connector.user_existence(user_name, password):
        temp_result = db_connector.get_note_by_index_and_sheet_name(sheet_name, index)
        if temp_result:
            print("    return: " + str({'userExistence' : True, 'octave' : temp_result[0], 'note' : temp_result[1], 'isFinished' : False}))
            print()
            return jsonify({'userExistence' : True, 'octave' : temp_result[0], 'note' : temp_result[1], 'isFinished' : False})
        else:
            print("    return: " + str({'userExistence' : True, 'isFinished' : True}))
            print()
            return jsonify({'userExistence' : True, 'isFinished' : True})
    else:
        print("    return: " + str({'userExistence' : False}))
        print()
        return jsonify({'userExistence' : False})


@app.route('/checknote', methods=['POST'])
def check_note():
    notes = request.get_json()
    print("checkNote Request: ")
    print("    input: " + str(notes))
    user_name, password = cipher.decrypt(base64.b64decode(notes['session'].encode())).decode().strip().split(',')
    if user_name is not None and password is not None and db_connector.user_existence(user_name, password):
        db_result = db_connector.get_note_by_index_and_sheet_name(notes['sheetName'], notes['index'])
        if notes['octave'] == db_result[0] and ",".join(notes['notes']) == db_result[1]:
            print("    return: " + str({'userExistence' : True, 'correct' : True}))
            print()
            return jsonify({'userExistence' : True, 'correct' : True})
        else:
            print("    return: " + str({'userExistence' : True, 'correct' : False}))
            print()
            return jsonify({'userExistence' : True, 'correct' : False})
    else:
        print("    return: " + str({'userExistence' : False}))
        print()
        return jsonify({'userExistence' : False})

@app.route('/usersignin', methods=['POST'])
def user_sign_in():
    user_info = request.get_json()
    print("SigninRequest: ")
    print("    user info: " + str(user_info))
    if db_connector.insert_new_user(user_info["userName"], user_info["password"]):
        # insert to db successfully
        print("successfully insert user")
        print()
        return jsonify({'succeed' : True})
    else:
        # user already exist
        print("fail to insert user")
        print()
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
    try:
        user_name, password = cipher.decrypt(base64.b64decode(session_info['session'].encode())).decode().strip().split(',')
    except:
        print("SessionCheckRequest: ")
        print("    decryption failed")
        print("    userExistence: " + str(False))
        print()
        return jsonify({'userExistence' : False})

    print("SessionCheckRequest: ")
    print("    session_info: " + str(session_info))
    print("    user_name: " + user_name)
    print("    password: " + password)
    if user_name is not None and password is not None and db_connector.user_existence(user_name, password):
        print("    userExistence: " + str(True))
        print()
        return jsonify({'userExistence' : True})
    else:
        print("    userExistence: " + str(False))
        print()
        return jsonify({'userExistence' : False})


# @app.route('/piano/', methods=['GET'])
# def serve_app():
#     return send_from_directory(CLIENT_FOLDER, 'index.html')



@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    print(path)
    return send_from_directory(CLIENT_FOLDER, path)

if __name__ == "__main__":
    app.debug = True
    app.run()
