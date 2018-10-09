/**
 * 
 * @class ZanCunConferenceView
 * @extends Ext.Panel
 * @description 会议状态查询 
 * 
 */
ZanCunConferenceView = Ext.extend(Ext.Panel, {
	//搜索
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
		ZanCunConferenceView.superclass.constructor.call(this, {
			id : 'ZanCunConferenceView',
			title : '会议室使用确认',
			iconCls : 'menu-conference_zancun',
			region : 'center',
			layout : 'form',
			items : [ this.searchPanel,this.gridPanel ]
		});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var dataStatus=[['','全部'],['1','待审核'],['2','已通过'],['3','退回'],['-1','会议已结束']];
		//start of this searchPanel
		this.searchPanel = new Ext.FormPanel({
			id:'ZanCunConferenceView_searchPanelExt',
			layout : 'form',
			region : 'center',
			width : '98%',
			height : '30%',
			//title : '搜索条件',
			//border : true,
			frame:true,
			keys : {
				key : Ext.EventObject.ENTER,
				fn : this.search.createCallback(this),
				scope : this
			},
			items : [{
				    layout : 'column',
				items : [{	columnWidth : 0.3,
						layout : 'form',
								defaults:{
								margins : {
						left : 4,
						top : 10,
						right : 4,
						bottom : 10	}	},
				
			    items:[{
								xtype : 'combo',								
								hiddenName : 'Q_roomId_L_EQ',
								width : 160,
								fieldLabel : '会议室名称',
								valueField : 'roomId',
								id : 'ZanCunConferenceView.roomId',
								displayField : 'roomName',
								mode : 'local',
								editable : false,
								emptyText : '',
								triggerAction : 'all',
								store : new Ext.data.SimpleStore({
									url : __ctxPath
											+ '/admin/getBoardrooConference.do?',
									// method:'post',
									autoLoad : true,
									fields : ['roomId', 'roomName'],

									listeners : {
										scope : this,
										load : function() {
											var cmp = Ext
													.getCmp('ZanCunConferenceView.roomId');
											if(cmp.hiddenField.value =='') cmp.setValue('');
											if (cmp.hiddenField.value && cmp.hiddenField.value !='')
												cmp.setValue(cmp.hiddenField.value);
										}
									}

								})
							},
				
						{
						fieldLabel : '会议名称',
						xtype : 'textfield',
						name : 'Q_confTopic_S_LK',
						width : 160,
						maxLength : 156,
						maxLengthText : '会议议题输入字符不能超过156长度！'
						
					}			
				]			
				},{
				
				columnWidth : 0.3,
					layout : 'form',
				
				
				items : [{					
				    fieldLabel : '会议开始时间',
					xtype : 'datetimefield',
					name : 'Q_startTime_D_GE',
					format : 'Y-m-d',
					width : 160
				},{
						
					   width : 160,
						xtype : 'combo',
						hiddenName : 'Q_applyStatus_SN_EQ',
						fieldLabel : '审核状态',
						valueField : 'applyStatus',
						displayField : 'applyStatusName',
						mode : 'local',
						editable : false,
						emptyText : '--全部--',
						triggerAction : 'all',
						forceSelection : true,
						store : new Ext.data.SimpleStore({
							//url : __ctxPath + '/admin/getBoardrooConference.do',
							//autoLoad : true,
							fields : ['applyStatus', 'applyStatusName'],
							data:dataStatus
						})
						
						}]			
				},{
				columnWidth : 0.3,
					layout : 'form',
					items : [{
					fieldLabel : '会议结束时间',
					xtype : 'datetimefield',
					//id:'endTimeZanCun',
					name : 'Q_endTime_DG_LE',
					format : 'Y-m-d',
					width : 160
					
				}]	}		
				]},{
				layout : 'hbox',
				region : 'center',
				border : false,
				layoutConfig : {
					padding : '5px',
					align : 'center'
				},
				defaults : {
					xtype : 'button',
					margins : {
						left : 4,
						top : 0,
						right : 4,
						bottom : 0
					}
				},
				items : [{
					xtype : 'label',
					style : 'padding-left:40%;',
					text : ' '
				},{
					iconCls : 'search',
					text : '查询',
					handler : this.search.createCallback(this)
					//style : 'padding-left:40%;'
				},{
					iconCls : 'btn-reset',
				//	style : 'padding-right:40%;'
					text : '重置',
					handler : this.reset.createCallback(this)
				}]
			}]
		}); // end of this superSearchPanel
		
		// 加载数据至store
		this.store = new Ext.data.JsonStore( {
			url : __ctxPath + "/admin/zanCunConference.do",
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : [ {
				name : 'confId',
				type : 'int'
			}, 'confTopic', 'compereName', 'roomName', 'roomLocation','confProperty','timeType','timeNumber',
					'attendUsersName', 'checkName','applyStatus','checkReason', 'startTime', 'endTime', 'status','bookType' ]
		});
		this.store.setDefaultSort('startTime', 'desc');
		// 加载数据
		this.store.load( {
			params : {
				start : 0,
				limit : 25
			}
		});

		/*this.rowActions = new Ext.ux.grid.RowActions( {
			header : '管理',
			width : 80,
			actions : [ {
				iconCls : 'btn-del',
				text : '删除',
				qtip : '删除',
				style : 'margin:0 3px 0 3px'
			},{
				iconCls : 'btn-edit',
				text : '审核',
				qtip : '审核',
				style : 'margin:0 3px 0 3px'
			},{
				iconCls : 'btn-showDetail',
				qtip : '查看',
				style : 'margin:0 3px 0 3px'
			} ]
		});*/

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel( {
			columns : [ sm, new Ext.grid.RowNumberer(), {
				header : 'confId',
				dataIndex : 'confId',
				hidden : true
			}, {
				header : '会议名称',
				dataIndex : 'confTopic',
				renderer : function(value, metadata, record, rowIndex,colIndex){
					var confId = record.data.confId;
					var applyStatus = record.data.applyStatus;
					var str='';
					var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ZanCunConferenceView.edit('+confId + ","+ applyStatus +')">'+value+'</a>';
					return str;
				}
			}, /*{
				header : '主持人',
				dataIndex : 'compereName'
			}, {
				header : '与会人员',
				dataIndex : 'attendUsersName'
			},*/ {
				header : '会议室名称',
				dataIndex : 'roomName'
			}, /*{
				header : '会议类型',
				dataIndex : 'confProperty'
			}, {
				header : '审批人',
				dataIndex : 'checkName'
			},*/
			{
				header : '审核状态',
				dataIndex : 'applyStatus',
				renderer: function(value){
				if(value=='1'){
					return  "<span>待审核</span>";
				}
				else if(value=='2'){
					return "<span>通过</span>";
				}
				else if(value=='3'){
					return "<span>不通过</span>";
				}
				else if(value=='4'){
					return "<span>取消申请</span>";
				}
				else if(value=='-1'){
					return "<span>会议已结束</span>";
				}
			}
			},
			 /*{
				header : '审批描述',
				dataIndex : 'checkReason'
			},*/{
				header : '开始时间',
				dataIndex : 'startTime'
			}, {
				header : "持续时间",
				dataIndex : 'timeType',
				renderer : function(value ,gridPanel , record) {
					if (value == '0') {
						return "<span>上午</span>";
					} else if(value == '1'){
						return "<span>下午</span>";
					} else {
						return "<span>" + record.data.timeNumber + "天</span>";
					}
				}
			},{
				header : '结束时间',
				dataIndex : 'endTime'
			},/* {
				header : '会议地址',
				dataIndex : 'roomLocation'
			},*/ {
				header : '管理',
						width : 120,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.confId;
							var applyStatus = record.data.applyStatus;
							var str = '';
							if (isGranted('_MeetingRoomQueryDel')) {
								str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="ZanCunConferenceView.del('
										+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';

							}
							if (isGranted('_MeetingRoomQueryEdit') ) {
								str += '&nbsp;<a href="#" style="text-decoration:none;color:#3D3D3D" title="审核" value="" class="btn-edit" onclick="ZanCunConferenceView.edit('
										+ editId + ","+ applyStatus + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审核</a>';
							}
							if (isGranted('_MeetingRoomQueryEnd') &&  2 == applyStatus){
								str += '&nbsp;<a href="#" style="text-decoration:none;color:#3D3D3D" title="结束" value=" " class="btn-end" onclick="ZanCunConferenceView.end('
											+ editId + ","+ applyStatus + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束</a>';
							}
							return str;
						}
			}],
			defaults : {
				sortable : true,
				menuDisabled : true,
				width : 100
			}
		});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar( {
			height : 30,
			bodyStyle : 'text-align:left',
			items : [ /*{
				text : '删除',
				iconCls : 'btn-del',
				xtype : 'button',
				handler : this.delRecords
			},{
				text : '审核',
				iconCls : 'btn-edit',
				xtype : 'button',
				handler : this.edit
			}*/ ]
		});

		this.gridPanel = new Ext.grid.GridPanel( {
			id : 'ZanCunConferenceGrid',
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
//			plugins : this.rowActions,
			viewConfig : {
				forceFit : true,
				autoFill : true
			},
			bbar : new Ext.PagingToolbar( {
				pageSize : 25,
				store : this.store,
				displayInfo : true,
				displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
				emptyMsg : "当前没有记录"
			})
		});

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
			grid.getSelectionModel().each(function(rec) {
				var confId = rec.data.confId;
				new ConferenceForm({
					confId : confId
				}).show();			
			});
		});
