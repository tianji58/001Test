//JavaScript Function
//新建 韦汉靖 2010-09-29 凯通JS方法大集合
//备注 此文件不可在循环过多(1000次以上)的环境下使用，否则会影响运行速度
//在转换JS组件中使用：LoadScriptFile(getVariable("Internal.Transformation.Filename.Directory", "") +"/cattsoft_Functions.js");
//
//版本信息
//01====>V1.0.0.1<====>2010-09-29<====>韦汉靖<====>新建
//02====>V1.0.0.2<====>2011-01-08<====>张志强<====>增加方法getPeriodOfTime（返回上、中、下旬时间段）
//


//Alert(getOsName());
//返回操作系统类型(windows/linux)
function getOsName(){
	 var osName = java.lang.System.getProperty("os.name").toLowerCase();
	 if(osName.indexOf("windows") >= 0){
	 	   return "windows";
	 	}
	 	return "linux";
}

//Alert(isCheckTime(1440, 1));
//返回时间是否达到检查点时间 适用于轮询程序 判断是否进行重启等操作
function isCheckTime(mpType, lastCycle, key){
	 if(key == null){
	 	   key = "SYS_CHECK_TIME_VALUE";
	 	}
	 var timePattern = getTimePattern(mpType);
	 var nowTime = date2str(new Date(), timePattern);
	 var checkTime = getVariable(key, "");
	 if(checkTime == null || checkTime.length != timePattern.length){
	 	    checkTime = date2str(getLastCycleTime(null, mpType, lastCycle), timePattern);
        setVariable(key, checkTime, "s");
        writeToLog("m","程序检查时间:" + checkTime);
	 	}
	 	return (nowTime==checkTime);
}

//Alert(getThisSoftPath());
//返回程序所在目录 不带前缀file:
function getThisSoftPath(){
	var path = getVariable("Internal.Transformation.Filename.Directory", "");
  path = getRealPath(path);
	return path;
}

//Alert(getRealPath(getVariable("Internal.Transformation.Filename.Directory", "")));
//返回一个真实路径  不带前缀file:
function getRealPath(path){
	if(path.indexOf("file://")==0){
	   if(getOsName() == "windows"){//WINDOWS系统
	      path = path.substring(8);
	   }else{
	      path = path.substring(7);
	   }
	}
	return path;
}

//Alert(initCycleTime(44640, 1, 2));
//根据开始时间、结束时间、周期类型等参数返回同步时间段
//mpType 时间周期类型 44640
//prevCycle 向前偏移量 1
//cycleCount　同步周期个数 2
//返回初始化后的时间段 {201007,201008, 1}
function initCycleTime(mpType, prevCycle, cycleCount){
	start = replace(getVariable("START_TIME", ""), "-", "");
	end = replace(getVariable("END_TIME", ""), "-", "");
	var cycleInfo = new Array();
	cycleInfo[2] = 3;//采集类型 1实时采集 2补漏采集 3、重新采集
	cycleInfo[3] = "补采";
    if(start.length == 6 && end.length == 6){//如果配置时间段参数是6位即到月份
        cycleInfo[0] = str2date(start, "yyyyMM");
        cycleInfo[1] = str2date(end, "yyyyMM"); 
    }else if(start.length == 8 && end.length == 8){//如果配置时间段参数是8位即到日期
        cycleInfo[0] = str2date(start, "yyyyMMdd");
        cycleInfo[1] = str2date(end, "yyyyMMdd"); 
    }else if(start.length == 10 && end.length == 10){//如果配置时间段参数是10位即到小时
        cycleInfo[0] = str2date(start, "yyyyMMddHH");
        cycleInfo[1] = str2date(end, "yyyyMMddHH"); 
    }else if(start.length == 12 && end.length == 12){//如果配置时间段参数是12位即到分
        cycleInfo[0] = str2date(start, "yyyyMMddHHmm");
        cycleInfo[1] = str2date(end, "yyyyMMddHHmm"); 
    }else{//实时采集时间段
        cycleInfo[1] = getPrevCycleTime(null,mpType,prevCycle);//如果没用设置时间段，则默认为此周期
        cycleInfo[0] = getPrevCycleTime(cycleInfo[1],mpType,cycleCount);
		cycleInfo[2] = 1;
		cycleInfo[3] = "实时采集";
    }
	return cycleInfo;
}

