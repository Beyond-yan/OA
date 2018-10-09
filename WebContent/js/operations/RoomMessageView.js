var sufferfixcur;
RoomMessageView = Ext.extend(Ext.Panel,
{
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		RoomMessageView.superclass.constructor.call(this,
		{			
			id : 'RoomMessageView' + this.suffix,
			title :  String(this.suffix).replace('1','宿舍').replace('2','食堂').replace('ALL','') +  '意见箱',
			region : 'center',
			iconCls : 'menu-suggestbox',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	
	initUIComponents : function() 
	{
 
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel
		({			
			height : 35,
			region : 'north',
			frame : false,
			border : false,
			layout : 'hbox',
			layoutConfig :
			{
				padding : '5',
				align : 'middle'
			},
			defaults :
			{
				style : 'padding:0px 5px 0px 5px;',
				border : false,
				anchor : '98%,98%',
				labelWidth : 75,
				xtype : 'label'
			},
			items : [
					{
						text : '标题'
					},
					{
						name : 'Q_subject_S_LK',
						xtype : 'textfield'
					},
					{
						text : '日期  从'
					},
					{
						name : 'Q_createtime_D_GE',
						xtype : 'datefield',
						format : 'Y-m-d'
					},
					{
						text : '至'
					},
					{
						name : 'Q_createtime_D_LE',
						xtype : 'datefield',
						format : 'Y-m-d'
					},
					{
						text : '发送人'
					},
					{
						name : 'Q_senderFullname_S_LK',
						xtype : 'textfield'
					},
					{
						hiddenName : 'Q_queryPwd_SN_EQ',
						id:'ddlQueryType',
						allowBlank : false,
						editable : false,
						xtype : 'combo',
						mode : 'local',
						triggerAction : 'all',
						value : '1',
						store : [ [ '1', '宿舍类' ], [ '2', '食堂类' ] ],
						hidden:true
					},					
					{
						hiddenName : 'queryPwdDisplayer',
						id:'ddlPwdDisplayer',
						allowBlank : false,
						editable : false,
						xtype : 'combo',
						mode : 'local',
						triggerAction : 'all',
						value : '1',
						store : [ [ '1', '宿舍类' ], [ '2', '食堂类' ] ],
						disabled:true,
						hidden:true
					},
					{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						scope : this,
						handler : this.search
					} ]
		});// end of the searchPanel	
		//alert(this.suffix);
		sufferfixcur = this.suffix;
		if(this.suffix!='ALL')
		{
			Ext.getCmp('ddlQueryType').setValue(this.suffix);			
			Ext.getCmp('ddlQueryType').readOnly  = true;
			Ext.getCmp('ddlPwdDisplayer').setValue(this.suffix);
		}	
		
		
		// 初始化工具栏
		this.topbar = new Ext.Toolbar(
		{
			height : 30,
			bodyStyle : 'text-align:left',
			items : [
			{
				iconCls : 'btn-add',
				text : '添加',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}
			, {
								iconCls : 'btn-del',
								text : '删除',
								xtype : 'button',
								handler : this.removeSelRs,
								scope : this
							}
			]
		});
		this.gridPanel = new HT.GridPanel
		({	
			id : 'SuggestBoxGrid' + this.suffix,
			region : 'center',
			url : __ctxPath 
				+ "/info/mykkSuggestBox.do?Q_queryPwd_SN_EQ=" 
				+ this.suffix 
				+ "&CurrentUserID=" 
				+ curUserInfo.userId,
			//autoLoad:true,
			root:'result',	
			tbar : this.topbar,
			fields : [ {
				name : 'boxId',
				type : 'int'
			}, 'subject', 'content', 'createtime', 'recUid', 'recFullname', 'senderId',
					'senderFullname', 'senderIp', 'phone', 'email',
					'isOpen', 'status', 'queryPwd'],
			columns : [
							{
								header : 'boxId',
								dataIndex : 'boxId',
								hidden : true
							},
							{
								header : '是否公开',
								width : 60,
								dataIndex : 'isOpen',
								renderer : function(value)
								{
									if (value == 0)
									{
										return '<font color="green">公开</font>';
									} else
									{
										return '<font color="red">未公开</font>';
									}
								}
							},
							{
								header : '状态',
								width : 45,
								dataIndex : 'status',
								renderer : function(value)
								{
									if (value == 0)
									{
										return '<font color="blue">草稿</font>';
									} else if (value == 1)
									{
										return '提交';
									} else
									{
										return '<font color="green">已回复</font>';
									}
								}
							}, 
							{
								header : '意见标题',
								width : 300,
								dataIndex : 'subject'
							},
							{
								header : '创建日期',
								dataIndex : 'createtime',
								renderer : function(value)
								{
									return value.substring(0,
											10);
								}
							},
							{
								header : '发送人',
								dataIndex : 'senderFullname',
								renderer : function(value)
								{
									if (value != null && value != '')
									{
										return value;
									} else
									{
										return '匿名';
									}
								}
							},							
							{
								header : '发送人电话',
								dataIndex : 'phone'
							},
							{
								header : '发送人IP',
								dataIndex : 'senderIp'
							},
							{
								header : '管理',
								dataIndex : 'newsId',
								width : 210,
								renderer : function(value,
										metadata, record,
										rowIndex, colIndex)
								{
									var status = record.data.status;
									var isOpen = record.data.isOpen;
									var sderid = record.data.senderId;
		
									var editId = record.data.boxId;
									var str = '';
									
									if(sderid==curUserInfo.userId)
									{
										str = '<button title="删除" value=" " class="btn-del" onclick="RoomMessageView.delByIds(' + editId + ')">&nbsp</button>';
									}									

									if (status == 0)
									{
										str += '<button title="编辑" value=" " class="btn-edit" onclick="RoomMessageView.editRecord(' + editId + ')">&nbsp</button>';
									} 
									else if (status == 1 &&  record.data.recUid == curUserInfo.userId)
									{
										str += '<button title="回复" value=" " class="btn-suggest-reply" onclick="RoomMessageView.reply(' + editId + ')">&nbsp</button>';
									}

									// 食堂类的回复 （具有食堂管理员角色的人员都可回复）
									if(status == 1 &&record.data.queryPwd=="2" && record.data.senderId!= curUserInfo.userId&&curUserInfo.isRestAdmin==true)
									{
										str += '<button title="回复" value=" " class="btn-suggest-reply" onclick="RoomMessageView.reply(' + editId + ')">&nbsp</button>';
									}
									
									str += '<button title="浏览" value=" " class="btn-suggest-scan" onclick=" new SuggestBoxDisplay({boxId : '+ editId +'}).show();" )">&nbsp</button>';

									return str;
								}
							}
			]
		});	
		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e)
		{
			grid.getSelectionModel().each(
					function(rec)
					{
						var status = rec.data.status;
						var isOpen = rec.data.isOpen;
						if (status == 0)
						{
							
							new RoomMessageForm(
							{
								boxId : rec.data.boxId,
								px:sufferfixcur
							}).show();
						}
						else
						{
							new SuggestBoxDisplay({
												boxId : rec.data.boxId
											}).show();
						}
					});
		});
	},	
		//按条件搜索
	search : function() 
	{
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
		//创建记录
	createRs : function() 
	{
		new RoomMessageForm(
		{px:this.suffix}
		).show();
	},
	
	removeSelRs:function()
	{
		$delGridRs({
			url : __ctxPath + '/info/multiDelSuggestBox.do',
			grid : this.gridPanel,
			idName : 'boxId'
		});
	}
});



RoomMessageView.delByIds = function(ids) {
	Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/info/multiDelSuggestBox.do',
								params : {
									ids : ids
								},
								method : 'POST',
								success : function(response, options) {
									Ext.ux.Toast.msg('操作信息',	'成功删除该意见！');
									//alert('SuggestBoxGrid'+this.suffix);
									Ext.getCmp('SuggestBoxGrid'+sufferfixcur).getStore()
											.reload();
								},
								failure : function(response, options) {
									Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
								}
							});
				}
			});// end of comfirm
};





RoomMessageView.editRecord = function(id)
{
	new RoomMessageForm(
	{
		boxId : id,
		px:sufferfixcur
	}).show();
};
/**
 * 回复
 */
RoomMessageView.reply = function(id)
{
	new SuggestBoxReplyForm(
	{
		boxId : id
	}).show();
};