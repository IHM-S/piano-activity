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
           (userName    TEXT     PRIMARY KEY NOT NULL,
            password    TEXT     NOT NULL,
            email       TEXT     UNIQUE NOT NULL);''')

        cur.execute('''CREATE TABLE sheetMusics
           (sheetID     INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
            name        TEXT     UNIQUE NOT NULL);''')
        cur.execute('''CREATE INDEX name_index ON sheetMusics(name)''')


        cur.execute('''CREATE TABLE notes
           (
            sheetID     INTEGER  NOT NULL,
            i           INTEGER  NOT NULL,
            octave      INTEGER  NOT NULL,
            note        TEXT     NOT NULL,
            PRIMARY KEY (sheetID, i),
            FOREIGN KEY (sheetID) REFERENCES sheetMusics(sheetID)
            );''')

        self.conn.commit()
        print("Table created successfully")

    def insert_new_sheet_music(self, name, notes): # [[octave, note], ]
        cur = self.conn.cursor()

        cur.execute("INSERT INTO sheetMusics (name) VALUES (?)", (name,))
        cur.execute("SELECT last_insert_rowid()")
        sheetID = cur.fetchone()[0]

        for index, note in enumerate(notes):
            cur.execute("INSERT INTO notes (sheetID, i, octave, note) VALUES (?,?,?,?)", (sheetID, index, note[0], note[1]))

        self.conn.commit()

    def get_note_by_index_and_sheetID(self, sheetID, index):
        """
        function search for the note with the index and sheet id in db, 
        if exist return the list contain octave and note,
        if doesn't exist return none
        """
        cur = self.conn.cursor()

        cur.execute("SELECT octave, note FROM notes WHERE sheetID = ? AND i = ?", (sheetID, index))
        
        octave_note = cur.fetchone()
        if octave_note:
            return list(octave_note)
        else:
            return None


if __name__ == "__main__":
    db = PianoDBConnector()
    # db.insert_new_sheet_music("hello",[[0, "C"], [0, 'C#,Db'], [0, 'D']])
    print(db.get_note_by_index_and_sheetID(1, 1) )