//		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 搜索
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {		
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
				searchPanel :self.searchPanel,
				gridPanel : self.gridPanel
			});
		}
	},
	
	/**
	 * 清空
	 */
	reset : function(self) {
		self.searchPanel.getForm().reset();
	},

	/**
	 * 添加记录
	 */
	createRecord : function() {
		new ConferenceForm().show();
	},

	/**
	 * 按IDS删除记录
	 */
	delByIds : function(editId) {
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : __ctxPath
							+ '/admin/multiDelConference.do',
					params : {
						ids : ids
					},
					method : 'POST',
					success : function(response, options) {
						Ext.ux.Toast.msg('操作信息', '成功删除该会议信息！');
						Ext.getCmp('ZanCunConferenceGrid').getStore().reload();
					},
					failure : function(response, options) {
						Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
					}
				});
			}
		});// end of comfirm
	},
	
	/**
	 * 删除多条记录
	 */
	delRecords : function() {
		var gridPanel = Ext.getCmp('ZanCunConferenceGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if (selectRecords.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要却小的记录！");
			return;
		}
		var ids = Array();
		for ( var i = 0; i < selectRecords.length; i++) {
			ids.push(selectRecords[i].data.confId);
			//alert(ids);
		}
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : __ctxPath
							+ '/admin/multiDelConference.do',
					params : {
						ids : editId
					},
					method : 'POST',
					success : function(response, options) {
						Ext.ux.Toast.msg('操作信息', '成功删除该会议信息！');
						Ext.getCmp('ZanCunConferenceGrid').getStore().reload();
					},
					failure : function(response, options) {
						Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
					}
				});
			}
		});// end of comfirm
	},
	/*
	*//**
	 * 查看详细信息
	 *//*
	showDetail : function(confId) {
		ConferenceDetailForm.show(confId);
	},*/
	
	/**
	 * 审核
	 */
	/*edit : function(){
		var gridPanel = Ext.getCmp('ZanCunConferenceGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if(selectRecords.length == 0){
			Ext.ux.Toast.msg('操作提示','请选择要编辑的记录！');
			return;
		}
		var confId = selectRecords[0].data.confId;
		new ConferenceForm({
			confId : edit
		}).show();
		Ext.Ajax.request({
			url : __ctxPath + '/admin/allowUpdaterConfPrivilege.do',
			params : {
				confId : confId
			},
			waitMsg : '数据正在提交，请稍后...',
			method : 'post',
			success : function(response,op){
				var res = Ext.util.JSON.decode(response.responseText);
				if(res.success){
					new ConferenceForm({
						confId : confId
					}).show();
				}else {
					Ext.MessageBox.show( {
						title : '操作信息',
						msg : res.msg,
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-error'
					});
				}
			}
		});
	},*/
	/**
	 * 编辑记录,首先判断用户权限
	 */
	editRecord : function(record) {
		var confId = record.data.confId;
		new ConferenceForm({
			confId : confId
		}).show();
		
		/*Ext.Ajax.request({
			url : __ctxPath + '/admin/allowUpdaterConfPrivilege.do',
			params : {
				confId : confId
			},
			waitMsg : '数据正在提交，请稍后...',
			method : 'post',
			success : function(response,op){
				var res = Ext.util.JSON.decode(response.responseText);
				if(res.success)
					new ConferenceForm({
						confId : confId
					}).show();
				else
					Ext.MessageBox.show( {
						title : '操作信息',
						msg : res.msg,
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-error'
					});
			}
		});*/
	}
	
	/**
	 * 管理列中的事件处理
	 */
	/*onRowAction : function(gridPanel, record, action, row, col) {
			switch (action) {
			case 'btn-del':
				if(isGranted('_MeetingRoomQueryDel')){
					this.delByIds(record.data.confId);
				}
				break;
			case 'btn-edit':
				if(isGranted('_MeetingRoomQueryEdit')){
					this.editRecord(record);
				}
				break;
			case 'btn-showDetail':
				this.showDetail(record.data.confId);
				break;
			}
	}*/
});
ZanCunConferenceView.edit = function(editId,applyStatus) {
	/*if(1 != applyStatus){
		Ext.ux.Toast.msg("信息", "审核失败，不能审核审核过或已完成的会议！");
	}else{*/
		new ConferenceForm( {
			confId : editId
		}).show();
//	}
};
ZanCunConferenceView.del = function(editId) {
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : __ctxPath
							+ '/admin/multiDelConference.do',
					params : {
						ids : editId
					},
					method : 'POST',
					success : function(response, options) {
						Ext.ux.Toast.msg('操作信息', '成功删除该会议信息！');
						Ext.getCmp('ZanCunConferenceGrid').getStore().reload();
					},
					failure : function(response, options) {
						Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
					}
				});
			}
		});// end of comfirm
	};
ZanCunConferenceView.end = function(editId,applyStatus) {
	if(3 == applyStatus || -1 == applyStatus){
		Ext.ux.Toast.msg("信息", "结束失败，该会议未通过审核或已结束！");
		return false;
	}
	var applyStatus1 = '-1';
	Ext.Msg.confirm('信息确认', '您确认要结束所选会议吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath
						+ '/admin/changeStatusConference.do',
				params : {
					applyStatus : applyStatus1,
					confId : editId
				},
				method : 'POST',
				success : function(response, options) {
					Ext.ux.Toast.msg('操作信息', '成功结束该会议！');
					Ext.getCmp('ZanCunConferenceGrid').getStore().reload();
				},
				failure : function(response, options) {
					Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
				}
			});
		}
	});// end of comfirm
}
