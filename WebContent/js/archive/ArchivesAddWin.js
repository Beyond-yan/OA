/**
 * @author:
 * @class SealView
 * @extends Ext.Panel
 * @description [Seal]管理
 * @company 广州宏天软件有限公司
 * @createtime:
 */
ArchivesAddWin = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ArchivesAddWin.superclass.constructor.call(this, {
					id : 'ArchivesAddWin',
					title : '公文补充管理',
					region : 'center',
					layout : 'form',
					defaults : {
						border : false,
						autoScroll : true,
						anchor : '96%,96%'
					},
					width : 400,
					items : [this.formPanel],
					buttonAlign : 'center',
					buttons : [{
								text : '启动流程',
								iconCls : 'btn-save',
								scope : this,
								handler : this.onAdd
							}]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.formPanel = new Ext.FormPanel({
			bodyStyle : 'padding: 4px 8px 4px 8px',
			layout : 'form',
			autoHeight : true,
			items : [{
						fieldLabel : '父公文ID',
						name : 'archivesId',
						xtype : 'textfield',
						allowBlank : false,
						width:300

					}, {
						fieldLabel : '流程名称',
						hiddenName : 'defId',
						width : 300,
						xtype : 'combo',
						// xtype : 'numberfield',
						mode : 'local',
						editable : false,
						resizable : true,
						triggerAction : 'all',
						displayField : 'processName',
						valueField : 'defId',
						store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/flow/comIncludeRecvProDefinition.do',
									fields : ['defId', 'processName']
								}),
						listeners : {
							select : function(cbo, record, index) {
								Ext.getCmp('ArchivesAddWin.processName').setValue(cbo
										.getRawValue());
							}
						}
					}, {
						name : 'processName',
						id : 'ArchivesAddWin.processName',
						allowBlank : false,
						xtype : 'hidden'
					},
					/*
					 * { fieldLabel : '流程定义ID', name : 'defId', allowBlank :
					 * false, xtype : 'numberfield' }, { fieldLabel : '流程名称',
					 * name : 'processName', allowBlank : false, xtype :
					 * 'textfield' },
					 */{
						fieldLabel : '角色ID',
						name : 'roleId',
						allowBlank : false,
						xtype : 'textfield',
						width : 300,
						value : 24

					}, {
						fieldLabel : '角色名称',
						name : 'roleName',
						xtype : 'textfield',
						allowBlank : false,
						width : 300,
						value : '综合管理员'
					}, {
						fieldLabel : '开始节点名称',
						name : 'startNodeName',
						xtype : 'textfield',
						allowBlank : false,
						width : 300,
						value : '开始'

					}, {
						fieldLabel : '发文人Id',
						name : 'userId',
						allowBlank : false,
						width : 300,
						xtype : 'numberfield'
					}, {
						xtype : 'container',
						layout : 'column',
						style : 'padding:0px 0px 8px 0px;margin-left:0px;',
						defaults : {
							border : false
						},
						items : [{
									xtype : 'label',
									style : 'padding:0px 0px 0px 0px;',
									text : '收文部门:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'depNames',
									width : '67%',
									readOnly : true,
									id : 'ArchivesAddWin.recDepNames',
									allowBlank : false
								}, {
									xtype : 'hidden',
									name : 'depIds',
									id : 'ArchivesAddWin.recDepIds'
								}, {
									xtype : 'button',
									iconCls : 'menu-department',
									text : '选择部门',
									handler : function() {
										var depIdsTemp = Ext
												.getCmp('ArchivesAddWin.recDepIds')
												.getValue();
										var depNamesTemp = Ext
												.getCmp('ArchivesAddWin.recDepNames')
												.getValue();
										var array1 = [];
										var array2 = [];

										var m = new Map();
										if (depIdsTemp != null
												&& depIdsTemp != '') {
											array1 = depIdsTemp.split(',');
											array2 = depNamesTemp.split(',');
											for (var i = 0; i < array1.length; i++) {
												m.put(array1[i], array2[i]);
											}
										}

										DepSelector3.getView(
												function(depIds, depNames) {
													Ext
															.getCmp('ArchivesAddWin.recDepIds')
															.setValue(depIds);
													Ext
															.getCmp('ArchivesAddWin.recDepNames')
															.setValue(depNames);
												}, false, m).show();
									}
								}]
					}]
		});// end of the searchPanel
	}// end of the initComponents()
	,
	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	onAdd : function() {
		var formPanel = this.formPanel;
		if (formPanel.getForm().isValid()) {// 如果合法
			Ext.Msg.confirm('信息确认', '您确认启动新的流程么？', function(btn) {
						if (btn == 'yes') {
							formPanel.getForm().submit({
								waitMsg : '正在提交数据...',
								method : 'POST',
								url : __ctxPath
										+ "/archive/satrtSubProcessTempArchives.do",
								success : function(response, options) {
									Ext.ux.Toast.msg('操作信息', '成功启动流程！');
									formPanel.getForm().reset();

								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});
						}
					});
		}
	}

});
