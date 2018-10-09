var TopicTecAndAdjuForm = function(dId, dName) {
	return this.setup(dId, dName);
};

TopicTecAndAdjuForm.prototype.setup = function() {
	var formPanel = new Ext.FormPanel();
	var store = new Ext.data.JsonStore({
			url : __ctxPath + "/archive/listArchives.do",
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : [{
						name : 'archivesId',
						type : 'int'
					}, 'typeId', 'typeName', 'archivesNo', 'issueDep', 'depId',
					'subject', 'issueDate', 'status', 'shortContent',
					'fileCounts', 'privacyLevel', 'urgentLevel', 'issuer',
					'issuerId', 'keywords', 'sources', 'archType', 'createtime']
		});
	store.setDefaultSort('archivesId', 'desc');
	// 加载数据
	store.load({
		params : {
			start : 0,
			limit : 25
		}
	});
	// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'archivesId',
						dataIndex : 'archivesId',
						hidden : true
					}, {
						header : '公文类型',
						dataIndex : 'typeId',
						hidden : true
					}, {
						header : '公文类型',
						dataIndex : 'typeName'
					}, {
						header : '发文字号',
						dataIndex : 'archivesNo'
					}, {
						header : '发文机关或部门',
						dataIndex : 'issueDep'
					}, {
						header : '文件标题',
						dataIndex : 'subject'
					}, {
						header : '公文状态',
						dataIndex : 'status',
						renderer : function(value) {
							if (value == 0) {
								return '<font color="#777">草稿</font>';
							} else if (value == 1) {
								return '<font color="red">待审核</font>';
							}
						}
					}, {
						header : '秘密等级',
						dataIndex : 'privacyLevel'
					}, {
						header : '紧急程度',
						dataIndex : 'urgentLevel'
					}, {
						header : '发文时间',
						dataIndex : 'createtime',
						renderer : function(value) {
							return value.substring(0, 10);
						}
					}, {
						header : '管理',
						width : 100,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.archivesId;
							var status = record.data.status;
							var str = '';
							if (status == '0') {
								if (isGranted('_ArchivesDrafmDel')) {
									str += '<button title="删除" value=" " class="btn-del" onclick="ArchivesDraftManage.remove('
											+ editId
											+ ')">&nbsp;&nbsp;</button>';
								}
								if (isGranted('_ArchivesDrafmEdit')) {
									str += '<button title="编辑草稿" value=" " class="btn-archive-draft" onclick="ArchivesDraftManage.editDraft('
											+ editId
											+ ')">&nbsp;&nbsp;</button>';
								}
							} else {
//								if (isGranted('_ArchivesDrafmEdit')) {
//									str += '<button title="编辑" value=" " class="btn-edit" onclick="ArchivesDraftManage.edit('
//											+ editId
//											+ ')">&nbsp;&nbsp;</button>';
//								}
								str += '<button title="查看详情" value=" " class="btn-archives-detail" onclick="ArchivesDraftManage.detail('
										+ editId + ')">&nbsp;&nbsp;</button>';
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
	var contactGrid = new Ext.grid.EditorGridPanel({
					title:'会议议题列表',
					autoScroll:true,
					id : 'contactGrid',
					region:'north',
					height : 200,
					autoWidth:false,
					store : store,
					shim : true,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					bbar : new HT.PagingBar({store : store,pageSize : 12})
				});
	var csm = new Ext.grid.CheckboxSelectionModel();
	var selectedUserGrid = new Ext.grid.EditorGridPanel({
			id : 'selectedUserGrid',
			region:'center',
			title:'已选议题',
			height : 400,
			width:165,
			autoScroll:true,
			store : new Ext.data.ArrayStore({
    				fields : [{
						name : 'archivesId',
						type : 'int'
					}, 'typeId', 'typeName', 'archivesNo', 'issueDep', 'depId',
					'subject', 'issueDate', 'status', 'shortContent',
					'fileCounts', 'privacyLevel', 'urgentLevel', 'issuer',
					'issuerId', 'keywords', 'sources', 'archType', 'createtime']
			}),
			trackMouseOver : true,
			sm:csm,
			columns:[
					csm,
					new Ext.grid.RowNumberer(),
					{
						header : "发文字号",
						dataIndex : 'archivesNo'
					},{
						header : "文件标题",
						dataIndex : 'subject'
					},{
						header : "发文机关或部门",
						dataIndex : 'issueDep'
					},{
						header : "发文时间",
						dataIndex : 'issueDate'
					}, {
						header : '管理',
						width : 100,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.archivesId;
							var status = record.data.status;
							var str = '';
							if (status == '0') {
								if (isGranted('_ArchivesDrafmDel')) {
									str += '<button title="删除" value=" " class="btn-del" onclick="ArchivesDraftManage.remove('
											+ editId
											+ ')">&nbsp;&nbsp;</button>';
								}
								if (isGranted('_ArchivesDrafmEdit')) {
									str += '<button title="编辑草稿" value=" " class="btn-archive-draft" onclick="ArchivesDraftManage.editDraft('
											+ editId
											+ ')">&nbsp;&nbsp;</button>';
								}
							} else {
//								if (isGranted('_ArchivesDrafmEdit')) {
//									str += '<button title="编辑" value=" " class="btn-edit" onclick="ArchivesDraftManage.edit('
//											+ editId
//											+ ')">&nbsp;&nbsp;</button>';
//								}
								str += '<button title="查看详情" value=" " class="btn-archives-detail" onclick="ArchivesDraftManage.detail('
										+ editId + ')">&nbsp;&nbsp;</button>';
							}
							return str;
						}
					}
			]
		});
	var southPanel=new Ext.Panel({
			width:200,
			region:'center',
			layout:'border',
			border:false,
			items:[
				new Ext.Panel({
					frame:true,
					region:'north',
					width:200,
					height:35,
					layout: {
                                type:'hbox',
                                pack:'center',
                                align:'stretch'
                            },
                            defaults:{margins:'0 0 5 0'},
					items:[
						{
							xtype:'button',
							iconCls:'add-all',
							text:'',
							handler:function(){
								var contactGrid = Ext.getCmp('contactGrid');
								var selGrid=Ext.getCmp('selectedUserGrid');
								var selStore=selGrid.getStore();
								var rows = contactGrid.getSelectionModel().getSelections();
								//alert(rows.length);
								for(var i=0;i<rows.length;i++){
									
									var archivesId=rows[i].data.archivesId;
									var archivesNo=rows[i].data.archivesNo;
									var subject=rows[i].data.subject;
									var issueDep=rows[i].data.issueDep;
									var issueDate=rows[i].data.issueDate;
									var isExist=false;
									//查找是否存在该记录
									for(var j=0;j<selStore.getCount();j++){
										
										if(selStore.getAt(j).data.archivesId==archivesId){
											isExist=true;
											break;
										}
									}
									if(!isExist){
										var newData={archivesId:archivesId,archivesNo:archivesNo,subject:subject,issueDep:issueDep,issueDate:issueDate};
										var newRecord=new selStore.recordType(newData);
										selGrid.stopEditing();
										selStore.add(newRecord);
									}
								}
							}
						},
						{
							xtype:'button',
							text:'',
							iconCls:'rem-all',
							handler:function(){
								var selGrid=Ext.getCmp('selectedUserGrid');
								var rows = selGrid.getSelectionModel().getSelections();
								var selStore=selGrid.getStore();
								
								for(var i=0;i<rows.length;i++){
									selGrid.stopEditing();
									selStore.remove(rows[i]);
								}
							}
						}
					]
				}),selectedUserGrid
			]
		});
	var panel=new Ext.Panel({
	    id:'TopicTecAndAdjuForm',
	    title : '会议议题汇总及调整',
	    iconCls : 'menu-new-document',
	    autoScroll : true,
	    layout:'border',
	    items:[contactGrid,southPanel]
	});

	return panel;
};



