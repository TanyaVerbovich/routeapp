# from crypt import methods
from dis import dis
from http.client import BAD_REQUEST, CREATED, NO_CONTENT, OK
from urllib import response
from flask import Flask, jsonify, make_response, request, abort
from flask_cors import CORS, cross_origin
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, UpdateByQuery
import os.path
import requests
import re
import datetime
from datetime import timedelta
from geopy.geocoders import Nominatim
from geopy import distance
import json
import hashlib
import math
import random

app = Flask(__name__)
es = Elasticsearch('http://127.0.0.1:9200')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['FILE_UPLOADS'] = os.path.join(os.path.abspath(os.getcwd()), "orders")
    

@app.route('/username/<string:user_id>', methods=['GET', 'POST'])
def get_username(user_id):
    query_body = {
    "query": {
        "match": {
            "id": user_id
        }
    }
    }
    res_user = es.search(index="users", body=query_body)
    user_name = res_user["hits"]["hits"][0]["_source"]["userName"]
    print(user_name)
    return jsonify({'username': user_name}), 201


@app.route('/timetable/username/<string:user_id>', methods=['GET', 'POST'])
def get_username_from_timetable(user_id):
    query_body = {
    "query": {
        "match": {
            "userId": user_id
        }
    }
    }
    res_user = es.search(index="timetable", body=query_body)
    user_name = res_user["hits"]["hits"][0]["_source"]["userName"]
    print(user_name)
    return jsonify({'username': user_name}), 201


@app.route('/users', methods=['GET', 'POST'])
def get_all_users():
    ls = []
    user = {}
    res = requests.post("http://127.0.0.1:9200/users/_search?pretty")
    number_values = res.json()["hits"]["total"]["value"]
    if len(res.json()["hits"]["hits"]):
        for i in range(number_values):
            user = res.json()["hits"]["hits"][i]['_source']
            user["user_id"] = res.json()["hits"]["hits"][i]['_id']
            ls.append(user)
        return jsonify({'users': ls}), 201


@app.route('/ords/<string:user_id>', methods=['GET', 'POST'])
def get_ords_current_user(user_id):
    ls = []
    order = {}
    res = requests.post("http://127.0.0.1:9200/orders/_search?pretty")
    number_values = res.json()["hits"]["total"]["value"]
    print(number_values)
    if len(res.json()["hits"]["hits"]):
        for i in range(number_values):
            order = res.json()["hits"]["hits"][i]['_source']
            if order['user_id'] == user_id:
                ls.append(order)
        return jsonify({'orders': ls}), 201


@app.route('/filtercustomer/<string:user_id>', methods=['GET', 'POST'])
def filtercustomer(user_id):
    company_name = json.loads(json.loads(request.data.decode("utf-8"))['body'])['filter']
    if company_name != "":
        print(company_name)
        print(company_name)
        query_body = {
        # "query": {
        #     "match": {
        #         "company_name": company_name
        #     }
        # }
        # }
         # ord_query ={
                    "query": {
                        "bool": {
                            "must": [
                        {"match": {  'company_name': company_name}},
                        {"match": {  'user_id': user_id}},
                        # {"match": {   'address_to': request.form.get('address_to')}}
                                ]
                        }
                    }
                }
        res = es.search(index="orders", body=query_body)
        ls = []
        order = {}
        number_values = res["hits"]["total"]["value"]
        if len(res["hits"]["hits"]):
            for i in range(number_values):
                order = res["hits"]["hits"][i]['_source']
                ls.append(order)
            print(ls)
        return jsonify({'filtered_customer': ls}), 201
    else:
        ls = []
        order = {}
        res = requests.post("http://127.0.0.1:9200/orders/_search?pretty")
        print(res.json())
        number_values = res.json()["hits"]["total"]["value"]
        print(number_values)
        if len(res.json()["hits"]["hits"]):
            for i in range(number_values):
                order = res.json()["hits"]["hits"][i]['_source']
                print(i)
                ls.append(order)
        return jsonify({'filtered_customer': ls}), 201


