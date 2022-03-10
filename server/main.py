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
        return jsonify({'id': id_form_index, 'role': role}), 202



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
        print(datetime.datetime.strptime(request.form.get('time'), '%d/%m/%Y %H:%M'))
        distance = get_distance(new_order['address_from'], new_order['address_to'])
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


# def get_price(distance, file):



if __name__ == '__main__':
    app.run()
