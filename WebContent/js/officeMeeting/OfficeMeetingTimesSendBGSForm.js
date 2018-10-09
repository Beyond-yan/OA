var OfficeMeetingTimesSendBGSForm=function(archives){
	this.archives = archives;
	var store = new Ext.data.JsonStore({
		data:this.archives,  
		fields : [{
			name : 'defId',
			type : 'int'
		}, 'SUBJECT', 'STATUS', 'YEAR', 'TIMES','PROCESS_INS_ID',
		'ARCHIVESID', 'RUNID', 'DEFID','CURRENTSTEP','URGENTLEVEL','PRIVACYLEVEL',
		'ISSUEDEP','TASKID','ACTIVITY_NAME']
	});
	var formPanel=new Ext.FormPanel({
		id : 'OfficeMeetingSendBGSForm',
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		url:__ctxPath+'/meetingTimes/setTimesMeetingTimes.do',
		border:false,
		items:[{
			xtype : "hidden",
			name : "timesId",
			id : "OfficeMeetingTimesSendBGSForm.timesId"
		},{
			xtype : "hidden",
			name : "timesl",
			id : "OfficeMeetingTimesSendBGSForm.timesl"
		},{
			xtype : "combo",
			fieldLabel : "选择期数",
			id : "OfficeMeetingTimesSendBGSForm.times",
			valueField : 'timesId',
			displayField : 'times',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			forceSelection : true,
			width : 350,
			store : new Ext.data.SimpleStore({
					url : __ctxPath + '/meetingTimes/getByTypeMeetingTimes.do?type=1',
					autoLoad : true,
					fields : ['timesId', 'times']
				}),
			listeners : {
				select : function(cbo, record, index) {
					Ext.getCmp('OfficeMeetingTimesSendBGSForm.timesId').setValue(cbo.getValue());
					Ext.getCmp('OfficeMeetingTimesSendBGSForm.timesl').setValue(cbo.getRawValue());
				}
			}
		},{
			xtype : "editorgrid",
			autoHeight : true,
			store : store,
			columns : [{
				header: "标题",
	            dataIndex: 'SUBJECT',
	            width : 350
			},{
				header: "议题编号",
	            dataIndex: 'URGENTLEVEL',
	            width: 150,
	            editor : new Ext.form.NumberField({
	            	allowBlank:false,
	            	allowNegative:false,
	            	width:50
	            })
			}]
			
		}]
	});
	var win=new Ext.Window({
		title:'送办公室主任',
		height:400,
		iconCls:'btn-add',
		buttonAlign:'center',
		width:500,
		modal:true,
		layout:'fit',
	    items:[formPanel],
		buttons:[{
					text:'送办公室主任审核',
					iconCls:'btn-save',
					handler : function() {
						if (formPanel.getForm().isValid()) {	 
							var records = store.data.items;
							var taskIds=new Array();
							for(var i = 0; i < records.length; i++){
								if(!records[i].data.URGENTLEVEL || records[i].data.URGENTLEVEL == null || records[i].data.URGENTLEVEL == ""){
									Ext.MessageBox.show({
										title : '操作信息',
										msg : '请将议题编号填写完整！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
									return;
								}
								taskIds.push(records[i].data['TASKID'])
							}
							sendBGSForeach(records, taskIds, 0, taskIds.length)
						}
					}
				},{
					text:'关闭',
					iconCls:'btn-close',
					handler:function(){
						win.close();
					}
				}]
	});
	
	win.show();
	
	function sendBGSForeach(records, taskIds, index, max){
		if(index == max){
			refreshTaskPanelView();
			if(Ext.getCmp('OfficeMeetingTimesGrid') != null){
				Ext.getCmp('OfficeMeetingTimesGrid').getStore().reload();
			}
			win.close();
			return;
		}
		var timesId = Ext.getCmp('OfficeMeetingTimesSendBGSForm.timesId').getValue();
		var timesl = Ext.getCmp('OfficeMeetingTimesSendBGSForm.timesl').getValue();
		var form=Ext.getCmp('OfficeMeetingSendBGSForm').getForm();
		var params = {
			taskId : taskIds[index],
			signalName : 'to 办公室主任审批',
			activityName : '办公室汇总',
			destName : '办公室主任审批',
			currentStep : 5,
			bangongshiUserId : curUserInfo.userId,
			bangongshiResult : 1
		};
	   var subject = "[" + records[index].data.SUBJECT + "]";
	   form.submit({
			url:__ctxPath+'/meetingTimes/setTimesAndNoMeetingTimes.do',
			method:'post',
			waitMsg:'正在发送' + subject + '，请稍等...',
			scope:this,
			params:{archivesId:records[index].data.ARCHIVESID, num:records[index].data.URGENTLEVEL, timesId:timesId, timesl:timesl},
			success : function(fp, action) {
				form.submit({
					url:__ctxPath+ "/flow/nextProcessActivity.do",
					method:'post',
					waitMsg:'正在发送' + subject + '，请稍等...',
					scope:this,
					params:params,
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息',subject + '发送成功！');
						refreshTaskPanelView();
						index++;
						sendBGSForeach(records,taskIds,index,max);
					},
					failure : function(fp, action) {
						Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
						refreshTaskPanelView();
					}
				});
			},
			failure : function(fp, action) {
				Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
				refreshTaskPanelView();
			}
		});
	}
};