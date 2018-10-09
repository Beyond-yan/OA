/**
 * 重置密码
 */
var SysServiceAccountPsdChangeForm = function(id){
	var formPanel = new Ext.FormPanel({
				url : __ctxPath+ '/system/resetPasswordSysServiceAccount.do',
				layout : 'form',
				id:'setPasswordForm',
				bodyStyle:'padding:5px',                                     
				border:false,
				defaults : {
					widht : 400,
					anchor : '100%,100%'
				},
	        	defaultType : 'textfield',
				items : [{
							name : 'accountId',
							id : 'accountId',
							xtype:'hidden',
							value : id
						}, 
						{
							fieldLabel : '重设密码',
							name:'newpassword',
							id:'newpassword',
							inputType : 'password',
							maxLength:18,
							maxLengthText:'密码不能超过0—18位',
							allowBlank : false,
							blankText : '密码不能为空!'
						},
						{
							fieldLabel : '确认密码',
							name:'rePassword',
							id:'rePassword',
							inputType : 'password',
							maxLength:18,
							maxLengthText:'密码不能超过0—18位',
							allowBlank : false,
							blankText : '密码不能为空!'
						}
						]
			});
			
	var setPassword = new Ext.Window({
		title:'重置密码',
		iconCls:'btn-password',
		width : 350,
		height : 175,
		modal: true,
		layout : 'fit',
		buttonAlign : 'center',
		items:[formPanel],
		buttons : [{
					text : '保存',
					iconCls:'btn-save',
					handler : function() {
						var fp=Ext.getCmp('setPasswordForm');
								if (fp.getForm().isValid()) {
								fp.getForm().submit({
											method: 'post',
											waitMsg : '正在提交数据...',
											success : function(fp,action) {
												Ext.ux.Toast.msg('操作信息', '重置密码成功！');
												setPassword.close();
											},
											failure : function(fp,action) {
												Ext.ux.Toast.msg('错误提示',action.result.msg);
												Ext.getCmp('setPasswordForm').getForm().reset();
											}
								});
							}
					}
				}, {
					text : '取消',
					iconCls:'btn-cancel',
					handler : function() {
						setPassword.close();
					}
				}]
			});
	setPassword.show();
};