@app.route('/filterdriver/<string:user_id>', methods=['GET', 'POST'])
def filterdriver(user_id):
    query_body = {
    "query": {
            "match": {
                "id": user_id
            }
        }
        }
    res = es.search(index="users", body=query_body)  
    user_name = res["hits"]["hits"][0]["_source"]["userName"]  
    company_name = json.loads(json.loads(request.data.decode("utf-8"))['body'])['filter']
    if company_name != "":
        query_body = {
                    "query": {
                        "bool": {
                            "must": [
                        {"match": {  'company_name': company_name}},
                        {"match": {  'driver': user_name}},
                        # {"match": {   'address_to': request.form.get('address_to')}}
                                ]
                        }
                    }
                }
        res = es.search(index="orders", body=query_body)
        ls = []
        order = {}
        number_values = res["hits"]["total"]["value"]
        if len(res["hits"]["hits"]):
            for i in range(number_values):
                order = res["hits"]["hits"][i]['_source']
                ls.append(order)
            print(ls)
        return jsonify({'filtered_customer': ls}), 201
    else:
        query_body = {
            "query": {
                "match": {
                "driver": user_name
            }
        }
        }
        res = es.search(index="orders", body=query_body)
        print(user_name)
        print(res)
        ls = []
        order = {}
        number_values = res["hits"]["total"]["value"]
        if len(res["hits"]["hits"]):
            for i in range(number_values):
                order = res["hits"]["hits"][i]['_source']
                ls.append(order)
            print(ls)
        return jsonify({'filtered_customer': ls}), 201


@app.route('/drivers/<string:user_id>', methods=['GET', 'POST'])
def get_drivers_orders(user_id):
    query_body = {
    "query": {
        "match": {
            "id": user_id
        }
    }
    }
    res_user = es.search(index="users", body=query_body)
    print(res_user)
    user_name = res_user["hits"]["hits"][0]["_source"]["userName"]
    query_body = {
    "query": {
        "match": {
            "driver": user_name
        }
    }
    }
    res = es.search(index="orders", body=query_body)
    print(res)
    ls = []
    order = {}
    number_values = res["hits"]["total"]["value"]
    if len(res["hits"]["hits"]):
        for i in range(number_values):
            order = res["hits"]["hits"][i]['_source']
            ls.append(order)
        print(ls)
    return jsonify({'orders': ls}), 201
    # query_body = {
    # "query": {
    #     "match": {
    #         "userName": user_name
    #     }
    # }
    # }
    # res_user = es.search(index="drivers", body=query_body)
    # userId = res_user["hits"]["hits"][0]["_id"]
    # query_body = {
    # "query": {
    #     "match": {
    #         "driver_id": userId
    #     }
    # }
    # }
    # res = es.search(index="order_driver", body=query_body)
    # ls = []
    # order = {}
    # number_values = res["hits"]["total"]["value"]
    # print(number_values)
    # if len(res["hits"]["hits"]):
    #     for i in range(number_values):
    #         order = res["hits"]["hits"][i]['_source']["order_id"]
    #         ls.append(order)
    #     print(ls)
    # lss = []
    # ordd = {}
    # for i in ls:
    #     res = es.get(index="orders", id=i)
    #     ordd = res['_source']
    #     lss.append(ordd)
    #     print(lss)
    #     return jsonify({'orders': lss}), 201



@app.route('/allorders', methods=['GET', 'POST'])
def get_all_ords():
    ls = []
    order = {}
    res = requests.post("http://127.0.0.1:9200/orders/_search?pretty")
    number_values = res.json()["hits"]["total"]["value"]
    print(number_values)
    if len(res.json()["hits"]["hits"]):
        for i in range(number_values):
            order = res.json()["hits"]["hits"][i]['_source']
            ls.append(order)
        print(ls)
        return jsonify({'orders': ls}), 201


@app.route('/many', methods=['GET', 'POST'])
def get_all_ords_drivers():
    ls = []
    ord_driv = {}
    res = requests.post("http://127.0.0.1:9200/order_driver/_search?pretty")
    number_values = res.json()["hits"]["total"]["value"]
    if len(res.json()["hits"]["hits"]):
        for i in range(number_values):
            ord_driv = res.json()["hits"]["hits"][i]['_source']
            ls.append(ord_driv)
        return jsonify({'ord_driver': ls}), 201
        

@app.route('/drivers', methods=['GET', 'POST'])
def get_all_drivers():
    ls = []
    driver = {}
    res = requests.post("http://127.0.0.1:9200/drivers/_search?pretty")
    number_values = res.json()["hits"]["total"]["value"]
    if len(res.json()["hits"]["hits"]):
        for i in range(number_values):
            driver = res.json()["hits"]["hits"][i]['_source']
            driver["user_id"] = res.json()["hits"]["hits"][i]['_id']
            ls.append(driver)
        return jsonify({'drivers': ls}), 201