//Alert(getTableNameSuffix(str2date("201009", "yyyyMM"), 2));
//根据时间和类型返回表名后缀
//ti 周期所在时间 201009
//tableType 表名类型 2
//返回相应表名 _y10m09
function getTableNameSuffix(ti, tableType){
	var suffix = " ";
    if(tableType == "1"){
	    suffix = "_m" + date2str(ti, "MM") + "d" + date2str(ti, "dd");
	}else if(tableType == "2"){
	    suffix = "_y" + date2str(ti, "yy") + "m" + date2str(ti, "MM");
	}else if(tableType == "3"){
	    suffix = "_" + date2str(ti, "yyyyMM");
	}else if(tableType == "4"){
	    suffix = "_" + date2str(ti, "yyMMdd");
	}
	return suffix;
}

//Alert(getTimePattern(1440));
//返回相应的时间格式字符
//mpType 1440
//返回相应时间格式表示字符 yyyyMMdd
function getTimePattern(mpType){
   var timePattern = "";
   if(mpType == "44640"){
      timePattern = "yyyyMM";
   }else if(mpType == "10080"){
      timePattern = "yyyyMMdd";
   }else if(mpType == "1440"){
      timePattern = "yyyyMMdd";
   }else if(mpType == "60"){
      timePattern = "yyyyMMddHH";
   }else if(mpType == "30"){
      timePattern = "yyyyMMddHHmm";
   }else if(mpType == "15"){
      timePattern = "yyyyMMddHHmm";
   }else if(mpType == "5"){
      timePattern = "yyyyMMddHHmm";
   }else {
        throw new java.lang.Exception("不支持的周期类型" + mpType);
   }
   return timePattern;
}

//Alert(getCycleStartTime(null, 1440));
//根据时间字符和格式返回表示此周期的开始时间
//ti 时间对象 20100928110000
//mpType周期类型 1440
//返回周期开始时间　如20100928所表示的时间
function getCycleStartTime(ti, mpType){
    var cal = java.util.Calendar.getInstance();
    if(ti != null){
	    cal.setTime(ti);
	}
	cal.setTime(truncDate(cal.getTime(), 1));
    if(mpType == "44640"){
        cal.setTime(truncDate(cal.getTime(), 4));
    }else if(mpType == "10080"){//处理周的时间格式
        cal.setFirstDayOfWeek(java.util.Calendar.FRIDAY);
        cal.set(java.util.Calendar.DAY_OF_WEEK, java.util.Calendar.FRIDAY);//周五为一周的开始
    }else if(mpType == "1440"){
        cal.setTime(truncDate(cal.getTime(), 3));
    }else if(mpType == "60"){
        cal.setTime(truncDate(cal.getTime(), 2));
    }else if(mpType == "30"){//处理周的时间格式
        var min = floor(cal.get(java.util.Calendar.MINUTE)/30);
		min = 30 * min;
		cal.set(java.util.Calendar.MINUTE, min);
    }else if(mpType == "15"){//处理周的时间格式
        var min = floor(cal.get(java.util.Calendar.MINUTE)/15);
		min = 15 * min;
		cal.set(java.util.Calendar.MINUTE, min);
    }else if(mpType == "5"){//处理周的时间格式
        var min = floor(cal.get(java.util.Calendar.MINUTE)/5);
		min = 5 * min;
		cal.set(java.util.Calendar.MINUTE, min);
    }else {
        throw new java.lang.Exception("不支持的周期类型" + mpType);
    }
    return cal.getTime();
}

