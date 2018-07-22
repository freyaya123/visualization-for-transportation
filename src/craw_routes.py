import pandas as pd
import datetime
import urllib.request
import json
import ssl
import numpy as np
import matplotlib.pyplot as plt
from src.fun import read_data, output_json, datetime_tostr, get_datetime, cal_distance, read_json


lon_min, lon_max = -75, -72
lat_min, lat_max = 40, 41


def get_routes(origin, destination):
    '''
    Get routes from url
    :param origin: [lon, lat]
    :param destination: [lon, lat]
    :return:
    '''
    url = 'https://maps.googleapis.com/maps/api/directions/json?origin=%f,%f' \
          '&destination=%f,%f&key=AIzaSyC-M_Y50bnkp9j2woeosYRMjScBT_vyipE' \
          % (origin[1], origin[0], destination[1], destination[0])
    context = ssl._create_unverified_context()
    response = urllib.request.urlopen(url, context=context)
    result = response.read()
    result = json.loads(result)
    result = result['routes'][0]['legs'][0]
    out = {}
    out['distance'] = result['distance']['value']
    out['google_duration'] = result['duration']['value']

    routes = [[result['start_location']['lng'], result['start_location']['lat']]]
    pre_road_time = []
    steps = result['steps']
    for i in range(len(steps)):
        routes.append([steps[i]['end_location']['lng'], steps[i]['end_location']['lat']])
        pre_road_time.append(steps[i]['duration']['value'])
    out['routes'] = routes
    out['pre_road_time'] = pre_road_time
    return out


def get_df_routes(yy=2016, mm=3, day=1, hh_start=9, hh_end=10):
    '''
    Output {'year':, 'month':, 'day':, 'start_hour':, 'end_hour':
            'routes': {'distance':, 'google_duration':, 'routes':[[lon, lat]], 'pre_road_time':[],
                        'pickup_datetime':, 'dropoff_datetime':, 'duration':},
    :param yy:
    :param mm:
    :param day:
    :param hh_start:
    :param hh_end:
    :return:
    '''
    df = read_data('../data/train.csv')
    time_start = datetime.datetime(yy, mm, day, hh_start)
    if hh_end != 24:
        time_end = datetime.datetime(yy, mm, day, hh_end) - datetime.timedelta(seconds=1)
    else:
        time_end = datetime.datetime(yy, mm, day, 23, 59, 59)
    df = df[(time_start <= df.pickup_datetime) & (df.pickup_datetime < time_end)]
    print(len(df))
    df = df.reset_index(drop=True)

    outs = []
    for i in range(len(df)):
        origin = [df.pickup_longitude[i], df.pickup_latitude[i]]
        destination = [df.dropoff_longitude[i], df.dropoff_latitude[i]]
        out = get_routes(origin, destination)
        out['pickup_datetime'] = datetime_tostr(df.pickup_datetime[i])
        out['dropoff_datetime'] = datetime_tostr(df.dropoff_datetime[i])
        out['duration'] = (df.dropoff_datetime[i] - df.pickup_datetime[i]).total_seconds()
        outs.append(out)
        print('Row %d: duration = %f' % (i, out['duration']))
    outs = {'year': yy, 'month': mm, 'day': day, 'start_hour': hh_start, 'end_hour': hh_end, 'routes': outs}
    output_json(outs, '../processed_data/routes/%d-%d-%d_%d-%d.json' % (yy, mm, day, hh_start, hh_end))


def output_routes(json_name, out_name='../processed_data/well_routes/2016-3-1_9-10.json'):
    '''
    Output {'data': [{'pick_time':, 'routes':[[lon, lat]]}]}
    For yuyan
    :param json_name:
    :return:
    '''
    with open(json_name) as f:
        res = json.load(f)
    out = []
    for r in res['routes']:
        tmp = {'pick_time': r['pickup_datetime']}
        tmp['routes'] = [y for x in r['routes'] for y in x]
        out.append(tmp)
    out = {'data': out}
    output_json(out, out_name)

    print(res)


