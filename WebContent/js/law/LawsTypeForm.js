LawsTypeForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		LawsTypeForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'LawsTypeFormWin',
					title : '法规分类',
					iconCls : 'menu-department',
					width : 300,
					height : 110,
					//minWidth : 399,
					//minHeight : 80,
					items : this.formPanel,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.form.FormPanel({
			url : __ctxPath + '/law/saveLawsType.do',
			layout : 'form',
			id : 'LawsTypeForm',
			frame : true,
			defaults : {
				widht : 300,
				anchor : '100%,100%'
			},
			//formId : 'LawsTypeFormId',
			defaultType : 'textfield',
			items : [{
						name : 'lawsType.typeId',
						id : 'typeId',
						xtype : 'hidden',
						value : ''//this.authorId == null ? '' : this.authorId
					}, {
						fieldLabel : '法规分类',
						name : 'lawsType.typeName',
						id : 'typeName'
					}

			]
		});
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('LawsTypeForm');
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
										Ext.ux.Toast.msg('操作信息', '操作成功！')
										Ext.getCmp('LawsTypeFormWin').close();
										Ext.getCmp('typeTreePanel').root.reload();
									
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
					iconCls : 'btn-del',
					handler : function() {
						Ext.getCmp('LawsTypeFormWin').close();
					}
				}];// end of the buttons
	}
});