//Alert(getCycleStartTime2("20100929121005", "yyyyMMddHHmmss", 1440));
//根据时间字符和格式返回表示此周期的开始时间
//timeStr 时间字符串  2010092811
//timeStrPattern 时间字符串的格式 yyyyMMddHH
//timePattern时间格式　与周期有关  yyyyMMdd
//mpType周期类型 1440
//返回周期开始时间　如20100928所表示的时间
function getCycleStartTime2(timeStr, timePattern, mpType){
    var ti = str2date(timeStr, timePattern);//获取字符串表示的时间
    return getCycleStartTime(ti, mpType);
}

//Alert(getPrevCycleTime(null, 1440, 2));
//获取前N个周期的开始时间
//ti当前周期开始时间　20100929
//mpType 1440
//n 2
//返回前N周期开始时间 20100927
function getPrevCycleTime(ti, mpType, n){
   ti = getCycleStartTime(ti, mpType);
   if(n == null){
      n = 1;
   }
   if(mpType == "44640"){
      ti = dateAdd(ti, "m", -1*n);
   }else if(mpType == "10080"){
      ti = dateAdd(ti, "w", -1*n);
   }else if(mpType == "1440"){
      ti = dateAdd(ti, "d", -1*n);
   }else if(mpType == "60"){
      ti = dateAdd(ti, "hh", -1*n);
   }else if(mpType == "30"){
      ti = dateAdd(ti, "mi", -30*n);
   }else if(mpType == "15"){
      ti = dateAdd(ti, "mi", -15*n);
   }else if(mpType == "5"){
      ti = dateAdd(ti, "mi", -5*n);
   }
   return ti;
}

//Alert(getLastCycleTime(null, 1440, 1));
//获取后N个周期的开始时间
//ti当前周期开始时间　20100929
//mpType 1440
//n 向后偏移周期数 1
//返回后N周期开始时间 20100930
function getLastCycleTime(ti, mpType, n){
   ti = getCycleStartTime(ti, mpType);
   if(n == null){
      n = 1;
   }
   if(mpType == "44640"){
      ti = dateAdd(ti, "m", 1*n);
   }else if(mpType == "10080"){
      ti = dateAdd(ti, "w", 1*n);
   }else if(mpType == "1440"){
      ti = dateAdd(ti, "d", 1*n);
   }else if(mpType == "60"){
      ti = dateAdd(ti, "hh", 1*n);
   }else if(mpType == "30"){
      ti = dateAdd(ti, "mi", 30*n);
   }else if(mpType == "15"){
      ti = dateAdd(ti, "mi", 15*n);
   }else if(mpType == "5"){
      ti = dateAdd(ti, "mi", 5*n);
   }
   return ti;
}

//Alert(getCycleTimes(str2date("20100925", "yyyyMMdd"), str2date("20100928", "yyyyMMdd"),"yyyyMMdd", 1440, 30));
//根据时间段返回这个时间段所有周期，以";"分开
//startCycle包含时间段开始时间的周期开始时间  20100925
//endCycle包含时间段结束时间的周期开始时间   20100928
//timePattern时间格式　与周期有关   yyyyMMdd
//mpType 周期类型   1440
//maxCycleCount 最大周期数目  30
//返回以";"分开的时间周期字符串　20100925;20100926;20100927;20100928
//作用　分周期执行前使用　下一步可以"Split field to rows"达到分周期执行效果
function getCycleTimes(startCycle,endCycle,timePattern,mpType, maxCycleCount){
    startCycle = getCycleStartTime(startCycle, mpType);
    endCycle = getCycleStartTime(endCycle, mpType);
    var cycleTimes = date2str(startCycle,timePattern);  
    startCycle = getLastCycleTime(startCycle, mpType);//跳到下一个周期
    while(startCycle.compareTo(endCycle)<1 && maxCycleCount>1){//累加下一个周期
        cycleTimes = cycleTimes + ";" + date2str(startCycle, timePattern);
        startCycle = getLastCycleTime(startCycle, mpType);
		maxCycleCount = maxCycleCount-1;
    }
    return cycleTimes;
}

