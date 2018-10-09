/**
 * @author:Ropen
 * @class DocDirectoryView
 * @extends Ext.Panel
 * @description 档案目录管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
Ext.ns('DocDirectoryView');
DocDirectoryView = Ext.extend(Ext.Panel, {
	searchPanel : null,
	gridPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		DocDirectoryView.superclass.constructor.call(this, {
					id : 'DocDirectoryView',
					iconCls : 'menu-record',
					title : '档案列表',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		var _url=__ctxPath + '/system/findBySchemaDepartment.do?depId=' + roleMap.get('DepartmentCommonId');
		/*if (isGranted('_DepQuery1')) {
			_url = __ctxPath + '/system/listDepartment.do?opt=department';
		}else{
			_url = __ctxPath + '/system/listByDepIdDepartment.do?depId='+curUserInfo.depId+'&opt=department';
		}*/
		var depSelector = new TreeSelector('depTreeSelectorView', _url, '所属部门',
				'Q_department.depId_L_EQ', true);
		
		var nowYear = parseInt(new Date().format('Y'));
		var startYear  = nowYear -13;
		var arr = [];
		for(var i = 0; i<=14; i++){
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			frame : true,
			items : [{
				layout : 'column',
				items : [{
							columnWidth : 0.24,
							layout : 'form',
							items : [{
										fieldLabel : '题名',
										name : 'Q_directoryName_S_LK',
										flex : 1,
										xtype : 'textfield',
										width : 130
									}]
						}, {
							columnWidth : 0.24,
							layout : 'form',
							items : [{
										fieldLabel : '保管期限',
										xtype : 'combo',
										hiddenName : 'Q_retentionYear_N_EQ',
										mode : 'local',
										editable : false,
										triggerAction : 'all',
										width : 130,
										store : [ [ '10', '10年' ],
										          [ '30', '30年' ],
										          [ '0', '永久' ],
										          [ '1', '待分类' ]],
										emptyText : '---请选择期限---'
									}]
						}, {
							columnWidth : 0.24,
							layout : 'form',
							items : [{
										fieldLabel : '年份',
										width : 130,
										hiddenName : 'Q_dirYear_N_EQ',
										xtype : 'combo',
										mode : 'local',
										editable : false,
										triggerAction : 'all',
										store : arr,
										emptyText : '---年份---'
									}]
						}, {
							columnWidth : 0.28,
							layout : 'form',
							items : [{
								xtype : 'hidden',
								id:'Q_department.depId_L_EQ',
								name : 'Q_department.depId_L_EQ'
							},depSelector]
						}, {
							columnWidth : 0.24,
							layout : 'form',
							items : [{
										fieldLabel : '文件总量',
										id : 'TT_totalBytes',
										name : 'TT_totalBytes',
										flex : 1,
										xtype : 'textfield',
										width : 130,
										readOnly : true
									}]
						}]
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
					}]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-add',
								text : '新建档案目录',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}, {
								iconCls : 'btn-del',
								text : '删除档案目录',
								xtype : 'button',
								scope : this,
								handler : this.removeSelRs
							}]
				});
		var store;
		if (isGranted('_DepQuery1')) {
			store = new Ext.data.JsonStore({
			url : __ctxPath + "/system/listDocDirectory.do",
			root : 'result',
			totalProperty : 'totalCounts',
			fields : [{
						name : 'id',
						type : 'int'
					}, 'directoryName', 'retentionYear', 'isSendDir','dirYear','department','startFileNo','endFileNo','fileAmount',
					 'createUser','createDate']
			});
		}else{
			store = new Ext.data.JsonStore({
				url : __ctxPath + '/system/listDocDirectory.do?Q_department.depId_L_EQ='+curUserInfo.depId,
				root : 'result',
				totalProperty : 'totalCounts',
				fields : [{
							name : 'id',
							type : 'int'
						}, 'directoryName', 'retentionYear', 'isSendDir','dirYear','department','startFileNo','endFileNo','fileAmount',
						 'createUser','createDate']
				});
		}
			store.setDefaultSort('createDate', 'desc');
			store.load();
			store.addListener('load', function(st, rds, opts) {
				//console.log(store.reader.jsonData);
				var totalBytes = store.reader.jsonData.totalBytes;
				Ext.getCmp('TT_totalBytes').setValue((totalBytes*1 / (1024 * 1024)).toFixed(2) + ' MB');
			});
		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'DocDirectoryGrid',
		    store:store,
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '题名',
						dataIndex : 'directoryName',
						width:150,
						renderer:function(value, metadata, record, rowIndex,
								colIndex){
							var docDirectoryId=record.data.id;
							var isSendDir=record.data.isSendDir;
							var depId=record.data.department.depId;
							var dirYear=record.data.dirYear;
							var str = '';
							str+='<a href="#"  onclick="DocDirectoryView.detail('
								+ docDirectoryId +','+isSendDir+','+depId+','+dirYear+')">'+value+'</a>';
							return str;
						}
					}, {
						header : '年份',
						dataIndex : 'dirYear',
						width:60
					}, {
						header : '保管期限',
						dataIndex : 'retentionYear',
						width:60,
						renderer : function(value) {
							if (value == '0') {
								return "<span>永久</span>";
							} else if(value == '1') {
								return "<span>待分类</span>";
							} else if(value == '30') {
								return "<span>30年</span>";
							}else{
								return "<span>10年</span>";
							}
						}

					},  {
						header : '作者',
						dataIndex : 'createUser',
						width:60
					}, {
						header : '所属部门',
						dataIndex : 'department',
						width:60,
						renderer:function(department){
							if(department!=null){
								return department.depName;
							}
						}
					}, {
						header : '件数',
						dataIndex : 'fileAmount',
						width:40
					}, {
						header : '起件号',
						dataIndex : 'startFileNo',
						width:40
					}, {
						header : '止件号',
						dataIndex : 'endFileNo',
						width:40
					}, new Ext.ux.grid.RowActions({
								header : '管理',
								width : 80,
								actions : [{
											iconCls : 'btn-del',
											text : '删除',
											style : 'margin:0 3px 0 3px'
										}, {
											iconCls : 'btn-edit',
											text : '编辑',
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
					new DocDirectoryForm({
								id : rec.data.id
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
		new DocDirectoryForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/system/multiDelDocDirectory.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/system/multiDelDocDirectory.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},
	// 编辑Rs
	editRs : function(record) {
		new DocDirectoryForm({
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
DocDirectoryView.detail= function(docDirectoryId,isSendDir,depId,dirYear) {
	new DocDirectoryDetailForm( {
		id:docDirectoryId,
		isSendDir:isSendDir,
		depId:depId,
		dirYear:dirYear
	}).show();
};
