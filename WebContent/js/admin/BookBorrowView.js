Ext.ns('BookBorrowView');
/**
 * 图书借阅列表
 */
var BookBorrowView = function() {
	return new Ext.Panel({
		id : 'BookBorrowView',
		title : '图书借阅列表',
		iconCls : 'menu-book-borrow',
		layout:'anchor',
		autoScroll : true,
		items : [new Ext.FormPanel({
			id : 'BookBorrowSearchForm',
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
						text : '借出图书名称'
					}, {
						xtype : 'textfield',
						name : 'Q_bookName_S_LK'
					}, {
						text : '借出图书的ISBN'
					}, {
						xtype : 'textfield',
						name : 'Q_borrowIsbn_S_LK'
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext
									.getCmp('BookBorrowSearchForm');
							var grid = Ext.getCmp('BookBorrowGrid');
							if (searchPanel.getForm().isValid()) {
								searchPanel.getForm().submit({
									waitMsg : '正在提交查询',
									url : __ctxPath
											+ '/admin/listBookBorRet.do',
									success : function(formPanel, action) {
										var result = Ext.util.JSON
												.decode(action.response.responseText);
										grid.getStore().loadData(result);
									}
								});
							}

						}
					},{
						xtype:'hidden',
						name:'Q_isReturn_SN_EQ',
						value:1//表示查询借阅中的图书
					}]
		}), this.setup()]
	});
};
/**
 * 建立视图
 */
BookBorrowView.prototype.setup = function() {
	return this.grid();
};
/**
 * 建立DataGrid
 */
BookBorrowView.prototype.grid = function() {
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
					header : 'recordId',
					dataIndex : 'recordId',
					hidden : true
				}, {
					header : '登记人',
					dataIndex : 'registerName'
				}, {
					header : '借阅人',
					dataIndex : 'fullname'
				}, {
					header : '借出图书名称',
					dataIndex : 'bookName'
				}, {
					header : '借出图书ISBN',
					dataIndex : 'borrowIsbn'
				}, {
					header : '借出时间',
					dataIndex : 'borrowTime'
				}, {
					header : '应还时间',
					dataIndex : 'returnTime',
					renderer:function(value){
					  return value.substring(0,10);
					}
				},{
					header : '归还状态',
					dataIndex : 'isReturn',//BookBorRet中isReturn的记录是0：已归还的;1:借阅中
					renderer:function(value){
						if(value==0) return '<span><font  color="#00EC00">已归还</font></span>';
						else if((value==1))  return '<span><font color="#FF0000">借阅中</font></span>';
					}			
				}, {
					header : '管理',
					dataIndex : 'recordId',
					sortable : false,
					width : 50,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.recordId;
						var str = '';
							str = '<button title="编辑" value=" " class="btn-edit" onclick="BookBorrowView.edit('
									+ editId + ')"></button>';
							str += '<button title="归还" value=" " class="menu-book-return" onclick="BookBorrowView.returnB('
									+ editId + ')"></button>';
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
					limit : 25
				}
			});
	var grid = new Ext.grid.GridPanel({
				id : 'BookBorrowGrid',
				tbar : this.topbar(),
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				autoHeight : true,
				cm : cm,
				sm : sm,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 25,
							store : store,
							displayInfo : true,
							displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
							emptyMsg : "当前没有记录"
						})
			});

	grid.addListener('rowdblclick', function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
								BookBorrowView.edit(rec.data.recordId);
						});
			});
	return grid;

};

/**
 * 初始化数据
 */
BookBorrowView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/admin/listBorrowBookBorRet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'recordId',
										type : 'int'
									}

									, {
										name : 'bookSnId',
										mapping : 'bookSn.bookSnId'
									}, 'borrowTime', 'returnTime',
									'lastReturnTime', 'borrowIsbn', 'bookName',
									'registerName', 'fullname','isReturn']
						}),
				remoteSort : true
			});
	store.setDefaultSort('returnTime', 'desc');
	return store;
};

/**
 * 建立操作的Toolbar
 */
BookBorrowView.prototype.topbar = function() {
	var toolbar = new Ext.Toolbar({
				id : 'BookBorrowFootBar',
				height : 30,
				bodyStyle : 'text-align:left',
				items : []
			});
		toolbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加借出记录 ',
					handler : function() {
						new BookBorrowForm();
					}
				}));
	return toolbar;
};

/**
 * 
 */
BookBorrowView.edit = function(id) {
	new BookBorrowForm(id);
	Ext.getCmp('BorrowFormButtonSel').hide();
	Ext.getCmp('BorrowFormButtonCle').hide();
}

BookBorrowView.returnB = function(id) {
	new BookReturnForm(id);
	Ext.getCmp('ReturnFormButtonSel').hide();
	Ext.getCmp('ReturnFormButtonCle').hide();
}
