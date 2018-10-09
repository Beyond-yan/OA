Ext.ns("App");

var totalCount=0;
var curCount=7;
var percentage = 0; //进度百分比
var progressText = ""; //进度条信息
var msgText = ""; //进度条信息
//显示信息条数按钮
var addMsg = function(totalCount,curCount) {
	//计算进度
    precentage = (totalCount+2-curCount)/(totalCount+3);
    //生产进度条文字
    progressText = "";
    if(curCount<=1){
    	msgText="正在为您处理，请等待...";
    }else{
    	msgText="此文件有"+curCount+"人正在处理，请等待...";
    }
	//msgBox.hide();
	if(curCount>=1){
		Ext.MessageBox.updateProgress(precentage,progressText,msgText);
	}
	//else {
	//	Ext.MessageBox.hide();
	//}
};

var addMsgFunction = function(isFirst,taskId) {
	Ext.Ajax.request({
		url : __ctxPath + '/flow/getProcessNumProcessActivity.do',
		params:{'taskId':taskId},
		method : 'POST',
		success : function(response, options) {
			var result = Ext.util.JSON.decode(response.responseText);
			curCount = result.num;
			if(isFirst){
				curCount += 1;
				totalCount=result.num + 1;
			    if(curCount<=1){
			    	msgText="正在为您处理，请等待...";
			    }else{
			    	msgText="此文件有"+curCount+"人正在处理，请等待...";
			    }
				Ext.MessageBox.show({
				  	title:'提示信息',
				 	msg:msgText,
				  	modal:true,
				  	width:300,
				  	progress:true,
					//buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
			}
			percentage = 0; //进度百分比
			progressText = ""; //进度条信息
			addMsg(totalCount,curCount);
			setTimeout(function(){
				//addMsg(totalCount,curCount);
				if(curCount>=1){
					addMsgFunction(false,taskId);
				}
				else{
					Ext.MessageBox.hide();
				}
			},1000);
		},
		failure : function(response, options) {
		},
		scope : this
	});
};
//首页PORTAL元素
var PortalItem=function(panelId,column,row){
   this.panelId=panelId;
   this.column=column;
   this.row=row;
}
//用户信息
var UserInfo=function(userId,username,isDepMonitorAdmin,isRestAdmin,isSumAdmin,isArchNoAdmin,isCarAdmin,isOfficeDirector,isAccountManager,isArchivesManager,isOfficeStaffRole,isGearOfficeRole,isDocumentLoader,isOfficeDeputyDirector,isAdmin,iscommonAdmin,isOfficeManager,fullname,depId,depName,deptName,rights,conf,ownerSchema,depExternal,parentDepId){
	this.userId=userId;
	this.username = username;
	this.fullname=fullname;
	this.depId=depId;
	this.depExternal=depExternal;
	this.depName=depName;
	this.deptName=deptName;
	this.isRestAdmin = isRestAdmin; // 是否是食堂管理员角色 By F3220847
	this.isDepMonitorAdmin= isDepMonitorAdmin; // 是否是部门督办管理员 By Super S.Gao
	this.isOfficeManager = isOfficeManager;//是否是室经理 
	this.rights=rights;
	this.portalConfig=conf;
	this.isArchNoAdmin = isArchNoAdmin;
	this.isCarAdmin=isCarAdmin;
	this.isOfficeDirector=isOfficeDirector;
	this.isAccountManager=isAccountManager;
	this.isArchivesManager=isArchivesManager;
	this.isOfficeStaffRole=isOfficeStaffRole;
	this.isGearOfficeRole=isGearOfficeRole;
	this.isDocumentLoader=isDocumentLoader;
	this.isOfficeDeputyDirector=isOfficeDeputyDirector;
	this.isSumAdmin = isSumAdmin;
	this.isAdmin = isAdmin;
	this.iscommonAdmin = iscommonAdmin;
	this.ownerSchema = ownerSchema;
	this.parentDepId=parentDepId;
};
var roleMap = new Map();
var flowMap = new Map();

//当前登录用户
var curUserInfo=null;

//在线编辑器头部菜单是否显示（true显示 false隐藏）
var ntkoSaveTrace=true;//保存修改痕迹
var ntkoCancelTrace=true;//取消保留修改痕迹
var ntkoTemplate=false;//模版套红
var ntkoSeal=false;//印章
var ntkoRedPath="";//套红路径
var ntkoSealPath="";//盖章路径

//检查当前用户有权访问funKey对应的功能
function isGranted(funKey){
	if(curUserInfo.rights.indexOf('__ALL')!=-1){
		return true;
	}
	if(curUserInfo.rights.indexOf(funKey)!=-1){
		return true;
	}
	return false;
}

App.init = function() {
	Ext.QuickTips.init();//这句为表单验证必需的代码
    //Ext.form.Field.prototype.msgTarget = "side" ;
	Ext.BLANK_IMAGE_URL=__ctxPath+'/ext3/resources/images/default/s.gif';
	setTimeout(function() {
				Ext.get('loading').remove();
				Ext.get('loading-mask').fadeOut({remove:true});
				document.getElementById('app-header').style.display='block';
			}, 1000); 
	
	Ext.util.Observable.observeClass(Ext.data.Connection);
	Ext.data.Connection.on('requestcomplete', function(conn, resp,options ){
		if (resp && resp.getResponseHeader){
		    if(resp.getResponseHeader('__timeout')) {
		    	Ext.Msg.confirm(
		    		'操作提示：',
		    		'操作已经超时，是否立即跳转到登录页重新登录？',
		    		function(btn) {
						if (btn == 'yes') {
							window.location.href=__ctxPath+'/index.jsp?randId=' + parseInt(1000*Math.random());
						}
		    		}
		    	);
		    	
		    	//Ext.ux.Toast.msg('操作提示：','操作已经超时，请重新登录!');
	        	//window.location.href=__ctxPath+'/index.jsp?randId=' + parseInt(1000*Math.random());
	    	}
	    	if(resp.getResponseHeader('__forbidden')){
	    		Ext.ux.Toast.msg('系统访问权限提示：','你目前没有权限访问：{0}',options.url);
	    	}
		}
	});
	var indexPage = null;
	//加载权限
	Ext.Ajax.request({
			url:__ctxPath+'/system/getCurrentAppUser.do?random=' + Math.random(),
			method:'Get',
			success:function(response,options){
				var object=Ext.util.JSON.decode(response.responseText);
				var user=object.user;
				//取得当前登录用户的相关信息，包括权限
				var conf=user.items;
				curUserInfo=new UserInfo(user.userId,user.username,user.isDepMonitorAdmin, user.isResAdmin,user.isSumAdmin,user.isArchNoAdmin,user.isCarAdmin,user.isOfficeDirector,user.isAccountManager,user.isArchivesManager,user.isOfficeStaffRole,user.isGearOfficeRole,user.isDocumentLoader,user.isOfficeDeputyDirector,user.isAdmin,user.iscommonAdmin,user.isOfficeManager, user.fullname,user.depId,user.depName,user.deptName,user.rights,conf,user.ownerSchema,user.depExternal,user.parentDepId);
				
				//显示应用程序首页
				indexPage = new IndexPage();
	
				var centerPanel=Ext.getCmp('centerTabPanel');
				var homeTab=centerPanel.add(new AppHome());
			 	centerPanel.activate(homeTab);
			}
	});
	Ext.Ajax.request({
			url:__ctxPath+"/system/listSysConfig.do?Q_typeKey_S_EQ=systemRoleConfig",//+"&Q_depId_N_EQ="+curUserInfo.depId,//后面可增加用户部门信息进行配置
			method:'Get',
			success:function(response,options){
				var object=Ext.util.JSON.decode(response.responseText);
				//取得系统所有角色配置项
				var roleConfigs=object.result;
				for(var i =0;i<roleConfigs.length;i++){
					var roleConfig = roleConfigs[i];
					if(!roleMap.containsKey(roleConfig.configKey))
						roleMap.put(roleConfig.configKey,roleConfig.dataValue);
				}
				//alert(roleMap.get('officeStaffRoleId'));
			}
	});
	Ext.Ajax.request({
			url:__ctxPath+"/system/listSysConfig.do?Q_typeKey_S_EQ=flowConfig",//+"&Q_depId_N_EQ="+curUserInfo.depId,//后面可增加用户部门信息进行配置
			method:'Get',
			success:function(response,options){
				var object=Ext.util.JSON.decode(response.responseText);
				//取得系统所有角色配置项
				var flowConfigs=object.result;
				for(var i =0;i<flowConfigs.length;i++){
					var flowConfig = flowConfigs[i];
					if(!flowMap.containsKey(flowConfig.configKey))
						flowMap.put(flowConfig.configKey,flowConfig.dataValue);
				}
			}
	});
	
	
	var viewId=getCookie('viewId');
	if (viewId != null && viewId != '' && viewId!='null') {
		App.clickTopTab(viewId);
	}
	
	//启动流程
	var topUrl = new String(window.location);  
	var index = topUrl.indexOf('?');  
	if(index > 0) {
		var urlJSON = Ext.urlDecode(topUrl.substring(index+1));
		if (urlJSON['StartFlow']) {
			var flowDefId = "";
			eval("flowDefId=FlowDefIdPro." + urlJSON['StartFlow']);
			
			if (flowDefId != "") {
				App.clickTopTab("NewProcess", null, null, function(obj){
					
					var contentPanel = App.getContentPanel();
					var startForm = contentPanel.getItem('ProcessRunStart' + flowDefId);
					if (startForm == null) {
						startForm = new ProcessRunStart({
							id : 'ProcessRunStart' + flowDefId,
							defId : flowDefId,
							flowName : "表单填写"
						});
						contentPanel.add(startForm);
					}
					contentPanel.activate(startForm);
					
				});
			}
		}
	}

};

/**
 * 
 * @param {} id
 * @param {} callback 回调函数
 */
App.clickTopTab=function(id,params,precall,callback){
	if(precall!=null){
		precall.call(this);
	}
	var tabs = Ext.getCmp('centerTabPanel');
	var tabItem = tabs.getItem(id);
	
	var _id = id;
	if(_id.match("_")){
		_id = id.substring(0,id.indexOf("_"));
	}

	if (tabItem == null) {
		$ImportJs(_id, function(view) {
			tabItem = tabs.add(view);
			tabs.activate(tabItem);
			if(callback!=null){
				callback.call(this);
			}
		},params);
	}else {
		if(callback!=null){
			callback.call(this);
		}
		tabs.activate(tabItem);
	}
};

App.MyDesktopClickTopTab=function(id,params,precall,callback){
	if(precall!=null){
		precall.call(this);
	}
	// 先判断任务是否存在
    Ext.Ajax.request({
        url : __ctxPath + "/flow/queryTaskProcessActivity.do",
        params : {
            taskId : params ? params.taskId : ""
        },
        method : 'POST',
        success : function(fp, action) {
            var jsonResult = JSON.parse(fp.responseText);
            if (!jsonResult || jsonResult.success != "true") {
            	if (jsonResult.code && jsonResult.code == "-1") {
                    Ext.MessageBox.show({
                        title : '操作信息',
                        msg : '该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！',
                        buttons : Ext.MessageBox.OK,
                        icon : Ext.MessageBox.WARNING
                    });
                    refreshTaskPanelView();
                    return;
				}
            }

            var tabs = Ext.getCmp('centerTabPanel');
            var tabItem = tabs.getItem(id);

            if (tabItem == null) {
                if(params.taskName != null){
                    if(params.taskName.indexOf('--')>=0){
                        params.taskName = params.taskName.substring(0,params.taskName.indexOf('--'));
                    }
                    //add by hejianghai
                    for(var i=0;i<tabs.items.length;i++){
                        if(tabs.getItem(i).title == params.taskName){
                            var formView=tabs.getItem(i);
                            tabs.activate(formView);
                            Ext.ux.Toast.msg("操作提示","请先处理上一个同类型的任务！");
                            return;
                        }
                    }
                }
                $ImportJs(id, function(view) {
                    tabItem = tabs.add(view);
                    tabs.activate(tabItem);
                },params);
            }else {
                tabs.remove(tabItem);
                var str='new ' + id ;
                if(params!=null){
                    str+='(params);';
                }else{
                    str+='();';
                }
                var view= eval(str);
                tabItem = tabs.add(view);
                tabs.activate(tabItem);
            }
        },
        failure : function(fp, action) {
            Ext.ux.Toast.msg('操作信息', '当前网络繁忙，请刷新后操作！');
        }
    });

};

App.clickNode = function(node) {
	if(node.id==null || node.id=='' || node.id.indexOf('xnode')!=-1){
		return ;
	}
//	alert('Ext.decode(node.attributes.params)'+Ext.decode(node.attributes.params));
	App.clickTopTab(node.id,Ext.decode(node.attributes.params));
//	App.clickTopTab(node.id);
};
/**
 * 桌面点击
 */
App.MyDesktopClick=function(){
	var desktopPanel=Ext.getCmp("MyDesktop");
	
//	desktopPanel.expand(true);//点击桌面没反应 byF7400185
	App.clickTopTab('AppHome');
};
/**
 * 退出系统
 */
App.Logout = function() {
	Ext.Ajax.request({
				url : __ctxPath + '/j_logout.do',
				success : function() {
					window.location.href = __ctxPath + '/login.jsp';
				}
	});
};

/*
 * 刷新待办事项(包含首页上的)
 * add by hejianghai
 */
function refreshTaskPanelView(){
	if(Ext.getCmp('TaskPanelView') != null){ //首页
		Ext.getCmp('TaskPanelView').getUpdater().update( __ctxPath + '/flow/displayTask.do?ran=' + Math.random());
	}
	if(Ext.getCmp('MeetingNoticeView') != null){ //首页会议通知
		Ext.getCmp('MeetingNoticeView').getUpdater().update( __ctxPath + '/meetingNotice/displayMeetingNotice.do?ran=' + Math.random());
	}
	if(Ext.getCmp('ArchivesDispatchGrid') != null){
		Ext.getCmp('ArchivesDispatchGrid').getStore().reload();
	}
	if(Ext.getCmp('ArchivesRecCtrlGrid') != null){
		Ext.getCmp('ArchivesRecCtrlGrid').getStore().reload();
	}
	if(Ext.getCmp('ArchivesDraftGrid') != null){
		Ext.getCmp('ArchivesDraftGrid').getStore().reload();
	}
	if(Ext.getCmp('ArchivesIssueGrid') != null){
		Ext.getCmp('ArchivesIssueGrid').getStore().reload();
	}
	if(Ext.getCmp('ArchReadGrid') != null){
		Ext.getCmp('ArchReadGrid').getStore().reload();
	}
	if(Ext.getCmp('MyTaskGrid') != null){ 
		Ext.getCmp('MyTaskGrid').getStore().reload();
	}
	if(Ext.getCmp('ToReceiveArchivesGrid') != null){ 
		Ext.getCmp('ToReceiveArchivesGrid').getStore().reload();
	}
	if(Ext.getCmp('DocumentSentGrid') != null){ 
		Ext.getCmp('DocumentSentGrid').getStore().reload();
	}
	/**请假管理**/
	if(Ext.getCmp('LeaveViewDraftGrid') != null){
		Ext.getCmp('LeaveViewDraftGrid').getStore().reload();
	}
	/**主任办公会**/
	if(Ext.getCmp('OfficeMeetingApplyGrid') != null){
		Ext.getCmp('OfficeMeetingApplyGrid').getStore().reload();
	}
	if(Ext.getCmp('OfficeMeetingOnGrid') != null){
		Ext.getCmp('OfficeMeetingOnGrid').getStore().reload();
	}
	if(Ext.getCmp('OfficeMeetingWaitGrid') != null){
		Ext.getCmp('OfficeMeetingWaitGrid').getStore().reload();
	}
	/**会议通知*/
	if(Ext.getCmp('ArchMeetingOnGrid') != null){
		Ext.getCmp('ArchMeetingOnGrid').getStore().reload();
	}
	if(Ext.getCmp('ArchMeetingViewGrid') != null){
		Ext.getCmp('ArchMeetingViewGrid').getStore().reload();
	}
	if(Ext.getCmp('ArchMeetingWaitGrid') != null){
		Ext.getCmp('ArchMeetingWaitGrid').getStore().reload();
	}
}

/*
 * 打开新流程
 * add by hejianghai
 */
function openFlowApplyTab(defId, name){
	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);

	if (startForm == null) {
		startForm = new ProcessRunStart({
					id : 'ProcessRunStart' + defId,
					defId : defId,
					flowName : name
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
}
/*
 * 打开父流程审批信息
 * add by lxw
 */
function openParentSPView(runId,defId,piId,name){
	new FlowSendForm({
			runid:runId,
			defid:defId,
			piid:piId,
			name:name
		}).show();		
}
/**
 * 公文详情里的编辑发文
 */
function openArchivesDetailEdit(archivesId,fileIds,defId,defName,panelId,archType,isGranted){
	new ArchiveSentEdit(archivesId,defName,1,function(){
		  Ext.getCmp(panelId+".displayPanel").load({
		  	url: __ctxPath+ '/pages/archive/archInfo.jsp',              
		  	params:{
		  	 archivesId:archivesId,
		  	 fileIds:fileIds,
		  	 defId:defId,
		  	 archType:archType,
		  	 sentPanelId:panelId,
		  	 isGranted:isGranted
		  	},              
		  	scope: this,                  
		  	discardUrl: false,                  
		  	nocache: false,                 
		  	text: "正在加载，请稍候...",                 
		  	timeout: 30,                 
		  	scripts: true           
		  	});
	});		
}
/**
 * 打开表单编辑信息窗口
 * @type 
 */
function openArchivesEdit(archivesId,fileIds,defId,defName,panelId){
	new ArchiveSentEdit(archivesId,defName,2,function(){
		  Ext.getCmp(panelId+".displayPanel").load({
		  	url: __ctxPath+"/pages/flowPath/dispatchFlow.jsp",              
		  	params:{
		  	 archiveId:archivesId,
		  	 fileIds:fileIds,
		  	 sentPanelId : panelId,
		  	 defId:defId
		  	},              
		  	scope: this,                  
		  	discardUrl: false,                  
		  	nocache: false,                 
		  	text: "正在加载，请稍候...",                 
		  	timeout: 30,                 
		  	scripts: true           
		  	});
	});		
}
/**
 * 打开远程发文表单编辑信息窗口
 * @type 
 */
function openArchivesYCEdit(archivesId,fileIds,defId,defName,panelId){
	new ArchiveSentEdit(archivesId,defName,2,function(){
		  Ext.getCmp(panelId+".displayPanel").load({
		  	url: __ctxPath+"/pages/flowPath/remoteSentFlow.jsp",              
		  	params:{
		  	 archiveId:archivesId,
		  	 fileIds:fileIds,
		  	 sentPanelId : panelId,
		  	 defId:defId
		  	},              
		  	scope: this,                  
		  	discardUrl: false,                  
		  	nocache: false,                 
		  	text: "正在加载，请稍候...",                 
		  	timeout: 30,                 
		  	scripts: true           
		  	});
	});		
}
/**
 * 收文详细信息编辑
 */
function openDetailWindow(archiveId,proName,detailId,fileIds,defId,archType,isGranted){
	new ArchivesReceiveEdit(archiveId,proName,defId,1,function(){
		  Ext.getCmp(detailId).load({
		  	url: __ctxPath+ '/pages/archive/archInfo.jsp',              
		  	params:{
		  	 archivesId:archiveId,
		  	 fileIds:fileIds,
		  	 defId:defId,
		  	 detailId:detailId,
		  	 archType:archType,
		  	 isGranted:isGranted
		  	},              
		  	scope: this,                  
		  	discardUrl: false,                  
		  	nocache: false,                 
		  	text: "正在加载，请稍候...",                 
		  	timeout: 30,                 
		  	scripts: true           
		  	});
	});	
}
/**
 * 
 * 打开表单编辑信息窗口
 */
function openWindow(archiveId,proName,detailId,fileIds,defId){
	new ArchivesReceiveEdit(archiveId,proName,defId,1,function(){
		var url=null;
		if(proName=='重庆市交通委员会督办件收文处理笺')
		url=__ctxPath+"/pages/chongqingReceiveArchives/dubanreceivefiles.jsp";
		else
		url=__ctxPath+"/pages/flowPath/receiveFlow.jsp";
		  Ext.getCmp(detailId).load({
		  	url: url,              
		  	params:{
		  	 archiveId:archiveId,
		  	 fileIds:fileIds,
		  	 defId:defId,
		  	 detailId:detailId
		  	},              
		  	scope: this,                  
		  	discardUrl: false,                  
		  	nocache: false,                 
		  	text: "正在加载，请稍候...",                 
		  	timeout: 30,                 
		  	scripts: true           
		  	});
	});	
}

/**
 * 打开会议通知表单编辑信息窗口
 * @param archiveId
 * @param proName
 * @param detailId
 * @param fileIds
 * @param defId
 */

function openMeetingEditWindow(noticeId,proName,detailId,fileIds,defId){
	new ArchivesMeetingEdit(noticeId,proName,defId,1,function(){
		var url= __ctxPath+"/pages/flowPath/meetingFlow.jsp";
		  Ext.getCmp(detailId).load({
		  	url: url,              
		  	params:{
		  	 noticeId:noticeId,
		  	 defId:defId,
		  	 detailId:detailId,
		  	 isEdited:1
		  	},              
		  	scope: this,                  
		  	discardUrl: false,                  
		  	nocache: false,                 
		  	text: "正在加载，请稍候...",                 
		  	timeout: 30,                 
		  	scripts: true           
		  	});
	});	
}

/**
 * 打开工作通知表单编辑信息窗口
 * @param archiveId
 * @param proName
 * @param detailId
 * @param fileIds
 * @param defId
 */

function openWorkEditWindow(archiveId,proName,detailId,fileIds,defId){
	new ArchivesWorkEdit(archiveId,proName,defId,1,function(){
		var url= __ctxPath+"/pages/flowPath/workFlow.jsp";
		  Ext.getCmp(detailId).load({
		  	url: url,              
		  	params:{
		  	 archiveId:archiveId,
		  	 fileIds:fileIds,
		  	 defId:defId,
		  	 detailId:detailId,
		  	 isEdited:1
		  	},              
		  	scope: this,                  
		  	discardUrl: false,                  
		  	nocache: false,                 
		  	text: "正在加载，请稍候...",                 
		  	timeout: 30,                 
		  	scripts: true           
		  	});
	});	
}

function openWorkSelect(id){
	new CheckSelectProcessView({
		id:id
	}).show();	
}
/*打开打印窗口*/
function dayin(archivesId,defId){
	Ext.Ajax.request({
		url : __ctxPath
		+ '/stamp/createDocdayin.do?archiveId='+archivesId+'&defId='+defId,
		method:'post',
		success : function(response, options) {
			 var flpath = Ext.util.JSON.decode(response.responseText).data;
			  window.location.href=flpath;
		}
	});

}
/**
 * 打开抄送给我的公文表单详细信息窗口
 * @type 
 */
function openreadArchDetail(editId,defId,Id ,runId){
					new MyccArchDetailView({
								archivesId : editId,
								runId : runId,
								defId : defId,
								archType : 1,
								isGranted : isGranted,
								Id:Id
							}).show();}
/**
 * 打开文档目录编辑窗口
 * add by sicen.liu 
 */
function openDocDirectoryDetailEdit(id){
	new DocDirectorFileNumberEdit({
		id : id
	}).show();	
}

var IMClient = {
		IMServerIp :'10.224.5.173',
		fn:function(cmd,arg){
			var href = '';
			var sip = this.IMServerIp;
			var curName = curUserInfo.username;
			switch (cmd){
				//login
				case 'l': IMClient.login();break;
				//talk
				case 't': IMClient.talkWith(arg);break;
				//login & talk
				case 'lt':IMClient.loginChat(arg);break;
			}
		},
		login:function(callback){
			Ext.Ajax.request({
				//http://10.224.5.173:5590/QD/tools/GetUserPP.asp?LoginName=shizh&DTime_Sec=600
				url : __ctxPath + '/system/getIMPPAppUser.do',
				success : function(r,o) {
					var res = Ext.decode(r.responseText);
					//window.location.href = 'IMClient://ShowTalk?Chater='+chater+'&ExecFlag=2&LoginName='+curName+'&Password=123456&Server='+sip;
					window.location.href = "IMClient://Login?Passport="+res.pp;
					
					if(callback){
						setTimeout(function(){	//此处若不延时，大多情况会报“客户端未登录”
							callback();
						},500);
					}
				}
			});
		},
		chatWith:function(chater){
			window.location.href = 'IMClient://ShowTalk?Chater='+chater;
		},
		loginChat: function(chater){
			IMClient.login(function(){
				IMClient.chatWith(chater);
			});
		},
		IMStatus:{
			ONLINE:5,
			OFFLINE:1
		}
};
App.eMailLoginOpen = function(mid){
	Ext.Ajax.request({
		url : __ctxPath + '/system/getCoreMailSessionAppUser.do?mid='+mid,
		success : function(response , options ) {
			var result = Ext.util.JSON.decode(response.responseText);
			if(result.pp==19){
				Ext.Msg.alert('错误','请确保在“我的办公”-“我的信息”中填写了正确的教委邮箱。')
			}else{
				window.open('http://10.224.5.179/coremail/XJS/index.jsp?'+result.pp+'&firstShowPage='+result.qq);
				 //orgwidow.location.reload();
				//parent.location.href='http://10.224.5.179/coremail/XJS/index.jsp?'+result.pp+'&firstShowPage='+result.qq;
			} 
		}
	});
}
	
//应用程序总入口
Ext.onReady(App.init);
