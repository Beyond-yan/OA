var ReWriteFlowOpinionForm=function(runId){
	var formPanel=new Ext.FormPanel({
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		url:__ctxPath+'/flow/saveOpinProcessForm.do',
		border:false,
		items:[{
				xtype:'hidden',
				name:'runId',
				value:runId
			},{
				xtype : 'combo',
				fieldLabel : '添加类型',
				hiddenName : "processForm.activityName",
				valueField : 'activityName',
				displayField : 'activityName',
				width: 350,
				editable : false,
				triggerAction : 'all',
				forceSelection : true,
				store : new Ext.data.SimpleStore({
							url : __ctxPath + '/flow/flowDefTasksProcessActivity.do?runId='+runId,
							autoLoad : true,
							fields : ['activityName']
						})
			},{
				xtype : 'container',
				id : 'ReWriteFlowOpinionForm.Leader',
				height:32,
				border:false,
				layout : 'column',
				defaults:{
					border : false
				},
				items : [{
							xtype : 'label',
							text : '选择人员:',
							width : 105
						}, {
							id:'ReWriteFlowOpinionForm.LeaderCheckName',
							xtype:'textfield',
							readOnly:true,
							allowBlank:false,
							width:272
						}, {
							xtype:'hidden',
							id:'ReWriteFlowOpinionForm.LeaderCheckUserId'
						},{
							xtype : 'button',
							style : 'padding-left:10px;',
							text : '选择人员',
							iconCls : 'btn-select',
							handler : function() {
								//var url = __ctxPath +'/system/depLeadersTreeDepartment.do?roles='+roleMap.get('diaryLeaderRoleId')+','+roleMap.get('officeDirectorRoleID')+','+roleMap.get('officeDeputyDirectorRoleID')+',-2';
								  var url = __ctxPath + '/system/depUsersTreeDepartment.do?depIds='+roleMap.get('DepartmentCommonId');
                                                                  DepLeaders.getView(
										function(userIds, fullnames) {
											Ext.getCmp('creatorId').setValue(userIds);
											Ext.getCmp('creatorName').setValue(fullnames);
											Ext.getCmp('ReWriteFlowOpinionForm.LeaderCheckUserId').setValue(userIds);
											Ext.getCmp('ReWriteFlowOpinionForm.LeaderCheckName').setValue(fullnames);
										}, true, null,url).show();
							}
						}]
			},{
				fieldLabel : '代填时间',
				name : 'createtime',
				xtype : 'datetimefield',
				value: new Date(),
				width:350,
				format : 'Y-m-d H:i',
				allowBlank : false
			},{ 
				border : false,
				style : 'padding-top:6px;',
				layout : 'form',
				items : {
					xtype:'textarea',
					name:'processForm.comments',
					id:'ReWriteFlowOpinionForm.comments',
					width:350,
					fieldLabel:'代填意见'
			}},{
				xtype:'hidden',
				name:'processForm.creatorId',
				id:'creatorId'
			},{
				xtype:'hidden',
				name:'processForm.creatorName',
				id:'creatorName'
			}
		]
	});
	var win=new Ext.Window({
		title:'添加意见',
		height:260,
		iconCls:'btn-add',
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
								formPanel.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '信息成功保存！');
									var grid=Ext.getCmp('ArchivesWriteOpionGrid');
									if(grid!=null){
									    grid.getStore().reload();
									}
									win.close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									win.close();
								}
							});
								 
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