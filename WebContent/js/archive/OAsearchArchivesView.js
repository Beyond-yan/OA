Ext.ns('OAsearchArchivesView');

/**
 * @author: sicen.liu
 * @class OAsearchArchivesView
 * @extends Ext.Panel
 * @description 办公小助手
 */
OAsearchArchivesView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel : null,
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
		OAsearchArchivesView.superclass.constructor.call(this, {
					id : 'OAsearchArchivesView',
					iconCls : 'menu-archive-issue-manage',
					title : '办公小助手',
					region : 'center',
					layout : 'form',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 45,
			frame : false,
			id : 'OAsearchArchivesSearchForm',
			border : false,
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				margins : '4 4 4 4'
			},
			items : [{
						xtype : 'label',
						text : '请输入搜索条件:'
					}, {
						xtype : 'textfield',
						name : 'searchText',
						width:530
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						scope : this,
						handler : function() {
							var gridPanel = Ext.getCmp('OAsearchArchivesGrid');
							var formPanel=Ext.getCmp('OAsearchArchivesSearchForm');
							if (formPanel.getForm().isValid()) {
								$search({
									searchPanel :formPanel,
									gridPanel : gridPanel
								});
							}

						}
					},{
						xtype:'button',
						text:'重置',
						iconCls:'btn-reseted',
						handler:function(){
						var searchPanel = Ext.getCmp('OAsearchArchivesSearchForm');
							searchPanel.getForm().reset();
						}
					}]
		});

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
			url : __ctxPath + "/archive/oaMenuSearchListArchives.do",
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : [{
						name : 'archivesId',
						type : 'int'
					},  'subject','archChecker','isdraft','isreceive','archivesNo','issueDep','keywords','ccTo']
		});
		// 加载数据
//		this.store.load({
//					params : {
//						start : 0,
//						limit : 25
//					}
//				});

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
					}), {
						header : 'archivesId',
						dataIndex : 'archivesId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'subject',
						width : 400,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var datatype=record.data.keywords;
							var title=record.data.ccTo;
							if(datatype=="") datatype="0";
							metadata.attr = 'style="white-space:normal;"';
							var str = '<a href="#"  title=\''+title+'\' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="OAsearchArchivesView.detail('
								+ record.data.archivesId
								+ ','
								+ record.data.isreceive
								+ ','
								+ record.data.isdraft
								+ ','
								+ datatype
								+ ')">'
								+ value
								+ '</a>';
							return str;
						}
					}, {
						header : '发文单位',
						dataIndex : 'issueDep'
					}, {
						header : '公文编号',
						dataIndex : 'archivesNo',
						renderer : function(value) {
							 if(value=="0"){
							 	return "";
							 }else{
							 	return value;
							 }
						}
					}, {
						header : '发文时间',
						dataIndex : 'archChecker',
						renderer : function(value) {
							return value.substring(0, 10);
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'OAsearchArchivesGrid',
					region : 'center',
					stripeRows : true,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					enableHdMenu : false,
					loadMask : true,
					autoHeight:true,
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
				if(this.isDesk){
					if(this.searchText!=null&&this.searchText!=""){
						Ext.getCmp('OAsearchArchivesSearchForm').getCmpByName('searchText').setValue(this.searchText);
						this.searchPanel.getForm().submit({
							waitMsg : '正在提交查询',
							url : __ctxPath + '/archive/oaMenuSearchListArchives.do',
							success : function(formPanel, action) {
										var result = Ext.util.JSON.decode(action.response.responseText);
										Ext.getCmp('OAsearchArchivesGrid').getStore().baseParams={
											searchText:Ext.getCmp('OAsearchArchivesSearchForm').getCmpByName('searchText').getValue()
										};
										Ext.getCmp('OAsearchArchivesGrid').getStore().loadData(result);
								  }
						});
					}
				}

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
	}
});
OAsearchArchivesView.detail=function(editId, runId, defId,dataType) {
	if(dataType==""||dataType=="0"){
		new OAOfficeDetailView({
				archivesId : editId,
				runId : runId,
				defId : defId
			}).show();
	}else if(dataType=="1"){
		new JwSentArchivesDetailForm({
			id:editId
		}).show();
	}else if(dataType=="2"){
		new JwSentDocsDetailForm({
			id:editId
		}).show();
	}else if(dataType=="3"){
		new JwReciivedDocsDetailForm({
			id:editId
		}).show();
	}else if(dataType=="4"){
		new JwRecArchivesDetailForm({
			id:editId
		}).show();
	}
}