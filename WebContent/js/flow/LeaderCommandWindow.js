var LeaderCommandWindow=function(option,taskId,callback){
	var formPanel=new Ext.FormPanel({
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		url:__ctxPath+'/flow/saveProcessForm.do',
		border:false,
		items:[
			{
				xtype:'hidden',
				name:'processForm.activityName',
				value:option==1?'处室意见':'领导批示'
			},{
				xtype:'hidden',
				name:'taskId',
				value:taskId
			},{
				xtype : 'container',
				hidden: option==1?true:false,
				height:32,
				border:false,
				layout : 'column',
				defaults:{
					border : false
				},
				items : [{
							xtype : 'label',
							text : '批示领导:',
							width : 105
						}, {
							id:'LeaderCommandForm.LeaderCheckName',
							xtype:'textfield',
							readOnly:true,
							allowBlank:option==1?true:false,
							width:260
						}, {
							xtype:'hidden',
							id:'LeaderCommandForm.LeaderCheckUserId'
						},{
							xtype : 'button',
							style : 'padding-left:10px;',
							text : '选择领导',
							iconCls : 'btn-select',
							handler : function() {
								var url= __ctxPath + '/system/depLeadersTreeDepartment.do?roles=100175';
								DepLeaders.getView(
										function(userIds, fullnames) {
											Ext.getCmp('creatorId').setValue(userIds);
											Ext.getCmp('creatorName').setValue(fullnames);
											Ext.getCmp('LeaderCommandForm.LeaderCheckUserId').setValue(userIds);
											Ext.getCmp('LeaderCommandForm.LeaderCheckName').setValue(fullnames);
										}, true, null,url).show();
							}
						}]
			},{
				xtype : 'container',
				height:32,
				hidden: option==1?false:true,
				border:false,
				layout : 'column',
				defaults:{
					border : false
				},
				items : [{
							xtype : 'label',
							text : '处室负责人:',
							width : 105
						}, {
							id:'LeaderCommandForm.OfficePrinName',
							xtype:'textfield',
							readOnly:true,
							allowBlank:option==1?false:true,
							width:240
						}, {
							xtype:'hidden',
							id:'LeaderCommandForm.OfficePrinUserId'
						},{
							xtype : 'button',
							text : '选择人员',
							style : 'padding-left:10px;',
							iconCls : 'btn-select',
							handler : function() {
								var url = __ctxPath + '/system/depLeadersTreeDepartment.do?roles=100152,100156&depIds='+curUserInfo.depId;
								DepLeaders.getView(
									function(userIds, userNames) {
										Ext.getCmp('creatorId').setValue(userIds);
										Ext.getCmp('creatorName').setValue(userNames);
										Ext.getCmp('LeaderCommandForm.OfficePrinUserId').setValue(userIds);
										Ext.getCmp('LeaderCommandForm.OfficePrinName').setValue(userNames);
									}, true, null,url).show();
							}
						}]
			},{
				xtype:'textarea',
				name:'processForm.comments',
				id:'LeaderCommandForm.comments',
				anchor:'98%,98%',
				fieldLabel:'代填意见'
			},{
				xtype:'hidden',
				name:'creatorId',
				id:'creatorId'
			},{
				xtype:'hidden',
				name:'creatorName',
				id:'creatorName'
			}
		]
	});
	var win=new Ext.Window({
		title:option==1?'处室意见':'领导批示',
		height:180,
		iconCls:'btn-changeTask',
		buttonAlign:'center',
		width:500,
		modal:true,
		layout:'fit',
	    items:[formPanel],
		buttons:[{
					text:'代填',
					iconCls:'btn-save',
					handler : function() {
							if (formPanel.getForm().isValid()) {	 
								var creatorId = Ext.getCmp('creatorId').getValue();
								var creatorName =Ext.getCmp('creatorName').getValue();
								var comments=Ext.getCmp('LeaderCommandForm.comments').getValue();
								if (callback != null) {
									callback.call(this,creatorId,creatorName,comments);
								}
								win.close();
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
};