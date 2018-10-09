FlowSnConfigOrderForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		FlowSnConfigOrderForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'FlowSnConfigOrderFormWin',
					title : '预约文件编号',
					iconCls : 'menu-department',
					width : 600,
					height : 250,
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
		var fId=null;
		var styleStore=new Ext.data.SimpleStore({
					autoLoad : false,
					url : __ctxPath+ '/snconfig/getCheckSignsComboFlowSnConfig.do',
					fields : [ 'id', 'snName' ]
				})
		this.formPanel = new Ext.form.FormPanel({
		    url : __ctxPath+ '/snconfig/saveFileSnConfigOrder.do',
			layout : 'form',
			id : 'FlowSnConfigOrderForm',
			frame : true,
			style:'padding:10px',
			items : [{
						xtype : 'hidden',
						name : 'fileSnConfigOrder.id'
					},{
								xtype : 'hidden',
								id : 'OrderUserDepName'
							},{
								xtype : 'hidden',
								name:'fileSnConfigOrder.userId',
								id : 'OrderUserId'
							},{
						layout : 'hbox',
						border : false,
						style:'padding-bottom:5px;',
						defaults : {
							border : false
						},
								items : [{
											xtype : 'label',
											text : '预约人:',
											width : 104
										}, {
											//name : 'fileSnConfigOrder.orderSnName',
											id : 'Orderarchives_orderUserName',
											xtype : 'textfield',
											allowBlank : false,
											readOnly : true,
											width : '61%'
										}, {
											xtype : 'button',
											iconCls : 'menu-flowWait',
											text : '选择人员',
											//width : 30,
											handler : function() {UserSelector.getView(
												function(userId, fullName,depName) {
												Ext.getCmp('OrderUserId').setValue(userId);
												Ext.getCmp('OrderUserDepName').setValue(depName);
												Ext.getCmp('Orderarchives_orderUserName').setValue(fullName);
												}, true).show();}
										}]
					},{
				//disabled:!addMode,
				xtype :'combo', //addMode ? 'combo' : 'hidden',
				fieldLabel : '流程名称',
				hiddenName : 'fileSnConfigOrder.defId',
				id : 'pfileSnConfigOrder.defId',
				mode : 'remote',
				allowBlank : false,
				editable : false,
				triggerAction : 'all',
				displayField : 'name',
				valueField : 'id',
			    //emptyText:'请选择单位',
				store : new Ext.data.SimpleStore({
					autoLoad : true,
					url : __ctxPath + '/flow/comQuickProDefinition.do',
					fields : [ 'id', 'name' ]
				}),
				listeners:{'select':function(){
				 Ext.getCmp('pfileSnConfigOrder.snId').getStore().removeAll();
				 Ext.getCmp('pfileSnConfigOrder.snId').clearValue();
				 fId=Ext.getCmp('pfileSnConfigOrder.defId').getValue();
				  Ext.getCmp('pfileSnConfigOrder.snId').getStore().load({params:{flowId:fId}});
				}},
				anchor : '95%'
			},{
				//disabled:!addMode,
				xtype :'combo', //addMode ? 'combo' : 'hidden',
				fieldLabel : '编号方式',
				hiddenName : 'fileSnConfigOrder.fileSnConfig.id',
				id : 'pfileSnConfigOrder.snId',
			    mode : 'local',
				allowBlank : false,
				editable : false,
				triggerAction : 'all',
				displayField : 'snName',
				valueField : 'id',
			    //emptyText:'请选择单位',
				store :styleStore,		
				anchor : '95%',
				listeners:{'beforequery':function(){
				  var v=Ext.getCmp('pfileSnConfigOrder.defId').getValue();
				   var c=Ext.getCmp('pfileSnConfigOrder.snId').getStore().getCount();
				   if(v==null||v==""){
				   Ext.ux.Toast.msg('操作信息','请选择相应流程！');
				   return;
				   }
				   if(c==0){
				   Ext.ux.Toast.msg('操作信息','无相应编号方式,请添加相应编号方式！');
				   return;
				   }
				}}
			},{
						layout : 'hbox',
						border : false,
						defaults : {
							border : false
						},
						items : [{
									xtype : 'label',
									text : '公文编号:',
									width : 104
								}, {
									name : 'fileSnConfigOrder.orderSnName',
									id : 'Orderarchives_archivesNo',
									xtype : 'textfield',
									allowBlank : false,
									readOnly : true,
									width : '61%'
								}, {
									xtype : 'button',
									iconCls : 'menu-flowWait',
									text : '生成编号',
									//width : 30,
									handler : function() {
										if (Ext
												.getCmp('pfileSnConfigOrder.defId')
												.isValid()
												&& Ext.getCmp('pfileSnConfigOrder.snId')
														.isValid()) {
											Ext.Ajax.request({
												url : __ctxPath
														+ '/snconfig/getSnNoFileSnConfig.do',
												params : {
													defId : Ext.getCmp('pfileSnConfigOrder.defId').getValue(),
													snConfigId : Ext.getCmp('pfileSnConfigOrder.snId').getValue()
												},
												method : 'POST',
												waitMsg : "正在生成编号，请稍等",
												success : function(response,
														options) {
													var archivesNo = Ext.util.JSON
															.decode(response.responseText).data;
													Ext
															.getCmp('Orderarchives_archivesNo')
															.setValue(archivesNo);
												},
												failure : function(response,
														options) {
													Ext.ux.Toast.msg('操作信息',
															'生成编号出错，请联系管理员！');
												}
											});
										}
									}
								}]
					}

			]
		});

		this.buttons = [{
						text : '确认预约',
						iconCls : 'btn-save',
						scope : this,
						handler : function() {
							var orderform = Ext.getCmp('FlowSnConfigOrderForm');
							if (orderform.getForm().isValid()) {
								orderform.getForm().submit({
									method : 'post',
									waitMsg : '正在提交提交数据...',
									success : function(fp, action) {
										Ext.ux.Toast.msg('操作信息', '预约编号成功！');
										Ext.getCmp('FlowSnConfigOrderFormWin')
												.close();
										Ext.getCmp('SeeFlowSnConfigOrderGrid').getStore().reload();		
									},
									failure : function(fp, action) {
										Ext.MessageBox.show({
													title : '操作信息',
													msg : '保存出错,请联系管理员！',
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
						scope : this,
						handler : function() {
							Ext.getCmp('FlowSnConfigOrderFormWin').close();
						}
					}];// end of the buttons
	}
});