//Alert(getCollectInfo(1440));
//获取采集信息
//mpType　采集类型　1440
//fType   方法类型 2--->getPatternTime2 其它-->getPatternTime
//timeFormat 时间格式 方法类型为2时起作用 yyyy-MM-dd
//FILENAME_TIME 补采文件时间 来自配置文件　决定是否补采
//COLLECT_FILE_COUNT 实采文件数量 来自配置文件 2
//CYCLE_PREV_VALUE 实采周期向前偏移数量 来自配置文件 2
//返回采集信息 {1, "FTP实时采集","yyyyMMdd","(201010(08|09))"}
function getCollectInfo(mpType,fType,timeFormat){
    var info = new Array(3, "FTP补采");//采集类型 1实时采集 2补漏采集 3、重新采集 
	var collectFileTime = getVariable("FILENAME_TIME","");//补采参数 为空正常采集 否则补采 支持正则表达式	
    var collectCount = abs(str2num(getVariable("COLLECT_FILE_COUNT","1")));
    var cyclePrev = abs(str2num(getVariable("CYCLE_PREV_VALUE","1")));
    var ti = getPrevCycleTime(null,mpType,cyclePrev);    
	if(fType != 2){//使用方法getPatternTime构造
	    var tFormat1 = "yyyyMM",tFormat2="dd";
        if(mpType == "60"){
           tFormat1 = "yyyyMMdd_";
           tFormat2 = "HH";
        }else if(mpType == "44640"){
           tFormat1 = "yyyy";
           tFormat2 = "MM";
        }else if(mpType != "1440"){
           throw new java.lang.Exception("不支持周期类型："+mpType);
        }
        info[2] = tFormat1 + tFormat2;//时间格式
	    if(collectFileTime == ""){//实时采集
           collectFileTime = getPatternTime(ti,mpType,tFormat1,tFormat2,collectCount);
           info[0] = 1;
           info[1] = "FTP实时采集";
        }
	}else{//使用getPatternTime2方法构造
	    if(timeFormat == null){
		    timeFormat = getTimePattern(mpType);
		}
		info[2] = timeFormat;
		if(collectFileTime == ""){//实时采集
           collectFileTime = getPatternTime2(ti,mpType,timeFormat,collectCount);
           info[0] = 1;
           info[1] = "FTP实时采集";
        }
	}
	info[3] = collectFileTime;
	return info;
}

//Alert(getPatternTime(str2date("201002", "yyyyMM"), 44640, "yyyy", "MM", 4));
//根据参数返回采集文件的时间正则表达式(分前后两部分 如(2009(11|12)|2010(01|02)))
//ti 最后一个周期所在时间  201002
//mpType　时间周期类型 44640
//tFormat1 前部分时间格式  yyyy
//tFormat2　后部分时间格式 MM
//collectCount　采集周期数 4
//返回时间正则表达式  (2009(11|12)|2010(01|02))
function getPatternTime(ti,mpType,tFormat1,tFormat2,collectCount){
    ti = getCycleStartTime(ti, mpType);
    var time1 = date2str(ti, tFormat1);
    var times = date2str(ti, tFormat2);
    var collectFileTime = "";
    for(; collectCount>1; collectCount=collectCount-1){
        ti = getPrevCycleTime(ti, mpType);
        var t1 =  date2str(ti, tFormat1);
        if(time1 != t1){
            collectFileTime = time1 + "(" + times + ")" + "|" + collectFileTime;
            time1 = t1;
            times = date2str(ti,tFormat2);
        }else{
            times = date2str(ti,tFormat2) + "|" + times;
        }
    }
    collectFileTime =  time1 + "(" + times + ")" + "|" + collectFileTime;
    collectFileTime = "(" + collectFileTime.substring(0, collectFileTime.length-1) + ")";
    return collectFileTime;
}

