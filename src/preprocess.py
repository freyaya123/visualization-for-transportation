import pandas as pd
import numpy as np
import xgboost as xgb
import datetime
import pickle
from sklearn.linear_model import LinearRegression

from src.fun import read_data, datetime_tostr, cal_distance, output_json


features = ['month', 'weekday', 'google_duration', 'google_distance', 'passenger_count',
            'hour_speed', 'hour']
category = ['month', 'weekday', 'hour', 'passenger_count']
target = ['trip_duration']
distance_ratio = 1.3540919895360521
speed_ratio = 4.844430423303414
lon_min, lon_max = -74.1, -73.6
lat_min, lat_max = 40.5, 41


def preprocess(df, is_test=False):
    hour_speed = pd.read_csv('../statistics/hour_speed.csv')
    hour_speed = hour_speed.set_index(hour_speed.hour)
    st_speed = pd.read_csv('../statistics/hour_grid_speed_0.01.csv')
    st_speed['ind'] = ['%d|%s' % (st_speed.hour[i], st_speed.grid[i]) for i in range(len(st_speed))]
    st_speed = st_speed.set_index(st_speed.ind)
    # print(st_speed)

    if not is_test:
        df = df[df.google_duration < 99999]
        df = df.reset_index(drop=True)
    df['month'] = [x.month for x in df.pickup_datetime]
    df['weekday'] = [x.weekday() for x in df.pickup_datetime]
    df['hour'] = [(df.pickup_datetime[i] + datetime.timedelta(seconds=df.google_duration[i]/2)).hour
                  for i in range(len(df))]
    df.passenger_count[df.passenger_count != 1] = 2
    df['hour_speed'] = [hour_speed.loc[df.hour[i]][0] for i in range(len(df))]
    df['grid'] = ['%d|%.2f|%.2f' % (df.hour[i], (df.pickup_longitude[i] + df.dropoff_longitude[i]) / 2-0.01/2,
                                    (df.dropoff_latitude[i] + df.pickup_latitude[i]) / 2-0.01/2) for i in range(len(df))]
    print('In index %d' % sum([x in st_speed.index for x in df.grid]))
    df['st_speed'] = [st_speed.loc[df.grid[i]].speed if df.grid[i] in st_speed.index else df.hour_speed[i]
                      for i in range(len(df))]
    if is_test:
        df = df[features]
    else:
        df = df[features+target]
    df.to_csv('../processed_data/try.csv')
    print(len(df))
    df = df.dropna(axis=1, how='any')
    df = pd.get_dummies(df, columns=category, dummy_na=False)

    return df


def test_accuracy(df):
    np.random.seed(1)
    ind = np.random.rand(len(df)) < 0.8
    train = df[ind]
    test = df[~ind]

    predictors = sorted(list(set(test.columns) - set(target)))
    bst = pickle.load(open("xg.dat", "rb"))
    preds = bst.predict(test[predictors])
    print(preds)
    print(accuracy(test[target].values.ravel(), preds))


def cal_hour_speed():
    '''
    calculate daily hourly order number and speed
    For every day:
        output a DataFrame['hour', 'order', 'speed']
        csv name = date.csv
    :return:
    '''
    # df = read_data('../processed_data/test_train_google2.csv')
    df = read_data('../processed_data/train.csv')
    print('Total samples:', len(df))

    df['hour'] = [(df.pickup_datetime[i] + (df.dropoff_datetime[i] - df.pickup_datetime[i])/2).hour
                  for i in range(len(df))]
    df['actual_distance'] = [distance_ratio*cal_distance([df.pickup_longitude[i], df.pickup_latitude[i]],
                                                         [df.dropoff_longitude[i], df.dropoff_latitude[i]])
                             for i in range(len(df))]
    if 'trip_duration' not in df.columns:
        df['trip_duration'] = df.duration

    # if i>10: break
    tmp = df
    tables = pd.pivot_table(tmp[['hour', 'actual_distance', 'trip_duration']], index=['hour'],
                            values=['actual_distance', 'trip_duration'], aggfunc=[np.sum])
    tables = tables['sum']
    # print(tables)
    tables['speed'] = tables.actual_distance/tables.trip_duration
    tables = tables[['speed']]
    tables = tables.reset_index()
    tables = tables.rename(index=str, columns={'index': 'hour'})
    print(tables)
    tables.to_csv('../statistics/hour_speed.csv', index=False)
    # df['speed'] = df.actual_distance/df.trip_duration
    # print(df.head())


