EditOutForm  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		EditOutForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'EditOutFormWin',
					title : '新增外出人员',
					iconCls : 'menu-product',
					width : 860,
					height : 320,
					items:this.formPanel,
					maximizable : true,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
		var jsArr=[__ctxPath+'/js/out/emailForm.js'];
		$ImportSimpleJs(jsArr,null);
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			url : __ctxPath + '/Out/saveOut.do',
				layout : 'form',
				id : 'EditOutForm',
				bodyStyle : 'padding:5px;',
				frame : false,
				defaults : {
					width : 400,
					anchor : '98%,98%'
				},
				defaultType : 'textfield',
				items : [ {
					xtype : 'container',
					style : 'padding-top:3px;',
					layout : 'column',
					height:40,
					items : [ {
						name : 'outPerson.Id',
						id : 'id',
						xtype : 'hidden'
					},{
						xtype : 'label',
						text : '外出人员:',
						width : 105
					}, {
						xtype : 'textfield',
						editable : false,
						name : 'outPerson.appUser.fullname',
						id : 'outPerson.appUser.fullname',
						value : curUserInfo.fullname,
						width : 250,
						readOnly : true,
						allowBlank : false
					},{
						xtype : 'hidden',
						name : 'outPerson.appUser.userId',
						value : curUserInfo.userId,
						id : 'outPerson.appUser.userId'
					},{
						xtype : 'button',
						text : '请选择',
						iconCls : 'btn-user-sel',
						handler : function() {
							NewUserSelector.getView(function(userId, fullName,depName){
								Ext.getCmp('outPerson.appUser.department').setValue(depName);
								var fm = Ext.getCmp("EditOutFormWin");
								fm.getCmpByName('outPerson.appUser.userId').setValue(userId);
								fm.getCmpByName('outPerson.appUser.fullname').setValue(fullName);
							}, true,false,!curUserInfo.isAdmin).show();
						}
					},{
						xtype : 'label',
						style : 'padding-left:20px;',
						text : '所在部门:',
						width : 105
					},{
						xtype : 'textfield',
						editable : false,
						id :'outPerson.appUser.department',
						value : curUserInfo.depName,
						width : 303
					}]
				},  {
					xtype : 'container',
					style : 'padding-top:3px;',
					layout : 'column',
					height:40,
					items : [ {
						xtype : 'label',
						text : '外出日期:',
						width : 105
					}, {
						xtype : 'datetimefield',
						name : 'outPerson.startDate',
						format : 'Y-m-d H',
						id : 'startDate',
						editable : false,
						minValue : new Date(),
						width : 303,
						allowBlank : false
					}, {
						xtype : 'label',
						style : 'padding-left:20px;',
						text : '返回日期:',
						width : 105
					}, {
						xtype : 'datetimefield',
						name : 'outPerson.endDate',
						format : 'Y-m-d H',
						id : 'endDate',
						editable : false,
						minValue : new Date(),
						width : 303,
						allowBlank : false
					}]
				}, {
					fieldLabel : '外出事由',
					xtype : 'textarea',
					name : 'outPerson.outReson',
					id : 'outReson',
					maxLength :100,
					allowBlank : false
				},  {
					fieldLabel : '工作托付',
					xtype : 'textarea',
					name : 'outPerson.workConsign',
					id : 'workConsign',
					maxLength :250,
					allowBlank : false
				}, {
					xtype : 'hidden',
					name : 'comment',
					id : 'comments'
				} ]
			});

	if (this.Id != null && this.Id != 'undefined') {
		this.formPanel.getForm().load({
			deferredRender : false,
			url : __ctxPath + '/Out/getOut.do?Id=' + this.Id,
			waitMsg : '正在载入数据...',
			success : function(form, action) {
				var result = action.result.data;
				var data = eval("(" + action.response.responseText
						+ ")").data;
				Ext.getCmp('startDate').setValue(
						new Date(data.startDate));
				Ext.getCmp('endDate').setValue(new Date(data.endDate));
				Ext.getCmp('outPerson.appUser.userId').setValue(
						data.appUser.userId);
				Ext.getCmp('outPerson.appUser.fullname').setValue(
						data.appUser.fullname);	
			},
			failure : function(form, action) {
				Ext.ux.Toast.msg('编辑', '载入失败');
			}
		});
	}
		
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('EditOutForm');
						if (fp.getForm().isValid()) {
							var startTime = Ext.util.Format.date(Ext.getCmp("startDate")
											.getValue(), 'Y-m-d H:i');
							var endTime = Ext.util.Format.date(
									Ext.getCmp("endDate").getValue(), 'Y-m-d H:i');
							if (startTime >= endTime) {
								Ext.MessageBox.show({
											title : '操作信息',
											msg : '外出日期应小于返回日期！',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
								return;
							}
							var af=false;
							Ext.Ajax.request({
							url : __ctxPath + '/Out/isofficeDeputyDirectorOut.do?outPerson.appUser.userId='+Ext.getCmp('outPerson.appUser.userId').getValue(),
								method:'post',
								success : function(response, options) {
								  af=Ext.util.JSON.decode(response.responseText).success;
								  if(af==true){	
						var emailContent=fp.getCmpByName('outPerson.appUser.fullname').getValue()+'将于'+startTime+'至'+endTime+'外出，外出事由为： '
									    +fp.getCmpByName('outPerson.outReson').getValue()+';\n工作托付为：'+fp.getCmpByName('outPerson.workConsign').getValue();
							new emailForm(emailContent, function(comments){
							Ext.getCmp('comments').setValue(comments);
								fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									if(Ext.getCmp('OutPersonGrid')){
										Ext.getCmp('OutPersonGrid').getStore()
												.reload();}
									if(Ext.getCmp('RecallPersonGrid')){
										Ext.getCmp('RecallPersonGrid').getStore()
										.reload();}
									if(Ext.getCmp('TodayGrid')){
										Ext.getCmp('TodayGrid').getStore()
										.reload();}
									Ext.getCmp('EditOutFormWin').close();
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
							})})}
						else{
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									if(Ext.getCmp('OutPersonGrid')){
										Ext.getCmp('OutPersonGrid').getStore()
												.reload();}
									if(Ext.getCmp('RecallPersonGrid')){
										Ext.getCmp('RecallPersonGrid').getStore()
										.reload();}
									if(Ext.getCmp('TodayGrid')){
										Ext.getCmp('TodayGrid').getStore()
										.reload();}
									Ext.getCmp('EditOutFormWin').close();
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
							})}
								},
								failure : function(form, action) {
				                Ext.ux.Toast.msg('编辑', '载入失败');
								}
							});
						}
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('EditOutFormWin').close();
					}
				}];//end of the buttons
	}//end of the initUIComponents
});