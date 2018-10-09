/**
 * @author:Ropen
 * @class ArchivesView
 * @extends Ext.Panel
 * @description 收文管理
 */
ToRejectArchivesView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		ToRejectArchivesView.superclass.constructor.call(this, {
					id : 'ToRejectArchivesView',
					title : '退文统计',
					iconCls : 'menu-flowPr',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// [Archives]分类ID
	typeId : null,

	// 条件搜索Panel
	searchPanel : null,

	// 数据展示Panel
	gridPanel : null,

	// GridPanel的数据Store
	store : null,

	// 头部工具栏
	/* topbar : null, */

	// 初始化组件
	initComponents : function() {
		var transferStore=new Ext.data.SimpleStore({
			autoLoad : true,
			url : __ctxPath
					+ '/archive/comQuickOdCommonComments.do?Q_ref1_S_EQ=3',
			fields : ['id', 'name']
		});
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 110,
			id:'ReceiveStoreSearchForm',
			region : 'north',					
			layout : 'form',			
			bodyStyle:'padding:5px',
			defaults:{border:false},
			items : [{
				layout:'column',
	            defaults:{border:false},
			    items:[{
			    	columnWidth:.3,
			        layout: 'form',
			        defaults:{border:false,anchor:'96%,96%'},
			        items: [{
	                    width:60,
				    	id:'subject',
						fieldLabel : '标题',
						name : 'Q_subject_S_LK',
						xtype : 'textfield'											
	                }]
			    },{
			        columnWidth:.3,
			        layout: 'form',
			        defaults:{border:false,anchor:'96%,96%'},
			        items: [{
				    	id:'transferType',
						fieldLabel : '错情原因',
						width : 150,
						xtype : 'combo',
						hiddenName : 'Q_transferType_L_EQ',
						editable : false,
						triggerAction : 'all',
						displayField : 'name',
						valueField : 'id',
						store : transferStore										
	                }]
			    },{
					columnWidth : .3,
					layout : 'form',
					defaults : {
						border : false,
						anchor : '96%,96%'
					},
					items : [{
						fieldLabel : '公文字号',
				    	id:'archiveNo',
						name : 'Q_archivesno_S_LK',
						xtype : 'textfield'
					}]
				},{
	                columnWidth:.3,
	                layout: 'form',
	                defaults:{border:false,anchor:'96%,96%'},
	                items: [{
						width:60,
				    	id:'sendDep',
						fieldLabel : '来文单位',
						name : 'Q_sendDep_S_LK',
						xtype : 'textfield'
					}]
	            },{
	                columnWidth:.3,
	                layout: 'form',
	                defaults:{border:false,anchor:'96%,96%'},
	                items: [{
						width:60,
						fieldLabel : '开始时间',
						name : 'dateBegin',
						id : 'dateBegin',
						xtype : 'datefield',
						format:'Y-m-d',
						listeners : {
							select : function() {
								var dateBegin=Ext.getCmp('dateBegin').getValue();
								dateBegin=Ext.util.Format.date(dateBegin, 'Y-m-d');
								Ext.getCmp('Q_createDate_D_GE').setValue(dateBegin+" 00:00:00");
							}
						}
					}]
	            },{
	                columnWidth:.3,
	                layout: 'form',
	                defaults:{border:false,anchor:'96%,96%'},
	                items: [{
						width:60,
						fieldLabel : '结束时间',
						name : 'dateEnd',
						id : 'dateEnd',
						xtype : 'datefield',
						format:'Y-m-d',
						listeners : {
							select : function() {
								var dateEnd=Ext.getCmp('dateEnd').getValue();
								dateEnd=Ext.util.Format.date(dateEnd, 'Y-m-d');
								Ext.getCmp('Q_createDate_D_LE').setValue(dateEnd+" 23:59:59");
							}
						}
					}]
	            }
			]},{
            	xtype:'panel',
            	border:false,
            	layout:'hbox',
            	layoutConfig:{
            		pack:'center',
            		align:'middle'
            	},
            	items:[{   
    			    xtype : 'button',
					text : '查询',
					iconCls : 'search',
					handler : this.search.createCallback(this)
				},{
				    xtype : 'button',
					text : '重置',
					style : 'padding-left:10px;',
					iconCls : 'reset',
					handler :function() {
					    Ext.getCmp('ReceiveStoreSearchForm').getForm().reset();
					}
				},{
				    xtype:'button',
					iconCls : 'excel-cls',
					 style : 'padding-left:10px;',
					text : '导出Excel',
					handler : this.tableToExcel.createCallback(this)
				}]
	        }, {
				xtype : 'hidden',
				id : 'archivesno',
				name : 'Q_archivesno_S_LK',
				value : '退文通知'
			}, {
				xtype : 'hidden',
				id : 'Q_createDate_D_GE',
				name : 'Q_createDate_D_GE'
			}, {
				xtype : 'hidden',
				id : 'Q_createDate_D_LE',
				name : 'Q_createDate_D_LE'
			}]
		});// end of the searchPanel
		// 加载数据至store
		this.store = new Ext.data.JsonStore({
			url : __ctxPath
					+ "/system/listSysDataTransfer.do?queryType=back",
			baseParams:{'Q_archivesno_S_LK':'退文'},
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : ['sources', 'archivesId','runid', 'archivesno', 'id',
					'subject', 'sendDep', 'transferType','dataSource','rejectMsg',
					'writtenDate', 'createDate', 'issuer','archtype','fromSchema',
					'receiveFlag','createUserFullName']
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
								renderer : function(value, metadata, record,
										rowIndex) {
									return record_start + 1 + rowIndex;
								}
							}), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},{
						header : '公文字号',
						dataIndex : 'archivesno'
					}, {
						header : '来文单位',
						dataIndex : 'sendDep'
					}, {
						header : '来文时间',
						width : 120,
						dataIndex : 'createDate'
					}, {
						header : '标题',
						dataIndex : 'subject',
						width : 300,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var isreceive = record.data.receiveFlag;
							var archtype=record.data.archtype;
							var fromSchema=record.data.fromSchema;
							var str = '';
							if(archtype==0){
								if (isreceive == 0)
									str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToRejectArchivesView.UnRecDetail('
										+ record.data.id+')">'
										+ value
										+ '</a>';
								else
									str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToRejectArchivesView.RecDetail('
										+ record.data.id+')">'
										+ value
										+ '</a>';
							}else if(archtype==1||archtype==3){
								if (isreceive == 0)
								str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToRejectArchivesView.sentUnRecDetail('
									+ record.data.id+','+
									+ record.data.runid+','+record.data.dataSource+','+fromSchema+')">'
									+ value
									+ '</a>';
								else
									str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToRejectArchivesView.sentRecDetail('
										+ record.data.id+','+
										+ record.data.runid+','+record.data.dataSource+','+fromSchema+')">'
										+ value
										+ '</a>';
							}
							return str;
						}
					}, {
						header : '错情原因',
						dataIndex : 'transferType',
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var str = '';
							transferStore.each(function(record) {   
								if(value==record.get('id')){
									str=record.get('name');
								}
							});  
							return str;
						}
					}, {
						header : '退文详情',
						dataIndex : 'rejectMsg'
					}],
			defaults : {
				sortable : true,
				menuDisabled : false
			}
		});
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ToReceiveArchivesGrid',
					tbar : this.topbar,
					region : 'center',
					stripeRows : true,
					/* tbar : this.topbar, */
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					plugins : this.rowActions,
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

	},// end of the initComponents()

	//把表格导出到Excel
	tableToExcel:function (self) {
		var recordCount = self.store.getCount();
		if (recordCount > 0) {
			var url  = __ctxPath
			+ '/flow/transferArchivesToExcelDownLoad.do?'
			+ 'createDateBegin='+ Ext.getCmp('Q_createDate_D_GE').getValue()
			+ '&createDateEnd='+Ext.getCmp('Q_createDate_D_LE').getValue()
			+ '&subject='+ encodeURI(Ext.getCmp('subject').getValue())
			+ '&archiveNo='+ Ext.getCmp('archiveNo').getValue()
			+ '&transferType='+ Ext.getCmp('transferType').getValue()
			+ '&sendDep='+Ext.getCmp('sendDep').getValue();
			//url = encodeURI(url);
			url = encodeURI(url);
			window.location.href=url;
		} else {
			Ext.Msg.alert("提示", "没有数据需要导出！")
		}
	} ,
	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
						searchPanel : self.searchPanel,
						gridPanel : self.gridPanel
					});
		}
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-archives-detail' :
				ToRejectArchivesView.detail(record.data.archiveId,
						record.data.runId, record.data.defId);
				break;
			case 'btn-flowView' :
				ToRejectArchivesView.proDetail(record.data.runId,
						record.data.defId, record.data.piid,
						record.data.runSubject);
				break;
			case 'btn-edit' :
				ToRejectArchivesView.edit(record.data.taskId,
						record.data.activityname);
				break;
			default :
				break;
		}
	}
});

