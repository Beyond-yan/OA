Ext.ns('PublicDocumentView');

var PublicDocumentView = function() {

};

PublicDocumentView.prototype.getView = function() {
	return new Ext.Panel({
		id : 'PublicDocumentView',
		layout:'anchor',
		title : '公共文档列表',
		autoScroll : true,
		region : 'center',
		anchor : '100%',
		items : [new Ext.FormPanel({
			id : 'PublicDocumentSearchForm',
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
						text : '文档名称'
					}, {
						xtype : 'textfield',
						name : 'document.docName',
						width : 90
					}, {
						text : '创建时间 从'
					}, {
						xtype : 'datefield',
						format : 'Y-m-d',
						editable:false,
						name : 'from'
					}, {
						text : '至'
					}, {
						xtype : 'datefield',
						format : 'Y-m-d',
						editable:false,
						name : 'to'
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'btn-search',
						handler : function() {
							var searchPanel = Ext
									.getCmp('PublicDocumentSearchForm');
							var gridPanel = Ext.getCmp('PublicDocumentGrid');
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
									.getCmp('PublicDocumentSearchForm');
							searchPanel.getForm().reset();
						}
					}
			]
		}), this.setup()]
	});
}

PublicDocumentView.prototype.setFolderId = function(folderId) {
	this.folderId = folderId;
	PublicDocumentView.folderId = folderId;
};

PublicDocumentView.prototype.getFolderId = function() {
	return this.folderId;
};

PublicDocumentView.prototype.setup = function() {
	return this.grid();
}

PublicDocumentView.prototype.grid = function() {

	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
					header : 'docId',
					dataIndex : 'docId',
					hidden : true
				}, {
					header : '文档名称',
					dataIndex : 'docName',
					width : 120
				}, {
					header : '创建 人',
					dataIndex : 'fullname',
					width : 120
				}, {
					header : '创建时间',
					dataIndex : 'createtime'
				}, {
					header : '文件夹',
					dataIndex : 'forlderName'
				}, {
					header : '附件',
					dataIndex : 'haveAttach',
					renderer : function(value, metadata, record) {
						if (value == '' || value == '0') {
							return '无附件';
						} else {
							var attachFiles = record.data.attachFiles;
							var str = '';

							for (var i = 0; i < attachFiles.length; i++) {
								str += '<a href="#" onclick="FileAttachDetail.show('
										+ attachFiles[i].fileId
										+ ');" class="attachment">'
										+ attachFiles[i].fileName + '</a>';
								str += '&nbsp;';
							}

							return str;
						}
					}
				}, {
					header : '管理',
					dataIndex : 'docId',
					width : 50,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.docId;
						var str = '<button title="查看" value="" class="btn-readdocument" onclick="PublicDocumentView.detail('
								+ editId + ')">&nbsp;</button>';
						if (isGranted('__ALL')) {
							str += '<button title="删除" value="" class="btn-del" onclick="PublicDocumentView.remove('
									+ editId + ')">&nbsp;</button>';
						}
						return str;

					}
				}],
		defaults : {
			// sortable : true,
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
	this.toolbar = new Ext.Toolbar({
		height : 30,
		items : []
	});
	if (isGranted('__ALL')) {
		this.toolbar.add(new Ext.Button({
			text : '删除',
			iconCls : 'btn-del',
			handler : function() {
				var grid = Ext.getCmp("PublicDocumentGrid");
				var selectRecords = grid.getSelectionModel()
						.getSelections();
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.docId);
				}
				PublicDocumentView.remove(ids);
			}
		}));
	}
	var grid = new Ext.grid.GridPanel({
				id : 'PublicDocumentGrid',
				tbar : this.toolbar,
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				autoHeight : true,
				maxHeight : 600,
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
							PublicDocumentView.detail(rec.data.docId);
						});
			});
	
	
	return grid;
}

PublicDocumentView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/document/publicListDocument.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'docId',
										type : 'int'
									}, {
										name : 'forlderName',
										mapping : 'docFolder.folderName'
									},'fullname', 'docName', 'content', 'createtime',
									'haveAttach', 'attachFiles', 'isShared']
						}),
				remoteSort : true
			});
	// store.setDefaultSort('docId', 'desc');
	return store;
};

PublicDocumentView.remove = function(id) {
	var grid = Ext.getCmp("PublicDocumentGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath
										+ '/document/multiDelDocument.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 25
												}
											});
								}
							});
				}
			});
};

PublicDocumentView.detail = function(id) {
	Ext.Ajax.request({
		url : __ctxPath + '/document/rightDocument.do',
		params : {
			docId : id
		},
		method : 'POST',
		success : function(response, options) {
			var result = Ext.util.JSON.decode(response.responseText);
			var rightM = result.rightM;
			var rightD = result.rightD;
			var docName = result.docName;
			if (id != null) {
				// new PublicDocumentDetailWin(id,docName);
				var tabs = Ext.getCmp('centerTabPanel');
				var panel = Ext.getCmp('PulicDocumentDetail');
				if (panel == null) {
					panel = new PublicDocumentDetail({docId:id, docName:docName});
					tabs.add(panel);
					tabs.activate(panel);
				} else {
					tabs.remove('PulicDocumentDetail');
					panel = new PublicDocumentDetail({docId:id, docName:docName});
					tabs.add(panel);
					tabs.activate(panel);
				}

			}
		},
		failure : function(response, options) {
		},
		scope : this
	});
}
