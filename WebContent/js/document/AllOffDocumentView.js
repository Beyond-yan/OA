Ext.ns('AllOffDocumentView');
/**
 * 文档列表
 */
var AllOffDocumentView = function() {
	
};
/**
 * 显示列表
 * @return {}
 */
AllOffDocumentView.prototype.getView=function(){
	return new Ext.Panel({
		id : 'AllOffDocumentView',
		title : '所有文档',
		autoScroll : true,
		region:'center',
		layout:'anchor',
		items : [new Ext.FormPanel({
			height : 40,
			frame : false,
			border:false,
			id : 'AllOffDocumentSearchForm',
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
						text : '文档名称'
					}, {
						xtype : 'textfield',
						name : 'Q_docName_S_LK'
					}, {
						text : '创建时间 从'
					}, {
						xtype : 'datefield',
						format:'Y-m-d',
						name : 'Q_createtime_D_GE',
						editable: false
					},{
						text : '至'
					},{
						xtype : 'datefield',
						format:'Y-m-d',
						name : 'Q_createtime_DG_LE',
						editable: false
					},{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext.getCmp('AllOffDocumentSearchForm');
							var gridPanel = Ext.getCmp('AllOffDocumentGrid');
							if (searchPanel.getForm().isValid()) {
								$search({
									searchPanel :searchPanel,
									gridPanel : gridPanel
								});
							}

						}
					}
					, {
						xtype : 'button',
						text : '重置',
						iconCls : 'reset',
						handler : function() {
							var searchPanel = Ext
									.getCmp('AllOffDocumentSearchForm');
							searchPanel.getForm().reset();
						}
					}, {
								name : 'depId',
								value : curUserInfo.depId,
								xtype : 'hidden'}
					]
		}), this.setup()]
	});
};

AllOffDocumentView.prototype.setFolderId=function(folderId){
	this.folderId=folderId;
	AllOffDocumentView.folderId=folderId;
};

AllOffDocumentView.prototype.getFolderId=function(){
	return this.folderId;
};

/**
 * 建立视图
 */
AllOffDocumentView.prototype.setup = function() {
	return this.grid();
};
/**
 * 建立DataGrid
 */
AllOffDocumentView.prototype.grid = function() {
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
					header : 'docId',
					dataIndex : 'docId',
					hidden : true
				}, {
					header : '文档名称',
					dataIndex : 'docName',
					width:120
				}
				, {
				   header : '创建人',
					dataIndex : 'fullname',
					width:120
				}
				, {
					header : '创建时间',
					dataIndex : 'createtime'
				},/*{
					header : '附件',
					dataIndex : 'haveAttach',
					renderer:function(value,metadata,record){
						
						if(value=='' || value=='0'){
							return '无附件';
						}else{
							var attachFiles=record.data.attachFiles;
							var str='';
							for(var i=0;i<attachFiles.length;i++){
								str+='<a href="#" onclick="FileAttachDetail.show('+attachFiles[i].fileId+');" class="attachment">'+attachFiles[i].fileName+'</a>';
								str+='&nbsp;';
							}
							
							return str;
						}
					}
				},*/ {
					header : '管理',
					dataIndex : 'docId',
					width : 100,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var attachFiles=record.data.attachFiles;
						var editId = record.data.docId;
						var str = '删除<button title="删除" value=" " class="btn-del" onclick="AllOffDocumentView.remove('
								+ editId + ')">&nbsp;</button>';	
						for(var i=0;i<attachFiles.length;i++){
								str+='<a href="#" onclick="FileAttachDetail.show('+attachFiles[i].fileId+');" class="attachment">'+'下载'+/*attachFiles[i].fileName+*/'</a>';
								str+='&nbsp;';
							}
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
					limit : 25,
					depId:curUserInfo.depId
				}
			});
	var grid = new Ext.grid.GridPanel({
				id : 'AllOffDocumentGrid',
				tbar : this.topbar(this),
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				autoHeight:true,
				maxHeight:600,
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
							AllOffDocumentView.edit(rec.data.docId);
						});
			});
	return grid;

};

/**
 * 初始化数据
 */
AllOffDocumentView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/document/listOffDocument.do?depId='+curUserInfo.depId
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'docId',
										type : 'int'
									},'docName','createtime','haveAttach','attachFiles','fullname'
									]
						}),
				remoteSort : true
			});
	store.setDefaultSort('docId', 'desc');
	return store;
};

/**
 * 建立操作的Toolbar
 */
AllOffDocumentView.prototype.topbar = function(docViewObj) {
	var toolbar = new Ext.Toolbar({
				id : 'AllOffDocumentFootBar',
				height : 30,
				bodyStyle : 'text-align:left',
				items : [{
							iconCls : 'btn-add',
							text : '添加文档',
							xtype : 'button',
							handler : function() {
								    new OffDocumentForm(null);
							}
						}, {
							iconCls : 'btn-del',
							text : '删除文档',
							xtype : 'button',
							handler : function() {

								var grid = Ext.getCmp("AllOffDocumentGrid");

								var selectRecords = grid.getSelectionModel().getSelections();

								if (selectRecords.length == 0) {
									Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
									return;
								}
								var ids = Array();
								for (var i = 0; i < selectRecords.length; i++) {
									ids.push(selectRecords[i].data.docId);
								}

								AllOffDocumentView.remove(ids);
							}
						}]
			});
	return toolbar;
};

/**
 * 删除单个记录
 */
AllOffDocumentView.remove = function(id) {
	var grid = Ext.getCmp("AllOffDocumentGrid");
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
													limit : 25,
					                                depId:curUserInfo.depId
												}
											});
								}
							});
				}
			});
};

/**
 * 
 */
AllOffDocumentView.edit = function(id) {
	new OffDocumentForm(id);
};
/**
 * 文档共享
 * @param {} id
 */
AllOffDocumentView.shared=function(id){
	var form = new DocumentSharedForm(id).getView();
	form.on('close',function(){
		Ext.getCmp("AllOffDocumentGrid").getStore().reload();
	});
	form.show();
};
