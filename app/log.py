import datetime


def log(text):
    now = datetime.datetime.now()
    time = str(now.strftime("%d-%m-%y %H:%M - "))
    return time+text
