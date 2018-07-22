import pandas as pd
import datetime
import json
from math import radians, cos, sin, asin, sqrt, degrees, atan2


def get_datetime(t):
    if '/' in t:
        return datetime.datetime.strptime(t, '%Y/%m/%d %H:%M:%S')
    else:
        return datetime.datetime.strptime(t, '%Y-%m-%d %H:%M:%S')


def datetime_tostr(d: datetime.datetime, time_format='%Y-%m-%d %H:%M:%S'):
    '''
    Transfer datetime to string.
    :param d:
    :param time_format: datetime format return.
    :return: A String.
    '''
    return d.strftime(time_format)


def read_data(filename):
    df = pd.read_csv(filename)
    df['pickup_datetime'] = df['pickup_datetime'].apply(get_datetime)
    if 'dropoff_datetime' in df.columns:
        df['dropoff_datetime'] = df['dropoff_datetime'].apply(get_datetime)
    if 'trip_duration' not in df.columns:
        if 'duration' in df.columns:
            df['trip_duration'] = df['duration']
    return df


def cal_distance(pos1, pos2):
    '''
    Calculate m from pos1 to pos2
    :param pos1: [lon, lat]
    :param pos2: [lon, lat]
    :return:
    '''
    lon1, lat1, lon2, lat2 = map(radians, [pos1[0], pos1[1], pos2[0], pos2[1]])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # earth radius, km
    return c * r * 1000


def output_json(out, filename):
    with open(filename, 'w') as f:
        out = json.dumps(out)
        f.write(out)
    return


def read_json(filename):
    with open(filename) as f:
        out = json.load(f)
    return out

