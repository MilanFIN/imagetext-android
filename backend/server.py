import cv2
import numpy as np
import time
import sys
import datetime


import pytesseract


from flask import Flask, jsonify, request

def TimestampMillisec64():
    return int((datetime.datetime.utcnow() - datetime.datetime(1970, 1, 1)).total_seconds() * 1000) 



def getText(img):
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) #


	limit = int(cv2.mean(gray)[0]	)


	th, threshed = cv2.threshold(gray, limit, 255, cv2.THRESH_BINARY_INV|cv2.THRESH_OTSU)



	# find bounding rect around "text"
	pts = cv2.findNonZero(threshed)
	ret = cv2.minAreaRect(pts)

	(cx,cy), (w,h), ang = ret


	#if (img.shape[0] < img.shape[1]):
	#	ang -= 90
	width = img.shape[1]
	height = img.shape[0]

	if (width > height):
		if (w > h):
			pass #should be ok as is
		elif (w < h):
			ang = -(90-ang)





	#rotate to be horizontal
	M = cv2.getRotationMatrix2D((cx,cy), ang, 1.0)
	rotated = cv2.warpAffine(threshed, M, (img.shape[1], img.shape[0]))


	#threshold to get rid of artifacts
	th, rotated = cv2.threshold(rotated, 127, 255, cv2.THRESH_BINARY )

	# fancy way of skipping 200 lines of diy text detection
	# also it works better
	text = pytesseract.image_to_string(rotated, lang='eng',config='--psm 6')
	return text



app = Flask(__name__)


@app.route('/',methods = ["GET", "POST"])
def text():
	if  request.method == "POST":
		start = TimestampMillisec64()
		fileStr = request.files["photo"].read()
		npimg = np.fromstring(fileStr, np.uint8)
		img = cv2.imdecode(npimg, cv2.IMREAD_UNCHANGED)


		## read image
		#img = cv2.imread("./images/"+"example.jpg") 

		text = getText(img)

		response = jsonify(text)
		response.headers.add('Access-Control-Allow-Origin', '*')
		end = TimestampMillisec64()
		print(end-start)
		return response
	elif request.method == "GET":
		img = cv2.imread("./images/"+"example.jpg")
		text = getText(img)
		response = jsonify(text)
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response

	else:
		return jsonify([])

# main driver function
if __name__ == '__main__':

	# run() method of Flask class runs the application 
	# on the local development server.
	app.run(host="0.0.0.0")