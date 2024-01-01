from decouple import config  # type: ignore
from mysql.connector import connect, Error


class DataBaseCursor:
    def __init__(self):
        try:
            self.connection = connect(
                host=config("mySQLServerIP"),
                user=config("apiUserName"),
                password=config("apiPassword"),
            )
        except Error as e:
            print(e)

        self.cursor = self.connection.cursor()
        self.cursor.execute("USE Hostelo")
        print("Connected to MySQL Server")


databaseCursor = DataBaseCursor()
cursor = databaseCursor.cursor
connection = databaseCursor.connection
