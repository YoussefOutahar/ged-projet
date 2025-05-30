from datetime import datetime

FRENCH_MONTHS = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
]

def get_french_date():
    now = datetime.now()
    return f"{now.day} {FRENCH_MONTHS[now.month - 1]} {now.year}"