def output_heaptmap(json_name, give_time, res = None):
    '''
    Output {'time':, 'positions':[[lon, lat]]}
    Need to calculate where the position with the given time
    :param json_name:
    :param output_name:
    :param give_time: A datetime
    :return:
    '''
    if res is None:
        with open(json_name) as f:
            res = json.load(f)
    positions = []
    for r in res['routes']:
        pick_time = get_datetime(r['pickup_datetime'])
        if pick_time <= give_time <= get_datetime(r['dropoff_datetime']):
            road_time = r['pre_road_time']
            if r['google_duration'] == 0:
                r['google_duration'] = r['duration']
            road_time = [x * r['duration']/r['google_duration'] for x in road_time]
            # print(road_time)

            if pick_time == give_time:
                positions.append(r['routes'][0])
                continue
            for i in range(len(road_time)):
                next_time = pick_time + datetime.timedelta(seconds=road_time[i])
                if next_time < give_time:
                    pick_time = next_time
                    continue
                p = (give_time - pick_time).total_seconds() / (next_time - pick_time).total_seconds()
                pick_pos = r['routes'][i]
                next_pos = r['routes'][i+1]
                lon = pick_pos[0] + p * (next_pos[0] - pick_pos[0])
                lat = pick_pos[1] + p * (next_pos[1] - pick_pos[1])
                positions.append([lon, lat])
        else:
            continue
    out = {'time': datetime_tostr(give_time), 'positions': positions}
    return out


def output_multitime_heaptmap(json_name, give_times, out_name='../processed_data/well_heatmap/2016-3-1_9-10.json'):
    '''
    Output {'data': [{'time':, 'positions':[[lon, lat]]}]}
    :param json_name:
    :param give_times:
    :return:
    '''
    with open(json_name) as f:
        res = json.load(f)
    outs = []
    for give_time in give_times:
        outs.append(output_heaptmap(json_name, give_time, res=res))
    outs = {'data': outs}
    output_json(outs, out_name)


def get_day_time(yy, mm, dd, time_interval=15):
    give_times = [datetime.datetime(yy, mm, dd, 6)]
    end_time = datetime.datetime(yy, mm, dd, 22)
    for i in range(1000):
        give_time = give_times[-1] + datetime.timedelta(minutes=time_interval)
        if give_time > end_time:
            break
        give_times.append(give_time)
    return give_times


def cal_distance_ratio():
    df = read_data('../processed_data/test_train_google_19999.csv')
    df = df[df.google_distance < 1000000]
    df = df.reset_index(drop=True)
    ratio = [df.google_distance[i]/cal_distance([df.pickup_longitude[i], df.pickup_latitude[i]],
                                                [df.dropoff_longitude[i], df.dropoff_latitude[i]])
             for i in range(len(df))]
    print(ratio)
    print(min(ratio))
    ratio = [x for x in ratio if 1 <= x <= 2]
    pd.DataFrame({'ratio': ratio}).to_csv('../statistics/distance_ratio.csv', index=False)
    return np.mean(ratio) # 1.3540919895360521


def cal_day_order_speed():
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

    distance_ratio = 1.3540919895360521

    df['date'] = [datetime_tostr(t, '%Y-%m-%d') for t in df.pickup_datetime]
    df['hour'] = [t.hour for t in df.pickup_datetime]
    dates = np.unique(df.date)
    df['actual_distance'] = [distance_ratio*cal_distance([df.pickup_longitude[i], df.pickup_latitude[i]],
                                                         [df.dropoff_longitude[i], df.dropoff_latitude[i]])
                             for i in range(len(df))]
    df['order'] = 1
    if 'trip_duration' not in df.columns:
        df['trip_duration'] = df.duration

    for i, day in enumerate(dates):
        # if i>10: break
        tmp = df[df.date == day]
        print('Day %s: total order = %d' % (day, len(tmp)))
        tables = pd.pivot_table(tmp[['hour', 'actual_distance', 'trip_duration', 'order']], index=['hour'],
                                values=['actual_distance', 'trip_duration', 'order'], aggfunc=[np.sum])
        tables = tables['sum']
        # print(tables)
        tables['speed'] = tables.actual_distance/tables.trip_duration
        tables = tables[['speed', 'order']]
        tables = tables.reset_index()
        tables = tables.rename(index=str, columns={'index': 'hour'})
        print(tables)
        tables.to_csv('../processed_data/order_speed/%s.csv' % day, index=False)
    # df['speed'] = df.actual_distance/df.trip_duration
    # print(df.head())


def cal_daily_order():
    '''
    calculate daily order number
    Output DataFrame['date', 'count']
    :return:
    '''
    # df = read_data('../processed_data/test_train_google2.csv')
    df = read_data('../processed_data/train.csv')
    print('Total samples:', len(df))

    df['date'] = [datetime_tostr(t, '%Y-%m-%d') for t in df.pickup_datetime]
    tables = pd.pivot_table(df[['date', 'id']], index=['date'], values=['id'], aggfunc=[len])
    tables = tables['len']
    tables = tables.reset_index()
    tables = tables.rename(index=str, columns={'index': 'date', 'id': 'count'})
    tables.to_csv('../processed_data/daily_order_count/daily_order.csv', index=False)
    print(tables)


