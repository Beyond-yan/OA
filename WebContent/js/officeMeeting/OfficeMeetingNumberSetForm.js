var OfficeMeetingNumberSetForm=function(archivesId){
	var formPanel=new Ext.FormPanel({
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		url:__ctxPath+'/meetingTimes/setNumberMeetingTimes.do',
		border:false,
		items:[{
			xtype : "hidden",
			name : "archivesId",
			id : "OfficeMeetingTimesSetForm.archivesId",
			value: archivesId
		},{
			xtype : "textfield",
			name : "number",
			fieldLabel : "议题编号",
			width : 300,
			allowBlank : false,
			id : "OfficeMeetingNumberSetForm.number"
		}]
	});
	var win=new Ext.Window({
		title:'设置编号',
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