import requests


################################################################################
# Vars
globUrl = 'https://homepairs-alpha.herokuapp.com/'
globUrl = 'http://localhost:8000/'
globUrl = 'https://homepairs-mytest.herokuapp.com/'


# Everything is correct
def test_basic_connection():
    url = globUrl + 'apikey'

    x = requests.get(url)
    print(x.text)


if __name__ == '__main__':
    print("Testing")
    test_basic_connection()
