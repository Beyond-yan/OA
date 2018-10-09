/**
 * @author:
 * @class FileSnConfigView
 * @extends Ext.Panel
 * @description [CqFileSnConfig]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
FileSnConfigView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				FileSnConfigView.superclass.constructor.call(this, {
							id : 'FileSnConfigView',
							title : '编号办法管理',
							iconCls:'menu-flowManager',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				// 初始化搜索条件Panel
				this.searchPanel = new Ext.FormPanel(
				{
					id : 'FileSnConfigSearchForm',
					height : 40,
					region : 'north',
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
								text : '编号名称'
							},{
								xtype : 'textfield',
								name : 'Q_snName_S_LK'
							},{
								text:'当前序号'
							},{
								name : 'Q_snNumber_L_EQ',
								xtype:'numberfield'
							},{
								text:'编号格式'
							},{
								name : 'Q_snFormat_S_LK',
								xtype : 'textfield'
							},{
								text:'编号类型'
							},{
								xtype: 'combo',
								hiddenName : 'Q_snType_L_EQ',
								mode : 'local',
								width:120,
								editable : false,
								triggerAction : 'all',
								store:[['0','发文'],['1','收文']]
							}
//							,{
//								text:'失效日期'
//							},{
//								name : 'Q_expirationDate_D_EQ',
//								xtype:'datefield',
//								width:120,
//								format:'Y-m-d'
//							}
							,{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('FileSnConfigSearchForm');
									var grid = Ext
											.getCmp('FileSnConfigGrid');
									if (searchPanel.getForm()
											.isValid()) {
										$search( {
											searchPanel : searchPanel,
											gridPanel : grid
										});
									}
								}
							},
							{
								xtype : 'button',
								text : '重置',
								iconCls : 'btn-reset',
								handler : function() {
								var searchPanel = Ext
								.getCmp('FileSnConfigSearchForm');
									searchPanel.getForm().reset();
								}
							} ]
				});// end of the searchPanel
				this.topbar = new Ext.Toolbar({
						items : [{
									iconCls : 'btn-add',
									text : '添加文件编号',
									xtype : 'button',
									scope : this,
									handler : this.createRs
								}, {
									iconCls : 'btn-del',
									text : '删除文件编号',
									xtype : 'button',
									scope:this,
									handler : this.removeSelRs
								}]
				});
				// 加载数据至store
				this.store = new Ext.data.JsonStore({
							url : __ctxPath + "/snconfig/signListFileSnConfig.do",
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [{
								name : 'id',
								type : 'int'
									},'snName','snNumber','snFormat','snType','expirationDate','createUser','createDate','updateUser','updateDate']
						});
				// 加载数据
				this.store.load({
							params : {
								start : 0,
								limit : 25
							}
						});
				this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 80,
					actions : [{
								iconCls : 'btn-del',
								text : '删除',
								qtip : '删除',
								style:'margin:0 3px 0 3px'
							},{
								iconCls : 'btn-edit',
								qtip : '编辑',
								text : '编辑',
								style:'margin:0 3px 0 3px'
							}]
					});
				// 初始化ColumnModel
				var record_start = 0;
				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer({
								  header : "序号",
								  width : 35,
								  renderer:function(value,metadata,record,rowIndex){
								   return record_start + 1 + rowIndex;
								  }
							}),{
								header : 'id',
								dataIndex : 'id',
								hidden : true
							},{
								header : '编号名称',
								dataIndex : 'snName'
							},{
								header : '当前序号',
								dataIndex : 'snNumber'
							},{
								header : '编号格式',
								width : 150,
								dataIndex : 'snFormat'
							},{
								header : '编号类型',
								dataIndex : 'snType',
								renderer : function(value) {
									var strValue = "发文";
									if (value == 1) {
										strValue ="收文";
									}  
									return strValue;
								}
							},{
								header : '失效日期',
								dataIndex : 'expirationDate'
							},this.rowActions],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
				});
				this.gridPanel = new Ext.grid.GridPanel({
					id : 'FileSnConfigGrid',
					region : 'center',
					stripeRows : true,
					tbar:this.topbar,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					plugins : this.rowActions,
					autoHeight : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录",
								doLoad : function(start){
							   		  record_start = start;
							          var o = {}, pn = this.getParams();
							          o[pn.start] = start;
							          o[pn.limit] = this.pageSize;
							          this.store.load({params:o});
								}
							})
				});
				
				this.gridPanel.addListener('rowdblclick',this.rowClick);
				this.rowActions.on('action',this.onRowAction, this);
					
			},// end of the initComponents()
			//重置查询表单
			reset : function(){
				this.searchPanel.getForm().reset();
			},
			//按条件搜索
			search : function() {
				$search({
					searchPanel:this.searchPanel,
					gridPanel:this.gridPanel
				});
			},
			//GridPanel行点击处理事件
			rowClick:function(grid,rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
					new FileSnConfigForm({id:rec.data.id}).show();
				});
			},
			//创建记录
			createRs : function() {
				new FileSnConfigForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/snconfig/multiDelFileSnConfig.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/snconfig/multiDelFileSnConfig.do',
					grid:this.gridPanel,
					idName:'id'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new FileSnConfigForm({
					id : record.data.id
				}).show();
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.id);
						break;
					case 'btn-edit' :
						this.editRs.call(this,record);
						break;
					default :
						break;
				}
			}
});
