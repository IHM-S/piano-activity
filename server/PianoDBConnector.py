import sqlite3
import os.path

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
           (userName     TEXT     PRIMARY KEY NOT NULL,
            password     TEXT     NOT NULL);''')

        cur.execute('''CREATE TABLE upto
            (userName    TEXT     PRIMARY KEY NOT NULL,
             sheetName   TEXT     NOT NULL,
             i           INTEGER  NOT NULL);''')

        cur.execute('''CREATE TABLE notes
           (
            sheetName    TEXT     NOT NULL,
            i            INTEGER  NOT NULL,
            octave       INTEGER  NOT NULL,
            note         TEXT     NOT NULL,
            PRIMARY KEY (sheetName, i));''')

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

        for index, note in enumerate(notes):
            cur.execute("INSERT INTO notes (sheetName, i, octave, note) VALUES (?,?,?,?)", (sheet_name, index, note[0], note[1]))

        self.conn.commit()

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

if __name__ == "__main__":
    db = PianoDBConnector()
    # print(db.get_note_by_index_and_sheet_name("hello", 1) )
    # print(db.insert_new_user('ihms', 'lifeishard')
    print(db.user_existence('ihms', '123456'))
