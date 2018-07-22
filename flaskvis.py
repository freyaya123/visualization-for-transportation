from flask import Flask,render_template, request
import sys
sys.path.append('main')
#import predict

app = Flask(__name__)


@app.route('/')
def hello_world():
    #return render_template('heat_road_bmap.html')
    
    if request.method == 'POST':
        datetime = request.form.get('datetime')
        pickUpLoc = request.form.get('pickuploc')
        dropOffLoc = request.form.get('dropOffLoc')
        result = predict.predict_duration(yy, mm, dd, hh, pick, drop)
        return result
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
