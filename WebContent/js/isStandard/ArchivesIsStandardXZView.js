ArchivesIsStandardXZView = Ext.extend(Ext.Panel, {
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
		ArchivesIsStandardXZView.superclass.constructor.call(this, {
					id : 'ArchivesIsStandardXZView',
					iconCls : 'menu-archive-search',
					title : '行政规范性文件库',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 88,
			region : 'north',
			id : 'isStandardXZSentStoreSearchForm',
			layout : 'form',
			bodyStyle : 'padding:5px',
			defaults : {
				border : false
			},
			items : [{
				layout : 'column',
				defaults : {
					border : false
				},
				items : [{
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										fieldLabel : '标题',
										id : 'isStandardXZsentStoredsubject',
										name : 'subject',
										xtype : 'textfield'
									}]
						}, {
							columnWidth : 0.24,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '年份',
								width : 130,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : arr,
								emptyText : '---年份---',
								listeners : {
									select : function() {
										Ext
												.getCmp('isStandardXZsentStoredStartDt')
												.setValue((this.getValue() + '-01-01'));
										Ext
												.getCmp('isStandardXZsentStoredendDate')
												.setValue(Ext.util.Format
														.substr(
																this.getValue(),
																0, 4)
														+ '-12-31');

									}
								}
							}, {
								name : 'startDate',
								xtype : 'hidden',
								id : 'isStandardXZsentStoredStartDt'
							}]
						}, /*
							 * { columnWidth : .25, layout : 'form', defaults : {
							 * border : false, anchor : '96%,96%' }, items : [{
							 * width : 60, editable : false, id :
							 * 'isStandardXZsentStoredStartDt', fieldLabel : '年份', name :
							 * 'startDate', xtype : 'datefield', format :
							 * 'Y-m-d' }] },
							 */{
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '90%,90%'
							},
							items : [{
										width : 60,
										id : 'isStandardXZsentStoredArchivesNo',
										fieldLabel : '发文编号',
										name : 'archiveNo',
										xtype : 'textfield'
									}]
						}, {
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								width : 60,
								id : 'isStandardXZsentStoredsnConfigId',
								fieldLabel : '编号办法',
								hiddenName : 'snConfigId',
								xtype : 'combo',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/snconfig/signComboFileSnConfig.do?snType=0',
									fields : ['id', 'name'],
									baseParams : {
										start : 0,
										limit : 10000
									}
								})
							}]
						}]
			}, {
				xtype : 'panel',
				border : false,
				layout : 'hbox',
				layoutConfig : {
					pack : 'center',
					align : 'middle'
				},
				items : [{
							xtype : 'button',
							text : '查询',
							iconCls : 'search',
							handler : this.search.createCallback(this)
						}, {
							xtype : 'button',
							text : '重置',
							style : 'padding-left:10px;',
							iconCls : 'reset',
							handler : function() {
								Ext.getCmp('isStandardXZSentStoreSearchForm').getForm()
										.reset();

							}
						}, {
							xtype : 'button',
							iconCls : 'excel-cls',
							style : 'padding-left:10px;',
							text : '导出Excel',
							handler : this.tableToExcel.createCallback(this)
						}]
			}, {
				xtype : 'hidden',
				name : 'archiveType',
				value : 0
			}, {
				xtype : 'hidden',
				name : 'endDate',
				id : 'isStandardXZsentStoredendDate'
			}, {
				xtype : 'hidden',
				name : 'isStandard',
				id : 'isStandardXZsentIsStandard',
				value : 1
			}, {
				xtype : 'hidden',
				name : 'keywords',
				id : 'isStandardXZsentKeywords',
				value : '10'
			}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/listIsStandardSentStoreJWArchives.do",
					baseParams : {
						archiveType : 0,
						isStandard : 1,
						keywords : '10'
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : ['archiveId', 'archivesNo', 'runSubject','standardApproveDate',
							'archCreateTime', 'signDate', 'defId', 'runId','standardApprover']
				});
		this.store.setDefaultSort('archiveId', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

		this.rowActions = new Ext.ux.grid.RowActions({
					header : '规范性确认',
					width : 80,
					actions : [{
								iconCls : 'btn-archives-detail',
								qtip : '是',
								text : '是',
								style : 'margin:0 3px 0 3px'
							},{
								iconCls : 'btn-flowView',
								qtip : '否',
								text : '否',
								style : 'margin:0 3px 0 3px'
							}]
				});

		// 初始化ColumnModel
		var record_start = 0;
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer({
								header : "序号",
								width : 35,
								renderer : function(value, metadata, record,
										rowIndex) {
									return record_start + 1 + rowIndex;
								}
							}), {
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'runSubject',
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesIsStandardXZView.detailT('
									+ record.data.archiveId
									+ ','
									+ record.data.runId
									+ ','
									+ record.data.defId
									+ ')">'
									+ value
									+ '</a>';
							return str;
						}
					}, {
						header : '发文编号',
						dataIndex : 'archivesNo'
					}, {
						header : '拟稿日期',
						dataIndex : 'archCreateTime'
					}, {
						header : '签发日期',
						dataIndex : 'signDate'
					}/*, {
						header : '是否确认',
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							if(record.data.standardApprover!=''){
							return '是';
							}else{
							return '否';
							}
						}
					}, {
						header : '确认人',
						dataIndex:'standardApprover'
					}, {
						header : '确认时间',
						dataIndex:'standardApproveDate'
					}, this.rowActions*/],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'isStandardXZArchivesGrid',
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
								emptyMsg : "当前没有记录",
								doLoad : function(start) {
									record_start = start;
									var o = {}, pn = this.getParams();
									o[pn.start] = start;
									o[pn.limit] = this.pageSize;
									this.store.load({
												params : o
											});
								}
							})
				});

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
							});
				});
		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {// alert(Ext.getCmp('sentStoredPrivacyLevel').getValue());
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
						searchPanel : self.searchPanel,
						gridPanel : self.gridPanel
					});
		}
	},

	// 把表格导出到Excel
	tableToExcel : function(self) {
		var recordCount = self.store.getCount();
		if (recordCount > 0) {

			/*
			 * Ext.getCmp('SentStoreSearchForm').getForm().submit({ url :
			 * __ctxPath+ '/flow/sentArchivesToExcelDownLoad.do', method :
			 * 'POST', success : function(fp, action) { alert(action);
			 * alert(fp); //window.location.href = action. }, failure :
			 * function(fp, action) { Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！'); } })
			 */

			var url = __ctxPath
					+ '/flow/sentIsStandardArchivesToExcelDownLoad.do?archiveType=0'
					+ '&archiveNo='
					+ Ext.getCmp('isStandardXZsentStoredArchivesNo').getValue()
					+ '&startDate='
					+ Ext.getCmp('isStandardXZsentStoredStartDt')
									.getValue()
					+ '&endDate='
					+Ext.getCmp('isStandardXZsentStoredendDate')
									.getValue() 
					+ '&subject='
					+ Ext.getCmp('isStandardXZsentStoredsubject').getValue()
//					+'&orgdepId='
//					+Ext.getCmp('orgdepId').getValue()
					+ '&snConfigId='
					+ Ext.getCmp('isStandardXZsentStoredsnConfigId').getValue()
//					+ '&issuerName='
//					+ Ext.getCmp('sentIssuerName').getValue()
					+'&isStandard='
					+Ext.getCmp('isStandardXZsentIsStandard').getValue()
					+'&keywords='
					+Ext.getCmp('isStandardXZsentKeywords').getValue();
			url = encodeURI(url);
			url = encodeURI(url);
			window.location.href = url;
		} else {
			Ext.Msg.alert("提示", "没有数据需要导出！")
		}
	},
	/**
	 * 管理列中的事件处理
	 * 
	 * @param {}
	 *            grid
	 * @param {}
	 *            record
	 * @param {}
	 *            action
	 * @param {}
	 *            row
	 * @param {}
	 *            col
	 */
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-archives-detail' :
				ArchivesIsStandardXZView.detail(record.data.archiveId);
				break;
			case 'btn-flowView' :
				ArchivesIsStandardXZView.toUnStandard(record.data.archiveId);
				break;
			default :
				break;
		}
	}
});
ArchivesIsStandardXZView.detail = function(editId) {
	var grid=Ext.getCmp('isStandardXZArchivesGrid');
	Ext.Msg.confirm('提示','确认该文件是规范性！',function(btn,text){
	 if(btn=='yes'){
	    Ext.Ajax.request({
	      url:__ctxPath +'/archive/isStandardArchives.do',
	      params : {
					"archivesId" : editId,
					"standardApproverId" : curUserInfo.userId,
					"standardApproveDate" : Ext.util.Format.date(new Date(),'Y-m-d H:i:s')
					},
	      method:'post',
	      success:function(){
	        Ext.ux.Toast.msg('信息提示','操作成功！');
	        grid.getStore().reload();
	      }
	    })
	 }
	});
},
ArchivesIsStandardXZView.toUnStandard=function(archivesId){

	var grid=Ext.getCmp('isStandardXZArchivesGrid');
	Ext.Msg.confirm('提示','确认该文件非规范性！',function(btn,text){
	 if(btn=='yes'){
	    Ext.Ajax.request({
	      url:__ctxPath +'/archive/isStandardArchives.do',
	      params : {
					"archivesId" : archivesId,
					"isStandard":0
					},
	      method:'post',
	      success:function(){
	        Ext.ux.Toast.msg('信息提示','操作成功！');
	        grid.getStore().reload();
	      }
	    })
	 }
	});
},
ArchivesIsStandardXZView.detailT = function(editId, runId, defId) {
	var isGranted=false;
	if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
		{
		  isGranted=true;
		}
	new ArchDetailView({
				archivesId : editId,
				runId : runId,
				defId : defId,
				archType : 0,
				isGranted:isGranted
			}).show();
}