def cal_st_speed():
    '''
    Calculate hourly grid speed
    gride: 0.1x0.1
    :return:
    '''
    # df = read_data('../processed_data/test_train_google2.csv')
    df = read_data('../processed_data/train.csv')
    # print(df.dtypes)
    print('Total samples:', len(df))
    df = df.loc[(lon_min <= df.pickup_longitude) & (df.pickup_longitude <= lon_max) &
                (lat_min <= df.pickup_latitude) & (df.pickup_latitude <= lat_max)]
    df = df.reset_index(drop=True)
    print('After preprocessing1', len(df))
    df = df.loc[(lon_min <= df.dropoff_longitude) & (df.dropoff_longitude <= lon_max) &
                (lat_min <= df.dropoff_latitude) & (df.dropoff_latitude <= lat_max)]
    df = df.reset_index(drop=True)
    print('Total samples:', len(df))

    distance_ratio = 1.3540919895360521

    df['hour'] = [(df.pickup_datetime[i] + (df.dropoff_datetime[i] - df.pickup_datetime[i]) / 2).hour
                  for i in range(len(df))]
    df['actual_distance'] = [distance_ratio * cal_distance([df.pickup_longitude[i], df.pickup_latitude[i]],
                                                           [df.dropoff_longitude[i], df.dropoff_latitude[i]])
                             for i in range(len(df))]
    if 'trip_duration' not in df.columns:
        df['trip_duration'] = df.duration

    df['grid'] = ['%.2f|%.2f' % ((df.pickup_longitude[i] + df.dropoff_longitude[i])/2-0.01/2,
                                 (df.dropoff_latitude[i] + df.pickup_latitude[i])/2-0.01/2) for i in range(len(df))]
    df['order'] = 1
    # if i>10: break
    tmp = df
    tables = pd.pivot_table(tmp[['hour', 'actual_distance', 'trip_duration', 'grid', 'order']], index=['hour', 'grid'],
                            values=['actual_distance', 'trip_duration', 'order'], aggfunc=[np.sum])
    tables = tables['sum']
    # print(tables)
    tables['speed'] = tables.actual_distance / tables.trip_duration
    # tables = tables[['speed']]
    tables = tables.reset_index()
    tables = tables.rename(index=str, columns={'index': 'hour'})
    print(tables, sum(tables.order<20))
    tables.to_csv('../statistics/hour_grid_speed_total_0.01.csv', index=False)
    tables = tables[tables.order>20]
    tables.to_csv('../statistics/hour_grid_speed_0.01.csv', index=False)


def get_st_speed_plot():
    '''
    Data for plot st_speed
    for every hour:
        x: lon index
        y: lat index
        [[x, y, value]]
    :return:
    '''
    speed = pd.read_csv('../statistics/hour_grid_speed_total_0.01.csv')
    speed = speed[speed.order > 5]
    speed = speed.reset_index(drop=True)
    print(len(speed))

    res = {}
    for h in range(24):
        tmp = speed[speed.hour == h]
        tmp = tmp.reset_index(drop=True)
        pos = [x.split('|') for x in tmp.grid]
        pos = [[float(pos[i][0]), float(pos[i][1]), tmp.speed[i]] for i in range(len(tmp))]
        pos = [[round((x[0]-lon_min)*100), round((x[1]-lat_min)*100), map_speed(x[2])] for x in pos]
        pos = {'%d|%d' % (x[0], x[1]): x[2] for x in pos}
        print(len(pos), pos)
        out = []
        print(int((lon_max-lon_min)/0.01), int((lat_max-lat_min)/0.01))
        for x in range(int((lon_max-lon_min)/0.01)):
            for y in range(int((lat_max-lat_min)/0.01)):
                if '%d|%d' % (x, y) in pos:
                    out.append([x, y, pos['%d|%d' % (x, y)]])
                else:
                    out.append([x, y, 0])
        print(out)
        res[str(h)] = out
    output_json(res, '../processed_data/hour_speed_discrete/hour_speed_discrete.json')



