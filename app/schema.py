import os

SCHEMA = 'https://' if 'REQUESTS_CA_BUNDLE' in os.environ \
                       and os.environ['REQUESTS_CA_BUNDLE'] != '' else 'http://'

