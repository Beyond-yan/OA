/**
 * @create 2010-01-30
 * @author csx
 * @description 流程表单选择器,
 * @class FormDefSelector
 * @extends Ext.Window
 */
FormDefSelector=Ext.extend(Ext.Window,{
	/**
	 * 流程定义的Id(pro_definition表的主键)
	 * @type 
	 */
	defId:null,
	/**
	 * 构造函数
	 * @param {} config
	 */
	constructor:function(config){
		Ext.applyIf(this,config);
		
		this.initUIComponents();
		
		FormDefSelector.superclass.constructor.call(this,{
			title:'流程表单选择',
			maximizable:true,
			layout:'fit',
			items:this.gridPanel
		});
	},
	/**
	 * 初始化UI组件
	 */
	initUIComponents:function(){
		// 加载数据至store
				this.store = new Ext.data.JsonStore({
							url : __ctxPath + "/flow/selectFormDef.do",
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [{
										name : 'formDefId',
										type : 'int'
									}, 'formName', 'columns', 'isEnabled',
									'activityName', 'deployId']
						});
				this.store.setDefaultSort('formDefId', 'desc');
				// 加载数据
				this.store.load({
							params : {
								start : 0,
								limit : 25
							}
						});

				this.rowActions = new Ext.ux.grid.RowActions({
							header : '管理',
							width : 80,
							actions : [{
										iconCls : 'btn-del',
										qtip : '删除',
										style : 'margin:0 3px 0 3px'
									}, {
										iconCls : 'btn-edit',
										qtip : '编辑',
										style : 'margin:0 3px 0 3px'
									}]
						});

				// 初始化ColumnModel
				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel({
							columns : [sm, new Ext.grid.RowNumberer(), {
										header : 'formDefId',
										dataIndex : 'formDefId',
										hidden : true
									}, {
										header : '表单名称',
										dataIndex : 'formName'
									}, {
										header : '总列数',
										dataIndex : 'columns'
									}, {
										header : '是否可用',
										dataIndex : 'isEnabled'
									}, {
										header : '节点名称',
										dataIndex : 'activityName'
									}, {
										header : 'Jbpm流程发布ID',
										dataIndex : 'deployId'
									}, this.rowActions],
							defaults : {
								sortable : true,
								menuDisabled : false,
								width : 100
							}
						});
				// 初始化工具栏
				this.topbar = new Ext.Toolbar({
							height : 30,
							bodyStyle : 'text-align:left',
							items : [{
										iconCls : 'btn-add',
										text : '添加表单定义',
										xtype : 'button',
										handler : this.createRecord
									}, {
										iconCls : 'btn-del',
										text : '删除表单定义',
										xtype : 'button',
										handler : this.delRecords,
										scope : this
									}]
						});

				this.gridPanel = new Ext.grid.GridPanel({
							id : 'FormDefGrid',
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
							plugins : this.rowActions,
							viewConfig : {
								forceFit : true,
								autoFill : true, // 自动填充
								forceFit : true
							},
							bbar : new Ext.PagingToolbar({
										pageSize : 25,
										store : this.store,
										displayInfo : true,
										displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
										emptyMsg : "当前没有记录"
									})
						});

				this.gridPanel.addListener('rowdblclick', function(grid,
								rowindex, e) {
							grid.getSelectionModel().each(function(rec) {
								new FormDefForm(rec.data.formDefId).show();
							});
						});
				this.rowActions.on('action', this.onRowAction, this);
	},
	/**
		 * 添加记录
		 */
		createRecord : function() {
			new FormDefForm().show();
		},
		/**
		 * 按IDS删除记录
		 * 
		 * @param {}
		 *            ids
		 */
		delByIds : function(ids) {
			Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
										url : __ctxPath
												+ '/flow/multiDelFormDef.do',
										params : {
											ids : ids
										},
										method : 'POST',
										success : function(response,
												options) {
											Ext.ux.Toast.msg('操作信息',
													'成功删除该[FormDef]！');
											Ext.getCmp('FormDefGrid')
													.getStore().reload();
										},
										failure : function(response,
												options) {
											Ext.ux.Toast.msg('操作信息',
													'操作出错，请联系管理员！');
										}
									});
						}
					});// end of comfirm
		},
		/**
		 * 删除多条记录
		 */
		delRecords : function() {
			var gridPanel = Ext.getCmp('FormDefGrid');
			var selectRecords = gridPanel.getSelectionModel()
					.getSelections();
			if (selectRecords.length == 0) {
				Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
				return;
			}
			var ids = Array();
			for (var i = 0; i < selectRecords.length; i++) {
				ids.push(selectRecords[i].data.formDefId);
			}
			this.delByIds(ids);
		},
	
		/**
		 * 编辑记录
		 * @param {} record
		 */
		editRecord : function(record) {
			new FormDefForm({
						formDefId : record.data.formDefId
					}).show();
		},
		/**
		 * 管理列中的事件处理
		 * @param {} grid
		 * @param {} record
		 * @param {} action
		 * @param {} row
		 * @param {} col
		 */
		onRowAction : function(gridPanel, record, action, row, col) {
			switch (action) {
				case 'btn-del' :
					this.delByIds(record.data.formDefId);
					break;
				case 'btn-edit' :
					this.editRecord(record);
					break;
				default :
					break;
			}
		}

});