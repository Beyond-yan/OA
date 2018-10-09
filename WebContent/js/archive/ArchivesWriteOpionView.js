/**
 * @author
 * @createtime
 * @class ArchivesWriteOpionView
 * @extends Ext.Window
 * @description 代填意见
 * @company 捷达世软件
 */
ArchivesWriteOpionView = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		ArchivesWriteOpionView.superclass.constructor.call(this, {
					id : 'ArchivesWriteOpionView',
					title : '代填意见',
					iconCls : 'menu-archive-draft',
					region : 'center',
					autoHeight:true,
					Height : 600,
					modal : true,
					width:800,
					layout : 'form',
					items : [this.gridPanel]
				});
	},// end of constructor

	// 群组ID
	teamId : null,


	// 数据展示Panel
	gridPanel : null,

	// GridPanel的数据Store
	store : null,

	// 头部工具栏
	topbar : null,

	// 初始化组件
	initComponents : function() {
		var runId=this.runId;
		var teamId = this.teamId;
		var taskId=this.taskId;
		var activityName=this.activityName;
		var taskName =this.taskName;
		if(this.type!=1){
		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '添加意见',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}]
		});
		}else{
			this.topbar=new Ext.Toolbar( {
				items : []
			});
		}
		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/flow/detailProcessForm.do?runId="+this.runId+'&taskId='+this.taskId,
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'runId',
								type : 'int'
							},'formId','activityName', 'comments','creatorName','createtime','status']
				});
		// 加载数据
		this.store.load();

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'runId',
						dataIndex : 'runId',
						hidden : true
					}, {
						header : 'formId',
						dataIndex : 'formId',
						hidden : true
					},{
						header : '任务名',
						dataIndex : 'activityName'
					}, {
						header : '办理人',
						dataIndex : 'creatorName'
					}, {
						header : '办理时间',
						dataIndex : 'createtime'
					}, {
						header : '办理意见',
						dataIndex : 'comments'
					}, {
						header : '管理',
						dataIndex : 'runId',
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var defId = record.data.defId;
							var name = record.data.name;
							var deployId = record.data.deployId;
							var str = '';
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesWriteOpionView.edit('
								+record.data.formId+','+taskId+',\''+taskName+'\',\''+activityName+'\','+record.data.runId+')"><img src="'+__ctxPath +'/images/system/edit.gif" />修改意见</a>&nbsp;';
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesWriteOpionGrid',
					region : 'center',
					tbar : this.topbar,
					stripeRows : true,
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
								//pageSize : 15,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});
	},// end of the initComponents()

	// 创建记录
	createRs : function() {
		 var runId=this.runId;
		 new ReWriteFlowOpinionForm(runId);
	
	},
	// 按ID删除记录
	removeRs : function(id) {
		var teamId = this.teamId;
		Ext.Msg.confirm('信息确认', '您确认要删除该条记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
							url : __ctxPath
									+ '/system/multiDelMembersAppTeam.do',
							params : {
					            teamId:teamId,
								ids : ids
							},
							method : 'POST',
							success : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '成功删除该组员！');
								Ext.getCmp('ArchivesWriteOpionGrid').getStore()
										.reload();
							},
							failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
							}
						});
			}
		});// end of comfirm
	},
	// 把选中记录删除
	removeSelRs : function() {
		var teamId = this.teamId;
		var selRs = this.gridPanel.getSelectionModel().getSelections();
		var ids = Array();
		for (var i = 0; i < selRs.length; i++) {
			ids.push(eval('selRs[i].data.'+'userId'));
		}
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
							url : __ctxPath
									+ '/system/multiDelMembersAppTeam.do',
							params : {
								teamId:teamId,
								ids : ids
							},
							method : 'POST',
							success : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '成功删除！');
								Ext.getCmp('ArchivesWriteOpionGrid').getStore()
										.reload();
							},
							failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
							}
						});
			}
		});// end of comfirm
	}
});
/**
 * 
 * 修改意见
 * 
 */
ArchivesWriteOpionView.edit = function(formId,taskId,taskName,activityName,runId) {
	new FlowDetailEditCommentsForm({
		taskId : taskId,
		taskName : taskName,
		activityName :activityName,
		runId: runId,
		formId : formId
			}).show();
}