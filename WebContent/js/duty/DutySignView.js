/**
 * @author:
 * @class DutySignView
 * @extends Ext.Panel
 * @description 值班签到
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
DutySignView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				DutySignView.superclass.constructor.call(this, {
							id : 'DutySignView',
							title : '值班签到',
							iconCls:'menu-dutySetting',
							region : 'center',
							layout : 'form',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				// 初始化搜索条件Panel
				this.searchPanel=new Ext.FormPanel({
					id : 'DutySignSearchForm',
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
							left : 0
						}
					},
					items : [
							{
								text:'查询条件:'
							}, {
								text : '值班人'
							}, {
								xtype:'textfield',
								readOnly:true,
								name:'DS_fullname',
								id:'DutySignSearchForm.fullname',
								width: 90
							}, {
								xtype : 'button',
								style:'padding-left:0px',
								text : '选择人员',
								iconCls : 'btn-select',
								//width : 60,
								handler : function() {
									UserSelector.getView(
										function(ids, names) {
										  var userId = Ext.getCmp('Q_appUser.userId_L_EQ');
										  var fullname = Ext.getCmp('DutySignSearchForm.fullname').setValue(names);
										  userId.setValue(ids);
										},true).show();
								}
							},{
								xtype : 'button',
								text : '查询',
								style:'padding-left:5px',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext.getCmp('DutySignSearchForm');
									var gridPanel = Ext.getCmp('DutySignGrid');
									if (searchPanel.getForm().isValid()) {
										$search({
											searchPanel :searchPanel,
											gridPanel : gridPanel
										});
									}

								}
							},{
								  xtype:'button',
								  text:'重置',
								  iconCls:'btn-reseted',
								  handler:function(){
									var searchPanel = Ext.getCmp('DutySignSearchForm');
									searchPanel.getForm().reset();
								  }
							},{
								xtype : 'hidden',
								name : 'Q_appUser.userId_L_EQ',
								id:'Q_appUser.userId_L_EQ'
							}]
				});// end of searchPanel

				this.topbar = new Ext.Toolbar({
						items : []
				});
				this.topbar.add(new Ext.Button({
			        iconCls : 'menu-diary',
					text : '签到',
					handler : function() {
						new DutySignForm();
					}
				}));
				this.topbar.add(new Ext.Button({
			        iconCls : 'btn-del',
					text : '删除签到记录',
					handler : function() {
						var grid = Ext.getCmp("DutySignGrid");
						var selectRecords = grid.getSelectionModel().getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.id);
						}
						DutySignView.remove(ids);
					}
				}));
				this.topbar.add(new Ext.Button({
			       iconCls : 'menu-cal-plan-view',
					text : '签到日志',
					handler : function() {
						 var tabs = Ext.getCmp('centerTabPanel');
					      var attendCompanyCalendarView=Ext.getCmp('AttendCompanyCalendarView');
					      if(attendCompanyCalendarView!=null){
					           tabs.remove('AttendCompanyCalendarView');
					      }
					     attendCompanyCalendarView = new AttendCompanyCalendarView();
			             tabs.add(attendCompanyCalendarView);
			             tabs.activate(attendCompanyCalendarView);  
					}
				}));
				this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 80,
					actions : [{
						iconCls : 'btn-del',
						text : '删除',
						qtip : '删除',
						style : 'margin:0 3px 0 3px'
					}]
				});
				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : 'id',
								dataIndex : 'id',
								hidden : true
							},{
								header : '签到日期',
								dataIndex : 'sgDate',
								hidden : true
							},{
								header : '签到日期',
								dataIndex : 'signDate'
							}, {
								header: '签到时间',
								dataIndex :'sgTime'
							},{
								header : '值班人',
								dataIndex : 'appUser.fullname'
							},this.rowActions],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
				});
				var store = new Ext.data.GroupingStore({
					proxy : new Ext.data.HttpProxy({
						url : __ctxPath + '/duty/listDutySignRecord.do'
					}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [{
											name : 'id',
											type : 'int'
										}, 'appUser.fullname','signDate', 'signType', 'description','sgDate','sgTime',
										'createUser', 'createDate']
							}),
					remoteSort : true,
					sortInfo:{field: 'signDate', direction: "ASC"},
					groupField:'sgDate'
				});
				store.load({
							params : {
								start : 0,
								limit : 25
							}
						});
				this.gridPanel= new Ext.grid.GridPanel({
							id : 'DutySignGrid',
							tbar : this.topbar,
							store : store,
							trackMouseOver : true,
							disableSelection : false,
							loadMask : true,
							plugins : this.rowActions,
							autoHeight : true,
							cm : cm,
							sm : sm,
       						animCollapse: false,
       						view: new Ext.grid.GroupingView({
					            forceFit:true,
					            groupTextTpl: '{text} (共{[values.rs.length]}条记录)'
					        }),
							viewConfig : {
								forceFit : true,
								enableRowBody : false,
								showPreview : false
							},
							bbar : new Ext.PagingToolbar({
										pageSize :25,
										store : store,
										displayInfo : true,
										displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
										emptyMsg : "当前没有记录"
									})
						});
				this.rowActions.on('action',this.onRowAction, this);
			},// end of the initComponents()
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/duty/multiDelDutySignRecord.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.id);
						break;
					default :
						break;
				}
			}
});
DutySignView.remove = function(id) {
	var grid = Ext.getCmp("DutySignGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath
										+ '/duty/multiDelDutySignRecord.do',
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