def process_train():
    df = read_data('../data/train.csv')
    print('Total samples:', len(df))
    df = df.loc[(lon_min <= df.pickup_longitude) & (df.pickup_longitude <= lon_max) &
                (lat_min <= df.pickup_latitude) & (df.pickup_latitude <= lat_max)]
    df = df.reset_index(drop=True)
    print('After preprocessing1', len(df))
    df = df.loc[(lon_min <= df.dropoff_longitude) & (df.dropoff_longitude <= lon_max) &
                (lat_min <= df.dropoff_latitude) & (df.dropoff_latitude <= lat_max)]
    df = df.reset_index(drop=True)
    print('After preprocessing1', len(df))
    df.to_csv('../processed_data/train.csv', index=False)


def output_daily_hour_origin_destination():
    '''
    For every day:
        {'pick up': {'6': [[lon, lat]]}, 'drop off': {'6': [[lon, lat]]}
    :return:
    '''
    # df = read_data('../processed_data/test_train_google2.csv')
    df = read_data('../processed_data/train.csv')
    print('Total samples:', len(df))

    df['date'] = [datetime_tostr(t, '%Y-%m-%d') for t in df.pickup_datetime]
    df['pick_hour'] = [t.hour for t in df.pickup_datetime]
    df['drop_hour'] = [t.hour for t in df.dropoff_datetime]
    dates = np.unique(df.date)

    for i, day in enumerate(dates):
        # if i>10: continue

        picks = {}
        drops = {}

        for hour in range(24):
            tmp = df[(df.date == day) & (df.pick_hour == hour)]
            tmp = tmp.reset_index(drop=True)
            pick_positions = [[tmp.pickup_longitude[i], tmp.pickup_latitude[i]] for i in range(len(tmp))]

            tmp = df[(df.date == day) & (df.drop_hour == hour)]
            tmp = tmp.reset_index(drop=True)
            drop_positions = [[tmp.dropoff_longitude[i], tmp.dropoff_latitude[i]] for i in range(len(tmp))]
            picks[str(hour)] = pick_positions
            drops[str(hour)] = drop_positions

        out = {'pick': picks, 'drop': drops}
        output_json(out, '../processed_data/daily_hourly_od/%s.json' % day)


def output_one_day_routes():
    json_name = '../processed_data/routes/2016-3-1_0-24.json'
    out_dir = '../processed_data/well_routes/2016-3-1/'
    with open(json_name) as f:
        res = json.load(f)
    out = {}
    for h in range(24):
        out[str(h)] = []
    for r in res['routes']:
        hour = get_datetime(r['pickup_datetime']).hour
        tmp = {'pick_time': r['pickup_datetime']}
        tmp['routes'] = [y for x in r['routes'] for y in x]
        out[str(hour)].append(tmp)

    for h in range(24):
        tmp = out[str(h)]
        tmp = {'data': tmp}
        print(tmp)
        output_json(tmp, out_dir+str(h)+'.json')

    # print(res)


def plot_positions(json_name='2016-01-13.json'):
    '''

    :param pos:
    :return:
    '''
    res = read_json('../processed_data/daily_hourly_od/'+json_name)
    hour = '19'
    taxi_type = 'pick'
    res = res[taxi_type][hour]
    lon = [x[0] for x in res]
    lat = [x[1] for x in res]
    plt.scatter(lon, lat, s=5)
    plt.title('%s %d:00 to %d:00 %s' % (json_name.split('.')[0], int(hour), int(hour)+1, taxi_type))
    plt.show()


if __name__ == '__main__':
    # origin = [-73.990318,40.755730]
    # destination = [-73.987579,40.769363]
    # res = get_routes(origin, destination)
    # print(res)

    # get_df_routes(2016, 3, 1, 0, 24)
    file = '2016-3-1_0-24'
    # output_routes('../processed_data/routes/2016-3-1_0-24.json',
    #               out_name='../processed_data/well_routes/2016-3-1_0-24.json')

    # give_time = datetime.datetime(2016, 3, 1, 9, 15)
    # give_time2 = datetime.datetime(2016, 3, 1, 9, 45)
    # output_heaptmap('../processed_data/routes/%s.json' % file, give_time2)
    give_times = get_day_time(2016, 3, 1, 60)
    # print(give_times)
    output_multitime_heaptmap('../processed_data/routes/%s.json' % file, give_times,
                              out_name='../processed_data/well_heatmap/%s.json' % file)
    # output_one_day_routes()

    # Calculate daily order number and speed
    # process_train()
    # print(cal_distance_ratio())
    # cal_day_order_speed()
    # cal_daily_order()
    # output_daily_hour_origin_destination()

    # Plot
    # plot_positions()