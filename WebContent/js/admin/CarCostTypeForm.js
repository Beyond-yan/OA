CarCostTypeForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CarCostTypeForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'CarCostTypeFormWin',
					title : '费用类别',
					iconCls : 'menu-department',
					width : 300,
					height : 140,
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
			url : __ctxPath + '/admin/saveCarCostType.do',
			layout : 'form',
			id : 'CarCostTypeForm',
			frame : true,
			defaults : {
				widht : 300,
				anchor : '95%,95%'
			},
			formId : 'CarCostTypeFormId',
			defaultType : 'textfield',
			items : [{
						name : 'carCostType.id',
						id : 'id',
						xtype : 'hidden',
						value :this.carCostTypeId == null ? '' : this.carCostTypeId
					}, {
						fieldLabel : '车费类别',
						name : 'carCostType.costTypeName',
						id : 'costTypeName',
						allowBlank:false
					},{
					   fieldLabel:'类别ID',
					   name:'carCostType.costNo',	
					   id : 'costNo',
					   allowBlank:false
					}

			]
		});

			if (this.carCostTypeId) {
			this.formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath + '/admin/getCarCostType.do?carCostTypeId=' + this.carCostTypeId,
						waitMsg : '正在载入数据...',
						success : function(form, action) {
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
						var fp = Ext.getCmp('CarCostTypeForm');
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
										Ext.ux.Toast.msg('操作信息', '操作成功！')
										Ext.getCmp('CarCostTypeFormWin').close();
										Ext.getCmp("carCostTypeGrid").getStore().reload();
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
						Ext.getCmp('CarCostTypeFormWin').close();
					}
				}];// end of the buttons
	}
});
