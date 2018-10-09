var emailForm=function(emailContent,callback){
	var formPanel=new Ext.FormPanel({
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		border:false,
		items:[{
				xtype:'textarea',
				name:'eamilcomment',
				id:'eamilcomments',
				value:emailContent,
				height:200,
				anchor:'98%,98%',
				fieldLabel:'请编辑发送内容'
			}
		]
	});
	var win=new Ext.Window({
		title:'邮件内容',
		height:300,
		iconCls:'btn-changeTask',
		buttonAlign:'center',
		width:500,
		modal:true,
		layout:'fit',
	    items:[formPanel],
		buttons:[{
					text:'确定',
					iconCls:'btn-save',
					handler : function() {
							if (formPanel.getForm().isValid()) {	
								var comments = Ext.getCmp('eamilcomments').getValue();
								if (callback != null) {
									callback.call(this,comments);
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