//Alert(getPatternTime2(str2date("201002", "yyyyMM"), 44640, "yyyyMM", 4));
//根据参数返回采集文件的时间正则表达式(如(200911|200912|201001|201002))
//ti 最后一个周期所在时间  201002
//mpType　时间周期类型 44640
//timeFormat 前部分时间格式  yyyyMM
//collectCount　采集周期数 4
//返回时间正则表达式  (200911|200912|201001|201002)
function getPatternTime2(ti,mpType,timeFormat,collectCount){
    ti = getCycleStartTime(ti, mpType);
    var collectFileTime = date2str(ti, timeFormat);
	//用(--collectCount)会使collectCount变为-1
    for(; collectCount>1; collectCount=collectCount-1){
        ti = getPrevCycleTime(ti, mpType);
        collectFileTime = date2str(ti, timeFormat) + "|" + collectFileTime;
    }
    collectFileTime = "(" + collectFileTime + ")";
    return collectFileTime;
}

//Alert(arrayToString(new Array("ab","ef"), ";"));
//数组转为字符串
//arr 数组 {"ab", "ef"}
//splitStr 分格符 ;
//返回连接后的字符串 ab;ef
function arrayToString(arr, splitStr){
   var str = "";
   for(var i=0; i<arr.length; i++){
      str = str + splitStr + arr[i];
   }
   str = str.substring(splitStr.length);
   return str;
}

//Alert(arrayToString(numToArray(10), 2));
//把一个数按2的最大倍数进行拆分成数组
//num 需拆分的数 11
//返回一个数组 {8,2,1}
function numToArray(num){
   var arr = new Array();
   var i=1;
   while(num>0){
      if(i*2>num){
         arr.push(i);
         num = num-i;
         i=1;
      }else{
         i=i*2;
      }
   }
   return arr;	
}

//Alert(getMaxNum(10,12));
//返回两个数的最大公约数
//n1 数值 10
//n2 数值 12
//返回最大的公约数 2
function getMaxNum(n1, n2){
   var max = n1;
   var min = n2;
   if(n1 < n2){
     max = n2;
     min = n1;
   }
   var r;
   while((r=max%min)!=0){
     max = min;
     min = r;
   }
   return min;	
}

//Alert(getMinMum(10,12));
//返回两个数的最小公倍数
//n1 数值 10
//n2 数值 12
//返回最小公倍数 60
function getMinMum(n1,n2){
   var maxN = getMaxNum(n1,n2);
   return n1*n2/maxN;	
}

//getFtpFileNameList("192.168.168.2",21,"cattsoft","cattsoft","/data",".*",100);
//返回FTP上指定目录下的文件列表
//host 地址 192.168.168.2
//port 端口　21
//username　用户名 cattsoft
//password 密码 cattsoft
//homeDir 目录 /data
//regex 文件名正则表达式 .*
//minSize 文件大小最小值
//返回　一个文件列表数组
function getFtpFileNameList(host, port, username, password, homeDir, regex, minSize){
	if(minSize == null){
	   minSize = -1;
	}
	var fileArr = new Array();
	var homeDirs = homeDir.split(";");
	for(var j=0; j<homeDirs.length; j++){
	    var fileList = getFtpFileList(host, port, username, password, homeDirs[j], regex);
	    for(var i=0; i<fileList.length; i++){
			if(minSize == -1 || fileList[i].getSize() >= minSize){
	            fileArr.push(homeDirs[j] + "/" + fileList[i].getName());
			}
	    }
	}
	return fileArr;
}

//getFtpFileSize(getFtpFileList("192.168.168.2",21,"cattsoft","cattsoft","/data",".*"),"test.txt");
//根据FTP文件列表返回指定文件的大小
//fileList FTP上返回的文件列表,通过调用方法getFtpFileList得到
//fileName 指定文件名 test.txt
//返回该文件大小,找不到返回-1 Long 
function getFtpFileSize(fileList, fileName){
    for(var i=0; i<fileList.length; i++){
	   var file = fileList[i];
	   if(file.getName() == fileName){
	       return file.getSize();
	   }
	}
	return -1;
}

