var ErrandsRegisterForm = function(dateId) {
	this.dateId = dateId;
	var fp = this.setup();
	var window = new Ext.Window({
				id : 'ErrandsRegisterFormWin',
				title : '请假单详细信息',
				width : 460,
				height : 350,
				modal : true,
				layout : 'fit',
				buttonAlign : 'center',
				items : [this.setup()],
				buttons : [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('ErrandsRegisterForm');
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									Ext.getCmp('ErrandsRegisterGrid')
											.getStore().reload();
									window.close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									window.close();
								}
							});
						}
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						window.close();
					}
				}]
			});
	window.show();
};

ErrandsRegisterForm.prototype.setup = function() {

	var formPanel = new Ext.FormPanel({
				url : __ctxPath + '/personal/saveErrandsRegister.do',
				layout : 'form',
				id : 'ErrandsRegisterForm',
				border:false,
				bodyStyle : 'padding:5px;',
				defaults : {
					width : 400,
					anchor : '98%,98%'
				},
				formId : 'ErrandsRegisterFormId',
				defaultType : 'textfield',
				items : [{
							name : 'errandsRegister.dateId',
							id : 'dateId',
							xtype : 'hidden',
							value : this.dateId == null ? '' : this.dateId
						}, {
							name : 'errandsRegister.flag',
							id : 'flag',
							xtype : 'hidden',
							value:1
						}, {
							xtype:'hidden',
							name : 'errandsRegister.userId',
							id : 'userId'
						},  {
							xtype:'hidden',
							name : 'errandsRegister.status',
							id : 'status'
						}, {
							xtype:'hidden',
							name:'errandsRegister.approvalId',
							id:'approvalId'
						},{
							xtype:'hidden',
							name : 'errandsRegister.approvalOption',
							id : 'approvalOption'
						}, {
							fieldLabel : '事项描述',
							xtype:'textarea',
							name : 'errandsRegister.descp',
							allowBlank : false,
							id : 'descp',
							height:180
						}, {
							fieldLabel : '开始时间',
							name : 'errandsRegister.startTime',
							xtype:'datetimefield',
							format:'Y-m-d H:i:s',
							allowBlank : false,
							id : 'startTime'
						}, {
							fieldLabel : '结束时间',
							name : 'errandsRegister.endTime',
							xtype:'datetimefield',
							format:'Y-m-d H:i:s',
							allowBlank : false,
							id : 'endTime'
						}, {
							xtype:'compositefield',
							fieldLabel:'审批人',
							items:[
								{
									xtype:'textfield',
									name:'errandsRegister.approvalName',
									id:'approvalName',
									allowBlank:false,
									readOnly:true,
									width:220
								},{
									xtype:'button',
									text:'选择用户',
									iconCls:'btn-sel-user',
									handler:function(){
										UserSelector.getView(function(uId,uName){
											Ext.getCmp("approvalId").setValue(uId);
											Ext.getCmp("approvalName").setValue(uName);
										},true).show();
									}
								}
							]
						}

				]
			});

	if (this.dateId != null && this.dateId != 'undefined') {
		formPanel.getForm().load({
			deferredRender : false,
			url : __ctxPath + '/personal/getErrandsRegister.do?dateId='
					+ this.dateId,
			waitMsg : '正在载入数据...',
			success : function(form, action) {
				var result = action.result.data;
				var startTime = getDateFromFormat(result.startTime,'yyyy-MM-dd HH:mm:ss');
				var endTime = getDateFromFormat(result.endTime,'yyyy-MM-dd HH:mm:ss');
				Ext.getCmp('startTime').setValue(new Date(startTime));
				Ext.getCmp('endTime').setValue(new Date(endTime));
			},
			failure : function(form, action) {
				Ext.ux.Toast.msg('编辑', '载入失败');
			}
		});
	}
	return formPanel;

};