def map_speed(speed):
    '''
    map speed to discrete number:
    1: >80km/h
    2: 60-80km/h
    3: 40-60km/h
    4: 20-40km/h
    5: <20km/h
    :param speed: A real number
    :return:
    '''
    speed = speed*3600/1000
    if speed > 60:
        return 1
    elif speed > 40:
        return 2
    elif speed > 30:
        return 3
    elif speed > 15:
        return 4
    else:
        return 5


def model(df):
    np.random.seed(1)
    ind = np.random.rand(len(df)) < 0.8
    train = df[ind]
    test = df[~ind]
    xg_train(train, test)


def xg_train(train, test):
    predictors = sorted(list(set(train.columns) - set(target)))
    print(predictors)
    print(train[predictors].columns, train.head())

    bst = xgb.XGBRegressor(seed=100, max_depth=3, n_estimators=50, learning_rate=0.035,
                           nthread=4, base_score=0.5)
    bst.fit(train[predictors], train[target].values.ravel())
    pickle.dump(bst, open("xg.dat", "wb"))
    bst2 = pickle.load(open("xg.dat", "rb"))
    preds = bst2.predict(test[predictors])
    print(preds)
    print(accuracy(test[target].values.ravel(), preds))
    print(accuracy(test[target], test.google_duration))


def lr_train(train, test):
    train_x = train.drop(target, axis=1)
    train_y = train[target]
    test_x = test.drop(target, axis=1)
    test_y = test[target]
    lr = LinearRegression()
    lr.fit(train_x, train_y)

    # Predict
    preds = lr.predict(test_x)
    preds = np.array([x[0] for x in preds])
    acc = accuracy(test_y, preds)
    print(acc)
    preds = lr.predict(train_x)
    preds = np.array([x[0] for x in preds])
    acc = accuracy(train_y, preds)
    print(acc)
    print(accuracy(test.duration, test.google_duration))


def accuracy(actual, pre):
    actual = np.array(actual)
    pre = np.array(pre)
    pre[pre<0.1] = 0.1
    return np.sqrt(np.mean((np.log(pre+1) - np.log(actual+1))**2))


def cal_duration_ratio():
    # df = read_data('../processed_data/test_train_google2.csv')
    df = read_data('../processed_data/train.csv')
    df['actual_distance'] = [distance_ratio * cal_distance([df.pickup_longitude[i], df.pickup_latitude[i]],
                                                           [df.dropoff_longitude[i], df.dropoff_latitude[i]])
                             for i in range(len(df))]
    return sum(df.actual_distance)/sum(df.trip_duration)


def predict_test():
    df = read_data('../processed_data/test_google.csv')
    print(len(df))
    inds = df[df.google_duration >= 99999].index
    ids = df.id
    df['actual_distance'] = [distance_ratio * cal_distance([df.pickup_longitude[i], df.pickup_latitude[i]],
                                                           [df.dropoff_longitude[i], df.dropoff_latitude[i]])
                             for i in range(len(df))]
    for ind in inds:
        df.google_duration[ind] = df.actual_distance[ind]/speed_ratio
        df.google_distance[ind] = df.actual_distance[ind]
    print(sum(df.google_duration > 99999), len(df))

    df = preprocess(df, is_test=True)
    predictors = sorted(df.columns)
    bst2 = pickle.load(open("xg.dat", "rb"))
    preds = bst2.predict(df[predictors])

    out = pd.DataFrame({'id': ids, 'trip_duration': preds})
    out.to_csv('../sub/sub_test.csv', index=False)


if __name__ == '__main__':
    # df = read_data('../data/test.csv')
    # df = read_data('../processed_data/test_train_google_19999.csv')
    df = read_data('../processed_data/train/train_google80000_120000.csv')
    df = preprocess(df)

    # print(df.dtypes)
    # df['month'] = [x.month for x in df.pickup_datetime]
    # print(max(df.pickup_datetime), min(df.pickup_datetime))
    # print(accuracy(df.duration, df.google_duration))

    model(df)
    # test_accuracy(df)

    # cal_hour_speed()
    # cal_st_speed()
    # get_st_speed_plot()
    # print(cal_duration_ratio())

    # Predict Test
    # predict_test()
