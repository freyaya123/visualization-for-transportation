import pandas as pd
import datetime
import urllib.request
import json
import ssl
import random
import _thread

data_dir = 'data/'
API_KEY = 'AIzaSyC-M_Y50bnkp9j2woeosYRMjScBT_vyipE'


def get_datetime(t):
    if '/' in t:
        return datetime.datetime.strptime(t, '%Y/%m/%d %H:%M:%S')
    else:
        return datetime.datetime.strptime(t, '%Y-%m-%d %H:%M:%S')


def trying(x):
    return (x['dropoff_datetime']-x['pickup_datetime']).total_seconds()


def get_google_feature(df, batch_size=10, out_name='../processed_data/test_train_google'):
    '''
    Use google to get the duration and actual distance from pick up point to drop off point.
    :param df: DataFrame
    :param batch_size:
    :return:
    '''
    durations = []
    distances = []
    N = len(df)
    origin = ''
    destination = ''
    for i in range(N):
        if origin != '':
            origin += '|'
        if destination != '':
            destination += '|'
        origin += '%.6f,%.6f' % (df.pickup_latitude[i], df.pickup_longitude[i])
        destination += '{:.6f}%2C{:.6f}%7C' .format(df.dropoff_latitude[i], df.dropoff_longitude[i])

        if i % batch_size == batch_size-1:
            url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' \
                  + origin + '&destinations=' + destination + '&key=' + API_KEY
            print(len(url))
            print(url)
            context = ssl._create_unverified_context()
            response = urllib.request.urlopen(url, context=context)
            result = response.read()
            result = json.loads(result)['rows']

            for j in range(batch_size):
                tmp = result[j]['elements'][j]
                if tmp['status'] != 'OK':
                    print('row %d is wrong. Nothing searched.' % i)
                    durations.append(999999)
                    distances.append(999999)
                    continue
                durations.append(tmp['duration']['value'])
                distances.append(tmp['distance']['value'])
                # print(origin, destination)
            print('row %d: length=%d' % (i, len(durations)))

            destination = ''
            origin = ''
        if i % 20000 == 19999:
            out = df[:(i+1)]
            print(len(out), len(durations), len(distances))
            out['google_duration'] = durations
            out['google_distance'] = distances
            out.to_csv(out_name+'_'+str(i+1)+'.csv', index=False)

            out = pd.DataFrame({'durations': durations, 'distances': distances})
            out.to_csv(out_name + '_durations.csv', index=False)
    print(len(durations))

    df['google_duration'] = durations
    df['google_distance'] = distances
    df.to_csv(out_name+'.csv', index=False)

    return df


def multi_get_google_feature(df, batch_size=10, out_name='../processed_data/test_train_google'):
    dfs = [df[:50], df[50:]]
    _thread.start_new(get_google_feature, (dfs[0], batch_size, out_name))
    _thread.start_new(get_google_feature, (dfs[1], batch_size, out_name))


if __name__ == '__main__':
    df = pd.read_csv('../processed_data/train.csv')
    random.seed(1)
    ind = [random.random() < 0.2 for _ in range(len(df))]
    df = df[ind]
    df = df.reset_index(drop=True)
    # df = pd.read_csv('../data/test.csv')
    df['pickup_datetime'] = df['pickup_datetime'].apply(get_datetime)
    if 'dropoff_datetime' in df.columns:
        df['dropoff_datetime'] = df['dropoff_datetime'].apply(get_datetime)
    # df['duration'] = df.apply(trying, axis=1)
    print('Total rows =', len(df))
    print(len(df))

    df = df[80000:]
    df = df.reset_index(drop=True)
    get_google_feature(df, batch_size=10, out_name='../processed_data/train/train_google80000')
    # multi_get_google_feature(df, batch_size=10, out_name='../processed_data/train/train_google80000')