@app.route('/delete/driver/<string:driver_phone>', methods=['GET', 'POST'])
def delete_driver(driver_phone):
    query_body = {
    "query": {
        "match": {
            "phone": driver_phone
        }
    }
    }
    res = es.search(index="drivers", body=query_body)
    _id = res['hits']['hits'][0]["_id"]
    es.delete(index="drivers", doc_type="_doc", id=_id)
    return _id


@app.route('/edit_timetable/<string:user_id>/<string:driver_id>', methods=['GET', 'POST'])
def edit_timetable(user_id, driver_id):
    sep_users = dict()
    if request.json['timeBegin']:
        sep_users['timeBegin'] = get_minutes(request.json['timeBegin'])
    if request.json['timeEnd']:
        sep_users['timeEnd'] = get_minutes(request.json['timeEnd'])
    if request.json['weekdays']:
        sep_users['weekdays'] = request.json['weekdays']
        
    update_body = dict()
    update_body["doc"] = dict()
    for item in sep_users.keys():
        update_body["doc"][item] = sep_users[item]            
    print(update_body)
    query_body = {
    "query": {
        "match": {
            "userId": driver_id
        }
    }
    }
    res = es.search(index="timetable", body=query_body)
    _id = res['hits']['hits'][0]["_id"]
    es.update(
        index='timetable', id=_id, body=update_body, request_timeout=200)
    return sep_users, 201


@app.route('/timetable', methods=['GET', 'POST'])
def get_timetable():
    ls = []
    tb = {}
    res = requests.post("http://127.0.0.1:9200/timetable/_search?pretty")
    number_values = res.json()["hits"]["total"]["value"]
    if len(res.json()["hits"]["hits"]):
        for i in range(number_values):
            tb = res.json()["hits"]["hits"][i]['_source']
            timeBeg = tb['timeBegin']
            timeEn = tb['timeEnd']
            tb['timeBegin'] = get_time(timeBeg)
            tb['timeEnd'] = get_time(timeEn)
            ls.append(tb)
        return jsonify({'timetable': ls}), 201


@app.route('/add_driver/<string:user_id>/<string:driver_id>', methods=['GET', 'POST'])
def add_driver(user_id, driver_id):
    query_body = {
    "query": {
        "match": {
            "id": driver_id
        }
    }
    }
    print(driver_id)
    res = es.search(index="users", body=query_body)
    print(res)
    userName = res["hits"]["hits"][0]["_source"]["userName"]
    sep_users = {
      'userName': userName,
      'phone':request.json['phone'],
      'car': request.json['car'], 
      'fuelConsumption': request.json['fuelConsumption']
    }
    query_body2 = {
    "query": {
        "match": {
            "userName": userName
        }
    }
    }
    res_user = es.search(index="drivers", body=query_body2)
    if res_user["_shards"]["successful"] == 0:
        print(driver_id, " *** ", res_user)
        result = es.index(index='driver', body=sep_users, request_timeout=30)
        return jsonify({'driver_id': driver_id}), 201
    else: 
        return jsonify({'userName': userName}), 203


@app.route('/add_profile', methods=['GET', 'POST'])
def add_profile():
    sep_users = {
      'sep_emails': request.json['sep_emails'],
      'sep_usernames':request.json['sep_emails'],
      'sep_passwords': request.json['sep_passwords'], 
      'sep_roles': request.json['sep_roles']
    }
    print(request.json['sep_emails'])
    query_body2 = {
    "query": {
        "match": {
            "userName": request.json['sep_usernames']
        }
    }
    }

    res_user = es.search(index="users", body=query_body2)
    if res_user["hits"]["total"]["value"] == 0:
        r = es.search(index='users',
              body= {
                    "size": 0,
                    "aggs": {
                            "max_id": {
                            "terms": {
                                "field": "id"
                                    }
                                }
                            }
                    }
            )
        lens = []
        for i in range(len(r["aggregations"]["max_id"]["buckets"])):
            lens.append(r["aggregations"]["max_id"]["buckets"][i]["key"])
        max_row = max(lens)
        print(max_row)
        user_obj = {
            "id" : max_row + 1,
            'userName': request.json['sep_usernames'],
            'mail': request.json['sep_emails'],
            'password': hash_password(request.json['sep_passwords']), 
            'role': request.json['sep_roles']
        }   
        print(user_obj)
        result = es.index(index='users', body=user_obj, request_timeout=30)
        return jsonify({'users': user_obj}), 201
    else:
        return jsonify({'users': sep_users}), 203


