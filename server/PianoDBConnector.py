import sqlite3
import os.path
import sys

class PianoDBConnector:

    def __init__(self):
        if os.path.isfile('piano.db'):
            self.conn = sqlite3.connect('piano.db', check_same_thread=False)
            print("Database opened successfully")
        else:
            self.conn = sqlite3.connect('piano.db', check_same_thread=False)
            self.create_new_db()

    def __del__(self):
        self.conn.close()
        print("Database closed successfully")

    def create_new_db(self):
        cur = self.conn.cursor()
        cur.execute('''CREATE TABLE users
            (userName      TEXT     PRIMARY KEY NOT NULL,
             password      TEXT     NOT NULL);''')

        cur.execute('''CREATE TABLE notes
            (sheetName     TEXT     NOT NULL,
             i             INTEGER  NOT NULL,
             octave        INTEGER  NOT NULL,
             note          TEXT     NOT NULL,
             PRIMARY KEY (sheetName, i));''')

        cur.execute('''CREATE TABLE status
            (userName      TEXT     PRIMARY KEY NOT NULL,
             i             INTEGER  NOT NULL,
             sheetName     TEXT     NOT NULL);''')

        cur.execute('''CREATE TABLE list
            (userName      TEXT     NOT NULL,
             correctNote   TEXT     NOT NULL,
             correctOctave INTEGER  NOT NULL,
             enteredOctave INTEGER  NOT NULL,
             enteredNote   TEXT     NOT NULL,
             correct       BOOLEAN  NOT NULL,
             i             INTEGER  NOT NULL,
             PRIMARY KEY (userName, i));''')

        self.conn.commit()

        # while the database is create add some fake data
        self.insert_new_sheet_music("hello",[[0, "C"], [0, 'C#,Db'], [0, 'D'], [1, "B"], [2, "C"]])

        print("Table created successfully")

    def insert_new_sheet_music(self, sheet_name, notes): # [[octave, note], ]
        """
        function insert new music sheet into database,
        name is the name of the music sheet,
        notes is an array of format [[octave, note], [octave, note]]
        """
        cur = self.conn.cursor()

        cur.execute("SELECT * FROM notes WHERE sheetName = ?", (sheet_name,))
        if cur.fetchone is None:
            return False
        else:
            for index, note in enumerate(notes):
                cur.execute("INSERT INTO notes (sheetName, i, octave, note) VALUES (?,?,?,?)", (sheet_name, index, note[0], note[1]))
            self.conn.commit()
            return True

        

    def get_note_by_index_and_sheet_name(self, sheet_name, index):
        """
        function search for the note with the index and sheet id in db,
        if exist return the list contain octave and note,
        if doesn't exist return none
        """
        cur = self.conn.cursor()

        cur.execute("SELECT octave, note FROM notes WHERE sheetName = ? AND i = ?", (sheet_name, index))

        octave_note = cur.fetchone()
        if octave_note:
            return list(octave_note)
        else:
            return None

    def insert_new_user(self, user_name, password):
        """
        function check if user already exist, if user already exist return false, if user doesn't exist return true and insert into db
        """

        cur = self.conn.cursor()

        cur.execute("SELECT * FROM users WHERE userName = ?", (user_name,))
        if cur.fetchone() is None:
            cur.execute("INSERT INTO users (userName, password) VALUES (?,?)", (user_name, password))
            self.conn.commit()
            return True
        else:  # user already exist
            return False

    def user_existence(self, user_name, password):
        """
        check user existence also check if password is correct
        """
        cur = self.conn.cursor()

        cur.execute("SELECT * FROM users WHERE userName = ? and password = ?", (user_name, password))
        if cur.fetchone() is None:
            return False
        else:
            return True

    def get_all_sheets(self):
        """
        get all sheet name
        """
        cur = self.conn.cursor()
        cur.execute("SELECT DISTINCT sheetName FROM notes ORDER BY sheetName ASC")
        result_list = list()
        for each_sheet in cur.fetchall():
            result_list.append(each_sheet[0])
        return result_list

    def store_status(self, info_dict):
        # 'resultList': this.state.resultList,
        # 'index': this.state.index,
        # 'userName': this.state.userName,
        # 'sheetName': this.state.sheetName,

           #  {'correctNote': this.state.currentNote,
           # 'correctOctave': this.state.currentOctave,
           # 'enteredOctave': octave, 
           # 'enteredNote': keyNames.join(','),
           # 'correct': false, 
           # 'index': this.state.index}

           # userName      TEXT     NOT NULL,
           #   correctNote   TEXT     NOT NULL,
           #   correctOctave INTEGER  NOT NULL,
           #   enteredOctave INTEGER  NOT NULL,
           #   enteredNote   TEXT     NOT NULL,
           #   correct       BOOLEAN  NOT NULL,
           #   index         INTEGER  NOT NULL,
        cur = self.conn.cursor()
        cur.execute("INSERT OR REPLACE INTO status (userName, i, sheetName) VALUES (?,?,?)", (info_dict['userName'], info_dict['index'],info_dict['sheetName']))
        cur.execute("DELETE FROM list WHERE userName=?", (info_dict['userName'],))
        for each_result in info_dict['resultList']:
            cur.execute("INSERT INTO list (userName, correctNote, correctOctave, enteredNote, enteredOctave, correct, i) VALUES (?,?,?,?,?,?,?)", 
                (info_dict['userName'],
                 each_result['correctNote'],
                 each_result['correctOctave'],
                 each_result['enteredNote'],
                 each_result['enteredOctave'],
                 each_result['correct'],
                 each_result['index']))
        self.conn.commit()

    def get_status(self, user_name):
        cur = self.conn.cursor()
        result_dict = dict()
        try:
            cur.execute("SELECT i, sheetName FROM status WHERE userName = ?", (user_name,))
            
            result_dict['index'], result_dict['sheetName'] = cur.fetchone()

            cur.execute("SELECT octave, note FROM notes WHERE i = ? AND sheetName = ?", (result_dict['index'], result_dict['sheetName']))
            result_dict['currentOctave'], result_dict['currentNote'] = cur.fetchone()

            result_dict['resultList'] = list()
            cur.execute("SELECT i, correctNote, correctOctave, enteredNote, enteredOctave, correct FROM list WHERE userName = ? ORDER BY i ASC ", (user_name,))
            for each_record in cur.fetchall():
                temp_dict = {'index':each_record[0], 
                             'correctNote':each_record[1], 'correctOctave':each_record[2],
                             'enteredNote':each_record[3], 'enteredOctave':each_record[4],
                             'correct': each_record[5]}
                result_dict['resultList'].append(temp_dict)
            return result_dict
        except sqlite3.OperationalError as e:
            print(e)
            return False
        


if __name__ == "__main__":
    db = PianoDBConnector()
    # print(db.get_note_by_index_and_sheet_name("hello", 1) )
    # print(db.insert_new_user('ihms', 'lifeishard')
    # print(db.user_existence('ihms', '123456'))
    print(db.get_all_sheets())

