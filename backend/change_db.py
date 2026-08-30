import sqlite3

conn = sqlite3.connect(r"C:\Users\Sashka\Desktop\test_project\backend\clinic.db")  

conn.execute(
    "UPDATE users SET role = 'admin' WHERE email = ?",
    ("admin@example.com",)
)

conn.commit()
conn.close()