@app.route('/getDays', methods=['GET', 'POST'])
def get_days():
    return jsonify({'monday': get_mond_sun()[0], 'sunday': get_mond_sun()[1]}), 202


@app.route('/login_profile', methods=['GET', 'POST'])
def login_profile():
    sep_users = {
      'sep_emails': request.json['sep_emails'],
      'sep_passwords': request.json['sep_passwords']
    }
    query_body = {
    "query": {
        "match": {
            "mail": request.json['sep_emails']
        }
    }
    }
    res = es.search(index="users", body=query_body)
    if res["hits"]["total"]["value"] != 0:
        id_form_index = res["hits"]["hits"][0]['_source']['id']
        hashed_pass = res["hits"]["hits"][0]['_source']['password']
        role =  res["hits"]["hits"][0]['_source']['role']
        if hashed_pass == hash_password(request.json['sep_passwords']):
            print(id_form_index)
            return jsonify({'id': id_form_index, 'role': role}), 201
        else:
            print("pass not right")
            return jsonify({'id': id_form_index, 'role': role}), 203
    else: 
        return jsonify({'users': sep_users}), 202



@app.route('/orders/<string:user_id>', methods=['GET', 'POST'])
def add_order(user_id):
    new_order = {
      'company_name': request.form.get('company_name'),
      'address_from': request.form.get('addres_from'),
      'time': request.form.get('time'),
      'address_to': request.form.get('address_to'),
      'phone': request.form.get('phone'),
      'user_Id': user_id
    }    
    if request.files:
        data_from_file = request.files['file']
        data_from_file.save(os.path.join(app.config['FILE_UPLOADS'], user_id+"_"+data_from_file.filename))
    try:
        conv_time = datetime.datetime.strptime(request.form.get('time'), '%d/%m/%Y %H:%M')
        distance = get_distance(new_order['address_from'], new_order['address_to'])
        [dict_order, weigth_of_order] = read_csv(distance, os.path.join(app.config['FILE_UPLOADS'], user_id+"_"+data_from_file.filename))
        time_begin = get_time_beginning(conv_time, distance)
        monday = get_mond_sun_full()[0]
        sunday = get_mond_sun_full()[1]
        print(get_minutes(time_begin.time().strftime('%H:%M')))
        print(get_minutes(conv_time.time().strftime('%H:%M')))
        list1 = []
        list2 = []
        list3 = []
        #logics for order in current week
        if (monday <= time_begin) and (time_begin <= sunday):
            #logics for driver whos worktime is suitable for order
            query_body1 = {
            "query": {
                "range": {
                    "timeBegin": {
                        "lte": get_minutes(time_begin.time().strftime('%H:%M'))
                    }
                }
            }
            }
            print(time_begin)
            res1 = es.search(index="timetable", body=query_body1, request_timeout=300)
            for item in range(res1['hits']['total']['value']):
                list1.append(res1['hits']['hits'][item]['_source']['userName'])
            print(list1)
            # query_body2 = {
            # "query": {
            #     "range": {
            #         "timeEnd": {
            #             "gte": get_minutes(conv_time.time().strftime('%H:%M'))
            #         }
            #     }
            # }
            # }
            print(conv_time.time().strftime('%H:%M'))
            times = []
            names = []
            res = requests.post("http://127.0.0.1:9200/timetable/_search?pretty")
            number_values = res.json()["hits"]["total"]["value"]
            if len(res.json()["hits"]["hits"]):
                for i in range(number_values):
                    user = res.json()["hits"]["hits"][i]['_source']
                    times.append(user['timeEnd'])
                    names.append(user['userName'])
            for i in times:
                if i >= get_minutes(conv_time.time().strftime('%H:%M')):
                    list2.append(names[times.index(i)])
            # res2 = es.search(index="timetable", body=query_body2, request_timeout=300)
            # for item in range(res2['hits']['total']['value']):
            #     list2.append(res2['hits']['hits'][item]['_source']['userName'])
            print(list2)
            #check weekdays
            query={  
            "query":{  
                "query_string":{  
                    "default_field":"weekdays",
                    "query":"*"+conv_time.strftime('%A')+"*"
                }
            }
            } 
            result_weekday = es.search(index="timetable", body=query)
            for item in range(result_weekday['hits']['total']['value']):
                list3.append(result_weekday['hits']['hits'][item]['_source']['userName'])
            print(list3)
            #suitable drivers
            list_timet = list(set(list1) & set(list2))
            timefrom=[]
            timeto=[]
            if len(list1) and len(list2):
                while True:
                    flag=False
                    for item in list3:
                        if item in list_timet:
                            list_timet.remove(item)
                    name_driver = random.choice(list_timet)

                    query_body = {
                    "query": {
                        "match": {
                            "driver": name_driver
                        }
                    }
                    }
                    print(name_driver)
                    res_user = es.search(index="orders", body=query_body)
                    if res_user['hits']['total']['value'] == 0:
                        break
                    timefrom.append(res_user['hits']['hits'][0]['_source']["time_from"])
                    timeto.append(res_user['hits']['hits'][0]['_source']["time_to"])
                    for i in range(len(timefrom)):
                        if (time_in_range(datetime.datetime.strptime(timefrom[i], '%d/%m/%Y %H:%M'), datetime.datetime.strptime(timeto[i], '%d/%m/%Y %H:%M'), time_begin, conv_time)):
                            flag=True
                            break
                    if flag:
                        break  
                print(name_driver)
                query_driver ={
                "query": {
                    "match": {
                        "userName": name_driver
                    }
                }
                }
                print(query_driver)
                res_dr = es.search(index="drivers", body=query_driver)
                bensin = res_dr['hits']['hits'][0]['_source']['fuelConsumption']*distance/100
                print("***", bensin)
                return jsonify({'price': round(get_price(weigth_of_order, bensin, distance), 2), 'driver': name_driver, 'order': dict_order, 'weight': weigth_of_order, 'time_from': time_begin.strftime('%d/%m/%Y %H:%M'), 'place11': get_coords(new_order['address_from'], new_order['address_to'])[0][0], 'place12': get_coords(new_order['address_from'], new_order['address_to'])[0][1], 'place21': get_coords(new_order['address_from'], new_order['address_to'])[1][0], 'place22': get_coords(new_order['address_from'], new_order['address_to'])[1][1]}), 201
            else:
                # print("sorry no available drivers")
                return jsonify({'user_id': user_id}), 202
        else:
            # print("sorry there is no timetable for such time")
            return jsonify({'user_id': user_id}), 203
    except ValueError:
        print("val")
        return jsonify({'user_id': user_id}), 204
    except AttributeError:
        print("atr")
        return jsonify({'user_id': user_id}), 204


