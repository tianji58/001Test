//JavaScript Function
//�½� Τ���� 2010-09-29 ��ͨJS�����󼯺�
//��ע ���ļ�������ѭ������(1000������)�Ļ�����ʹ�ã������Ӱ�������ٶ�
//��ת��JS�����ʹ�ã�LoadScriptFile(getVariable("Internal.Transformation.Filename.Directory", "") +"/cattsoft_Functions.js");
//
//�汾��Ϣ
//01====>V1.0.0.1<====>2010-09-29<====>Τ����<====>�½�
//02====>V1.0.0.2<====>2011-01-08<====>��־ǿ<====>���ӷ���getPeriodOfTime�������ϡ��С���Ѯʱ��Σ�
//


//Alert(getOsName());
//���ز���ϵͳ����(windows/linux)
function getOsName(){
	 var osName = java.lang.System.getProperty("os.name").toLowerCase();
	 if(osName.indexOf("windows") >= 0){
	 	   return "windows";
	 	}
	 	return "linux";
}

//Alert(isCheckTime(1440, 1));
//����ʱ���Ƿ�ﵽ����ʱ�� ��������ѯ���� �ж��Ƿ���������Ȳ���
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
        writeToLog("m","������ʱ��:" + checkTime);
	 	}
	 	return (nowTime==checkTime);
}

//Alert(getThisSoftPath());
//���س�������Ŀ¼ ����ǰ׺file:
function getThisSoftPath(){
	var path = getVariable("Internal.Transformation.Filename.Directory", "");
  path = getRealPath(path);
	return path;
}

//Alert(getRealPath(getVariable("Internal.Transformation.Filename.Directory", "")));
//����һ����ʵ·��  ����ǰ׺file:
function getRealPath(path){
	if(path.indexOf("file://")==0){
	   if(getOsName() == "windows"){//WINDOWSϵͳ
	      path = path.substring(8);
	   }else{
	      path = path.substring(7);
	   }
	}
	return path;
}

//Alert(initCycleTime(44640, 1, 2));
//���ݿ�ʼʱ�䡢����ʱ�䡢�������͵Ȳ�������ͬ��ʱ���
//mpType ʱ���������� 44640
//prevCycle ��ǰƫ���� 1
//cycleCount��ͬ�����ڸ��� 2
//���س�ʼ�����ʱ��� {201007,201008, 1}
function initCycleTime(mpType, prevCycle, cycleCount){
	start = replace(getVariable("START_TIME", ""), "-", "");
	end = replace(getVariable("END_TIME", ""), "-", "");
	var cycleInfo = new Array();
	cycleInfo[2] = 3;//�ɼ����� 1ʵʱ�ɼ� 2��©�ɼ� 3�����²ɼ�
	cycleInfo[3] = "����";
    if(start.length == 6 && end.length == 6){//�������ʱ��β�����6λ�����·�
        cycleInfo[0] = str2date(start, "yyyyMM");
        cycleInfo[1] = str2date(end, "yyyyMM"); 
    }else if(start.length == 8 && end.length == 8){//�������ʱ��β�����8λ��������
        cycleInfo[0] = str2date(start, "yyyyMMdd");
        cycleInfo[1] = str2date(end, "yyyyMMdd"); 
    }else if(start.length == 10 && end.length == 10){//�������ʱ��β�����10λ����Сʱ
        cycleInfo[0] = str2date(start, "yyyyMMddHH");
        cycleInfo[1] = str2date(end, "yyyyMMddHH"); 
    }else if(start.length == 12 && end.length == 12){//�������ʱ��β�����12λ������
        cycleInfo[0] = str2date(start, "yyyyMMddHHmm");
        cycleInfo[1] = str2date(end, "yyyyMMddHHmm"); 
    }else{//ʵʱ�ɼ�ʱ���
        cycleInfo[1] = getPrevCycleTime(null,mpType,prevCycle);//���û������ʱ��Σ���Ĭ��Ϊ������
        cycleInfo[0] = getPrevCycleTime(cycleInfo[1],mpType,cycleCount);
		cycleInfo[2] = 1;
		cycleInfo[3] = "ʵʱ�ɼ�";
    }
	return cycleInfo;
}

