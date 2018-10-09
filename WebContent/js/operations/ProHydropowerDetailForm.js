/**
 * @author
 * @createtime
 * @class ProHydropowerDetailForm
 * @extends Ext.Window
 * @description 水电费明细表单
 * @company 捷达世软件
 */
ProHydropowerDetailForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProHydropowerDetailForm.superclass.constructor.call(this, {
			id : 'ProHydropowerDetailFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '水电费明细表单',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, 
//			{
//				text : '重置',
//				iconCls : 'btn-reset',
//				scope : this,
//				handler : this.reset
//			},
			{
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'ProHydropowerDetailForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'proHydropowerDetail.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				xtype : 'hidden',
				name : 'proHydropowerDetail.roomId',
				id : 'roomId'
			}, {
				xtype : 'container',
				layout : 'hbox',
				layoutConfigs : {
					align : 'middle'
				},
				defaults : {
					margins : '0 2 0 0'
				},
				height : 26,
				items : [ {
					xtype : 'label',
					text : '房间编号:',
					width : 103
				}, {
					id : 'code',
					xtype : 'textfield',
					name : 'proHydropowerDetail.proDormRoom.code',
					editable : false,
					readOnly : true,
					allowBlank : false,
					width : 130
				}, {
					xtype : 'button',
					iconCls : 'btn-car',
					text : '选择房间',
					handler : function() {
						RoomSelector.getView(function(id, name) {
						
							Ext.getCmp('roomId').setValue(id);
							Ext.getCmp('code').setValue(name);
						}, true,false

						).show();
					}

				}, {
					xtype : 'button',
					text : '消除记录',
					iconCls : 'reset',
					handler : function() {
						Ext.getCmp('roomId').setValue('');
						Ext.getCmp('code').setValue('');
					}
				} ]

			}, {
				    fieldLabel : '水电费类型',
             	    hiddenName : 'proHydropowerDetail.type',
					id : 'type',
					xtype : 'combo',
					mode : 'local',
					allowBlank : false,
					editable : false,
					triggerAction : 'all',
					value : '1',
					store : [
							[ '1', '水费' ],
							[ '2','电费' ] ]
			}, {
				fieldLabel : '上个月使用量',
				name : 'proHydropowerDetail.lastMonthAmount',
				allowBlank : false,
				maxLength : 9
			}, {
				fieldLabel : '本月使用量',
				name : 'proHydropowerDetail.thisMonthAmount',
				allowBlank : false,
				maxLength : 9
			}, 
			{
				fieldLabel : '使用量',
				name : 'proHydropowerDetail.useAmount',
				allowBlank : false,
				maxLength : 9
			}, 
			{
				fieldLabel : '统计开始时间',
				name : 'proHydropowerDetail.startTime',
				allowBlank : false,
				xtype : 'datetimefield',
				format : 'Y-m-d H:i:s'
			}, {
				fieldLabel : '统计截止时间',
				name : 'proHydropowerDetail.endTime',
				allowBlank : false,
				xtype : 'datetimefield',
				format : 'Y-m-d H:i:s'
			} ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/operations/getProHydropowerDetail.do?id='
						+ this.id,
				root : 'data',
				preName : 'proHydropowerDetail'
			});
		}

	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function() {
		$postForm( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/operations/saveProHydropowerDetail.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('ProHydropowerDetailGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});