//getFtpFileList("192.168.168.2",21,"cattsoft","cattsoft","/data",".*");
//返回FTP上指定目录下的文件列表
//host 地址 192.168.168.2
//port 端口　21
//username　用户名 cattsoft
//password 密码 cattsoft
//homeDir 目录 /data
//regex  文件格式(正则表达式) .*
//返回　一个文件列表数组
function getFtpFileList(host, port, username, password, homeDir, regex){
	if(regex == null || regex == ""){
	    regex = ".*";
	}
	var ftp = getFtpClient(host, port, username, password, homeDir);
    var fileList = ftp.listFiles();
	var arrFile = new Array();
	for(var i=0; i<fileList.length; i++){
	    var fileName = fileList[i].getName();
		if(fileList[i].isFile() && fileName.matches(regex)){
		     arrFile.push(fileList[i]);
		}
	}
	try {
	    ftp.quit();
	} catch(e) {
        writeToLog("m", "error->退出FTP出错："+e);
	}
	writeToLog("m", homeDir + "->匹配文件数："+arrFile.length);
	return arrFile;
}

//delFtpFile("192.168.168.2",21,"cattsoft","cattsoft","/data",".*",false);
//删除FTP上指定目录下的指定文件
//host 地址 192.168.168.2
//port 端口　21
//username　用户名 cattsoft
//password 密码 cattsoft
//homeDir 目录 /data
//regex  文件格式(正则表达式) .*
//isRegex 是否匹配才删除 true:匹配才删除,false:匹配不上才删除
//返回　一个文件列表数组
function delFtpFile(host, port, username, password, homeDir, regex, isRegex){
	if(regex == null || regex == ""){
	    regex = ".*";
	}
	if(isRegex == null){
	   isRegex = false;
	}
	var ftp = getFtpClient(host, port, username, password, homeDir);
    var fileList = ftp.listFiles();
	var arrFile = new Array();
	for(var i=0; i<fileList.length; i++){
	    var fileName = fileList[i].getName();
		if(fileList[i].isFile()){
		    if((fileName.matches(regex) && isRegex) || (!fileName.matches(regex) && !isRegex)){
		        ftp.deleteFile(fileName);
				arrFile.push(fileList[i]);
			}
		}
	}
	try {
	    ftp.quit();
	} catch(e) {
        writeToLog("m", "error->退出FTP出错："+e);
	}
	writeToLog("m", homeDir + "->删除文件数："+arrFile.length);
	return arrFile;
}

//getFtpClient("192.168.168.2",21,"cattsoft","cattsoft","/data");
//返回一个FTP连接
//host 地址 192.168.168.2
//port 端口　21
//username　用户名 cattsoft
//password 密码 cattsoft
//homeDir 目录 /data
//返回FTP连接　
function getFtpClient(host, port, username, password, homeDir){
    var ftp = new org.apache.commons.net.ftp.FTPClient();
	try{
	   ftp.connect(host, port);
	   ftp.login(username, password);
	   if(homeDir != null && homeDir != ""){
	      if (!ftp.changeWorkingDirectory(homeDir)){
	         throw new java.lang.Exception("目录跳转失败："+homeDir);
	      }
	   }
	}catch(e){
	   throw new java.lang.Exception("连接FTP失败："+host);
	}
	return ftp;
}

//var dbConn=getDBConnection("ase_db");
//dbName 数据库名称 如ase_db
//返回相应的数据连接
//其它使用方法
//var result = dbConn.execStatements(sql);
//var rs = dbConn.openQuery("select top 10 sApId from tbSDWlanAP_PM");
//while(rs.next()){
//   writeToLog("m", "APID==========================> "+rs.getString(1));
//}
//dbConn.disconnect();
//add 2011-01-26 韦汉靖
function getDBConnection(dbName){
	  var dbMeta = _step_.getTransMeta().findDatabase(dbName);
    var dbConn = new org.pentaho.di.core.database.Database(dbMeta);
    dbConn.connect();
    return dbConn;
}