//Alert(getTableNameSuffix(str2date("201009", "yyyyMM"), 2));
//����ʱ������ͷ��ر�����׺
//ti ��������ʱ�� 201009
//tableType �������� 2
//������Ӧ���� _y10m09
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
//������Ӧ��ʱ���ʽ�ַ�
//mpType 1440
//������Ӧʱ���ʽ��ʾ�ַ� yyyyMMdd
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
        throw new java.lang.Exception("��֧�ֵ���������" + mpType);
   }
   return timePattern;
}

//Alert(getCycleStartTime(null, 1440));
//����ʱ���ַ��͸�ʽ���ر�ʾ�����ڵĿ�ʼʱ��
//ti ʱ����� 20100928110000
//mpType�������� 1440
//�������ڿ�ʼʱ�䡡��20100928����ʾ��ʱ��
function getCycleStartTime(ti, mpType){
    var cal = java.util.Calendar.getInstance();
    if(ti != null){
	    cal.setTime(ti);
	}
	cal.setTime(truncDate(cal.getTime(), 1));
    if(mpType == "44640"){
        cal.setTime(truncDate(cal.getTime(), 4));
    }else if(mpType == "10080"){//�����ܵ�ʱ���ʽ
        cal.setFirstDayOfWeek(java.util.Calendar.FRIDAY);
        cal.set(java.util.Calendar.DAY_OF_WEEK, java.util.Calendar.FRIDAY);//����Ϊһ�ܵĿ�ʼ
    }else if(mpType == "1440"){
        cal.setTime(truncDate(cal.getTime(), 3));
    }else if(mpType == "60"){
        cal.setTime(truncDate(cal.getTime(), 2));
    }else if(mpType == "30"){//�����ܵ�ʱ���ʽ
        var min = floor(cal.get(java.util.Calendar.MINUTE)/30);
		min = 30 * min;
		cal.set(java.util.Calendar.MINUTE, min);
    }else if(mpType == "15"){//�����ܵ�ʱ���ʽ
        var min = floor(cal.get(java.util.Calendar.MINUTE)/15);
		min = 15 * min;
		cal.set(java.util.Calendar.MINUTE, min);
    }else if(mpType == "5"){//�����ܵ�ʱ���ʽ
        var min = floor(cal.get(java.util.Calendar.MINUTE)/5);
		min = 5 * min;
		cal.set(java.util.Calendar.MINUTE, min);
    }else {
        throw new java.lang.Exception("��֧�ֵ���������" + mpType);
    }
    return cal.getTime();
}

//Alert(getCycleStartTime2("20100929121005", "yyyyMMddHHmmss", 1440));
//����ʱ���ַ��͸�ʽ���ر�ʾ�����ڵĿ�ʼʱ��
//timeStr ʱ���ַ���  2010092811
//timeStrPattern ʱ���ַ����ĸ�ʽ yyyyMMddHH
//timePatternʱ���ʽ���������й�  yyyyMMdd
//mpType�������� 1440
//�������ڿ�ʼʱ�䡡��20100928����ʾ��ʱ��
function getCycleStartTime2(timeStr, timePattern, mpType){
    var ti = str2date(timeStr, timePattern);//��ȡ�ַ�����ʾ��ʱ��
    return getCycleStartTime(ti, mpType);
}

//Alert(getPrevCycleTime(null, 1440, 2));
//��ȡǰN�����ڵĿ�ʼʱ��
//ti��ǰ���ڿ�ʼʱ�䡡20100929
//mpType 1440
//n 2
//����ǰN���ڿ�ʼʱ�� 20100927
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
//��ȡ��N�����ڵĿ�ʼʱ��
//ti��ǰ���ڿ�ʼʱ�䡡20100929
//mpType 1440
//n ���ƫ�������� 1
//���غ�N���ڿ�ʼʱ�� 20100930
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
//����ʱ��η������ʱ����������ڣ���";"�ֿ�
//startCycle����ʱ��ο�ʼʱ������ڿ�ʼʱ��  20100925
//endCycle����ʱ��ν���ʱ������ڿ�ʼʱ��   20100928
//timePatternʱ���ʽ���������й�   yyyyMMdd
//mpType ��������   1440
//maxCycleCount ���������Ŀ  30
//������";"�ֿ���ʱ�������ַ�����20100925;20100926;20100927;20100928
//���á�������ִ��ǰʹ�á���һ������"Split field to rows"�ﵽ������ִ��Ч��
function getCycleTimes(startCycle,endCycle,timePattern,mpType, maxCycleCount){
    startCycle = getCycleStartTime(startCycle, mpType);
    endCycle = getCycleStartTime(endCycle, mpType);
    var cycleTimes = date2str(startCycle,timePattern);  
    startCycle = getLastCycleTime(startCycle, mpType);//������һ������
    while(startCycle.compareTo(endCycle)<1 && maxCycleCount>1){//�ۼ���һ������
        cycleTimes = cycleTimes + ";" + date2str(startCycle, timePattern);
        startCycle = getLastCycleTime(startCycle, mpType);
		maxCycleCount = maxCycleCount-1;
    }
    return cycleTimes;
}

