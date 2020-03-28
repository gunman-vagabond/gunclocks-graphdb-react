var clockSize = 25;
var targetTimezoneOffsetHour = -9;  //GMT - JST(+9)
var shortHandCast;
var longHandCast;

//$(function(){
//	clockSize = $("#clockSize").val();
//	$("pre#GunClock").text(GunClock());
//	setInterval(timer01,1000);
//});

//$("form#form01").submit(function(){
//	clockSize = $("#clockSize").val();
//});

//function timer01(){
//	clockSize = $("#clockSize").val();
//	$("pre#GunClock").text(GunClock());
//};


var Cast = function(image){
	this.image = image;
};

Cast.prototype.display = function(x,y){

	/////////////////////////////
	// compute (x,y) for display
	/////////////////////////////
	var _x = parseInt((x*2) -(this.image[0].length /2));
	var _y = parseInt(y     -(this.image.length    /2));

	/////////////////////////// 
	// display character image 
	/////////////////////////// 
	for(var i=0; i<this.image.length; i++){

		if ( _y+i < 0 ) { continue; }

		var strBufTmp = "";
		if ( _x > 0 ) {
			strBufTmp = strBufGunClock[_y+i].substr(0,_x);
		}

		for(var j=0; j<this.image[i].length; j++){

			if ( _x+j >= 0 && _x+j <= clockSize*2) {
				if( this.image[i].charAt(j) !== '*' ) {
					strBufTmp = strBufTmp + this.image[i].charAt(j);
				} else {
					strBufTmp += strBufGunClock[_y+i].charAt(_x+j);
				}
			}

		}

		if ( _x+this.image[i].length <= clockSize*2 ) {
			strBufTmp += strBufGunClock[_y+i].substring(_x+this.image[i].length,clockSize*2 );
		}
		strBufGunClock[_y+i] = strBufTmp;
	}

};

var strBufGunClock = [];

var gunman = new Cast([
		"*  __ *", 
		" _|__|_",
		"b (@@) ",
		" V|~~|>",
		"  //T| "
		]);

var inu = new Cast([
		"__AA  * ",
		"| 6 |__P",
		"~~|    l",
		" /_/~l_l"
		]);

var longHand  = new Cast( [ "##" ] );
var shortHand = new Cast( [ "::" ] );

var num3      = new Cast( [ "3" ] );
var num6      = new Cast( [ "6" ] );
var num9      = new Cast( [ "9" ] );
var num12     = new Cast( [ "12"] );
var waku      = new Cast( [ "+" ] );

function initGunClock(){
	strBufGunClock = [];
	for ( var i=0; i < clockSize; i++ ){
		var str = "";
		for ( var j=0; j < clockSize*2; j++ ){
			str += " ";
		}
		strBufGunClock.push(str);
	}
};

var strNewline = "\n\r";

var toString = function(strBuf){

	var str = "";

	for ( var i=0; i < strBuf.length; i++ ) {
		str = str + strBuf[i];
		str = str + strNewline;
	}

	return str;
}



function hourToRadian(h, m) {
	return Math.PI * (90.0 - ((h%12) + m/60.0) * 30.0) / 180.0;
}

function minuteToRadian(m, s) {
	return Math.PI * (90.0 - (m + s/60.0) * 6.0) / 180.0;
}

function digitalRadian(h, m, s) {
	var hRadian = hourToRadian(h,m);
	var mRadian = minuteToRadian(m,s);

	var aveRadian = (hRadian + mRadian) / 2;


	if ( ((hRadian > mRadian) && ( (hRadian - mRadian) < Math.PI))
	  || ((mRadian > hRadian) && ( (mRadian - hRadian) < Math.PI))
	) {
		return aveRadian + Math.PI; 
	} else {
		return aveRadian;
	}
}