//var db_url="jdbc:sybase:Tds:192.168.168.163:5000/NetDailyFlux?charset=eucgb&jconnect_version=6";
//var db_driver="com.sybase.jdbc3.jdbc.SybDataSource";
//var db_user="develop";
//var db_pwd="catt2010";
//var dbConn=createDBConnection(db_url, db_driver, db_user, db_pwd);
//db_url 数据库连接地址
//db_driver 数据库驱动类
//db_user　用户名
//db_pwd　密码
//返回相应的数据连接
//add 2011-01-26 韦汉靖
function createDBConnection(db_url, db_driver, db_user, db_pwd){
	 var dbMeta = new org.pentaho.di.core.database.DatabaseMeta("js_build_db", "GENERIC", "Native", null, null, null, db_user, db_pwd);
   var attr = dbMeta.getAttributes();
   attr.put("CUSTOM_DRIVER_CLASS", db_driver);
   attr.put("CUSTOM_URL", db_url);
   var dbConn = new org.pentaho.di.core.database.Database(dbMeta);
   dbConn.connect();
   return dbConn;
}

//Alert(findArrayIndex(new Array(1,2,3), 3));
//判断数组是否存在指定值 存在返回索引ID 否则返回-1
//arr 数组 ew Array(1,2,3)
//value 查找值 3
//返回 索引ID 2
function findArrayIndex(arr, value){
   for(var i=0; i<arr.length; i++){
      if(arr[i] == value){
         return i;
      }
   }
   return -1;
}

//用splitStr分析字符串keys得出数组 查找数据中value
//如果值在keys中存在则返回values中相应位置的字符 否则返回null
//keys 如 60,1440,44640
//values 如 24,2,1
//value 如 1440
//splitStr 如 ,
//defIndex 如 0
//以上设置返回 2
function findKeyByValue(keys,values,value,splitStr,defIndex){
   var kArr = keys.split(splitStr);
   var vArr = values.split(splitStr);
   var index = findArrayIndex(kArr, value);
   if(index!=-1){
      if(vArr[index]!=undefined){
      	 return vArr[index];
      }else if(defIndex != null && vArr[defIndex]!=undefined){
   	     return vArr[defIndex];
   	  }
   }
   return null;
}

//updateOuputLog();
//confFile  日志配置文件路径
//增加日志输出文件
//通过/../conf/log.xml文件配置日志输出
function updateOutputLog(confFile){
   var first = getVariable("FIRST_TIME_UPDATE_LOG", "true");
   if(first == "true"){
	   logWriter = org.pentaho.di.core.logging.LogWriter.getInstance();
	   var softPath = getThisSoftPath();
	   var logConf = softPath + "/../conf/log.xml";
	   if(confFile != null && confFile != ""){
	      logConf = softPath + "/" + confFile;
	   }else{
	      if(!fileExists(logConf)){
	          logConf = softPath + "/log.xml";
	      }
	      if(!fileExists(logConf)){
	          logConf = softPath + "/conf/log.xml";
	      }
	   }
	   org.apache.log4j.xml.DOMConfigurator.configure(logConf);
	   var logger = org.apache.log4j.Logger.getLogger("kettle_log");
       var appenders = logger.getAllAppenders();
	   while(appenders.hasMoreElements()){
	      var appender = appenders.nextElement();
		  writeToLog("m", "======add==log====>"+appender.getName());
		  logWriter.addAppender(appender);
	   }
       setVariable("FIRST_TIME_UPDATE_LOG", "false", "r");
   }
}

