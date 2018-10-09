ProcessNextForm=Ext.extend(Ext.Panel,{
	formPanel:null,
	formButtons:[],
	constructor:function(config){
		//需要弹出一个对话框架告诉他正在锁定该任务执行
		//用于存储自由跳转的Fork节点的人员，格式如this.flowForkAssignId['任务1']=3 
		Ext.applyIf(this,config);
		var flag=false;
		Ext.Ajax.request({
			params:{
				taskId:this.taskId
			},
			async : false, 
			scope:this,
			url:__ctxPath+ "/flow/checkTask.do",
			success:function(response,options){
				//若当前任务已经被其他人员执行或已经执行完成等
				var result=Ext.util.JSON.decode(response.responseText);
				if(result.assigned!=undefined){
					if(!result.assigned){
							Ext.ux.Toast.msg('操作信息','该任务已经被其他用户锁定执行！');
                               flag=true;
					}
					if(result.assigned){
						Ext.ux.Toast.msg('操作信息','该任务已经成功锁定!');
					}
				}
			}
		});
		if(flag){
		  var taskPanel=Ext.getCmp('TaskPanelView');
			  if(taskPanel!=null&&taskPanel!=undefined){
			       taskPanel.getUpdater().update(__ctxPath+ '/flow/displayTask.do');
			  }
		  ProcessNextForm.superclass.constructor.call(null);
		  return;
		}
		
		//将Tab标题改成流程名称
		if(this.taskName == null || this.taskName == 'undefined'){
			this.taskName = this.activityName;
		}else{
			this.taskName = this.taskName;			
		}
		
		ProcessNextForm.superclass.constructor.call(this, {
			id : 'ProcessForm' + this.taskId,
			iconCls : 'btn-approvalTask',
			title : this.taskName,
			layout:'border',
			bodyStyle:'padding:5px',
			items : []
		});	
	},
	
	initComponent:function(){
		var taskId=this.taskId;
		var activityName=this.activityName;
		var msgPanel = new Ext.Panel({
			style : 'padding:0px 0px 0px 0px;margin-left:6px;',
			border:false,
			autoHeight:true,
			layout:'column',
			items:[{
					xtype : 'label',
					style : 'padding:0px 0px 0px 0px;margin-right:25px;',
					text : '提醒办理人：',
					width : 80
				},{
					xtype:'checkbox',
					name:'sendMail',
					inputValue:'true',
					boxLabel:'发送邮件',
					columnWidth:.16,
					listeners : {
						'check' : function(checkbox, checked){
							if(checked){//只有在点击时触发
								msgPanel.getCmpByName('sendMail').setValue(true);
								msgPanel.getCmpByName('sendMsg').setValue(false);
								msgPanel.getCmpByName('sendInfo').setValue(false);
							}   
						}
					}
				},{
					xtype:'checkbox',
					name:'sendMsg',
					inputValue:'true',
					boxLabel:'发送短信',
					columnWidth:.16,
					listeners : {
						'check' : function(checkbox, checked){
							if(checked){//只有在点击时触发
								msgPanel.getCmpByName('sendMail').setValue(false);
								msgPanel.getCmpByName('sendMsg').setValue(true);
								msgPanel.getCmpByName('sendInfo').setValue(false);
							}   
						}
					}
				},{
					xtype:'checkbox',
					name:'sendInfo',
					inputValue:'true',
					boxLabel:'即时消息',
					columnWidth:.16,
					listeners : {
						'check' : function(checkbox, checked){
							if(checked){//只有在点击时触发
								msgPanel.getCmpByName('sendMail').setValue(false);
								msgPanel.getCmpByName('sendMsg').setValue(false);
								msgPanel.getCmpByName('sendInfo').setValue(true);
							}   
						}
					}
				}//end of fieldset
			]//end of panel items
		});
		var formOuterPanel = new Ext.Panel({
			autoHeight:true,
			layout : 'form',
			border:false,
			layoutConfig : {
				pack : 'left',
				align : 'top'
			},
			items:[
				new Ext.form.Label({text:'正在加载流程表单...',height:60})
			]
		});
		
		// 显示流程审批的表单
		var detailPanel = new Ext.Panel({
			title:'审批信息',
			bodyStyle : 'padding-top:20px',
			layout:'fit',
			width : 700,
			autoLoad:{
				url:__ctxPath+'/flow/processRunDetail.do?randId='+Math.random()+'&taskId='+this.taskId
			}
		});
		//左面板－－用于显示用户审批信息
		var leftPanel = new Ext.Panel({
			border:false,
			region:'center',
			layout:'anchor',
			autoScroll:true,
			bodyStyle:'padding:20px;',
			//style:'max-width:1100px',
			items:[formOuterPanel,detailPanel]
		});
		//右面板－－用于存自由跳转
		var rightPanel = new Ext.Panel({
			layout : 'fit',
			bodyStyle : 'padding:5px',
			title : '自由跳转',
			region : 'east',
			collapsible : true,
			collapsed : true,
			split : true,
			width : 240
		});
		/*
		var searchStore = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url : __ctxPath + '/archive/oaOfficeHelperListArchives.do?taskId='+this.taskId
			}),
			reader : new Ext.data.JsonReader({
						root : 'result',
						totalProperty : 'totalCounts',
						id : 'id',
						fields : [{
							name : 'archivesId',
							type : 'int'
						}, 'subject','createtime','isdraft','isreceive','keywords']
					}),
			remoteSort : true
		});
		searchStore.setDefaultSort('createtime', 'desc');
		var cm = new Ext.grid.ColumnModel({
		columns : [new Ext.grid.RowNumberer(), {
					header : 'archivesId',
					dataIndex : 'archivesId',
					hidden : true
				},{
					header : '标题',
					dataIndex : 'subject',
					width : 70,
					renderer : function(value, metadata, record, rowIndex,colIndex) {
						var datatype=record.data.keywords;
						if(datatype=="") datatype="0";
						metadata.attr = 'style="white-space:normal;"';
						var str = '<a href="#"  title=\''+value+'\' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ProcessNextForm.detail('
							+ record.data.archivesId
							+ ','
							+ record.data.isreceive
							+ ','
							+ record.data.isdraft
							+ ','
							+ datatype
							+ ')">'
							+ value
							+ '</a>';
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
		}
		});//end of the cm
		searchStore.load({
	 		param : {
	 			start : 0,
	 			limit : 25
	 		}
	 		});
		//最右侧面板——用于搜索引擎查询页面
		var searchPanel = new Ext.Panel({
			layout : 'form',
			title : '办公小助手',
			region : 'west',
			iconCls : 'menu-archive-issue-manage',
			collapsible : true,
			collapsed : true,
			autoScroll:true,
			collapsedCls:'menu-archive-issue-manage',
			height : 100,
			split : true,
			width : 240,
			items:[{
				items:[new Ext.grid.GridPanel({
							region : 'center',
							store : searchStore,
							trackMouseOver : true,
							disableSelection : false,
							loadMask : true,
							autoHeight: true,
							autoScroll:true,
							cm : cm,
							viewConfig : {
								forceFit : true,
								enableRowBody : false,
								showPreview : false
							},
							bbar : new Ext.PagingToolbar({
										pageSize : 25,
										store : searchStore,
										displayInfo : true,
										displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
										emptyMsg : "当前没有记录"
									})
		               })
		           ]
			}]
		});*/
		if (curUserInfo.isArchivesManager&&this.archType!="") {
			this.items = [leftPanel, rightPanel];
//			if(curUserInfo.ownerSchema!="oa"&&curUserInfo.ownerSchema!="xxzxoa"){
//				this.items = [leftPanel, rightPanel];
//			}
//			else{
//				this.items = [searchPanel,leftPanel, rightPanel];
//			}
		}else{
			this.items = [leftPanel];
//			if(curUserInfo.ownerSchema!="oa"&&curUserInfo.ownerSchema!="xxzxoa"){
//				this.items = [leftPanel];
//			}else{
//				this.items = [searchPanel,leftPanel];
//			}
		}
		this.tbar = new Ext.Toolbar({items:[
			{
				text:'流程示意图',
				iconCls:'btn-flow-chart',
				scope:this,
				handler:function(){
					this.showFlowImage();
				}
			},
			'-',
			{
				text:'当前办理信息',
				iconCls:'btn-flow-chart',
				scope:this,
				handler:function(){
					this.showDeptInfo();
				}
			}
		]});

		//调用父类的方法完成构造
	 	ProcessNextForm.superclass.initComponent.call(this);
	 	
		//加载审批表单
		Ext.Ajax.request({
			url:__ctxPath+ "/flow/getProcessActivity.do",
			scope:this,
			params:{
				activityName:activityName,
				taskId:this.taskId
			},
			success:function(response,options){
				try{
					//缺省为FormPanel
					this.isFormPanel=true;
					var formPanel=null;
					if(response.responseText.trim().indexOf("[")==0){//兼容旧的模板写法
						if(activityName=='' || activityName=='undefined' || activityName==null){
							activityName='开始';
						}
						eval('formPanel = new Ext.FormPanel({title:"任务表单-' + activityName+'",defaults:{border:false},width:600,bodyStyle:"padding:8px 8px 8px 8px;",layout:"form",autoHeight:true,items:'+response.responseText+'});');
					}else{
						if(response.responseText.indexOf("Ext.extend(Ext.Panel")!=-1){//为非FormPanel
							this.isFormPanel=false;
							eval('formPanel= new ('+response.responseText + ')({activityName:"'+activityName+'"});');
						}else{
							eval('formPanel= new ('+response.responseText + ')({activityName:"'+activityName+'"});');
						}
					}
					
					formOuterPanel.removeAll(true);
					formOuterPanel.add(formPanel);
					
		
					
					if(activityName=="签发"){
						msgPanel.getCmpByName('sendMsg').setValue(true);
					}
					var ccPanel=new Ext.Panel({
						style : 'padding:10px 0px 0px 0px;margin-left:6px;',
						border:false,
						autoHeight:true,
						layout:'column',
						items : [{
									xtype : 'label',
									style : 'padding:0px 0px 0px 0px;',
									text : '阅知:',
									width : 105
								}, {
									// columnWidth:.6,
									xtype : 'textfield',
									name : 'ccNames',
									width : '70%',
									readOnly : true
								}, {
									xtype : 'hidden',
									name : 'ccIds'
								}, {
									xtype : 'button',
									iconCls : 'menu-department',
									text : '选择阅知人',
									handler : function() {
										var issuerId = ccPanel.getCmpByName('ccIds').getValue();
										var reporterName = ccPanel.getCmpByName('ccNames').getValue();
										var array1=[];
										var array2=[];									
										var m = new Map();
										if(issuerId!=null && issuerId!=''){
												array1 = issuerId.split(',');
												array2 = reporterName.split(',');
												for(var i=0;i<array1.length;i++){	
													m.put(array1[i],array2[i]);
												}
										}

										DeptOfUserSelector.getView(
													function(userIds, fullnames) {
														ccPanel.getCmpByName('ccIds').setValue(userIds);
														ccPanel.getCmpByName('ccNames').setValue(fullnames);
													}, false, false, curUserInfo.depId, m)
											.show();
									}
								}]
					});
					/***去除阅知，通知审核人modify by:tony zhang**/
					//formPanel.add(ccPanel);
					formPanel.add(msgPanel);
					
					formPanel.doLayout();
					formPanel.taskId=this.taskId;
					this.formPanel=formPanel;
					//加上表单跳转功能
					if(this.isFormPanel){
						//加载审批表单的功能按钮
					 	Ext.Ajax.request({
							url:__ctxPath+ "/flow/transProcessActivity.do",
							params:{taskId:this.taskId},
							scope:this,
							success:function(response,options){
								var object=Ext.util.JSON.decode(response.responseText);
								this.getTopToolbar().add(new Ext.Toolbar.Separator());
								for(var i=0;i<object.data.length;i++){
									this.getTopToolbar().insert(2+i,this.genFormButton(formPanel,taskId,object.data[i].name,object.data[i].destination,activityName));
								}
								this.doLayout();
							}
					 	});
					}else{
						formOuterPanel.doLayout();
					}
					/*
				 	//加载阅知人员
				 	Ext.Ajax.request({
						url:__ctxPath+ "/flow/myListCcuserProcess.do",
						params:{'taskId':this.taskId},
						scope:this,
						success:function(response,options){
							var object=Ext.util.JSON.decode(response.responseText);
							var strCcUserId = '';
							var strCcUserName = '';
							for(var i=0;i<object.result.length;i++){
								if(strCcUserId != ''){
									strCcUserId += ',';
									strCcUserName += ',';
								}
								strCcUserId += object.result[i].ccUserId;
								strCcUserName += object.result[i].appUser.fullname;
							}
							ccPanel.getCmpByName('ccIds').setValue(strCcUserId);
							ccPanel.getCmpByName('ccNames').setValue(strCcUserName);
						}
				   });*/
				}catch(e){
					//Ext.ux.Toast.msg('表单加载信息','流程表单加载出现异常！'+e);
				}
			}
		});
		//生成自由跳转的表单内容--modify by :tony zhang
		this.genFreeJumpPanel.call(this);
		rightPanel.add(this.freeJumpPanel);
		rightPanel.doLayout();
		
		
	},//end of initComponent
	
	//自由跳转Panel
	genFreeJumpPanel:function(){
		var flowAssignId='';
		this.freeTransCombo=new Ext.form.ComboBox({
							xtype:'combo',
							allowBlank:false,
							editable : false,
							lazyInit: false,
							anchor:'96%,96%',
							hiddenName:'freeCombo',
							triggerAction : 'all',
							listeners:{
								scope:this,
								select : function(combo,record,index){
									this.destName=record.data.destName;
									this.userJumpPanel.removeAll();
									if("fork"==record.data.sourceType){
										//目标节点为fork
										this.destType='fork';
										this.genForkUserAssign.call(this);
									}else if(record.data.sourceType.indexOf('end')==-1){
										this.genCommonUserAssign.call(this);
									}
								} 
							},
							store : new Ext.data.ArrayStore({
									autoLoad : true,
									url : __ctxPath + '/flow/freeTransProcessActivity.do?taskId='+this.taskId,
									fields : ['signalName', 'destName','sourceType']
							}),
							displayField : 'destName',
							valueField : 'signalName'
		});
		
		this.userJumpPanel=new Ext.Panel({border:false,autoHeight:true,layout:'form',hideLabels:true});
		
		this.freeJumpPanel=new Ext.FormPanel({
			border:false,
			layout:'form',
			hideLabels:true,
			autoHeight:true,
			items : [		{
								xtype : 'label',
								text : '跳转任务'
							},
							this.freeTransCombo,
							this.userJumpPanel,
							{
								xtype:'button',
								text:'自由跳转',
								iconCls:'btn-transition',
								scope:this,
								handler:function(){
									this.freeJump.call(this);
								}
							}
					]
		});		
	},//end of freeJumpPanel
	
	//gen common user assign
	genCommonUserAssign:function(){
		this.userJumpPanel.add([
			{
				xtype : 'label',
				text : this.destName+'任务执行人:'
			}, {
				xtype : 'textfield',
				name : 'nextAssignUserNames',
				width : 160,
				readOnly : true
			}, {
				xtype : 'button',
				name : 'userSelectButton',
				text : '...',
				iconCls : 'btn-users',
				scope:this,
				handler : function() {
					var userAssignNames=this.freeJumpPanel.getCmpByName('nextAssignUserNames');
					UserSelector.getView({
						scope:this,
						callback:function(uIds, uNames) {
							userAssignNames.setValue(uNames);
							this.flowAssignId = uIds;
						}
					}).show();
				}
			}
		]);
		this.userJumpPanel.doLayout();
	},
	
	//为汇集节点产生自由跳转的人员选择
	genForkUserAssign:function(){
			Ext.Ajax.request({
				url:__ctxPath+'/flow/outerTransProcessActivity.do?taskId='+this.taskId,
				params:{
					nodeName:this.destName
				},
				scope:this,
				success:function(resp,options){
					var outers=Ext.decode(resp.responseText);
					this.flowForkAssignId=new Array(outers.length);
					for(var i=0;i<outers.length;i++){
						this.userJumpPanel.add(this.genUserFieldSel.call(this,outers[i]));
					}
					this.userJumpPanel.doLayout();
				}
			});
	},
	//产生用户选择
	genUserFieldSel:function(outers){
		//目标节点名称
		var destName=outers[1];
		var textField=new Ext.form.TextField({
			value:destName
		});
		var flowAssignUserName=new Ext.form.TextField({allowBlank:false});
		var cmpField=new Ext.form.CompositeField({
			border:false,
			items:[
				{
					xtype:'displayfield',
					value:destName
				},
				flowAssignUserName,
				{
					xtype:'button',
					text:'...',
					iconCls : 'btn-users',
					scope:this,
					handler:function(){
						UserSelector.getView({
							scope:this,
							callback:function(uIds, uNames) {
								flowAssignUserName.setValue(uNames);
								eval('this.flowForkAssignId[\''+destName+'\']=uIds;');
							}
						}).show();
					}
				}
			]
		});
		
		return cmpField;
								
	},
	/**
	 * 自由跳转提交
	 */
	freeJump:function(){
			if(!this.freeJumpPanel.getForm().isValid()){
				return;
			}
			var form=null;
			if(!this.isFormPanel){
				form=this.formPanel.formPanel.getForm();
			}else{
				form=this.formPanel.getForm();	
			}
			if(form.isValid()){//是合法有效
				var flowAssignId='';
				if(this.destType=='fork'){//目标为fork节点
					var i=0;
					for(var tname in this.flowForkAssignId){
						if(i++>=this.flowForkAssignId.length)break;
						if(flowAssignId!=''){
							flowAssignId+='|';
						}
						flowAssignId+=tname+':'+this.flowForkAssignId[tname];	
					}
				}else{//目标为普通节点
					flowAssignId=this.flowAssignId;
				}
				var signalName=this.freeTransCombo.getValue();
				form.submit({
					url:__ctxPath+ "/flow/nextProcessActivity.do",
					method:'post',
					waitMsg:'正在提交处理，请稍等',
					scope:this,
					params:{
							taskId:this.taskId,
							signalName:signalName,
							activityName:this.activityName,
							destName:this.destName,
							//看是否指定了执行人员
							flowAssignId:flowAssignId
					},
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息','成功保存！');
						AppUtil.removeTab('ProcessForm'+this.taskId);
						var myTaskGrid=Ext.getCmp("MyTaskGrid");
						var appHomeTaskGrid=Ext.getCmp('TaskPanelView');
						if(appHomeTaskGrid!=null){
							appHomeTaskGrid.getUpdater().update(__ctxPath+ '/flow/displayTask.do');
						}
						if(myTaskGrid!=null){
							myTaskGrid.getStore().reload();
						}
					},
					failure : function(fp, action) {
						Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
					}
				});
			}
	},
	
	//产生审批表单的按钮
	genFormButton:function(formPanel,taskId,signalName,destName,activityName){
		var fp=formPanel;
		return {
			iconCls:'btn-transition',
			text:'转至[' + destName + "]",
			listeners:{
				'click':function(){
					
					if(fp.save){
						var result=fp.save.call(fp,taskId,signalName,destName,activityName);
						if(result==false) return;
					}
					
					var form=fp.getForm();
					if(form.isValid()){//是合法有效
						form.submit({
							url:__ctxPath+ "/flow/nextProcessActivity.do",
							method:'post',
							waitMsg:'正在提交处理，请稍等',
							params:{taskId:taskId,signalName:signalName,activityName:activityName,destName:destName},
							success : function(fp, action) {
								Ext.ux.Toast.msg('操作信息','成功保存！');
								AppUtil.removeTab('ProcessForm'+taskId);
								var myTaskGrid=Ext.getCmp("MyTaskGrid");
								var appHomeTaskGrid=Ext.getCmp('TaskPanelView');
								if(appHomeTaskGrid!=null){
									appHomeTaskGrid.getUpdater().update(__ctxPath+ '/flow/displayTask.do');
								}
								if(myTaskGrid!=null){
									myTaskGrid.getStore().reload();
								}
							},
							failure : function(fp, action) {
								Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
							}
						});
					}
				}
			}
		}
	},// end of genFormButton
	showFlowImage:function(){
		var win=new Ext.Window({
			autoScroll:true,
				iconCls:'btn-flow-chart',
				bodyStyle:'background-color:white',
				maximizable : true,
				title:'流程示意图',
				width:600,
				height:500,
				modal:true,
				layout:'fit',
				html:'<img src="'+__ctxPath+ '/jbpmImage?taskId='+this.taskId+ '&rand=' + Math.random()+ '"/>'
		});	
		win.show();
	},// end of genFormButton
	showDeptInfo:function(){
		var deptWin=new Ext.Window({
			id:'flowTaskInfoWin',
			autoScroll:true,
			iconCls:'btn-flow-chart',
			bodyStyle:'background-color:white',
			maximizable : true,
			title:'当前办理信息',
			width:300,
			height:400,
			x:1000,
			y:180,
			layout:'fit'
		});	
		deptWin.show();
		deptWin.load({   
            url :__ctxPath+ '/flow/getProTaskListProcessRun.do?taskId='+this.taskId+'&rand=' + Math.random(),   
            params : { 
            	couId : 'task',   
                subMainId : "tab-task-main"
            },   
            scripts: true  
        });   
	}
});
ProcessNextForm.detail=function(editId, runId, defId,dataType) {
	if(dataType==""||dataType=="0"){
	new OAOfficeDetailView({
				archivesId : editId,
				runId : runId,
				defId : defId
			}).show();
	}else if(dataType=="1"){
		new JwSentArchivesDetailForm({
			id:editId
		}).show();
	}else if(dataType=="2"){
		new JwSentDocsDetailForm({
			id:editId
		}).show();
	}else if(dataType=="3"){
		new JwReciivedDocsDetailForm({
			id:editId
		}).show();
	}else if(dataType=="4"){
		new JwRecArchivesDetailForm({
			id:editId
		}).show();
	}
}