//Alert(getCollectInfo(1440));
//��ȡ�ɼ���Ϣ
//mpType���ɼ����͡�1440
//fType   �������� 2--->getPatternTime2 ����-->getPatternTime
//timeFormat ʱ���ʽ ��������Ϊ2ʱ������ yyyy-MM-dd
//FILENAME_TIME �����ļ�ʱ�� ���������ļ��������Ƿ񲹲�
//COLLECT_FILE_COUNT ʵ���ļ����� ���������ļ� 2
//CYCLE_PREV_VALUE ʵ��������ǰƫ������ ���������ļ� 2
//���زɼ���Ϣ {1, "FTPʵʱ�ɼ�","yyyyMMdd","(201010(08|09))"}
function getCollectInfo(mpType,fType,timeFormat){
    var info = new Array(3, "FTP����");//�ɼ����� 1ʵʱ�ɼ� 2��©�ɼ� 3�����²ɼ� 
	var collectFileTime = getVariable("FILENAME_TIME","");//���ɲ��� Ϊ�������ɼ� ���򲹲� ֧��������ʽ	
    var collectCount = abs(str2num(getVariable("COLLECT_FILE_COUNT","1")));
    var cyclePrev = abs(str2num(getVariable("CYCLE_PREV_VALUE","1")));
    var ti = getPrevCycleTime(null,mpType,cyclePrev);    
	if(fType != 2){//ʹ�÷���getPatternTime����
	    var tFormat1 = "yyyyMM",tFormat2="dd";
        if(mpType == "60"){
           tFormat1 = "yyyyMMdd_";
           tFormat2 = "HH";
        }else if(mpType == "44640"){
           tFormat1 = "yyyy";
           tFormat2 = "MM";
        }else if(mpType != "1440"){
           throw new java.lang.Exception("��֧���������ͣ�"+mpType);
        }
        info[2] = tFormat1 + tFormat2;//ʱ���ʽ
	    if(collectFileTime == ""){//ʵʱ�ɼ�
           collectFileTime = getPatternTime(ti,mpType,tFormat1,tFormat2,collectCount);
           info[0] = 1;
           info[1] = "FTPʵʱ�ɼ�";
        }
	}else{//ʹ��getPatternTime2��������
	    if(timeFormat == null){
		    timeFormat = getTimePattern(mpType);
		}
		info[2] = timeFormat;
		if(collectFileTime == ""){//ʵʱ�ɼ�
           collectFileTime = getPatternTime2(ti,mpType,timeFormat,collectCount);
           info[0] = 1;
           info[1] = "FTPʵʱ�ɼ�";
        }
	}
	info[3] = collectFileTime;
	return info;
}

//Alert(getPatternTime(str2date("201002", "yyyyMM"), 44640, "yyyy", "MM", 4));
//���ݲ������زɼ��ļ���ʱ��������ʽ(��ǰ�������� ��(2009(11|12)|2010(01|02)))
//ti ���һ����������ʱ��  201002
//mpType��ʱ���������� 44640
//tFormat1 ǰ����ʱ���ʽ  yyyy
//tFormat2���󲿷�ʱ���ʽ MM
//collectCount���ɼ������� 4
//����ʱ��������ʽ  (2009(11|12)|2010(01|02))
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
//���ݲ������زɼ��ļ���ʱ��������ʽ(��(200911|200912|201001|201002))
//ti ���һ����������ʱ��  201002
//mpType��ʱ���������� 44640
//timeFormat ǰ����ʱ���ʽ  yyyyMM
//collectCount���ɼ������� 4
//����ʱ��������ʽ  (200911|200912|201001|201002)
function getPatternTime2(ti,mpType,timeFormat,collectCount){
    ti = getCycleStartTime(ti, mpType);
    var collectFileTime = date2str(ti, timeFormat);
	//��(--collectCount)��ʹcollectCount��Ϊ-1
    for(; collectCount>1; collectCount=collectCount-1){
        ti = getPrevCycleTime(ti, mpType);
        collectFileTime = date2str(ti, timeFormat) + "|" + collectFileTime;
    }
    collectFileTime = "(" + collectFileTime + ")";
    return collectFileTime;
}

