/**
 * @author:
 * @class ArchFlowConfView
 * @extends Ext.Panel
 */
ArchFlowConfView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	formPanel : null,
	// 数据展示Panel
	gridPanel : null,
	// GridPanel的数据Store
	store : null,
	// 头部工具栏
	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ArchFlowConfView.superclass.constructor.call(this, {
					id : 'ArchFlowConfView',
					title : '公文流程配置',
					iconCls : 'menu-archive-setting',
					region : 'center',
					layout : 'form',
					tbar : this.toolbar,
					items : [this.formPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化设置表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px 10px 10px 10px',
			border : false,
			url : __ctxPath + '/archive/saveArchFlowConf.do',
			id : 'ArchFlowConfForm',
			defaults : {
				anchor : '98%,98%'
			},
			defaultType : 'textfield',

			items : [{
				xtype : 'fieldset',
				title : '公文流程配置',
				items : [{
					xtype : 'container',
					layout : 'column',
					items : [{
								xtype : 'label',
								text : '发文流程:',
								width : 101
							}, {
								xtype : 'textfield',
								name : 'sendProcessName',
								id : 'sendProcessName',
								width : 200
							}, {
								xtype : 'hidden',
								name : 'sendProcessId',
								id : 'sendProcessId'
							}, {
								xtype : 'button',
								iconCls:'menu-flow',
								text : '选择流程',
								handler : function() {
									FlowSelector.getView(function(id, name) {
										Ext.getCmp('sendProcessId')
												.setValue(id);
										Ext.getCmp('sendProcessName')
												.setValue(name);
									}, true).show();
								}
							}]

				}, {
					xtype : 'container',
					style : 'padding-top:3px;',
					layout : 'column',
					items : [{
								xtype : 'label',
								text : '收文流程:',
								width : 101
							}, {
								xtype : 'textfield',
								name : 'recProcessName',
								id : 'recProcessName',
								width : 200
							}, {
								xtype : 'hidden',
								name : 'recProcessId',
								id : 'recProcessId'
							}, {
								xtype : 'button',
								text : '选择流程',
								iconCls:'menu-flow',
								handler : function() {
									FlowSelector.getView(function(id, name) {
										Ext.getCmp('recProcessId').setValue(id);
										Ext.getCmp('recProcessName')
												.setValue(name);
									}, true).show();
								}
							}]

				}]
			}]
		});
		Ext.Ajax.request({
		   url:__ctxPath+'/archive/getArchFlowConf.do',
		   success:function(response,options){
		      var obj=Ext.util.JSON.decode(response.responseText).data;
		      Ext.getCmp('sendProcessId').setValue(obj.sendProcessId);
		      Ext.getCmp('sendProcessName').setValue(obj.sendProcessName);
		      Ext.getCmp('recProcessId').setValue(obj.recProcessId);
		      Ext.getCmp('recProcessName').setValue(obj.recProcessName);
		   }
		});
		
		// 初始化功能按钮
		this.toolbar = new Ext.Toolbar({
					id : 'ArchToolbar',
					items : [{
						text : '保存',
						iconCls : 'btn-save',
						handler : this.save
								.createCallback(this.formPanel, this)
					}, {
						text : '重置',
						iconCls : 'btn-reset',
						handler : this.reset.createCallback(this.formPanel)
					}, {
						text : '取消',
						iconCls : 'btn-cancel',
						handler : this.cancel.createCallback(this)
					}]
				});

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/depListArchRecUser.do",
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : ['archRecId', 'userId', 'fullname', 'depId','depLevel',
							'depName']
				});
		this.store.load();


		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var row = 0;
		var col = 0;
		var depId=0;

		var userSelector=new Ext.form.ComboBox({
									mode : 'local',
									anchor : '74%',
									allowBlank : false,
									editable : false,
									valueField : 'name',
									displayField : 'name',
									triggerAction : 'all',
									store : new Ext.data.SimpleStore({
												url : __ctxPath
														+ '/archive/selectArchRecUser.do',
												fields : ['id', 'name']
											}),
									listeners:{
									   select:function(combo, record,index){
									        var store = Ext.getCmp('ArchFlowConfGrid')
													.getStore();
											var rec = store.getAt(row);
											rec.set('userId', record.data.id);
											rec.set('fullname', record.data.name);
									   }
									}
												
								});
		var cm = new Ext.grid.ColumnModel({
					columns : [new Ext.grid.RowNumberer(), {
								header : 'archRecId',
								dataIndex : 'archRecId',
								hidden : true
							}, {
								header : '部门ID ',
								dataIndex : 'depId',
								hidden : true
							}, {
								header : '部门名称',
								dataIndex : 'depName',
								renderer:function(value,metadata,record){
									var str='';
									var level=record.data.depLevel;
									if(level!=null&& !isNaN(level)){
										for(var i=2;i<=level;i++){
											str+='<img src="' + __ctxPath+ '/images/system/down.gif"/>';
										}
									}
									str+=value;
									return str;
								}
							}, {
								header : '用户ID',
								dataIndex : 'userId',
								hidden : true
							}, {
								header : '部门收文负责人',
								dataIndex : 'fullname',
								//editor : userEditor
								editor :userSelector
							}],
					defaults : {
						sortable : false,
						menuDisabled : false,
						width : 100
					}
				});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : [{
						iconCls : 'btn-save',
						text : '保存',
						xtype : 'button',
						handler : function() {
							var params = [];
							var grid=Ext.getCmp('ArchFlowConfGrid');
							var store=grid.getStore();
							for (i = 0, cnt = store.getCount(); i < cnt; i += 1) {
								var record = store.getAt(i);
								if (record.data.archRecId == ''
										|| record.data.archRecId == null) {// 设置未保存的assignId标记，方便服务端进行gson转化
									if(record.data.userId!=null&&record.data.userId!='')
									record.set('archRecId', -1);
								}
								if (record.dirty){ // 得到所有修改过的数据
									    params.push(record.data);
									}
							}
							//alert(Ext.encode(params));
							if (params.length == 0) {
								Ext.ux.Toast.msg('信息', '没有对数据进行任何更改');
								return;
							}
							Ext.Ajax.request({
										method : 'post',
										url : __ctxPath
												+ '/archive/saveArchRecUser.do',
										success : function(request) {
											Ext.ux.Toast
													.msg('操作信息', '成功设置部门收文负责人');
											store.reload();
											grid.getView().refresh();
										},
										failure : function(request) {
											Ext.MessageBox.show({
														title : '操作信息',
														msg : '信息保存出错，请联系管理员！',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
										},
										params : {
											data : Ext.encode(params)
										}
									});
						}
					}]
				});

		this.gridPanel = new Ext.grid.EditorGridPanel({
			id : 'ArchFlowConfGrid',
			title:'部门负责人配置',
			region : 'center',
			stripeRows : true,
			tbar : this.topbar,
			store : this.store,
			trackMouseOver : true,
			disableSelection : false,
			loadMask : true,
			autoHeight : true,
			cm : cm,
			viewConfig : {
				//forceFit : true,
				autoFill : true // 自动填充
				//forceFit : true
				// showPreview : false
			}
				
			});
		var grid = this.gridPanel;
		grid.on('cellclick', function(grid, rowIndex, columnIndex, e) {
					row = rowIndex;
					var depId=grid.getStore().getAt(row).get('depId');
					userSelector.getStore().load({
					    params : {depId:depId}
					  });
				});
	},// end of the initComponents()

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
	cancel : function(panel) {
		var tabs = Ext.getCmp('centerTabPanel');
		if (panel != null) {
			tabs.remove('ArchFlowConfView');
		}
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
	}// end of save
});
