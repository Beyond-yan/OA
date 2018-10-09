/**
 * @author 
 * @createtime 
 * @class FlowSnConfigForm
 * @extends Ext.Window
 * @description FlowSnConfig表单
 * @company 捷达世软件
 */
FlowSnConfigForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				FlowSnConfigForm.superclass.constructor.call(this, {
							id : 'FlowSnConfigFormWin',
							items : [this.formPanel,this.gridPanel],
							iconCls:'menu-flow',
							width : 630,
							height : 380,
							layout : 'border',
							maximizable : true,
							modal : true,
							title : '文件编号选择',
							buttonAlign : 'center',
							buttons : [{
											text : '保存',
											iconCls : 'btn-save',
											scope : this,
											handler : this.save
										},{
											text : '取消',
											iconCls : 'btn-cancel',
											scope : this,
											handler : this.cancel
										}
							         ]
				});
			},//end of the constructor
			//初始化组件
			initUIComponents : function() {
				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : 'id',
								dataIndex : 'id',
								hidden : true
							},{
								header : '编号名称',
								dataIndex : 'snName'
							}, {
								header : '编号序号',
								width: 40,
								dataIndex : 'snNumber'
							}, {
								header: '编号格式',
								dataIndex: 'snFormat'
							}]
				});

				var store = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : __ctxPath + '/snconfig/listFileSnConfig.do?flowId='+this.flowId
								}),
						reader : new Ext.data.JsonReader({
									root : 'result',
									totalProperty : 'totalCounts',
									id : 'id',
									fields : [{
										name : 'id',
										type : 'int'
											},'snName','snNumber','snFormat','snType','expirationDate','createUser','createDate','updateUser','updateDate']
								}),
						remoteSort : true
					});
			     store.setDefaultSort('id', 'asc');
			     store.load({
							params : {
								start : 0,
								limit : 10
							}
						});

				this.gridPanel = new Ext.grid.GridPanel({
							id : 'FlowSnConfigFormGrid',
							width : 400,
							height : 300,
							region : 'center',
							title : '编号列表',
							store : store,
							shim : true,
							trackMouseOver : true,
							disableSelection : false,
							loadMask : true,
							cm : cm,
							sm : sm,
							viewConfig : {
								forceFit : true,
								enableRowBody : false,
								showPreview : false
							},
							// paging bar on the bottom
							bbar : new Ext.PagingToolbar({
										pageSize :100,
										store : store,
										displayInfo : true,
										displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
										emptyMsg : "当前没有记录"
									})
						});

				
				// --------------------------------end grid
				// panel-------------------------------------

				this.formPanel = new Ext.FormPanel({
					width : 400,
					region : 'north',
					id : 'FlowSnConfigFormSearchForm',
					height : 40,
					frame : false,
					border : false,
					layout : 'hbox',
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						xtype : 'label',
						margins : {
							top : 0,
							right : 4,
							bottom : 4,
							left : 4
						}
					},
					items : [{
								text : '请输入查询条件:'
							}, {
								text : '编号名称'
							}, {
								xtype : 'textfield',
								name : 'snName'
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext.getCmp('FlowSnConfigFormSearchForm');
									var grid = Ext.getCmp('FlowSnConfigFormGrid');
									if (searchPanel.getForm().isValid()) {
										$search( {
											searchPanel : searchPanel,
											gridPanel : grid
										});
									}
								}
						 },{
							 xtype:'hidden',
							 id:'FlowSnConfigFormSearchForm.flowId'
						 }]
				});
				if (this.flowId != null && this.flowId != 'undefined') {
					Ext.getCmp('FlowSnConfigFormSearchForm.flowId').setValue(this.flowId);
				}
				
			},//end of the initcomponents
			/**
			 * 取消
			 * @param {} window
			 */
			cancel : function() {
				this.close();
			},
			/**
			 * 保存记录
			 */
			save : function() {
				var gridPanel = Ext.getCmp('FlowSnConfigFormGrid');
				var selectRecords = gridPanel.getSelectionModel()
						.getSelections();
				if (selectRecords.length == 0) {
					Ext.MessageBox.show({
						title : '操作信息',
						msg : '请选择编号名称！',
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-help'
					});
					return;
				}
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.id);
				}
				Ext.Ajax.request({
					url : __ctxPath + '/snconfig/saveFlowSnConfig.do',
					params : {
						flowId:Ext.getCmp('FlowSnConfigFormSearchForm.flowId').getValue(),
						ids:ids
					},
					method : 'post',
					success : function() {
						Ext.Ajax.request({
							url : __ctxPath + '/snconfig/getCheckSignsFlowSnConfig.do',
							params : {
								flowId:Ext.getCmp('FlowSnConfigFormSearchForm.flowId').getValue()
							},
							method : 'post',
							success : function(res,opt) {
								var data = Ext.util.JSON.decode(res.responseText);
								var gridPanel = Ext.getCmp('FlowSnConfigGrid');
								gridPanel.getStore().loadData(data);
							}
						});
						Ext.getCmp('FlowSnConfigFormWin').close();
						Ext.ux.Toast.msg("信息提示", "成功设置流程编号！");
						
					}
				});
			}//end of save

		});