Django Backend

The backend uses SQLite by default, so it runs without a database server. Set
`USE_MYSQL=1` to use MySQL instead. MySQL uses the pure-Python `PyMySQL`
driver; this deliberately avoids `mysqlclient`, which needs native MySQL
development libraries and can fail while building a wheel.

Recommended local setup:

1. Create and activate a virtualenv:
   python3 -m venv .venv
   source .venv/bin/activate

2. Install requirements:
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt

3. Check and start the server:
   python manage.py check
   python manage.py migrate
   python manage.py runserver

4. To use MySQL, provide the connection variables before migrating:
   USE_MYSQL=1 MYSQL_DATABASE=bookstore_db MYSQL_USER=root MYSQL_PASSWORD=... python manage.py migrate

Do not install from `requirement.txt` in new setup instructions; it only
forwards to the canonical `requirements.txt` for compatibility.
