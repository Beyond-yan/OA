/**
 * @author:Gaoyi Luo
 * @class ArchivesRecCtrlDetailView
 * @extends Ext.Panel
 * @description 收文详情管理
 */
ArchivesRecCtrlDetailView = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		ArchivesRecCtrlDetailView.superclass.constructor.call(this, {
					id : 'ArchivesRecCtrlDetailView' + this.runId,
					title : this.detailSubject + '(' + this.runId + ')',
					iconCls : 'menu-archive-draft',
					region : 'center',
					autoHeight:true,
					maximizable: true,
					minimizable: true,
					Height : 600,
					x: Ext.getBody().getWidth()*0.2,  
					y: Ext.getBody().getHeight()*0.3,  
					modal : true,
					width:900,
					layout : 'form',
					button:'button',
					pressed:true,
					items : [this.gridPanel],
					listeners: {
						minimize:function(window){
							window.hide();	
							window.minimizable=true;
						},
						close:function(window){
							if ("undefined" != typeof belowCenter ) {
								belowCenter.remove(Buttons.id);
								belowCenter.doLayout();
							}
						}		
			        },
				});
		var Buttons=Ext.getCmp('window'+this.runId);
		var title=this.detailSubject.substr(0, 2)+"..."+this.runId;
		if(Buttons==null){
			Buttons = WindowMin.getButton(this,this.editId,title);
			if ("undefined" != typeof belowCenter) {
				if(belowCenter.items.length >=20 ){
					belowCenter.remove(belowCenter.items.get(0));
				}
				belowCenter.add(Buttons);
				belowCenter.doLayout();
			}
		}else{
			Buttons.handler(Buttons);
		}
	},// end of constructor

	// [Archives]分类ID
	typeId : null,

	// 数据展示Panel
	gridPanel : null,

	// GridPanel的数据Store
	store : null,

	// 头部工具栏
	topbar : null,

	// 初始化组件
	initComponents : function() {
		var runid = this.runId;
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/flow/listDetailFlowTaskReport.do",
					baseParams : {
						'runId' : runid,
						'archiveType' : 1
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityname', 'status',
							'runSubject', 'preActivityname', 'preUserId', 'preUserName',
							'assignUserId', 'assignUserName', 'archiveId',
							'issuerId', 'issuer', 'archCreateTime', 'sendTime',
							'isReply', 'archivesNo', 'orgdepName', 'issuedep','curDepId','curDepName','flowName','dataValue','piid','creatorDepName','creatorDepId',
							'standardApprover', 'standardApproveDate']
				});
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
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
					}), {
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
//					}, {
//						header : '标题',
//						dataIndex : 'runSubject'
					}, {
						header : '步骤名称',
						dataIndex : 'activityname'
					}, {
						header : '办理人',
						dataIndex : 'assignUserName'
					}, {
						header : '当前办理部门',
						dataIndex : 'curDepName'
//					}, {
//						header : '登记人',
//						dataIndex : 'issuer'
//					}, {
//						header : '登记部门',
//						dataIndex : 'creatorDepName'
//					}, {
//						header : '登记时间',
//						dataIndex : 'archCreateTime'
					}, {
						header : '办理状态',
						dataIndex : 'status',
						width: 60,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							metadata.attr = 'style="white-space:normal;"'; 
							var str = '';
							if (value == 1) {
								str = '已办理';
							} else {
								str = '未办理';
							}
							return str;
						}
					}, {
						header : '办理时间',
						dataIndex : 'standardApproveDate'
					}, {
						header : '办理意见',
						dataIndex : 'standardApprover',
						width : 300
					}],
			defaults : {
				sortable : true,
				menuDisabled : false
			}
		});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesRecCtrlDetailGrid' + '(' + this.runId + ')',
					region : 'center',
					stripeRows : true,
					//tbar : this.topbar,
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

	},// end of the initComponents()
});