@app.route('/sendorder/<string:user_id>', methods=['GET', 'POST'])
def send_order(user_id):
    if request.files:
       data_from_file = request.files['file']
    orders_obj = {
            "user_id" : request.form.get('user_Id'),
            'company_name': request.form.get('company_name'),
            'addres_from': request.form.get('addres_from'),
            'time_from': request.form.get('time_from'), 
            'address_to': request.form.get('address_to'),
            'phone': request.form.get('phone'),
            'file': os.path.join(os.path.join(app.config['FILE_UPLOADS'], user_id+"_"+data_from_file.filename)),
            'time_to': request.form.get('time'),
            'price': request.form.get('price'),
            'weight' : request.form.get('weight'),
            'order': request.form.get('order'),
            'driver': request.form.get('driver'),
            'place11': request.form.get('place11'),
            'place12': request.form.get('place12'),
            'place21': request.form.get('place21'),
            'place22': request.form.get('place22')
    }   
    print(orders_obj)
    if request.form.get('price') == 'undefined':
        return jsonify({'ord': orders_obj}), 202
    else:
        result = es.index(index='orders', body=orders_obj, request_timeout=30)
        # ord_query ={
        #             "query": {
        #                 "bool": {
        #                     "must": [
        #                 {"match": {  'company_name': request.form.get('company_name')}},
        #                 # {"match": {  'phone': request.form.get('phone')}}
        #                 # {"match": {   'address_to': request.form.get('address_to')}}
        #                         ]
        #                 }
        #             }
        #         }
        ord_query ={
                "query": {
                    "match": {
                        "company_name": request.form.get('company_name')
                    }
                }
                }    
        print(ord_query)
        res_ord = es.search(index="orders", body=ord_query)
        print(res_ord)
        order_id = res_ord['hits']['hits'][0]['_id']
        print(order_id)
        driver_query ={
                    "query": {
                        "match": {
                            "userName": request.form.get('driver')
                        }
                    }
                    }
        res_dr = es.search(index="drivers", body=driver_query)
        driver_id = res_dr['hits']['hits'][0]['_id']
        driver_obj = {
            'driver_id': driver_id,
            'order_id': order_id
        }
        result = es.index(index='order_driver', body=driver_obj, request_timeout=30)
        return jsonify({'result': orders_obj}), 201


