from dis import dis
from http.client import BAD_REQUEST, CREATED, NO_CONTENT, OK
from urllib import response
from flask import Flask, jsonify, make_response, request, abort
from flask_cors import CORS, cross_origin
from elasticsearch import Elasticsearch
import os.path
import requests
import re
import datetime
from datetime import timedelta
from geopy.geocoders import Nominatim
import json
import hashlib
import math

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
        return jsonify({'users': ls})


# @app.route('/ords', methods=['GET', 'POST'])
# def get_all_ords():
#     user_obj = {
#             "userName" : "Egor Dorozhkin",
#             'timeBegin': "9:00",
#             'timeEnd': "18:00",
#             'weekdays': "Saturday, Sunday", 
#         }   
#     print(user_obj)
#     result = es.index(index='timetable', body=user_obj, request_timeout=30)
        

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


@app.route('/edit_timetable/<string:user_id>', methods=['GET', 'POST'])
def edit_timetable(user_id):
    sep_users = dict()
    if request.json['timeBegin']:
        sep_users['timeBegin'] = request.json['timeBegin']
    if request.json['timeEnd']:
        sep_users['timeEnd'] = request.json['timeEnd']
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
            "userId": user_id
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
            ls.append(tb)
        return jsonify({'timetable': ls}), 201


@app.route('/add_driver/<string:user_id>', methods=['GET', 'POST'])
def add_driver(user_id):
    sep_users = {
      'userName': request.json['userName'],
      'phone':request.json['phone'],
      'car': request.json['car'], 
      'fuelConsumption': request.json['fuelConsumption']
    }
    query_body2 = {
    "query": {
        "match": {
            "userName": request.json['userName']
        }
    }
    }
    res_user = es.search(index="drivers", body=query_body2)
    if res_user["_shards"]["successful"] == 0:
        print(user_id, " *** ", res_user)
        result = es.index(index='driver', body=sep_users, request_timeout=30)
        return jsonify({'user_id': user_id}), 201
    else: 
        return jsonify({'userName': request.json['userName']}), 203


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
        # orders_obj = {
        #         "user_id" : new_order['user_Id'],
        #         'company_name': new_order['company_name'],
        #         'addres_from': new_order['addres_from'],
        #         'time': new_order['time'], 
        #         'address_to': new_order['address_to'],
        #         'phone': new_order['phone'],
        #         'file': os.path.join(os.path.join(app.config['FILE_UPLOADS'], user_id+"_"+data_from_file.filename),
        #         'price': get_price(distance, data_from_file)
        #     }   
        # print(orders_obj)
        # result = es.index(index='orders', body=orders_obj, request_timeout=30)
        # return jsonify({'result': orders_obj}), 201
        return jsonify({'result': request.form}), 201
    except ValueError:
        return jsonify({'user_id': user_id}), 203
    except AttributeError:
        return jsonify({'user_id': user_id}), 202 
    finally:
        print(get_mond_sun())


def hash_password(password):
    encoded_password = password.encode("utf-8")
    hex_object = hashlib.sha1(encoded_password)
    hex_password = hex_object.hexdigest()
    return hex_password


def get_distance(place1, place2):
    geolocator = Nominatim(user_agent="http")
    location = geolocator.geocode(place1)
    dolgota1 = location.latitude
    shirota1 = location.longitude
    location = geolocator.geocode(place2)
    dolgota2 = location.latitude
    shirota2 = location.longitude
    distance = math.acos(math.sin(shirota1)*math.sin(shirota2)+math.cos(shirota1)*math.cos(shirota2)*math.cos(dolgota1-dolgota2))*math.pi/180*6378.137
    return distance


def read_csv(distance, file):
    order = dict()
    file1 = open(file, 'r')
    Lines = file1.readlines()

    items = []
    number = []
    weigth = []
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
    sunday = monday + timedelta(days = 7)
    return monday.strftime("%d"), sunday.strftime("%d %b")



if __name__ == '__main__':
    app.run()
 