function makeGunClock(){

	/////////////
	// get time
	/////////////

	//Date.now()                  : current time (ms)
	//Date().getTimezoneOffset()  : tz offset    (minute: ex. GMT - JST(+9) = -540 )
	//my targetTimezoneOffsetHour : -9           (hour)
	var d = new Date(
	          Date.now() - 
	          (targetTimezoneOffsetHour * 60 - new Date().getTimezoneOffset()) * 60000
	         );

//	var d = new Date();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();

        ////////////////////////////////
        // compute character location
        ////////////////////////////////
	var centerX = parseInt((clockSize)/2);
	var centerY = parseInt((clockSize)/2);

	var shortHandCastX = centerX + parseInt(Math.cos(hourToRadian(hour,minute)) * (clockSize*2/3/2) );
	var shortHandCastY = centerY - parseInt(Math.sin(hourToRadian(hour,minute)) * (clockSize*2/3/2) );

	var longHandCastX = centerX + parseInt(Math.cos(minuteToRadian(minute,second)) * (clockSize*4/5/2) );
	var longHandCastY = centerY - parseInt(Math.sin(minuteToRadian(minute,second)) * (clockSize*4/5/2) );

        var i;
	//// waku ////
	for(i=0; i< 360; i+=30) {

		if ( i%90 === 0 ) { continue; }

		var radian = (i * 2 * Math.PI) / 360;

	 	var wakuX,wakuY; 
		var wakuXdiff = clockSize/2 * Math.cos(radian);
		var wakuYdiff = clockSize/2 * Math.sin(radian);

		if ( wakuXdiff >=0 ) {
			wakuX = centerX + parseInt(wakuXdiff);
		} else {
			wakuX = centerX + parseInt(wakuXdiff-0.5);
		}

		if ( wakuYdiff >=0 ) {
			wakuY = centerY + parseInt(wakuYdiff);
		} else {
			wakuY = centerY + parseInt(wakuYdiff-0.5);
		}

		waku.display(wakuX, wakuY);
	}

	//// num ////
	num3.display (clockSize -1 , centerY      );
	num6.display (centerX      , clockSize -1 );
	num9.display (0            , centerY      );
	num12.display(centerX      , 0            );

	//// longHand ////
	for(i=0; i<parseInt(clockSize*2/3/2); i++){

		var longHandX = centerX + ( ((longHandCastX - centerX) * i) / (clockSize*2/3/2) );
		var longHandY = centerY + ( ((longHandCastY - centerY) * i) / (clockSize*2/3/2) );

		longHand.display(longHandX, longHandY);
	}

	//// shortHand ////
	for(i=0; i<clockSize*5/6/2; i++){
		var shortHandX = centerX + ( ((shortHandCastX - centerX) * i) / (clockSize*5/6/2) );
		var shortHandY = centerY + ( ((shortHandCastY - centerY) * i) / (clockSize*5/6/2) );

		shortHand.display(shortHandX, shortHandY);
	}

	shortHandCast.display(shortHandCastX, shortHandCastY);
	longHandCast.display(longHandCastX, longHandCastY);

	////////////////////////
	// display digital time 
	////////////////////////

	var strBufTime = "";

        if(hour<10) { strBufTime += "0"; }
        strBufTime += hour+":";
        if(minute<10) { strBufTime += "0"; }
        strBufTime += minute+":";
        if(second<10) { strBufTime += "0"; }
        strBufTime += second;

	var digital = new Cast([
		"____________",
		"| " + strBufTime + " |",
		"~~~~~~~~~~~~"
	]);

	var digitalRad = digitalRadian(hour,minute,second);


	digital.display(centerX + parseInt(Math.cos(digitalRad) * clockSize/2 *1/2)
	              , centerY - parseInt(Math.sin(digitalRad) * clockSize/2 *1/2)
	);

};

function GunClock(size, _targetTimezoneOffsetHour, _shortHandCast, _longHandCast){

        clockSize=size;
        targetTimezoneOffsetHour =  _targetTimezoneOffsetHour;
        shortHandCast = _shortHandCast;
        longHandCast = _longHandCast;

	initGunClock();
	makeGunClock();
//	gunman.display(20,5);
	return toString(strBufGunClock);

//  return "bbb";
};

var timezoneOffsetHour = {
  "Tokyo"      : - 9,
  "Shanghai"   : - 8,
  "Sydney"     : -11,
  "Moscow"     : - 3,
  "Berlin"     : - 1,
  "Paris"      : - 1,
  "London"     :   0,
  "Cairo"      : - 2,
  "NewYork"    : + 4,
  "LosAngeles" : + 8,
  "Sao_Paulo"  : + 3
};

exports.getGunClock = function( 
  { 
    size, 
//    targetTimezoneOffsetHour = -9, 
    cityName = "Tokyo",
    shortHandCastText = [], 
    longHandCastText = [], 
  } 
) {
    if ( timezoneOffsetHour[cityName] ) {
      targetTimezoneOffsetHour = timezoneOffsetHour[cityName];
    } else {
      targetTimezoneOffsetHour = 0;
    };

    var _shortHandCast = gunman;
    if ( shortHandCastText !== [] ) {
      _shortHandCast = new Cast(shortHandCastText);
    }
    var _longHandCast = inu;
    if ( longHandCastText !== [] ) {
      _longHandCast = new Cast(longHandCastText);
    }
//    return GunClock(size, targetTimezoneOffsetHour, gunman, inu);
    return GunClock(size, targetTimezoneOffsetHour, _shortHandCast, _longHandCast);
}