//reflectionByField(createObject("com.test.Test", null), "test", "test");
//为某个实例私有属性设置值
//obj 实例 createObject("com.test.Test", null);
//fileName 属性名称 test
//setObj 结果值
function reflectionByField(obj, fieldName, isGet, setObj){
    var clazz = obj.getClass();
	var field = clazz.getDeclaredField(fieldName);
	field.setAccessible(true);
	if(isGet){
	   return field.get(obj);
	}else{
	   field.set(obj, setObj);
	}
}

//reflectionByMethod(createObject("com.test.Test", null), "setTest", java.lang.String,"test");
//为某个实例不可直接访问的方法设置值
//obj 实例 createObject("com.test.Test", null);
//methodName 方法名称 setTest
//paramTypes 参数类型集 java.lang.String
//os 结果值集　
function reflectionByMethod(obj, methodName, paramTypes, os){
    var clazz = obj.getClass();
	var method = clazz.getDeclaredMethod(methodName, paramTypes);
    method.setAccessible(true);
	return method.invoke(obj, os);
}

//createObject("java.lang.Object", null);
//根据类名返回此类的一个实例 主要用于构造方法为private
//className　类名称 java.lang.Object
//os 构造方法参数集 null
//返回一个Object实现
function createObject(className, os){
    var c = java.lang.Class.forName(className);
	var cons = c.getDeclaredConstructors();
	var obj;
	try{
		for(var i=0;i<cons.length;i++){
           var con = cons[i];
	       con.setAccessible(true);
		   var types = con.getParameterTypes();
	       if(types.length == os.length){
		      obj = con.newInstance(os);
		   }
	    }
	}catch(e){}
	return obj;
}


//getPeriodOfTime 根据给定时间获取上旬、中旬或下旬的开始时间(yyyy-MM-dd HH:mm:ss)和结束时间[不包含](yyyy-MM-dd HH:mm:ss)。
    //如：上旬开始时间：2010-12-01 00:00:00，结束时间：2010-12-11 00:00:00
//time 表示传入的时间：如果time为null，则默认为当前时间。
//type 获取时间的类型：如果type为null，则默认为上旬。
    //1表示上旬
    //2表示中旬
    //3表示下旬。
//offset 偏移量：
    //0或不写表示当前月、正数表示往后推相应的月份、负数表示往后推相应的月份
//例子：
//period = getPeriodOfTime();//获取当前月的上旬的开始时间和结束时间
//period = getPeriodOfTime(null, 2);//获取当前月中旬的开始时间和结束时间
//period = getPeriodOfTime(null, 3, -1);//获取上个月下旬的开始时间和结束时间
//period = getPeriodOfTime(str2date("20100208", "yyyyMMdd"), 3);//获取2010年02月下旬的开始时间和结束时间
//Alert("开始时间：" + period[0] + " -------------- 结束时间：" + period[1]);
//add by 张志强 2011-01-08
function getPeriodOfTime(time, type, offset){
    if(null == offset){
      offset = 0;
    }
    if(null == type){
      type = 1;
    }
    var period = new Array();
    var tempDate = getLastCycleTime(time, 44640, offset);
    
    var start = "";
    var end = "";
    var fomart = "yyyy-MM-dd HH:mm:ss";
    //Alert(date2str(tempDate, fomart));
    if(1 == type){
      start = date2str(tempDate, fomart);
      end = date2str(dateAdd(tempDate, "d", 10), fomart);
    }else if(2 == type){
      start = date2str(dateAdd(tempDate, "d", 10), fomart);
      end = date2str(dateAdd(tempDate, "d", 20), fomart);
    }else if(3 == type){
      start = date2str(dateAdd(tempDate, "d", 20), fomart);
      end = date2str(dateAdd(tempDate, "m", 1), fomart);
    }else{
    	throw new java.lang.Exception("给定的获取类型有误。获取时间的类型为：1表示上旬、2表示中旬、3表示下旬。");
    }
    period[0] = start;
    period[1] = end;
    
    return period;
}