/**
 * 未接收发文公文详细信息
 * 
 * @param {}
 * 
 */
ToRejectArchivesView.UnRecDetail = function(archivesId) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				isReceive : 1,
				archType : 1,
				download :1,
				dataSource:1
			}).show();
}
/**
 * 已接收收文公文详细信息
 * 
 * @param {}
 *          
 */
ToRejectArchivesView.RecDetail = function(archivesId) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				isReceive : 1,
				archType : 1,
				download :1,
				dataSource:1
			}).show();
}
/**
 * 未接收收文公文详细信息
 * 
 * @param {}
 * 
 */
ToRejectArchivesView.sentUnRecDetail= function(archivesId,runid,dataSource,fromSchema) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				isReceive : 1,
				archType : 1,
				download :1,
				runid:runid,
				dataSource:dataSource,
				fromSchema:fromSchema
			}).show();
}
/**
 * 已接收收文公文详细信息
 * 
 * @param {}
 *          
 */
ToRejectArchivesView.sentRecDetail= function(archivesId,runid,dataSource,fromSchema) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				isReceive : 1,
				archType : 1,
				download :1,
				runid:runid,
				dataSource:dataSource,
				fromSchema:fromSchema
			}).show();
}
ToRejectArchivesView.edit = function(id) {
	new FeedbackForm(id);
};

ToRejectArchivesView.check = function(id) {
 	var grid = Ext.getCmp("ToReceiveArchivesGrid");
	Ext.Msg.confirm('信息确认', '您确认标记为已收吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/system/checkSysDataTransfer.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("操作信息", "成功标记所选记录！");
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