var OfficeMeetingTimesSetForm=function(archivesIds){
	var formPanel=new Ext.FormPanel({
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		url:__ctxPath+'/meetingTimes/setTimesMeetingTimes.do',
		border:false,
		items:[{
			xtype : "hidden",
			name : "timesId",
			id : "OfficeMeetingTimesSetForm.timesId"
		},{
			xtype : "hidden",
			name : "archivesIds",
			id : "OfficeMeetingTimesSetForm.archivesIds",
			value: archivesIds
		},{
			xtype : "hidden",
			name : "timesl",
			allowBlank : false,
			id : "OfficeMeetingTimesSetForm.timesl"
		},{
				xtype : "combo",
				fieldLabel : "期数",
				id : "OfficeMeetingTimesSetForm.times",
				valueField : 'timesId',
				displayField : 'times',
				editable : false,
				allowBlank : true,
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
						Ext.getCmp('OfficeMeetingTimesSetForm.timesId').setValue(cbo.getValue());
						Ext.getCmp('OfficeMeetingTimesSetForm.timesl').setValue(cbo.getRawValue());
					}
				}
			}
		]
	});
	var win=new Ext.Window({
		title:'设置期数',
		height:100,
		iconCls:'btn-add',
		buttonAlign:'center',
		width:500,
		modal:true,
		layout:'fit',
	    items:[formPanel],
		buttons:[{
					text:'保存',
					iconCls:'btn-save',
					handler : function() {
							if (formPanel.getForm().isValid()) {	 
								formPanel.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									var jsonResult = action.result;
									if (jsonResult && jsonResult.code == 0) {
										Ext.ux.Toast.msg("操作信息", jsonResult.msg);
									}else{
										Ext.ux.Toast.msg('操作信息', '信息成功保存！');
										refreshTaskPanelView();
										if(Ext.getCmp('OfficeMeetingTimesGrid') != null){
											Ext.getCmp('OfficeMeetingTimesGrid').getStore().reload();
										}
										win.close();
									}
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