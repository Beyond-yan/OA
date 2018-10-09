Ext.ns('MySubUserDiaryView');
/**
 * TODO: add class/table comments列表
 */
var MySubUserDiaryView = function() {
	return new Ext.Panel({
		id : 'MySubUserDiaryView',
		title : '下属工作日志',
		iconCls : 'menu-subDiary',
		autoScroll : true,
		items : [new Ext.FormPanel({
			height : 40,
			frame : false,border:false,
			id : 'MySubUserDiarySearchForm',
			layout : 'hbox',
			layoutConfig: {
                padding:'5',
                align:'middle'
            },
			defaults : {
				xtype : 'label',
				margins:{top:0, right:4, bottom:4, left:4}
			},
			items : [{
						text : '请输入查询条件:'
					}, {
						text : '下属姓名'
					}, {
						hiddenName : 'userId',
						emptyText : '请选择',
						xtype : 'combo',
						mode : 'local',
						anchor : '98%',
						editable : false,
						valueField : 'id',
						displayField : 'name',
						triggerAction : 'all',
						store : new Ext.data.SimpleStore({
							        autoLoad:true,
									url : __ctxPath
											+ '/system/comboUserSub.do',
									fields : ['id', 'name']
								})
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext
									.getCmp('MySubUserDiarySearchForm');
							var gridPanel = Ext.getCmp('MySubUserDiaryGrid');
							if (searchPanel.getForm().isValid()) {
								$search({
									searchPanel :searchPanel,
									gridPanel : gridPanel
								});
							}

						}
					}, {
						xtype : 'button',
						text : '重置',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext
									.getCmp('MySubUserDiarySearchForm');
							searchPanel.getForm().reset();
						}
					}]
		}), this.setup()

		]
	});
};
/**
 * 建立视图
 */
MySubUserDiaryView.prototype.setup = function() {
	return this.grid();
};
function statusRender(value, metadata, record, rowIndex,colIndex) {
	 	  	var status =record.data.status;
	 	  	var str="";
	 	  	if(status == 0){
	 	  		str = '<span><font  color="FF0000">未审批</font></span>';
	 	  	}else {
	 	  		str = '<span><font  color="#00EC00">已审批</font></span>';
	 	  	}
			return str;
		}
/**
 * 建立DataGrid
 */
MySubUserDiaryView.prototype.grid = function() {
	var cm = new Ext.grid.ColumnModel({
		columns : [new Ext.grid.RowNumberer(), {
					header : 'diaryId',
					dataIndex : 'diaryId',
					hidden : true
				}, {
					header : '姓名',
					dataIndex : 'userName'
				}, {
					header : '日期',
					dataIndex : 'dayTime'
				},{
				    header:'审批状态',
				    dataIndex:'status',
				    renderer:statusRender
				}, {
					header : '管理',
					dataIndex : 'diaryId',
					width : 100,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.diaryId;
						
						var str = '<button title="审批" value=" " class="btn-edit" onclick="MySubUserDiaryView.comment('
							+ editId + ')">&nbsp</button>';
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
		}
	});

	var store = this.store();
	store.load({
				params : {
					start : 0,
					limit : 10
				}
			});
	var grid = new Ext.grid.GridPanel({
				id : 'MySubUserDiaryGrid',
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				autoHeight : true,
				cm : cm,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 10,
							store : store,
							displayInfo : true,
							displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
							emptyMsg : "当前没有记录"
						})
			});

	grid.addListener('rowdblclick', function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
							MySubUserDiaryView.check(rec.data.diaryId);
						});
			});
	return grid;

};

/**
 * 初始化数据
 */
MySubUserDiaryView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/system/subUserDiary.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'diaryId',
										type : 'int'
									}, 'dayTime', 'content', 'diaryType','status', {
										name : 'userName',
										mapping : 'appUser.fullname'
									}]
						}),
				remoteSort : true
			});
	store.setDefaultSort('diaryId', 'desc');
	return store;
};

/**
 * 
 */
MySubUserDiaryView.check = function(id) {
	new DiaryDetail(id);
}
MySubUserDiaryView.comment = function(id) {
	new DiaryComment({
		diaryId : id
	}).show();
}
