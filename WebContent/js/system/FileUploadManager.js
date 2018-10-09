/**
 * @description 文件分类上传管理
 * @author YHZ
 * @company www.jee-soft.cn
 * @datetime 2010-11-15 AM
 */
FileUploadManager = Ext.extend(Ext.Window, {
	//显示图片的panel
	imagePanel : null,
	imageStore : null,
	dataView : null,
	tpl : null,
	
	// panel
	panel : null,
	store : null,
	treePanel : null,
	gridPanel : null,
	tabPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this,_cfg);
		this.initUIComponent();
		FileUploadManager.superclass.constructor.call(this, {
					id : 'fileUploadManager',
					layout : 'fit',
					title : '附件分类管理',
					iconCls : 'menu-file',
					width : 680,
					height : 396,
					maximizable : true,
					border : false,
					modal : true,
					plain : true,
					items : this.tabPanel,
					buttonAlign : 'center',
					buttons : [{
								text : '确定',
								iconCls : 'btn-ok',
								scope : this,
								handler : this.upLoad
							}, {
								text : '取消',
								iconCls : 'btn-cancel',
								scope : this,
								handler : this.close
							}]
				});// end of this constructor
	},// 初始化组件

	initUIComponent : function() {
		// ##treePanel##//
		this.treePanel = new Ext.tree.TreePanel({
			region : 'west',
			id : 'fileUploadManagerFilesTreePanel',
			title : '附件分类',
			collapsible : true,
			autoScroll : true,
			split : true,
			width : 150,
			tbar : new Ext.Toolbar({
						items : [{
							xtype : 'button',
							iconCls : 'btn-refresh',
							text : '刷新',
							handler : function() {
								Ext.getCmp('fileUploadManagerFilesTreePanel').root.reload();
							}
						}, {
							xtype : 'button',
							text : '展开',
							iconCls : 'btn-expand',
							handler : function() {
								Ext.getCmp('fileUploadManagerFilesTreePanel').expandAll();
							}
						}, {
							xtype : 'button',
							text : '收起',
							iconCls : 'btn-collapse',
							handler : function() {
								Ext.getCmp('fileUploadManagerFilesTreePanel').collapseAll();
							}
						}]
					}),
			loader : new Ext.tree.TreeLoader({
						url : __ctxPath + '/system/loadTreeFileAttach.do'
					}),
			root : new Ext.tree.AsyncTreeNode({
						expanded : true
					}),
			rootVisible : false,
			listeners : {
				'click' : function(node){
					if (node != null) {
						var text = '';
						switch (node.getDepth()) {
							case 2 :
								text = node.parentNode.text + '/' + node.text;
								break;
							case 3 :
								text = node.parentNode.parentNode.text + '/'
										+ node.parentNode.text + '/'
										+ node.text;
								break;
							default :
								text = node.text;
								break;
						}
						text = node.isLeaf() ? text + '%' : text;
						var store = Ext.getCmp('fileUploadManager').gridPanel.getStore();
						store.url = __ctxPath + '/system/listFileAttach.do';
						store.baseParams = {
							Q_fileType_S_LK : text
						};
						store.reload({
							params : {
								start : 0,
								limit : 10
							}
						});
					}
				}
			}
		});
		this.imageTreePanel = new Ext.tree.TreePanel({
			region : 'west',
			id : 'fileUploadManagerimageTypeTreePanel',
			title : '图片分类',
			collapsible : true,
			autoScroll : true,
			split : true,
			width : 150,
			tbar : new Ext.Toolbar({
			items : [{
				xtype : 'button',
				iconCls : 'btn-refresh',
				text : '刷新',
				handler : function() {
					Ext.getCmp('fileUploadManagerimageTypeTreePanel').root.reload();
				}
			}, {
				xtype : 'button',
				text : '展开',
				iconCls : 'btn-expand',
				handler : function() {
					Ext.getCmp('fileUploadManagerimageTypeTreePanel').expandAll();
				}
			}, {
				xtype : 'button',
				text : '收起',
				iconCls : 'btn-collapse',
				handler : function() {
					Ext.getCmp('fileUploadManagerimageTypeTreePanel').collapseAll();
				}
			}]
		}),
		loader : new Ext.tree.TreeLoader({
					url : __ctxPath + '/system/loadTreeFileAttach.do'
				}),
		root : new Ext.tree.AsyncTreeNode({
					expanded : true
				}),
		rootVisible : false,
		listeners : {
			'click' : function(node){
				if (node != null) {
					var text = '';
					switch (node.getDepth()) {
						case 2 :
							text = node.parentNode.text + '/' + node.text;
							break;
						case 3 :
							text = node.parentNode.parentNode.text + '/'
									+ node.parentNode.text + '/'
									+ node.text;
							break;
						default :
							text = node.text;
							break;
					}
					text = node.isLeaf() ? text + '%' : text;
					var store = Ext.getCmp('fileUploadManager').dataView.getStore();
					store.url = __ctxPath + '/system/listFileAttach.do';
					store.baseParams = {
						Q_fileType_S_LK : text
					};
					store.reload({
						params : {
							start : 0,
							limit : 6
						}
					});
				}
			}
		}
	});
		
		//##end of this tree##//
		
		
		// ##gridPanel##//
		var topbar = new Ext.Toolbar({
					id : 'fileUploadManagerTopbar',
					height : 30,
					menuAlign : 'center',
					defaultType : 'button',
					items : [{
								text : '上传',
								iconCls : 'btn-upload',
								handler : this.upLoadFile
							}]
				}); // end of this topbar

		// 创建store
		this.store = new Ext.data.JsonStore({
			url : __ctxPath + '/system/listFileAttach.do?type=file',
			root : 'result',
			totalProperty : 'totalCounts',
			id : 'id',
			fields : [{
						name : 'fileId',
						type : 'int'
					}, {name:'filename',mapping:'fileName'}, 'ext', 'note',
					'fileType','filePath','createtime','totalBytes'],
			remoteSort : false
		});
		this.store.load({
			params : {
				start : 0,
				limit : 10
			}
		});
		var rowActions = new Ext.ux.grid.RowActions({
			header : '管理',
			width : 80,
			actions : [ {
					iconCls : 'btn-showDetail',
					qtip : '查看',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-downLoad',
					qtip : '下载',
					style : 'margin:0 3px 0 3px'
				}
			]
		});
		// 多选
		var sm = new Ext.grid.CheckboxSelectionModel();
		// 列模型
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'fileId',
						dataIndex : 'fileId',
						hidden : true
					}, {
						header : '附件名称',
						dataIndex : 'filename'
					}, {
						header : '上传时间',
						dataIndex : 'createtime',
						format : 'y-m-d'
					}, {
						header : '大小',
						dataIndex : 'note'
					}, rowActions],
			defaults : {
				sortable : true,
				menuDisabled : true
			}
		});// end of this cm

		// ##gridPanel##//
		this.gridPanel = new Ext.grid.GridPanel({
			id : 'fileUploadManagerGridPanel',
			layout : 'form',
			region : 'center',
			tbar : topbar,
			loadMask : true,
			height : 300,
			store : this.store,
			plugins : rowActions,
			cm : cm,
			sm : sm,
			viewConfig : {
				forceFit : true,
				autoFill : true
			},
			bbar : new Ext.PagingToolbar({
				pageSize : 10,
				store : this.store,
				displayInfo : true,
				displayMsg : '当前显示从{0}至{1}，共有{2}条记录',
				emptyMsg : '对不起，当前没有数据！'
			})
		}); // end of this gridPanel

		this.gridPanel.addListener('rowdblclick', function(grid, rowIndex, e) {
			grid.getSelectionModel().each(function(rec) {
				FileAttachDetail.show(rec.data.fileId);
			});
		});
		rowActions.on('action', this.onRowAction, this);

		// ##panel##//
		this.panel = new Ext.Panel({
			height : 300,
			id : 'fileUploadManagerPanel',
			iconCls : 'menu-find-doc',
			layout : 'border',
			region : 'center',
			items : [this.treePanel, this.gridPanel]
		});
		
		
		//##显示图片的imagePanel中相关组件##//
		this.imageStore = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url :  __ctxPath + '/system/listFileAttach.do?type=image'
			}),
			reader : new Ext.data.JsonReader({
			  	root : 'result',
			  	totalProperty : 'totalCounts',
				id : 'id',
			    fields: [
			    	{name : 'fileId',type:'int'}, {name:'filename',mapping:'fileName'}, 'filePath'
			    ]
		    }),
		    remoteSort : true
		});
		this.imageStore.setDefaultSort('createtime','DESC');
		this.imageStore.load({
			params : {
				start : 0,
				limit : 8
			}
		});
	
		this.tpl = new Ext.XTemplate(
			'<tpl for=".">',
				'<div style="width:105px; height : 105px;" class="thumb-wrap" id="{fileId}">',
				'<img align="middle" src="'+__ctxPath+'/attachFiles/{filePath}" style="width:90px;height:90px;margin-left:7px;" title="{fileName}"/>',
				'<center><span style="margin-top:3px;">{filename}</span><center>',
				'</div>', 
			'</tpl>'
		),
		
		this.dataView = new Ext.DataView({
			store : this.imageStore,
			tpl : this.tpl,
			height : 240,
			multiSelect : true,
			overClass : 'x-view-over',
			itemSelector : 'div.thumb-wrap',
			bodyStyle:'padding:4px',
			emptyText : '目前尚无记录',
			listeners : {
				'dblclick' : {
					fn : this.imageDbClick.createCallback(this),
					scope : this
				}
			}
		});  
		
		/**
		 * imagePanel
		 */
		this.imagePanel = new Ext.Panel({
		    id : 'fileUploadManageImagePanel',
		  	height : 300,
		  	width : '100%',
			layout : 'border',
			region : 'center',
		    items : [this.imageTreePanel,{
		    	height : 310,
		    	region : 'center',
				layout : 'fit',
				tbar : [{
						text : '上传',
						iconCls : 'btn-upload',
						handler : this.upLoadImage
					}],
				autoHeight : true,
				items : this.dataView,
				bbar : new Ext.PagingToolbar({
					pageSize : 8,
					store : this.imageStore,
					displayInfo : true,
					displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
					emptyMsg : "当前没有记录"
				})
		    }]
		});
		//##end of this imagePanel##//
		
		// ##tabPanel##//
		var type = this.permitted_extensions;
		if(type=='bmp' || type=='jpg' || type=='tiff' || type=='gif'){ //上传image图片
			this.tabPanel = new Ext.TabPanel({
			id : 'fileUploadMangerTabPanel',
			activeTab : 0,
			items : [{
						title : '上传图片',
						items : [this.imagePanel]
					}]
			});
		}else{ //上传非图片的文件
			this.tabPanel = new Ext.TabPanel({
			id : 'fileUploadMangerTabPanel',
			activeTab : 0,
			items : [{
						title : '上传附件',
						items : [this.panel]
					}]
			});
		}	
		//##end of this tabPanel##//
		
	}, // end of this initUIComponent

	onRowAction : function(gridPanel, record, action, row, col) {
		switch (action) {
			case 'btn-showDetail' :
				this.showdetail(record.data.fileId);
				break;
			case 'btn-downLoad' :
				this.downLoad(record.data.fileId);
				break;
		}
	},

	/**
	 * 查看详细信息
	 */
	showdetail : function(fileId) {
		FileAttachDetail.show(fileId);
	},

	/**
	 * 下载
	 */
	downLoad : function(fileId) {
		window.open(__ctxPath + "/file-downLoad?fileId="+fileId);
	},

	/**
	 * 文件上传
	 */
	upLoadFile : function() {
		var dialog = App.createUploadDialog2( {
			file_cat : this.file_cat,
			url : this.url,
			callback : function(obj) {
				if(obj!=null){
					var gridPanel = Ext.getCmp('fileUploadManagerGridPanel');
					gridPanel.getStore().baseParams = {
						Q_fileType_S_LK : this.file_cat
					};
					gridPanel.getStore().reload({
						params : {
							start : 0,
							limit : 10
						}
					});
				}
			}
		});
		dialog.show('file');
	},
	
	/**
	 * 上传图片刷新
	 */
	upLoadImage : function(){
		var dialog = App.createUploadDialog2({
			file_cat : this.file_cat,
			callback : function(obj){
				if(obj != null){
					var store = Ext.getCmp('fileUploadManager').dataView.getStore();
					store.url = __ctxPath + '/system/listFileAttach.do?type=image';
					store.baseParams = {
						Q_fileType_S_LK : this.file_cat
					};
					store.reload({
						params : {
							start : 0,
							limit : 8
						}
					});
				}
			}
		});
		dialog.show('image');
	},

	/**
	 * 确定上传文件
	 */
	upLoad : function() {
		var tab = Ext.getCmp('fileUploadMangerTabPanel');
		var gridPanel = Ext.getCmp('fileUploadManagerGridPanel');
		var records = gridPanel.getSelectionModel().getSelections();
		
		var type = this.permitted_extensions;
		if(type=='bmp' || type=='jpg' || type=='tiff' || type=='gif'){ //上传image图片
			records = Ext.getCmp('fileUploadManager').dataView.getSelectedRecords();
		}
		
		var arr = new Array();
		for(var i = 0 ; i < records.length ; i++){
			arr.push(records[i].data);
		}
		if (this.callback != null)
			this.callback.call(this, arr);
		Ext.getCmp('fileUploadManager').close();
	},
	
	/**
	 * Image图片双击事件，显示图片信息
	 */
	imageDbClick : function(self){
		var nodes = self.dataView.getSelectedNodes();
		if(nodes != '' && nodes != null && nodes != 'undefined'){
			FileUploadImageDetailForm.show(nodes[0].id);
		}
	}
});
