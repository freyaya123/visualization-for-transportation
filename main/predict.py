import urllib.request
import json
import datetime
import ssl
import pickle
import pandas as pd

API_KEY = 'AIzaSyC-M_Y50bnkp9j2woeosYRMjScBT_vyipE'
features = ['month', 'weekday', 'google_duration', 'google_distance', 'passenger_count',
            'hour_speed', 'hour']
category = ['month', 'weekday', 'hour', 'passenger_count']


def get_google_arg(pick, drop):
    '''
    Get google predict duration and distance by pick up pos and drop off pos
    :param pick: [lon, lat]
    :param drop: [lon, lat]
    :return: duration, distance
    '''
    origin = '%f,%f' % (pick[1], pick[0])
    destination = '{:f}%2C{:f}%7C' .format(drop[1], drop[0])

    url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' \
          + origin + '&destinations=' + destination + '&key=' + API_KEY
    context = ssl._create_unverified_context()
    response = urllib.request.urlopen(url, context=context)
    result = response.read()
    result = json.loads(result)['rows']
    result = result[0]['elements'][0]
    return result['duration']['value'], result['distance']['value']


def predict_duration(yy, mm, dd, hh, pick, drop, passenger_cnt=1):
    '''
    predict the duration
    :param yy:
    :param mm: 1-6
    :param dd:
    :param hh:
    :param pick:
    :param drop:
    :param passenger_cnt: 1-9
    :return:
    '''
    pick_date = datetime.datetime(yy, mm, dd)
    duration, distance = get_google_arg(pick, drop)
    df = get_test_data()
    test = pd.DataFrame({'month': [mm], 'weekday': pick_date.weekday(), 'google_duration': duration,
                         'google_distance': distance, 'passenger_count': passenger_cnt, 'hour': hh})
    df = pd.concat([df, test])
    df = df.reset_index(drop=True)
    df = pd.get_dummies(df, columns=category, dummy_na=False)
    test = df.loc[len(df)-1]

    bst = pickle.load(open("xg.dat", "rb"))
    preds = bst.predict(test)
    print(preds)
    return preds[0]


def get_test_data():
    df = pd.DataFrame({'month': [x for x in range(1, 7)], 'key': 0})
    tmp = pd.DataFrame({'weekday': [x for x in range(7)], 'key': 0})
    df = pd.merge(df, tmp, on='key')
    tmp = pd.DataFrame({'hour': [x for x in range(24)], 'key': 0})
    df = pd.merge(df, tmp, on='key')
    tmp = pd.DataFrame({'passenger_count': [x for x in range(1, 9)], 'key': 0})
    df = pd.merge(df, tmp, on='key')
    cols = list(set(features) - set(category))
    for col in cols:
        df[col] = 1.0
    return df


if __name__ == '__main__':
    pick = [-73.990318,40.755730]
    drop = [-73.987579,40.769363]
    # print(get_google_arg(pick, drop))
    # get_test_data()

    print(predict_duration(2016, 3, 1, 9, pick, drop, 1))