//Alert(arrayToString(new Array("ab","ef"), ";"));
//����תΪ�ַ���
//arr ���� {"ab", "ef"}
//splitStr �ָ�� ;
//�������Ӻ���ַ��� ab;ef
function arrayToString(arr, splitStr){
   var str = "";
   for(var i=0; i<arr.length; i++){
      str = str + splitStr + arr[i];
   }
   str = str.substring(splitStr.length);
   return str;
}

//Alert(arrayToString(numToArray(10), 2));
//��һ������2����������в�ֳ�����
//num ���ֵ��� 11
//����һ������ {8,2,1}
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
//���������������Լ��
//n1 ��ֵ 10
//n2 ��ֵ 12
//�������Ĺ�Լ�� 2
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
//��������������С������
//n1 ��ֵ 10
//n2 ��ֵ 12
//������С������ 60
function getMinMum(n1,n2){
   var maxN = getMaxNum(n1,n2);
   return n1*n2/maxN;	
}

//getFtpFileNameList("192.168.168.2",21,"cattsoft","cattsoft","/data",".*",100);
//����FTP��ָ��Ŀ¼�µ��ļ��б�
//host ��ַ 192.168.168.2
//port �˿ڡ�21
//username���û��� cattsoft
//password ���� cattsoft
//homeDir Ŀ¼ /data
//regex �ļ���������ʽ .*
//minSize �ļ���С��Сֵ
//���ء�һ���ļ��б�����
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
//����FTP�ļ��б���ָ���ļ��Ĵ�С
//fileList FTP�Ϸ��ص��ļ��б�,ͨ�����÷���getFtpFileList�õ�
//fileName ָ���ļ��� test.txt
//���ظ��ļ���С,�Ҳ�������-1 Long 
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
//����FTP��ָ��Ŀ¼�µ��ļ��б�
//host ��ַ 192.168.168.2
//port �˿ڡ�21
//username���û��� cattsoft
//password ���� cattsoft
//homeDir Ŀ¼ /data
//regex  �ļ���ʽ(������ʽ) .*
//���ء�һ���ļ��б�����
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
        writeToLog("m", "error->�˳�FTP����"+e);
	}
	writeToLog("m", homeDir + "->ƥ���ļ�����"+arrFile.length);
	return arrFile;
}

//delFtpFile("192.168.168.2",21,"cattsoft","cattsoft","/data",".*",false);
//ɾ��FTP��ָ��Ŀ¼�µ�ָ���ļ�
//host ��ַ 192.168.168.2
//port �˿ڡ�21
//username���û��� cattsoft
//password ���� cattsoft
//homeDir Ŀ¼ /data
//regex  �ļ���ʽ(������ʽ) .*
//isRegex �Ƿ�ƥ���ɾ�� true:ƥ���ɾ��,false:ƥ�䲻�ϲ�ɾ��
//���ء�һ���ļ��б�����
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
        writeToLog("m", "error->�˳�FTP����"+e);
	}
	writeToLog("m", homeDir + "->ɾ���ļ�����"+arrFile.length);
	return arrFile;
}

//getFtpClient("192.168.168.2",21,"cattsoft","cattsoft","/data");
//����һ��FTP����
//host ��ַ 192.168.168.2
//port �˿ڡ�21
//username���û��� cattsoft
//password ���� cattsoft
//homeDir Ŀ¼ /data
//����FTP���ӡ�
function getFtpClient(host, port, username, password, homeDir){
    var ftp = new org.apache.commons.net.ftp.FTPClient();
	try{
	   ftp.connect(host, port);
	   ftp.login(username, password);
	   if(homeDir != null && homeDir != ""){
	      if (!ftp.changeWorkingDirectory(homeDir)){
	         throw new java.lang.Exception("Ŀ¼��תʧ�ܣ�"+homeDir);
	      }
	   }
	}catch(e){
	   throw new java.lang.Exception("����FTPʧ�ܣ�"+host);
	}
	return ftp;
}

