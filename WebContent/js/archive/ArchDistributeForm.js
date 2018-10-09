/**
 * @author Ropen
 *
 */
ArchDistributeForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ArchDistributeForm.superclass.constructor.call(this, {
					id : 'ArchDistributeFormWin',
					layout : 'fit',
					items : this.displayPanel,
					modal : true,
					height : 300,
					width : 600,
					iconCls:'menu-arch-dispatch',
					maximizable : true,
					title : '分发意见待办',
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.displayPanel = new Ext.Panel({
							id : 'ArchivesHandleDisplayPanel',
							autoScroll : true,
							height : 220,
							border : false,
							autoLoad : {
								url : __ctxPath
										+ '/pages/archive/dispatcharchives.jsp?dispatchId='
										+ this.dispatchId
							}
						});
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px 10px 10px 10px',
			border : false,
			url : __ctxPath + '/archive/saveArchDispatch.do',
			id : 'ArchDistributeForm',
			defaults : {
				anchor : '98%,98%'
			},
			defaultType : 'textfield',
			items : [{
						name : 'archivesId',
						id : 'archivesId',
						xtype : 'hidden'
					},{
					    name:'dispatchId',
					    id:'dispatchId',
					    xtype:'hidden',
					    value :this.dispatchId
					}, {
						xtype : 'container',
						layout : 'column',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px',
									text : '收文人员',
									width : 101
								}, {
									xtype : 'textarea',
									width : 300,
									id : 'readerNames',
									allowBlank:false,
									blankText:'请选择接收公文的人员',
									readOnly:true,
									name : 'readerNames'
								}, {
									xtype : 'hidden',
									id : 'readerIds',
									name : 'readerIds'
								}, {
									xtype : 'button',
									text : '选择人员',
									handler : function() {
										UserSelector.getView(
												function(id, name) {
													Ext.getCmp('readerNames')
															.setValue(name);
													Ext.getCmp('readerIds')
															.setValue(id);
												}).show();

									}
								}, {
									xtype : 'container',
									style:'padding-left:0px;padding-top:3px;',
									layout : 'column',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px',
												text : '承办人员',
												width : 101
											}, {
												xtype : 'textarea',
												width : 300,
												id : 'undertakeNames',
												allowBlank:false,
												blankText:'请选择承办人员',
												readOnly:true,
												name : 'undertakeNames'
											}, {
												xtype : 'hidden',
												id : 'undertakeIds',
												name : 'undertakeIds'
											}, {
												xtype : 'button',
												text : '选择人员',
												handler : function() {
													UserSelector.getView(
															function(id, name) {
																Ext
																		.getCmp('undertakeNames')
																		.setValue(name);
																Ext
																		.getCmp('undertakeIds')
																		.setValue(id);
															}).show();

												}
											}]

								}]

					}
			]
		});
		// 初始化功能按钮
		this.buttons = [{
					text : '关闭',
					iconCls : 'btn-cancel',
					handler : this.cancel.createCallback(this)
				}];
	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function(formPanel) {
		formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function(window) {
		window.close();
	},
	/**
	 * 保存记录
	 */
	save : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			formPanel.getForm().submit({
						method : 'POST',
						waitMsg : '正在提交数据...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息！');
							var gridPanel = Ext.getCmp('ArchDispatchGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							window.close();
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错，请联系管理员！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
							window.close();
						}
					});
		}
	}// end of save

});