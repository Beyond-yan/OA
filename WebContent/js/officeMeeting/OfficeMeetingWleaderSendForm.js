var OfficeMeetingWleaderSendForm=function(archives){
	this.archives = archives;
	var formPanel=new Ext.FormPanel({
		id : 'OfficeMeetingSendBGSForm',
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		url:__ctxPath+'/meetingTimes/setTimesMeetingTimes.do',
		border:false,
		items:[{
			xtype : 'container',
			style : 'padding-left:0px;margin-bottom:4px;',
			id : 'depContainer',
			layout : 'column',
			items : [{
						xtype : 'label',
						text : '办理意见:',
						width : 60
					}, {
						xtype : 'textarea',
						id : 'leaderOpinion',
						autoScroll:true,
						maxLength:500,
						height:100,
						width:400
					}]
		}]
	});
	var win=new Ext.Window({
		title:'委领导审核',
		height:200,
		iconCls:'btn-add',
		buttonAlign:'center',
		width:500,
		modal:true,
		layout:'fit',
	    items:[formPanel],
		buttons:[{
					text:'确认',
					iconCls:'btn-save',
					handler : function() {
						if (formPanel.getForm().isValid()) {	 
							sendForeach(archives, 0, archives.length)
						}
					}
				},{
					text:'退回',
					iconCls:'btn-changeTask',
					handler : function() {
						if (formPanel.getForm().isValid()) {	 
							backForeach(archives, 0, archives.length)
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
	
	function sendForeach(records, index, max){
		if(index == max){
			refreshTaskPanelView();
			if(Ext.getCmp('OfficeMeetingWleaderGrid') != null){
				Ext.getCmp('OfficeMeetingBGSZRGrid').getStore().reload();
			}
			win.close();
			return;
		}
		var comment = Ext.getCmp('leaderOpinion').getValue();
		var form=Ext.getCmp('OfficeMeetingSendBGSForm').getForm();
		var params = {
			taskId : records[index].TASKID,
			signalName : 'to 排版',
			activityName : '委领导审批',
			destName : '排版',
			currentStep : 7,
			weiResult : 0,
			comments : comment
		};
	    var subject = "[" + records[index].SUBJECT + "]";
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
				sendForeach(records,index,max);
			},
			failure : function(fp, action) {
				Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
				refreshTaskPanelView();
			}
		});
	}
	
	function backForeach(records, index, max){
		if(index == max){
			refreshTaskPanelView();
			if(Ext.getCmp('OfficeMeetingWleaderGrid') != null){
				Ext.getCmp('OfficeMeetingWleaderGrid').getStore().reload();
			}
			win.close();
			return;
		}
		var comment = Ext.getCmp('leaderOpinion').getValue();
		var form=Ext.getCmp('OfficeMeetingSendBGSForm').getForm();
		var params = {
			taskId : records[index].TASKID,
			signalName : 'to 办公室汇总',
			activityName : '委领导审批',
			destName : '办公室汇总',
			status : '退回',
			currentStep : 4,
			comments : comment,
			flowAssignId : records[index].bangongshiUserId
		};
	    var subject = "[" + records[index].SUBJECT + "]";
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
				backForeach(records,index,max);
			},
			failure : function(fp, action) {
				Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
				refreshTaskPanelView();
			}
		});
	}
};