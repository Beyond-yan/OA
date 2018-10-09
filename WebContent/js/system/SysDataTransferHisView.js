/**
 * @author:
 * @class SysDataTransferHisView
 * @extends Ext.Panel
 * @description [SysDataTransferHis]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysDataTransferHisView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysDataTransferHisView.superclass.constructor.call(this, {
							id : 'SysDataTransferHisView',
							title : '单位公文发送历史',
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
							height : 40,
							frame : false,
							id:'SysDataTransferHisViewForm',
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
//								value : '',
								store : [['','全部'],['0', '未接受'],['1', '已接'],['2','拒绝']]
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
								var searchPanel = Ext.getCmp('SysDataTransferHisViewForm');
									searchPanel.getForm().reset();
								}
							}]
						});// end of searchPanel

				this.topbar = new Ext.Toolbar({
							items : [{
										iconCls : 'btn-add',
										hidden : true,
										text : '添加[SysDataTransferHis]',
										xtype : 'button',
										scope : this,
										handler : this.createRs
									}, {
										iconCls : 'btn-del',
										hidden : true,
										text : '删除[SysDataTransferHis]',
										xtype : 'button',
										scope : this,
										handler : this.removeSelRs
									}]
						});

				this.gridPanel = new HT.GridPanel({
					region : 'center',
					tbar : this.topbar,
					//使用RowActions
					rowActions : true,
					id : 'SysDataTransferHisGrid',
					url : __ctxPath + "/system/listSysDataTransferHis.do?queryType=send",
					fields : [{
								name : 'id',
								type : 'int'
							}, 'hisId', 'archivesId', 'archivesno', 'sendDep',
							'subject', 'archtype', 'issuerid', 'issuer',
							'privacylevel', 'urgentlevel', 'sources',
							'writtenDate', 'receiveDep', 'transferType',
							'fromSchema', 'toSchemaId', 'receiveDate',
							'receiveFlag', 'rejectMsg', 'createUser',
							'createDate', 'transactionId', 'receiveUser',
							'receiveUserName','updateUser','updateDate','receiveType'],
					columns : [{
								header : 'id',
								dataIndex : 'id',
								hidden : true
							},  {
								header : '标题',
								dataIndex : 'subject',
								width: 300,
								renderer : function(value, metadata, record, rowIndex,colIndex){
									var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="SysDataTransferHisView.detail('
											+record.data.id+')">'+value+'</a>';
									return str;
								}
							}, {
								header : '发送人',
								dataIndex : 'issuer'
							}, {
								header : '发送单位',
								dataIndex : 'sendDep'
							}, {
								header : '发送时间',
								width : 120,
								dataIndex : 'createDate'
							},  {
								header : '修改人',
								dataIndex : 'updateUser'
							}, {
								header : '修改时间',
								width : 120,
								dataIndex : 'updateDate'
							}, {
								header : '接收时间',
								width : 120,
								dataIndex : 'receiveDate'
							}, {
								header : '状态',
								dataIndex : 'receiveFlag',
								renderer : function(value){
									var str='';
									if(value==0){
										str="未接受";
									}else if(1 == value){
										str="接收";
									}else{
										str="拒绝";
									}
									return str;
								}
							}, {
								header : '拒绝原因',
								dataIndex : 'rejectMsg',
								renderer : function(value, metadata, record, rowIndex,colIndex){
									var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="SysDataTransferHisView.idear('
											+record.data.id+')">'+(value == null ? '' : value)+'</a>';
									return str;
								}
							},  new Ext.ux.grid.RowActions({
										header : '管理',
										hidden : true,
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
						//end of columns
				});

//				this.gridPanel.addListener('rowdblclick', this.rowClick);

			},// end of the initComponents()
			//重置查询表单
			reset : function() {
				this.searchPanel.getForm().reset();
			},
			//按条件搜索
			search : function(self) {
				$search({
							searchPanel : self.searchPanel,
							gridPanel : self.gridPanel
						});
			},
			//GridPanel行点击处理事件
			rowClick : function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
							new SysDataTransferHisForm({
										id : rec.data.id
									}).show();
						});
			},
			//创建记录
			createRs : function() {
				new SysDataTransferHisForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
							url : __ctxPath
									+ '/system/multiDelSysDataTransferHis.do',
							ids : id,
							grid : this.gridPanel
						});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
							url : __ctxPath
									+ '/system/multiDelSysDataTransferHis.do',
							grid : this.gridPanel,
							idName : 'id'
						});
			},
			//编辑Rs
			editRs : function(record) {
				new SysDataTransferHisForm({
							id : record.data.id
						}).show();
			},
			//行的Action
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
		/*查看反馈意见*/
SysDataTransferHisView.idear= function(id) {
	new FeedbackForm(id,2,true);
};
/*查看公文*/
SysDataTransferHisView.detail = function(archivesId) {
	new ToReceiveArchivesDetailView({
		archivesId : archivesId,
		archType:2,
		download :1
	}).show();
}