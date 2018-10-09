/**
 * @author:
 * @class SysDataTransferView
 * @extends Ext.Panel
 * @description [SysDataTransfer]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysDataTransferView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysDataTransferView.superclass.constructor.call(this, {
							id : 'SysDataTransferView',
							title : '单位公文发送',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				// 初始化搜索条件Panel
				this.searchPanel = new HT.SearchPanel({
							layout : 'hbox',
							region : 'north',
//							colNums : 3,
							id:'SysDataTransferSearchForm',
							height : 40,
							frame : false,
							border : false,
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
								xtype : 'label',
								text : '请输入查询条件:'
							},{
								text : '标题',
								xtype:'label'
							},  {
								name : 'Q_subject_S_LK',
								xtype : 'textfield',
								anchor : '98%'
							}, {
								text : '状态'
							},{
								xtype : 'combo',
								hiddenName : 'Q_receiveFlag_L_EQ',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : [['','全部'],['0', '初始状态'],['1', '已接'],['2','拒绝']]
							},{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							},{
								xtype:'button',
								text:'重置',
								iconCls:'btn-reseted',
								handler:function(){
								var searchPanel = Ext.getCmp('SysDataTransferSearchForm');
									searchPanel.getForm().reset();
								}
							}/*,{
								xtype:'hidden',
								name:'Q_isdraft_L_EQ',
								value:1
							}*/]
							/*items : [{
										fieldLabel : '公文Id',
										name : 'Q_archivesId_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
										fieldLabel : '公文编号',
										name : 'Q_archivesno_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '发文单位',
										name : 'Q_sendDep_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '主题',
										name : 'Q_subject_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '公文类型',
										name : 'Q_archtype_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
										fieldLabel : '发文人',
										name : 'Q_issuerid_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
										fieldLabel : '发文人姓名',
										name : 'Q_issuer_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '密级',
										name : 'Q_privacylevel_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '缓急程度',
										name : 'Q_urgentlevel_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '文种',
										name : 'Q_sources_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '成文日期',
										name : 'Q_writtenDate_D_EQ',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									}, {
										fieldLabel : '收文单位编号',
										name : 'Q_receiveDep_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '交换类型',
										name : 'Q_transferType_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
										fieldLabel : '源Schema',
										name : 'Q_fromSchema_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
										fieldLabel : '交换schema',
										name : 'Q_toSchemaId_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
										fieldLabel : '接受时间',
										name : 'Q_receiveDate_D_EQ',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									}, {
										fieldLabel : '接受Flag',
										name : 'Q_receiveFlag_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
										fieldLabel : '据收原因',
										name : 'Q_rejectMsg_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '创建人',
										name : 'Q_createUser_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '创建时间',
										name : 'Q_createDate_D_EQ',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									}, {
										fieldLabel : 'transactionId',
										name : 'Q_transactionId_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '接受人账号',
										name : 'Q_receiveUser_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '接受人姓名',
										name : 'Q_receiveUserName_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}],
							buttons : [{
										text : '查询',
										scope : this,
										iconCls : 'btn-search',
										handler : this.search
									}, {
										text : '重置',
										scope : this,
										iconCls : 'btn-reset',
										handler : this.reset
									}]*/
						});// end of searchPanel

				this.topbar = new Ext.Toolbar({
							items : [{
										iconCls : 'btn-add',
										text : '添加[SysDataTransfer]',
										xtype : 'button',
										scope : this,
										handler : this.createRs
									}, {
										iconCls : 'btn-del',
										text : '删除[SysDataTransfer]',
										xtype : 'button',
										scope : this,
										handler : this.removeSelRs
									}]
						});

				this.gridPanel = new HT.GridPanel({
					region : 'center',
					tbar : this.topbar,
					// 使用RowActions
					rowActions : true,
					id : 'SysDataTransferGrid',
					url : __ctxPath + "/system/listSysDataTransfer.do",
					fields : [{
								name : 'id',
								type : 'int'
							}, 'archivesId', 'archivesno', 'sendDep',
							'subject', 'archtype', 'issuerid', 'issuer',
							'privacylevel', 'urgentlevel', 'sources',
							'writtenDate', 'receiveDep', 'transferType',
							'fromSchema', 'toSchemaId', 'receiveDate',
							'receiveFlag', 'rejectMsg', 'createUser',
							'createDate', 'transactionId', 'receiveUser',
							'receiveUserName'],
					columns : [{
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}/*, { 
								header : '公文ID',
								dataIndex : 'archivesId'
							}, {
								header : '公文编号',
								dataIndex : 'archivesno'
							}*/, {
								header : '发文单位编号',
								dataIndex : 'sendDep'
							}, {
								header : '主题',
								dataIndex : 'subject'
							}, {
								header : '公文类型',
								dataIndex : 'archtype'
							}/*, {
								header : '发文人',
								dataIndex : 'issuerid'
							}, {
								header : '发文人姓名',
								dataIndex : 'issuer'
							}, {
								header : '密级',
								dataIndex : 'privacylevel'
							}, {
								header : '缓急程度',
								dataIndex : 'urgentlevel'
							}, {
								header : '文种',
								dataIndex : 'sources'
							}*/, {
								header : '成文日期',
								dataIndex : 'writtenDate'
							}/*, {
								header : '收文单位编号',
								dataIndex : 'receiveDep'
							}*/, {
								header : '交换类型',
								dataIndex : 'transferType'
							}, {
								header : '源Schema',
								dataIndex : 'fromSchema'
							}, {
								header : '交换schema',
								dataIndex : 'toSchemaId'
							}, {
								header : '接受时间',
								dataIndex : 'receiveDate'
							}, {
								header : '接受Flag',
								dataIndex : 'receiveFlag'
							}, {
								header : '据收原因',
								dataIndex : 'rejectMsg'
							}, {
								header : '创建人',
								dataIndex : 'createUser'
							}, {
								header : '创建时间',
								dataIndex : 'createDate'
							}, {
								header : 'transactionId',
								dataIndex : 'transactionId'
							}, {
								header : '接受人账号',
								dataIndex : 'receiveUser'
							}, {
								header : '接受人姓名',
								dataIndex : 'receiveUserName'
							}, new Ext.ux.grid.RowActions({
										header : '管理',
										width : 100,
										actions : [{
													iconCls : 'btn-del',
													qtip : '删除',
													style : 'margin:0 3px 0 3px'
												}, {
													iconCls : 'btn-edit',
													qtip : '编辑',
													style : 'margin:0 3px 0 3px'
												}],
										listeners : {
											scope : this,
											'action' : this.onRowAction
										}
									})]
						// end of columns
				});

				this.gridPanel.addListener('rowdblclick', this.rowClick);

			},// end of the initComponents()
			// 重置查询表单
			reset : function() {
				this.searchPanel.getForm().reset();
			},
			// 按条件搜索
			search : function() {
				$search({
							searchPanel : this.searchPanel,
							gridPanel : this.gridPanel
						});
			},
			// GridPanel行点击处理事件
			rowClick : function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
							new SysDataTransferForm({
										id : rec.data.id
									}).show();
						});
			},
			// 创建记录
			createRs : function() {
				new SysDataTransferForm().show();
			},
			// 按ID删除记录
			removeRs : function(id) {
				$postDel({
							url : __ctxPath
									+ '/system/multiDelSysDataTransfer.do',
							ids : id,
							grid : this.gridPanel
						});
			},
			// 把选中ID删除
			removeSelRs : function() {
				$delGridRs({
							url : __ctxPath
									+ '/system/multiDelSysDataTransfer.do',
							grid : this.gridPanel,
							idName : 'id'
						});
			},
			// 编辑Rs
			editRs : function(record) {
				new SysDataTransferForm({
							id : record.data.id
						}).show();
			},
			// 行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this, record.data.id);
						break;
					case 'btn-edit' :
						this.editRs.call(this, record);
						break;
					default :
						break;
				}
			}
		});
