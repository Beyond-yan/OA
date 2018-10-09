/**
 * @author:Ropen
 * @class ArchivesView
 * @extends Ext.Panel
 * @description 收文管理
 */
DocumentSentView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		DocumentSentView.superclass.constructor.call(this, {
					id : 'DocumentSentView',
					title : '单位公文发送',
					iconCls : 'menu-planmanage',
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
/*	topbar : null,*/

	// 初始化组件
	initComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 40,
					region : 'north',
					frame : false,
					id:'DocumentSentSearchForm',
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
								xtype : 'label',
								text : '请输入查询条件:'
							},{
								text : '标题',
								xtype:'label'
							},  {
								name : 'Q_subject_S_LK',
								xtype : 'textfield',
								anchor : '98%'
							}, {
								text : '状态'
							},{
								xtype : 'combo',
								hiddenName : 'Q_receiveFlag_L_EQ',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
//								value : '',
								store : [['','全部'],['0', '未接收'],['1', '已接收'],['2','已退文']]
							},{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							},{
								xtype:'button',
								text:'重置',
								iconCls:'btn-reseted',
								handler:function(){
								var searchPanel = Ext.getCmp('DocumentSentSearchForm');
									searchPanel.getForm().reset();
								}
							}/*,{
								xtype:'hidden',
								name:'Q_isdraft_L_EQ',
								value:1
							}*/]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/system/listSysDataTransfer.do?queryType=send",
					/*baseParams : {
					'Q_isdraft_L_EQ':1
					},*/
					root : 'result',
					id : 'DocumentSentViewGrid',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [  'id', 'archivesId', 'archivesno', 'sendDep',
							'subject', 'archtype', 'issuerid', 'issuer',
							'privacylevel', 'urgentlevel', 'sources',
							'writtenDate', 'receiveDep', 'transferType',
							'fromSchema', 'toSchemaId', 'receiveDate',
							'receiveFlag', 'rejectMsg', 'createUser',
							'createDate', 'transactionId', 'receiveUser',
							'receiveUserName','receiveType','confs.depName']
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
						  renderer:function(value,metadata,record,rowIndex){
						   return record_start + 1 + rowIndex;
						  }
					}), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'subject',
						width: 300,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="DocumentSentView.detail('
									+record.data.id+')">'+value+'</a>';
							return str;
						}
					},  {
						header : '发送人',
						dataIndex : 'issuer'
					}, {
						header : '发送单位',
						dataIndex : 'sendDep'
					}, {
						header : '发送时间',
						width : 120,
						dataIndex : 'createDate'
					} , {
						header : '接收单位',
						dataIndex : 'confs.depName'
					} , {
						header : '接收人',
						dataIndex : 'receiveUserName'
					} ,{
						header : '接收时间',
						width : 120,
						dataIndex : 'receiveDate'
					} ,{
						header : '状态',
						dataIndex : 'receiveFlag',
						renderer : function(value){
							var str='';
							if(value==0){
								str="未接收";
							}else if(1 == value){
								str="已接收";
							}else{
								str="已退文";
							}
							return str;
						}
					}, {
						header : '退文原因',
						dataIndex : 'rejectMsg',
						renderer : function(value, metadata, record, rowIndex,colIndex){
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="DocumentSentView.idear('
									+record.data.id+')">'+(value == null ? '' : value)+'</a>';
							return str;
						}
					},  {
						header : '管理',
						dataIndex : 'id',
						width :160,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.id;
							var receiveFlag=record.data.receiveFlag;
							var str = '';
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="DocumentSentView.detail('
								+editId+')"><img src="'+__ctxPath +'/images/btn/archive/archives_detail.png" />查看</a>&nbsp;';
							if(receiveFlag!=2){
						    	str  = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" class="btn-del" onclick="DocumentSentView.deleted('
						    		+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value="" class="btn-edit" onclick="DocumentSentView.edit('
									+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
							}
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false
			}
		});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		this.topbar.add(new Ext.Button({
						iconCls : 'btn-add',
						text : '公文发送',
						xtype : 'button',
						handler : function() {
							new DocumentSentForm().show();
						}
					}));
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'DocumentSentGrid',
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
					store : this.store,
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
							})
				});

	},// end of the initComponents()

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
  
/*  删除公文*/
  DocumentSentView.deleted = function(archivesId) {
	var grid = Ext.getCmp("DocumentSentGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + "/system/multiDelSysDataTransfer.do",
								params : {
									ids : archivesId
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功取消所选记录！");
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
/*查看反馈意见*/
DocumentSentView.idear= function(id) {
	new FeedbackForm(id,2);
};
/*查看公文*/
  DocumentSentView.detail = function(archivesId) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				archType:1,
				download : 1
			}).show();
}
/*修改公文*/
  DocumentSentView.edit = function(id) {
	new DocumentSentForm({
				id : id
			}).show();
};
