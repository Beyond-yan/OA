/**
 * @class ArchivesHandleView
 * @extends Ext.Panel
 * @description [ArchivesHandle]管理
 */
ArchivesHandleView = Ext.extend(Ext.Panel, {
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
		ArchivesHandleView.superclass.constructor.call(this, {
					id : 'ArchivesHandleView',
					iconCls : 'menu-arch-handler',
					title : '收文库',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var dir = '';
		var sort = '';
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
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
			            items:[
			            	{
			                columnWidth:.3,
			                layout: 'form',
			                defaults:{border:false,anchor:'96%,96%'},
			                items: [{
			                    width:60,
						    	id:'receiveStoredsubject',
								fieldLabel : '标题',
								name : 'subject',
								xtype : 'textfield'											
					}]
			            },{
			                columnWidth:.3,
			                layout: 'form',
			                defaults:{border:false,anchor:'96%,96%'},
			                items: [{
			                    width:60,
						    	id:'receiveStoredDepSignNo',
								fieldLabel : '来文字号',
								name : 'depSignNo',
								xtype : 'textfield'											
					}]
			            },{
							columnWidth : 0.3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										width : 65,
										fieldLabel : '主办部门',
										id : 'receiveOrgDepNames',
										xtype : 'textfield',
										readOnly:true,
										editable : false
									}, {
										xtype : 'hidden',
										name : 'orgdepId',
										id : 'receiveOrgDepIds'
																																								
							}, {	
								name : 'startDate',
								xtype : 'hidden',
								id : 'receiveStoredStartDt'
							}]
						}, {
			               columnWidth:.07,
			                layout: 'form',
			                defaults:{border:false,anchor:'96%,96%'},
			                items: [{	
			                style:'padding-right:20px',
							xtype : 'button',
							iconCls : 'btn-dep-sel',
							text : '选择部门',
							handler : function() {
								var url = __ctxPath +"/system/selectDepartment.do?depId="+roleMap.get('DepartmentCommonId');
								DepSelector3.getView(function(id, name) {
									Ext.getCmp('receiveOrgDepNames').setValue(name);
									Ext.getCmp('receiveOrgDepIds').setValue(id);
								}, false,null,url).show();
							}			                			                	
					}]
			            },{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '收文编号',
						    	id:'receiveStoredarchivesNo',
								name : 'archiveNo',
								xtype : 'textfield'
						}]
						},{
							columnWidth : .3,
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
										Ext.getCmp('receiveStoredStartDt').setValue((this.getValue()+'-01-01'));
										Ext.getCmp('RsentStoredendDate').setValue(Ext.util.Format.substr(this.getValue(),0,4)+'-12-31');	
										
									}
								}
									}, {
										xtype : 'hidden',
										name : 'orgdepId',
										id : 'receiveOrgDepIds'
									}]
			            },{
			                columnWidth:.3,
			                layout: 'form',
			                defaults:{border:false,anchor:'96%,96%'},
			                items: [{	
								width : 60,
								fieldLabel : '编号办法',
								id : 'receiveStoredsnConfigId',
								hiddenName : 'snConfigId',
								triggerAction : 'all',
								editable : false,
								xtype : 'combo',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/snconfig/signComboFileSnConfig.do?snType=1',
									fields : ['id', 'name'],
									baseParams:{
											start : 0,
											limit : 10000
									}
								})}]
			            },{
			                columnWidth:.3,
			                layout: 'form',
			                defaults:{border:false,anchor:'96%,96%'},
			                items: [{   width : 60,
										fieldLabel : '稿笺名称',
										xtype : 'combo',
										listWidth: 250,
										id : 'sendDefId',
										hiddenName : 'defId',
										editable : false,
										triggerAction : 'all',
										displayField : 'name',
										valueField : 'id',
										store : new Ext.data.SimpleStore({
											autoLoad : true,
											url : __ctxPath
													+ '/flow/comQuickProDefinition.do?typeId=1205687',
											fields : ['id', 'name']
										})
									}]
			            },{
			                columnWidth:.3,
			                layout: 'form',
			                defaults:{border:false,anchor:'96%,96%'},
			                items: [{
									width:60,
									fieldLabel : '来文单位',
									name : 'issuedep',
									xtype : 'textfield'
								}]
			            }]},{
	            	xtype:'panel',
	            	border:false,
	            	layout:'hbox',
	            	layoutConfig:{
	            		pack:'center',
	            		align:'middle'
	            	},
	            	items:[
							{   xtype : 'button',
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
							}
	            	]
	            },{
								xtype : 'hidden',
								name : 'archiveType',
								value : 1
							},{
				xtype : 'hidden',
				name : 'endDate',
				id:'RsentStoredendDate'
			}, {
				xtype : 'hidden',
				id : 'ArchivesHandleView.dir',
				value : 'DESC'
			}, {
				xtype : 'hidden',
				id : 'ArchivesHandleView.sort',
				value : 'archiveId'
			}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/listReceiveStoreArchives.do",
					baseParams : {
						archiveType : 1
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : ['archiveId',  'archivesNo', 'issuedep','depSignNo',
							'runSubject', 'issueDate', 'writtenDate','defId','runId']
				});
		//this.store.setDefaultSort('archiveId', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

				this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 120,
					actions : [{
								iconCls : 'btn-archives-detail',
								qtip : '公文信息',
								text : '公文信息',
								style : 'margin:4px 3px 4px 3px'
							}, {
								iconCls : 'btn-archives-toDoc',
								qtip : '公文归档',
								text : '公文归档',
								style : 'margin:0 3px 0 3px'
							}]
					});
		// 初始化ColumnModel
		var record_start = 0;
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [ new Ext.grid.RowNumberer({
						  header : "序号",
						  width : 35,
						  renderer:function(value,metadata,record,rowIndex){
						   return record_start + 1 + rowIndex;
						  }
					}), {
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					},{
						header : 'defId',
						dataIndex : 'defId',
						hidden : true
					},{
						header : 'runId',
						dataIndex : 'runId',
						hidden : true
					},{
						header : '标题',
						dataIndex : 'runSubject',
						width : 300,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							var str = '<a href="#" title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesHandleView.detail('+record.data.archiveId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
							return str;
						}
					}, {
						header : '收文编号',
						dataIndex : 'archivesNo'
					}, {
						header : '来文号',
						dataIndex : 'depSignNo',
						width : 100
					}, {
						header : '收文日期',
						dataIndex : 'issueDate'
					}, {
						header : '成文日期',
						dataIndex : 'writtenDate'
						},this.rowActions
					],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 50
			}
		});
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesHandleGrid',
					region : 'center',
					stripeRows : true,
					store : this.store,
					plugins : this.rowActions,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
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
							}),listeners :{headerclick:function( g, n, e){
								sort = g.getColumnModel( ).getDataIndex(n);
								if(sort != Ext.getCmp('ArchivesHandleView.sort').getValue()){
									dir = '';
								}
								Ext.getCmp('ArchivesHandleView.sort').setValue(sort);
								if('ASC' == dir){
									dir = 'DESC';
									Ext.getCmp('ArchivesHandleView.dir').setValue(dir);
								}else{
									dir = 'ASC';
									Ext.getCmp('ArchivesHandleView.dir').setValue(dir);
								}
							}}
				});

		this.rowActions.on('action',this.onRowAction, this);
	},// end of the initComponents()