//var dbConn=getDBConnection("ase_db");
//dbName ���ݿ����� ��ase_db
//������Ӧ����������
//����ʹ�÷���
//var result = dbConn.execStatements(sql);
//var rs = dbConn.openQuery("select top 10 sApId from tbSDWlanAP_PM");
//while(rs.next()){
//   writeToLog("m", "APID==========================> "+rs.getString(1));
//}
//dbConn.disconnect();
//add 2011-01-26 Τ����
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
//db_url ���ݿ����ӵ�ַ
//db_driver ���ݿ�������
//db_user���û���
//db_pwd������
//������Ӧ����������
//add 2011-01-26 Τ����
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
//�ж������Ƿ����ָ��ֵ ���ڷ�������ID ���򷵻�-1
//arr ���� ew Array(1,2,3)
//value ����ֵ 3
//���� ����ID 2
function findArrayIndex(arr, value){
   for(var i=0; i<arr.length; i++){
      if(arr[i] == value){
         return i;
      }
   }
   return -1;
}

//��splitStr�����ַ���keys�ó����� ����������value
//���ֵ��keys�д����򷵻�values����Ӧλ�õ��ַ� ���򷵻�null
//keys �� 60,1440,44640
//values �� 24,2,1
//value �� 1440
//splitStr �� ,
//defIndex �� 0
//�������÷��� 2
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
//confFile  ��־�����ļ�·��
//������־����ļ�
//ͨ��/../conf/log.xml�ļ�������־���
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
//Ϊĳ��ʵ��˽����������ֵ
//obj ʵ�� createObject("com.test.Test", null);
//fileName �������� test
//setObj ���ֵ
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
//Ϊĳ��ʵ������ֱ�ӷ��ʵķ�������ֵ
//obj ʵ�� createObject("com.test.Test", null);
//methodName �������� setTest
//paramTypes �������ͼ� java.lang.String
//os ���ֵ����
function reflectionByMethod(obj, methodName, paramTypes, os){
    var clazz = obj.getClass();
	var method = clazz.getDeclaredMethod(methodName, paramTypes);
    method.setAccessible(true);
	return method.invoke(obj, os);
}

//createObject("java.lang.Object", null);
//�����������ش����һ��ʵ�� ��Ҫ���ڹ��췽��Ϊprivate
//className�������� java.lang.Object
//os ���췽�������� null
//����һ��Objectʵ��
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


//getPeriodOfTime ���ݸ���ʱ���ȡ��Ѯ����Ѯ����Ѯ�Ŀ�ʼʱ��(yyyy-MM-dd HH:mm:ss)�ͽ���ʱ��[������](yyyy-MM-dd HH:mm:ss)��
    //�磺��Ѯ��ʼʱ�䣺2010-12-01 00:00:00������ʱ�䣺2010-12-11 00:00:00
//time ��ʾ�����ʱ�䣺���timeΪnull����Ĭ��Ϊ��ǰʱ�䡣
//type ��ȡʱ������ͣ����typeΪnull����Ĭ��Ϊ��Ѯ��
    //1��ʾ��Ѯ
    //2��ʾ��Ѯ
    //3��ʾ��Ѯ��
//offset ƫ������
    //0��д��ʾ��ǰ�¡�������ʾ��������Ӧ���·ݡ�������ʾ��������Ӧ���·�
//���ӣ�
//period = getPeriodOfTime();//��ȡ��ǰ�µ���Ѯ�Ŀ�ʼʱ��ͽ���ʱ��
//period = getPeriodOfTime(null, 2);//��ȡ��ǰ����Ѯ�Ŀ�ʼʱ��ͽ���ʱ��
//period = getPeriodOfTime(null, 3, -1);//��ȡ�ϸ�����Ѯ�Ŀ�ʼʱ��ͽ���ʱ��
//period = getPeriodOfTime(str2date("20100208", "yyyyMMdd"), 3);//��ȡ2010��02����Ѯ�Ŀ�ʼʱ��ͽ���ʱ��
//Alert("��ʼʱ�䣺" + period[0] + " -------------- ����ʱ�䣺" + period[1]);
//add by ��־ǿ 2011-01-08
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
    	throw new java.lang.Exception("�����Ļ�ȡ�������󡣻�ȡʱ�������Ϊ��1��ʾ��Ѯ��2��ʾ��Ѯ��3��ʾ��Ѯ��");
    }
    period[0] = start;
    period[1] = end;
    
    return period;
}