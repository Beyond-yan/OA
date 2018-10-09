<%@page pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.Enumeration"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	boolean aotuLogin = (request.getParameter("poRtal")!=null);
	String viewId = request.getParameter("viewId");
	System.out.println(aotuLogin);
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
<title>重庆市交通委员会办公系统</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/sysMain.css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/ext3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/ext3/resources/css/ext-patch.css" />
<%response.addHeader("__timeout","true");%>
<script type="text/javascript" src="<%=request.getContextPath()%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript">
	var __ctxPath="<%=request.getContextPath() %>";
	function doLogin(params){
		Ext.Ajax.request( {
			url : __ctxPath + "/login.do",
			params : params,
			method : "post",
			success : function(resp,opts) {
				var respText = Ext.util.JSON.decode(resp.responseText);
				if(respText.failure==true) {
					Ext.MessageBox.show( {
						title : "操作信息",
						msg : respText.msg,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
					return;
				}		
				var iurl = __ctxPath + "/index.jsp";
				<%if(request.getParameter("viewId")!=null){%>
						iurl += "?viewId=<%=request.getParameter("viewId")%>"
				<%}%>
				window.location.href = iurl;
			},
			failure:function(resp,opts) {
				//var respText = Ext.util.JSON.decode(resp.responseText);
			}
		});
	}
</script>
<% if(aotuLogin){%>
<script type="text/javascript">
	doLogin({username:'<%=request.getParameter("username")%>',poRtal:'password'});
</script>
</head>
<body>
正在登录请稍后......
<%} else {%>
<script type="text/javascript">
	function refeshCode() {
		var a = document.getElementById("loginCode");
		a.innerHTML='<img border="0" height="30" width="80" src="' + __ctxPath
		+ "/CaptchaImg?rand=" + Math.random() + '"/>';
	}
	
	function submitYouFrom(){
		var usernameTemp = document.getElementById('ext-comp-1002').value;
		var passwordTemp = document.getElementById('ext-comp-1003').value;
		var codeTemp ="";
		//var codeTemp = document.getElementById('checkCode').value;
		if(getCookieUserName("CQOA_UserName") != usernameTemp){
			setCookie("CQOA_UserName",usernameTemp);
		}
		if(usernameTemp == "" || passwordTemp == ""){
			Ext.MessageBox.show( {
				title : "操作信息",
				msg : "请输入帐号和密码不能为空!",
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
			return false;
		}
		doLogin({username:usernameTemp,password:passwordTemp,checkCode:codeTemp});
	}
	function reset(){
		document.getElementById('ext-comp-1002').value='';
		document.getElementById('ext-comp-1003').value='';
		//document.getElementById('checkCode').value='';
	}
	
	function getCookieUserName(cookieKey){
		 var arr = document.cookie.match(new RegExp("(^| )" + cookieKey + "=([^;]*)(;|$)"));
	     if(arr != null) 
	    	 return unescape(arr[2]); 
		return null;
	}
	function setCookie(cookieKey,value){
		    var Days = 10; //此 cookie 将被保存 10 天
		    var exp = new Date();    //new Date("December 31, 9998");
		    exp.setTime(exp.getTime() + Days*24*60*60*1000);
		    document.cookie = cookieKey + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}

	window.onload=function(){
		var strUserName=getCookieUserName("CQOA_UserName"); 
		if(null != strUserName && strUserName != "")
			document.getElementById('ext-comp-1002').value=strUserName;
	};
</script>
<style type="text/css">
	body{padding-top:134px;background:#f5f6f8  url(images/loginImages/bg_loginPage.png) top center no-repeat;}
	.loginBg{position:relative;height:350px;padding-top:50px;background:url(images/loginImages/bg_loginBlue.jpg) repeat-x;}
	.loginForm{width:713px;height:350px;position:relative;margin:0 auto;background:url("images/loginImages/bg_loginForm.png") top center no-repeat;}
	.loginForm ul{margin-left:195px;width:246px;height:193px;padding-top:65px;}
	.loginForm ul li{padding-left:22px;height:40px;margin-bottom:6px;}
	.loginForm ul li input{width:130px;margin-top:3px;border:none;*border:0;background-color:transparent;height:20px}
	.identifyCode{margin-left:15px;}
	.loginForm ul li label{display:inline-block;*display:inline;*zoom:1;width:60px;}
	.title{width:542px;height:58px;margin-left:-271px;position:absolute;top:-15px;left:50%;background:url(images/loginImages/bg_loginTitle.png) no-repeat;}
	.btn{margin-left:78px;background: url("images/loginImages/btn_login.png") no-repeat scroll;}
	.btn a{width:110px;height:31px;}
	.btn_login{margin-left:55px;}
	.copyRight{text-align:center;}
</style>
</head>
<body>
<div class="loginBg">
	<div class="title"></div>
	<div class="loginForm">
    	<ul>
             <li class="username"><label>&nbsp;</label><input id="ext-comp-1002" name=username/></li>
             <li class="password"><label>&nbsp;</label><input id="ext-comp-1003" type="password" name=password onkeyDown="if(event.keyCode==13){Javascript:submitYouFrom()}"/></li>
             <li>
             	<a id="ext-gen40" onclick="submitYouFrom();" class="btn_login" href="javascript:void(0);">
             		<img src="images/loginImages/btn_login.png"/>
             	</a>
             </li>
        </ul>
    </div>
</div>
<div style="margin-bottom: 10px"><p class="copyRight">版权所有：重庆市交通委员会&nbsp;&nbsp;技术支持：重庆旺山实业有限公司</p></div>
<%}%>
</body>
</html>