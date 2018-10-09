/**
 * @author:
 * @class InfoTypeView
 * @extends Ext.Panel
 * @description [InfoType]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
InfoTypeView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				InfoTypeView.superclass.constructor.call(this, {
							id : 'InfoTypeView',
							title : '信息分类',
							iconCls : 'menu-flowPr',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				// 初始化搜索条件Panel
				this.searchPanel =new Ext.FormPanel({
					height : 40,
					frame : false,
					region : 'north',
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
								text : '信息分类'
							}, {
								xtype : 'textfield',
								width : 220,
								name : 'Q_typeName_S_LK'
							}, {
								text : '添加人'
							}, {
								xtype : 'textfield',
								width : 220,
								name : 'Q_createUser_S_LK'
							},{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								scope : this,
								handler : this.search
							}, {
								xtype : 'button',
								text : '重置',
								scope : this,
								iconCls : 'reset',
								handler:this.reset
							}]
				});

				this.topbar = new Ext.Toolbar({
						items : [{
									iconCls : 'btn-add',
									text : '添加信息分类',
									xtype : 'button',
									scope : this,
									handler : this.createRs
								}, {
									iconCls : 'btn-del',
									text : '删除信息分类',
									xtype : 'button',
									scope:this,
									handler : this.removeSelRs
								}]
				});
				// 加载数据至store
				this.store = new Ext.data.JsonStore({
							url :  __ctxPath + "/info/listInfoType.do",
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [{
								name : 'typeid',
								type : 'int'
							},'typeName','createUser','createDate','updateDate','updateUser']
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
					width :80,
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
								header : 'typeid',
								width :10,
								dataIndex : 'typeid',
								hidden : true
							},{
								header : '信息分类',
								width :80,
								dataIndex : 'typeName'
							},{
								header : '添加人',
								dataIndex : 'createUser'
							},{
								header : '添加时间',
								dataIndex : 'createDate'
							},this.rowActions],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
				});
				this.gridPanel = new Ext.grid.GridPanel({
					id : 'InfoTypeGrid',
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
					new InfoTypeForm({typeid:rec.data.typeid}).show();
				});
			},
			//创建记录
			createRs : function() {
				new InfoTypeForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/info/multiDelInfoType.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/info/multiDelInfoType.do',
					grid:this.gridPanel,
					idName:'typeid'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new InfoTypeForm({
					typeid : record.data.typeid
				}).show();
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.typeid);
						break;
					case 'btn-edit' :
						this.editRs.call(this,record);
						break;
					default :
						break;
				}
			}
});
