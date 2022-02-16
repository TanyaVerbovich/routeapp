from http.client import BAD_REQUEST, CREATED, NO_CONTENT, OK
from flask import Flask, jsonify, make_response, request, abort
from flask_cors import CORS, cross_origin
from elasticsearch import Elasticsearch
import requests
import re

from datetime import datetime

import json
import hashlib

app = Flask(__name__)
es = Elasticsearch('http://127.0.0.1:9200')

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


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
    print(sep_users)
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
            return jsonify({'role': role}), 201
        else:
            print("pass not right")
            return jsonify({'role': role}), 203
    else: 
        return jsonify({'role': role}), 202



def hash_password(password):
    encoded_password = password.encode("utf-8")
    hex_object = hashlib.sha1(encoded_password)
    hex_password = hex_object.hexdigest()
    return hex_password


if __name__ == '__main__':
    app.run()
