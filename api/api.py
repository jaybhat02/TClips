import requests
import json
from datetime import datetime, timezone
from flask import Flask, request, render_template, jsonify

client_id = 'iks5zekmi9nl1enkboczdg9pgjmk3s'
client_secret = 'dvgtinzrwgq2xhhxwog526lp0288vz'
streamer_name = ''
MaxDate = ''
MinDate = ''

def apiLogin():
    body = {
        'client_id': client_id,
        'client_secret': client_secret,
        "grant_type": 'client_credentials'
    }
    keys = requests.post('https://id.twitch.tv/oauth2/token', body).json()
    headers = {
        'Client-ID': client_id,
        'Authorization': 'Bearer ' + keys['access_token']
    }
    return headers

def getId():
    channel_data = requests.get('https://api.twitch.tv/helix/users?login=' + streamer_name, headers=headers).json()
    return channel_data['data'][0]['id']

def isLive():
    stream_data = requests.get('https://api.twitch.tv/helix/streams?user_login=' + streamer_name, headers=headers).json()
    if len(stream_data['data']) == 1:
        return(streamer_name + ' is live: ' + stream_data['data'][0]['title'] + ' playing ' + stream_data['data'][0]['game_name'] + ' with ' + str(stream_data['data'][0]['viewer_count'])+' viewers.')
    else:
        return(streamer_name + ' is not live')

headers = apiLogin()

def getClipInfo(NumClip):
    id = getId()
    clipInfo = []
    try:
        topClip = requests.get('https://api.twitch.tv/helix/clips?broadcaster_id='+ id +'&first=' + NumClip + '&started_at=' + MinDate +'&ended_at=' + MaxDate, headers=headers)
    except:
        print("error")
    clip_info = topClip.json()
    pagination = clip_info.get('pagination')
    cursor=pagination.get('cursor')
    for x in clip_info['data']:
            dateCon = datetime.strptime(x['created_at'],'%Y-%m-%dT%H:%M:%SZ')
            relevent_info = {
            'title': x['title'],
            'views': x['view_count'],
            'date': dateCon.strftime('%b %d, %Y'),
            'duration': x['duration'],
            'thumbnail': x['thumbnail_url'],
            'download': x['thumbnail_url'].split("-preview",1)[0] + ".mp4",
            'toggle': False
            }
            clipInfo.append(relevent_info)
    i = 1
    while(not cursor == None and i<3):
        topClip = requests.get('https://api.twitch.tv/helix/clips?broadcaster_id='+ id +'&first=' + NumClip + '&started_at=' + MinDate +'&ended_at=' + MaxDate+ '&after=' + cursor, headers=headers)
        clip_info = topClip.json()
        for x in clip_info['data']:
            dateCon = datetime.strptime(x['created_at'],'%Y-%m-%dT%H:%M:%SZ')
            relevent_info = {
            'title': x['title'],
            'views': x['view_count'],
            'date': dateCon.strftime('%b %d, %Y'),
            'duration': x['duration'],
            'thumbnail': x['thumbnail_url'],
            'download': x['thumbnail_url'].split("-preview",1)[0] + ".mp4",
            'toggle': False
            }
            clipInfo.append(relevent_info)
        pagination = clip_info.get('pagination')
        cursor=pagination.get('cursor')
        i = i+1
    return clipInfo
clipInfoGlob = ''

app = Flask(__name__)


@app.route('/streamer', methods=['POST'])
def my_form_post():
    global streamer_name, MinDate, MaxDate
    inputData = request.get_json()
    streamer_name = inputData.get('Streamer').get('Streamer')
    MaxDate = inputData.get('MaxDate').get('MaxDate')
    MinDate = inputData.get('MinDate').get('MinDate')
    clipInfo = getClipInfo('100')
    
    return jsonify({'clipInfo' : clipInfo})


