LawsAuthorForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		LawsAuthorForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'LawsAuthorFormWin',
					title : '颁布单位',
					iconCls : 'menu-department',
					width : 300,
					height : 110,
					//minWidth : 399,
					//minHeight : 169,
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
			url : __ctxPath + '/law/saveLawsAuthor.do',
			layout : 'form',
			id : 'LawsAuthorForm',
			frame : true,
			defaults : {
				widht : 300,
				anchor : '100%,100%'
			},
			formId : 'LawsAuthorFormId',
			defaultType : 'textfield',
			items : [{
						name : 'lawsAuthor.authorId',
						id : 'authorId',
						xtype : 'hidden',
						value :'' //this.authorId == null ? '' : this.authorId
					}, {
						fieldLabel : '单位名称',
						name : 'lawsAuthor.authorName',
						id : 'authorName'
					}

			]
		});

		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('LawsAuthorForm');
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
										Ext.ux.Toast.msg('操作信息', '操作成功！')
										Ext.getCmp('LawsAuthorFormWin').close();
										Ext.getCmp('authorTreePanel').root.reload();
									
								/*	Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									Ext.getCmp('authorTreePanel').root.reload();
									window.close();*/
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
						Ext.getCmp('LawsAuthorFormWin').close();
					}
				}];// end of the buttons
	}
});