def hash_password(password):
    encoded_password = password.encode("utf-8")
    hex_object = hashlib.sha1(encoded_password)
    hex_password = hex_object.hexdigest()
    return hex_password


def time_in_range(start, end, timefrom, timeto):
    if (start <= timefrom <= end) or  (start <= timeto <= end):
        return False
    if (start <= timefrom <= end) != True and  (start <= timeto <= end) != True:
        return True


def get_distance(place1, place2):
    geolocator = Nominatim(user_agent="http")
    location = geolocator.geocode(place1)
    dolgota1 = location.latitude
    shirota1 = location.longitude
    location = geolocator.geocode(place2)
    dolgota2 = location.latitude
    shirota2 = location.longitude
    plac1 = (dolgota1, shirota1)
    plac2 = (dolgota2, shirota2)
    # distance = math.acos(math.sin(shirota1)*math.sin(shirota2)+math.cos(shirota1)*math.cos(shirota2)*math.cos(dolgota1-dolgota2))*math.pi/180*6378.137
    return distance.distance(plac1, plac2).km

def get_coords(place1, place2):
    geolocator = Nominatim(user_agent="http")
    location = geolocator.geocode(place1)
    (dolgota1, shirota1) = location.latitude, location.longitude
    location = geolocator.geocode(place2)
    (dolgota2, shirota2) = location.latitude, location.longitude
    plac1 = (dolgota1, shirota1)
    plac2 = (dolgota2, shirota2)
    return plac1, plac2


def read_csv(distance, file):
    order = dict()
    file1 = open(file, 'r')
    Lines = file1.readlines()

    weigth_summ = 0
    for line in Lines:
        [var1, var2, var3] = line.split(",")
        order[var1] = var2
        weigth_summ+=float(var3)
    return order, weigth_summ
    

def get_time_beginning(time_end, distance):
    time_for_order= distance/70
    minutes = round(time_for_order * 60 - round(time_for_order)*60)
    hours = round(time_for_order)
    d = time_end - timedelta(hours=hours, minutes=minutes)
    return d

def get_mond_sun():
    now = datetime.datetime.now()
    monday = now - timedelta(days = now.weekday())
    sunday = monday + timedelta(days = 6)
    return monday.strftime("%d"), sunday.strftime("%d %b")


def get_mond_sun_full():
    now = datetime.datetime.now()
    monday = now - timedelta(days = now.weekday())
    sunday = monday + timedelta(days = 6)
    return monday, sunday


def get_minutes(given_time):
    ###convert time to minutes
    hours = given_time.split(":")[0]
    minutes = given_time.split(":")[1]
    return int(hours)*60+ int(minutes)


def get_time(given_minutes):
   ###
    hours = round(given_minutes/60)
    minutes = given_minutes - hours*60
    if minutes == 0:
         return str(hours)+":"+str(minutes)+"0"
    else:
        return str(hours)+":"+str(minutes)
 

def parse_api():
    ###parse site with actual bensin prices to get price for bensin
    response = requests.get("https://ru.globalpetrolprices.com/Belarus/gasoline_prices/")
    return float(response.text[response.text.find('<th height="30">&nbsp;BYN</th>')+len('<td height="30" align="center"> <td height="30" align="center">'):][0:5])


def get_price(weigth_of_order, bensin, distance):
    money_for_road = parse_api()*bensin
    if (weigth_of_order < 20):
        coef = 0
    elif (weigth_of_order < 100) and (weigth_of_order > 20):
        coef = 5
    elif (weigth_of_order >100) and (weigth_of_order < 200):
        coef = 15
    money_rider = distance/70 * 2 *10
    return 1.5*(money_for_road+weigth_of_order+coef+money_rider)
    

if __name__ == '__main__':
    app.run()
 