/**
 * @author:Ropen
 * @class ArchDispatchView
 * @extends Ext.Panel
 * @description [ArchDispatch]管理
 */
ArchUndertakeView=Ext.extend(Ext.Panel,{
	//条件搜索Panel
	searchPanel:null,
	//数据展示Panel
	gridPanel:null,
	//GridPanel的数据Store
	store:null,
	//头部工具栏
	topbar:null,
	//构造函数
	constructor:function(_cfg){
			Ext.applyIf(this,_cfg);
			//初始化组件
			this.initUIComponents();
			//调用父类构造
			ArchUndertakeView.superclass.constructor.call(this,{
				id:'ArchUndertakeView',
				title:'公文承办待办',
				region:'center',
				iconCls:'menu-arch-undertake',
				layout:'border',
				items:[this.searchPanel,this.gridPanel]
			});
	},//end of constructor

	//初始化组件
	initUIComponents:function(){
		//初始化搜索条件Panel
			this.searchPanel = new Ext.FormPanel({
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
					items : [{text:'公文标题'},{
									name : 'Q_subject_S_LK',
									anchor:'100%',
									xtype : 'textfield'
							}, {
									xtype : 'button',
									text : '查询',
									iconCls : 'search',
									handler : this.search.createCallback(this)
							}]
				});// end of the searchPanel
	
			
			this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/listArchDispatch.do",
					baseParams:{'Q_archUserType_SN_EQ':1},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'dispatchId',
								type : 'int'
							}, 'archivesId', 'dispatchTime', 'userId',
							'fullname', 'isRead', 'subject', 'readFeedback',
							'isUndertake','archives']
				});
		this.store.setDefaultSort('dispatchId', 'desc');
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
								iconCls : 'btn-readdocument',
								qtip : '查看',
								style : 'margin:0 3px 0 3px'
							}]
				});

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : 'dispatchId',
								dataIndex : 'dispatchId',
								hidden : true
							},{
							    header:'公文字号',
							    dataIndex : 'archives',
							    renderer:function(value){
							      if(value!=null){
							         return value.archivesNo;
							      }
							    }
							},{
								header : '公文标题',
								dataIndex : 'archives',
							    renderer:function(value){
							      if(value!=null){
							         return value.subject;
							      }
							    }
							}, {
								header : '发布时间',
								dataIndex : 'archives',
								renderer:function(value){
								   if(value!=null&&value!=''){
								      return value.issueDate.substring(0,10);
								   }
								}
							}, {
								header : '来文机关或部门',
								dataIndex : 'archives',
							    renderer:function(value){
							      if(value!=null){
							         return value.issueDep;
							      }
							    }
							}, this.rowActions],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchUndertakeGrid',
					region : 'center',
					stripeRows : true,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
					plugins : this.rowActions,
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
						// showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

//		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
//					grid.getSelectionModel().each(function(rec) {
//								new ArchDispatchForm(rec.data.dispatchId)
//										.show();
//							});
//				});
		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
				searchPanel :self.searchPanel,
				gridPanel : self.gridPanel
			});
		}
	},

	/**
	 * 编辑记录
	 * @param {} record
	 */
	editRecord:function(record){
		new ArchUndertakeForm({dispatchId:record.data.dispatchId}).show();
	},
	/**
	 * 管理列中的事件处理
	 * @param {} grid
	 * @param {} record
	 * @param {} action
	 * @param {} row
	 * @param {} col
	 */
	onRowAction:function(gridPanel, record, action, row, col) {
		switch(action) {
			case 'btn-readdocument':
				this.editRecord(record);
				break;
			default:
				break;
		}
	}
});