//行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-archives-detail' :
				ArchivesHandleView.detail(record.data.archiveId,record.data.runId,record.data.defId);
				break;
			case 'btn-archives-toDoc' :
				ArchivesHandleView.toDoc(record.data.archiveId);
				break;
			default :
				break;
		}
	},

	//把表格导出到Excel
					tableToExcel:function (self) {
						var recordCount = self.store.getCount();
						if (recordCount > 0) {
							var url  = __ctxPath
					+ '/flow/receiveArchivesToExcelDownLoad.do?archiveType=1'
					+ '&startDate='
					+ Ext.getCmp('receiveStoredStartDt')
									.getValue()
					+'&endDate='
					+Ext.getCmp('RsentStoredendDate')
									.getValue()
					+ '&subject='
					+ Ext.getCmp('receiveStoredsubject').getValue()
					+ '&snConfigId='
					+ Ext.getCmp('receiveStoredsnConfigId').getValue()
					+'&orgdepId='
					+Ext.getCmp('receiveOrgDepIds').getValue()
					+ '&archiveNo='
					+ Ext.getCmp('receiveStoredarchivesNo').getValue()
					+ '&depSignNo='
					+ Ext.getCmp('receiveStoredDepSignNo').getValue()
					+'&defId='
					+Ext.getCmp('sendDefId').getValue()
					+'&dir='
					+Ext.getCmp('ArchivesHandleView.dir').getValue()
					+'&sort='
					+Ext.getCmp('ArchivesHandleView.sort').getValue();
					url = encodeURI(url);
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
	}
});
	/**
 * 显示公文详情
 * 
 * @param {}
 *            editId
 */
ArchivesHandleView.detail = function(editId,runId,defId) {
	var isGranted=false;
	if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
		{
		  isGranted=true;
		}
	new ArchDetailView({
				archivesId : editId,
				runId: runId,
				defId: defId,
				archType:1,
				isGranted:isGranted
			}).show();},
ArchivesHandleView.toDoc = function(archiveId){
	Ext.Ajax.request({
		url : __ctxPath + '/system/findArchiveDocFiles.do',
		params : {
			'archiveId' : archiveId
		},
		method : 'post',
		success : function(response) {
			var result = Ext.util.JSON.decode(response.responseText);
			if(result.data){
				Ext.Msg.confirm('提示', '归档后不可重复归档，请确认是否要归档该流程？', function(btn, text) {
					if (btn == 'yes') {
						Ext.Ajax.request({
							url : __ctxPath + '/system/archiveToDocDocFiles.do',
							params : {
								'archiveId' : archiveId
							},
							success : function(response) {
								Ext.ux.Toast.msg('操作信息', '流程归档成功！');
								Ext.getCmp('ArchivesGrid').getStore()
									.reload();
							},
							failure : function(response) {
								Ext.Msg.alert("提示", "归档失败！");
							}
						});
					}
				});
			}else {
				Ext.ux.Toast.msg('操作信息', '改流程已归档，不可重复归档！');
			}
		},
		failure : function(response) {
			Ext.Msg.alert("提示", "归档文件查询失败！");
		}
	});
}