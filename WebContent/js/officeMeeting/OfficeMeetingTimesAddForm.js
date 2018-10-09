var OfficeMeetingTimesAddForm=function(runId){
	var formPanel=new Ext.FormPanel({
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		url:__ctxPath+'/meetingTimes/saveMeetingTimes.do',
		border:false,
		items:[{
				fieldLabel : '年号',
				name : 'year',
				xtype : 'textfield',
				regex:/^[0-9]+$/,
				width:350,
				allowBlank : false
			},{
				fieldLabel : '期号',
				name : 'times',
				xtype : 'textfield',
				width:350,
				allowBlank : false
			},{
				xtype : "hidden",
				name : "type",
				value:'1',
			}
		]
	});
	var win=new Ext.Window({
		title:'新增期数',
		height:150,
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
										var grid=Ext.getCmp('OfficeMeetingTimes.times');
										if(grid!=null){
										    grid.getStore().reload();
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